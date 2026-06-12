use crate::domain::FARADAY_CONSTANT_C_PER_MOL;

pub fn flux_mmol_per_cm2_per_s(current_density_acm2: f64) -> f64 {
    (current_density_acm2 / FARADAY_CONSTANT_C_PER_MOL) * 1000.0
}

pub fn integrate_removed_mmol_per_cm2(
    concentrations: &[f64],
    initial_concentration: f64,
    dx_cm: f64,
) -> f64 {
    concentrations
        .iter()
        .map(|c| initial_concentration - c)
        .sum::<f64>()
        * dx_cm
}

pub fn calculate_utilizations(
    concentrations: &[f64],
    initial_concentration: f64,
    beta_lower_bound: f64,
    thickness_cm: f64,
    dx_cm: f64,
) -> (f64, f64) {
    let removed = integrate_removed_mmol_per_cm2(concentrations, initial_concentration, dx_cm);
    let initial_removable_beta = (initial_concentration - beta_lower_bound) * thickness_cm;
    let initial_total = initial_concentration * thickness_cm;

    let beta_util = if initial_removable_beta > 0.0 {
        (removed / initial_removable_beta).clamp(0.0, 1.0)
    } else {
        0.0
    };
    let total_util = if initial_total > 0.0 {
        (removed / initial_total).clamp(0.0, 1.0)
    } else {
        0.0
    };

    (beta_util, total_util)
}

pub fn stripped_capacity_mah_per_cm2(removed_mmol_per_cm2: f64) -> f64 {
    removed_mmol_per_cm2 / 1000.0 * FARADAY_CONSTANT_C_PER_MOL / 3600.0
}

pub fn mass_balance_relative_error(
    removed_by_integral: f64,
    current_density_acm2: f64,
    stop_time_s: f64,
) -> f64 {
    let removed_by_flux = flux_mmol_per_cm2_per_s(current_density_acm2) * stop_time_s;
    if removed_by_flux.abs() < 1e-30 {
        return 0.0;
    }
    ((removed_by_integral - removed_by_flux) / removed_by_flux).abs()
}
