import {
  DEFAULT_BASE_FORM_STATE,
  type Figure9Result,
  type SimulationBaseFormState,
} from "@li-mg/shared";
import { useCallback, useEffect, useState } from "react";
import { ensureWasmInitialized } from "../../wasm/init";
import { runFigure9WithBase } from "./figure9Runner";

export function useFigure9Simulation() {
  const [base, setBase] = useState<SimulationBaseFormState>(DEFAULT_BASE_FORM_STATE);
  const [result, setResult] = useState<Figure9Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runValidation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await ensureWasmInitialized();
      setResult(runFigure9WithBase(base));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    void runValidation();
    // Initial load only; parameter changes require explicit Run validation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    base,
    setBase,
    result,
    error,
    loading,
    runValidation,
  };
}
