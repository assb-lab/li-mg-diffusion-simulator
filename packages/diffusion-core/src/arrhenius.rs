use crate::domain::ArrheniusInput;

const BOLTZMANN_EV_PER_K: f64 = 8.617_333_262e-5;

pub fn calculate_diffusion_coeff_arrhenius(input: &ArrheniusInput) -> Result<f64, String> {
    if input.temperature_k <= 0.0 || input.temperature_ref_k <= 0.0 {
        return Err("temperature must be positive in Kelvin".to_string());
    }
    let exponent = (-input.activation_energy_ev / BOLTZMANN_EV_PER_K)
        * (1.0 / input.temperature_k - 1.0 / input.temperature_ref_k);
    Ok(input.diffusion_ref_cm2_per_s * exponent.exp())
}
