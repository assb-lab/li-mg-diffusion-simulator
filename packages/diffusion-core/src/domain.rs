use serde::{Deserialize, Serialize};

pub const MODEL_VERSION: &str = "0.1.0";
pub const SOLVER_VERSION: &str = "0.1.0";
pub const FARADAY_CONSTANT_C_PER_MOL: f64 = 96485.0;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum StopReason {
    BetaLowerBoundReached,
    MaxTimeReached,
    InvalidInput,
    NumericalFailure,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SimulationParams {
    pub model_version: String,
    pub thickness_um: f64,
    pub current_density_acm2: f64,
    pub diffusion_coeff_cm2_per_s: f64,
    pub initial_concentration_mmol_per_cm3: f64,
    pub beta_lower_bound_mmol_per_cm3: f64,
    pub temperature_c: Option<f64>,
    pub grid_count: usize,
    pub dt_s: Option<f64>,
    pub max_time_s: f64,
    pub saved_profile_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SimulationProfile {
    pub time_s: f64,
    pub concentrations_mmol_per_cm3: Vec<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SimulationResult {
    pub model_version: String,
    pub solver_version: String,
    pub x_um: Vec<f64>,
    pub profiles: Vec<SimulationProfile>,
    pub stop_time_s: f64,
    pub stop_reason: StopReason,
    pub beta_phase_utilization: f64,
    pub total_li_utilization: f64,
    pub stripped_capacity_mah_per_cm2: f64,
    pub interface_concentration_mmol_per_cm3: f64,
    pub mass_balance_relative_error: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArrheniusInput {
    pub diffusion_ref_cm2_per_s: f64,
    pub temperature_ref_k: f64,
    pub temperature_k: f64,
    pub activation_energy_ev: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UtilizationSweepParams {
    pub base: SimulationParamsBase,
    pub current_density_acm2_values: Vec<f64>,
    pub temperature_c_values: Vec<f64>,
    pub arrhenius: ArrheniusInput,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SimulationParamsBase {
    pub model_version: String,
    pub thickness_um: f64,
    pub initial_concentration_mmol_per_cm3: f64,
    pub beta_lower_bound_mmol_per_cm3: f64,
    pub grid_count: usize,
    pub dt_s: Option<f64>,
    pub max_time_s: f64,
    pub saved_profile_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UtilizationSweepResult {
    pub current_density_acm2_values: Vec<f64>,
    pub temperature_c_values: Vec<f64>,
    pub beta_phase_utilization_matrix: Vec<Vec<f64>>,
    pub total_li_utilization_matrix: Vec<Vec<f64>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SimulationErrorCode {
    InvalidThickness,
    InvalidCurrentDensity,
    InvalidDiffusionCoefficient,
    InvalidConcentrationRange,
    InvalidGrid,
    InvalidTime,
    NumericalFailure,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SimulationError {
    pub code: SimulationErrorCode,
    pub message: String,
    pub details: Option<serde_json::Value>,
}

impl SimulationError {
    pub fn new(code: SimulationErrorCode, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
            details: None,
        }
    }
}

pub type SimulationCoreResult<T> = Result<T, SimulationError>;
