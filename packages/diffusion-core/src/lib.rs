pub mod arrhenius;
pub mod domain;
pub mod solver;
pub mod tridiagonal;
pub mod utilization;

#[cfg(target_arch = "wasm32")]
mod wasm_api;

pub use arrhenius::calculate_diffusion_coeff_arrhenius;
pub use domain::*;
pub use solver::simulate_diffusion;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Figure9CaseResult {
    pub label: String,
    pub current_density_acm2: f64,
    pub result: SimulationResult,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Figure9Result {
    pub cases: Vec<Figure9CaseResult>,
}

pub fn simulate_figure9_preset() -> SimulationCoreResult<Figure9Result> {
    let cases = [("10uA", 1e-5_f64), ("100uA", 1e-4_f64), ("1mA", 1e-3_f64)];

    let mut results = Vec::new();
    for (label, current) in cases {
        let params = SimulationParams {
            model_version: MODEL_VERSION.to_string(),
            thickness_um: 25.0,
            current_density_acm2: current,
            diffusion_coeff_cm2_per_s: 3.0e-11,
            initial_concentration_mmol_per_cm3: 69.6,
            beta_lower_bound_mmol_per_cm3: 24.0,
            temperature_c: None,
            grid_count: 201,
            dt_s: Some(50.0),
            max_time_s: 1e8,
            saved_profile_count: 30,
        };
        let result = simulate_diffusion(&params)?;
        results.push(Figure9CaseResult {
            label: label.to_string(),
            current_density_acm2: current,
            result,
        });
    }

    Ok(Figure9Result { cases: results })
}

pub fn simulate_utilization_sweep(
    params: &UtilizationSweepParams,
) -> SimulationCoreResult<UtilizationSweepResult> {
    let mut beta_matrix = Vec::new();
    let mut total_matrix = Vec::new();

    for &temperature_c in &params.temperature_c_values {
        let temperature_k = temperature_c + 273.15;
        let diffusion = calculate_diffusion_coeff_arrhenius(&crate::domain::ArrheniusInput {
            diffusion_ref_cm2_per_s: params.arrhenius.diffusion_ref_cm2_per_s,
            temperature_ref_k: params.arrhenius.temperature_ref_k,
            temperature_k,
            activation_energy_ev: params.arrhenius.activation_energy_ev,
        })
        .map_err(|e| {
            crate::domain::SimulationError::new(
                crate::domain::SimulationErrorCode::NumericalFailure,
                e,
            )
        })?;

        let mut beta_row = Vec::new();
        let mut total_row = Vec::new();

        for &current in &params.current_density_acm2_values {
            let sim_params = crate::domain::SimulationParams {
                model_version: params.base.model_version.clone(),
                thickness_um: params.base.thickness_um,
                current_density_acm2: current,
                diffusion_coeff_cm2_per_s: diffusion,
                initial_concentration_mmol_per_cm3: params.base.initial_concentration_mmol_per_cm3,
                beta_lower_bound_mmol_per_cm3: params.base.beta_lower_bound_mmol_per_cm3,
                temperature_c: Some(temperature_c),
                grid_count: params.base.grid_count,
                dt_s: params.base.dt_s,
                max_time_s: params.base.max_time_s,
                saved_profile_count: params.base.saved_profile_count,
            };
            let result = simulate_diffusion(&sim_params)?;
            beta_row.push(result.beta_phase_utilization);
            total_row.push(result.total_li_utilization);
        }

        beta_matrix.push(beta_row);
        total_matrix.push(total_row);
    }

    Ok(UtilizationSweepResult {
        current_density_acm2_values: params.current_density_acm2_values.clone(),
        temperature_c_values: params.temperature_c_values.clone(),
        beta_phase_utilization_matrix: beta_matrix,
        total_li_utilization_matrix: total_matrix,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use domain::SimulationErrorCode;

    fn base_params() -> SimulationParams {
        SimulationParams {
            model_version: MODEL_VERSION.to_string(),
            thickness_um: 25.0,
            current_density_acm2: 0.0,
            diffusion_coeff_cm2_per_s: 3.0e-11,
            initial_concentration_mmol_per_cm3: 69.6,
            beta_lower_bound_mmol_per_cm3: 24.0,
            temperature_c: None,
            grid_count: 201,
            dt_s: Some(1.0),
            max_time_s: 1000.0,
            saved_profile_count: 5,
        }
    }

    #[test]
    fn zero_current_keeps_uniform_concentration() {
        let params = base_params();
        let result = simulate_diffusion(&params).expect("simulation should succeed");
        let last_profile = result.profiles.last().expect("profile exists");
        for c in &last_profile.concentrations_mmol_per_cm3 {
            assert!((c - params.initial_concentration_mmol_per_cm3).abs() < 1e-6);
        }
    }

    #[test]
    fn positive_current_lowers_interface_concentration() {
        let mut params = base_params();
        params.current_density_acm2 = 1e-4;
        params.dt_s = Some(100.0);
        params.max_time_s = 50_000.0;
        let result = simulate_diffusion(&params).expect("simulation should succeed");
        assert!(
            result.interface_concentration_mmol_per_cm3 < params.initial_concentration_mmol_per_cm3
        );
    }

    #[test]
    fn simulation_stops_at_beta_lower_bound() {
        let mut params = base_params();
        params.current_density_acm2 = 1e-3;
        params.dt_s = Some(100.0);
        params.max_time_s = 200_000.0;
        let result = simulate_diffusion(&params).expect("simulation should succeed");
        assert_eq!(result.stop_reason, StopReason::BetaLowerBoundReached);
        assert!(
            result.interface_concentration_mmol_per_cm3
                <= params.beta_lower_bound_mmol_per_cm3 + 1e-3
        );
    }

    #[test]
    fn mass_balance_within_tolerance() {
        let mut params = base_params();
        params.current_density_acm2 = 1e-4;
        params.dt_s = Some(100.0);
        params.max_time_s = 500_000.0;
        params.grid_count = 201;
        let result = simulate_diffusion(&params).expect("simulation should succeed");
        assert!(result.mass_balance_relative_error <= 1e-2);
    }

    #[test]
    fn invalid_thickness_returns_error() {
        let mut params = base_params();
        params.thickness_um = -1.0;
        let err = simulate_diffusion(&params).expect_err("should fail");
        assert!(matches!(err.code, SimulationErrorCode::InvalidThickness));
    }

    #[test]
    fn terminal_profile_is_saved_when_stop_occurs_before_first_interval() {
        let mut params = base_params();
        params.current_density_acm2 = 1e-3;
        params.dt_s = Some(50.0);
        params.max_time_s = 1e8;
        params.saved_profile_count = 30;
        let result = simulate_diffusion(&params).expect("simulation should succeed");
        let last_profile = result.profiles.last().expect("terminal profile exists");
        assert!((last_profile.time_s - result.stop_time_s).abs() < 1e-6);
        let min = last_profile
            .concentrations_mmol_per_cm3
            .iter()
            .copied()
            .fold(f64::INFINITY, f64::min);
        let max = last_profile
            .concentrations_mmol_per_cm3
            .iter()
            .copied()
            .fold(f64::NEG_INFINITY, f64::max);
        assert!(max - min > 1.0);
    }

    #[test]
    fn figure9_beta_utilization_within_tolerance() {
        let figure9 = simulate_figure9_preset().expect("figure9 should run");
        let targets = [93.0, 41.0, 9.0];
        for (case, target) in figure9.cases.iter().zip(targets) {
            let beta_percent = case.result.beta_phase_utilization * 100.0;
            assert!(
                (beta_percent - target).abs() <= 5.0,
                "case {} beta utilization {:.1}% not within ±5pp of {:.1}%",
                case.label,
                beta_percent,
                target
            );
        }
    }

    #[test]
    fn arrhenius_increases_with_temperature() {
        let input = ArrheniusInput {
            diffusion_ref_cm2_per_s: 3.0e-11,
            temperature_ref_k: 298.15,
            temperature_k: 373.15,
            activation_energy_ev: 0.57,
        };
        let d_cold = calculate_diffusion_coeff_arrhenius(&ArrheniusInput {
            temperature_k: 273.15,
            ..input
        })
        .expect("valid");
        let d_hot = calculate_diffusion_coeff_arrhenius(&input).expect("valid");
        assert!(d_hot > d_cold);
    }
}
