use crate::domain::{SimulationError, SimulationParams, UtilizationSweepParams};
use crate::{simulate_diffusion, simulate_figure9_preset, simulate_utilization_sweep};
use wasm_bindgen::prelude::*;

fn to_js_error(error: SimulationError) -> JsValue {
    JsValue::from_str(&serde_json::to_string(&error).unwrap_or_else(|_| error.message))
}

#[wasm_bindgen]
pub fn simulate_diffusion_json(params_json: &str) -> Result<String, JsValue> {
    let params: SimulationParams = serde_json::from_str(params_json)
        .map_err(|e| JsValue::from_str(&format!("invalid JSON: {e}")))?;
    let result = simulate_diffusion(&params).map_err(to_js_error)?;
    serde_json::to_string(&result).map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn simulate_figure9_preset_json() -> Result<String, JsValue> {
    let result = simulate_figure9_preset().map_err(to_js_error)?;
    serde_json::to_string(&result).map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn simulate_utilization_sweep_json(params_json: &str) -> Result<String, JsValue> {
    let params: UtilizationSweepParams = serde_json::from_str(params_json)
        .map_err(|e| JsValue::from_str(&format!("invalid JSON: {e}")))?;
    let result = simulate_utilization_sweep(&params).map_err(to_js_error)?;
    serde_json::to_string(&result).map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn calculate_diffusion_coeff_arrhenius_json(input_json: &str) -> Result<f64, JsValue> {
    let input: crate::domain::ArrheniusInput = serde_json::from_str(input_json)
        .map_err(|e| JsValue::from_str(&format!("invalid JSON: {e}")))?;
    crate::calculate_diffusion_coeff_arrhenius(&input).map_err(|e| JsValue::from_str(&e))
}
