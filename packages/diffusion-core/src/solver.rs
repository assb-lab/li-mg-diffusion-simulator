use crate::domain::{
    SimulationCoreResult, SimulationError, SimulationErrorCode, SimulationParams,
    SimulationProfile, SimulationResult, StopReason, MODEL_VERSION, SOLVER_VERSION,
};
use crate::tridiagonal::solve_tridiagonal;
use crate::utilization::{
    calculate_utilizations, flux_mmol_per_cm2_per_s, integrate_removed_mmol_per_cm2,
    mass_balance_relative_error, stripped_capacity_mah_per_cm2,
};

fn push_terminal_profile(
    profiles: &mut Vec<SimulationProfile>,
    time_s: f64,
    concentrations: &[f64],
    saved_profile_count: usize,
) {
    if saved_profile_count == 0 {
        return;
    }

    if let Some(last) = profiles.last() {
        if (last.time_s - time_s).abs() < 1e-9 {
            return;
        }
    }

    if profiles.len() >= saved_profile_count {
        profiles.pop();
    }

    profiles.push(SimulationProfile {
        time_s,
        concentrations_mmol_per_cm3: concentrations.to_vec(),
    });
}

pub fn validate_params(params: &SimulationParams) -> SimulationCoreResult<()> {
    if params.thickness_um <= 0.0 {
        return Err(SimulationError::new(
            SimulationErrorCode::InvalidThickness,
            "thickness must be positive",
        ));
    }
    if params.current_density_acm2 < 0.0 {
        return Err(SimulationError::new(
            SimulationErrorCode::InvalidCurrentDensity,
            "current density must be non-negative",
        ));
    }
    if params.diffusion_coeff_cm2_per_s <= 0.0 {
        return Err(SimulationError::new(
            SimulationErrorCode::InvalidDiffusionCoefficient,
            "diffusion coefficient must be positive",
        ));
    }
    if params.beta_lower_bound_mmol_per_cm3 >= params.initial_concentration_mmol_per_cm3 {
        return Err(SimulationError::new(
            SimulationErrorCode::InvalidConcentrationRange,
            "beta lower bound must be less than initial concentration",
        ));
    }
    if params.grid_count < 3 {
        return Err(SimulationError::new(
            SimulationErrorCode::InvalidGrid,
            "grid count must be at least 3",
        ));
    }
    if params.max_time_s <= 0.0 {
        return Err(SimulationError::new(
            SimulationErrorCode::InvalidTime,
            "max time must be positive",
        ));
    }
    Ok(())
}

fn default_dt(diffusion_coeff: f64, dx_cm: f64) -> f64 {
    0.25 * dx_cm * dx_cm / diffusion_coeff
}

fn build_x_grid_um(thickness_cm: f64, grid_count: usize) -> Vec<f64> {
    let dx_cm = thickness_cm / (grid_count - 1) as f64;
    (0..grid_count).map(|j| j as f64 * dx_cm * 1e4).collect()
}

fn backward_euler_step(
    prev: &[f64],
    diffusion_coeff: f64,
    dx_cm: f64,
    dt_s: f64,
    flux_mmol: f64,
) -> Result<Vec<f64>, String> {
    let n = prev.len();
    let r = diffusion_coeff * dt_s / (dx_cm * dx_cm);

    let mut lower = vec![0.0; n - 1];
    let mut diag = vec![0.0; n];
    let mut upper = vec![0.0; n - 1];
    let mut rhs = prev.to_vec();

    if n == 1 {
        return Ok(prev.to_vec());
    }

    // j = 0: no-flux boundary
    diag[0] = 1.0 + 2.0 * r;
    upper[0] = -2.0 * r;

    // interior
    for j in 1..n - 1 {
        lower[j - 1] = -r;
        diag[j] = 1.0 + 2.0 * r;
        upper[j] = -r;
    }

    // j = N-1: galvanostatic flux boundary
    // ghost substitution gives modified last row
    lower[n - 2] = -r;
    diag[n - 1] = 1.0 + r;
    rhs[n - 1] -= r * flux_mmol * dx_cm / diffusion_coeff;

    solve_tridiagonal(&lower, &diag, &upper, &rhs)
}

pub fn simulate_diffusion(params: &SimulationParams) -> SimulationCoreResult<SimulationResult> {
    validate_params(params)?;

    let thickness_cm = params.thickness_um * 1e-4;
    let n = params.grid_count;
    let dx_cm = thickness_cm / (n - 1) as f64;
    let dt_s = params
        .dt_s
        .unwrap_or_else(|| default_dt(params.diffusion_coeff_cm2_per_s, dx_cm));
    let flux_mmol = flux_mmol_per_cm2_per_s(params.current_density_acm2);

    let mut concentrations = vec![params.initial_concentration_mmol_per_cm3; n];
    let x_um = build_x_grid_um(thickness_cm, n);

    let mut profiles = Vec::new();
    let save_interval = (params.max_time_s / params.saved_profile_count as f64).max(dt_s);
    let mut next_save_time = 0.0;
    let mut time_s = 0.0;
    let mut stop_reason = StopReason::MaxTimeReached;

    profiles.push(SimulationProfile {
        time_s: 0.0,
        concentrations_mmol_per_cm3: concentrations.clone(),
    });
    next_save_time += save_interval;

    while time_s < params.max_time_s {
        let interface_before = concentrations[n - 1];
        if interface_before <= params.beta_lower_bound_mmol_per_cm3 {
            stop_reason = StopReason::BetaLowerBoundReached;
            break;
        }

        concentrations = backward_euler_step(
            &concentrations,
            params.diffusion_coeff_cm2_per_s,
            dx_cm,
            dt_s,
            flux_mmol,
        )
        .map_err(|e| SimulationError::new(SimulationErrorCode::NumericalFailure, e))?;

        time_s += dt_s;

        if concentrations[n - 1] <= params.beta_lower_bound_mmol_per_cm3 {
            stop_reason = StopReason::BetaLowerBoundReached;
            break;
        }

        if time_s + 1e-15 >= next_save_time && profiles.len() < params.saved_profile_count {
            profiles.push(SimulationProfile {
                time_s,
                concentrations_mmol_per_cm3: concentrations.clone(),
            });
            next_save_time += save_interval;
        }
    }

    push_terminal_profile(
        &mut profiles,
        time_s,
        &concentrations,
        params.saved_profile_count,
    );

    let removed = integrate_removed_mmol_per_cm2(
        &concentrations,
        params.initial_concentration_mmol_per_cm3,
        dx_cm,
    );
    let (beta_util, total_util) = calculate_utilizations(
        &concentrations,
        params.initial_concentration_mmol_per_cm3,
        params.beta_lower_bound_mmol_per_cm3,
        thickness_cm,
        dx_cm,
    );

    Ok(SimulationResult {
        model_version: MODEL_VERSION.to_string(),
        solver_version: SOLVER_VERSION.to_string(),
        x_um,
        profiles,
        stop_time_s: time_s,
        stop_reason,
        beta_phase_utilization: beta_util,
        total_li_utilization: total_util,
        stripped_capacity_mah_per_cm2: stripped_capacity_mah_per_cm2(removed),
        interface_concentration_mmol_per_cm3: concentrations[n - 1],
        mass_balance_relative_error: mass_balance_relative_error(
            removed,
            params.current_density_acm2,
            time_s,
        ),
    })
}
