export interface FormattedDuration {
  value: number;
  unit: "s" | "min" | "h";
  label: string;
}

export function formatSimulationDurationS(seconds: number): FormattedDuration {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error("seconds must be a non-negative finite number");
  }

  if (seconds >= 3600) {
    const value = seconds / 3600;
    return { value, unit: "h", label: `${value.toFixed(1)} h` };
  }

  if (seconds >= 60) {
    const value = seconds / 60;
    return { value, unit: "min", label: `${value.toFixed(1)} min` };
  }

  return { value: seconds, unit: "s", label: `${seconds.toFixed(1)} s` };
}
