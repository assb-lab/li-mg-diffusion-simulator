import type { SimulationExportV1, SimulationParams, SimulationResult } from "@li-mg/shared";

export function buildSimulationExport(
  params: SimulationParams,
  result: SimulationResult,
): SimulationExportV1 {
  return {
    exportVersion: 1,
    exportedAtIso: new Date().toISOString(),
    source: {
      appName: "Li-Mg Alloy Diffusion Simulator",
      modelVersion: result.modelVersion,
      solverVersion: result.solverVersion,
    },
    params,
    result,
  };
}

export function exportJson(payload: SimulationExportV1): string {
  return JSON.stringify(payload, null, 2);
}

export function exportProfileCsv(result: SimulationResult): string {
  const lines = ["time_s,x_um,concentration_mmol_cm3"];
  for (const profile of result.profiles) {
    for (let i = 0; i < result.xUm.length; i += 1) {
      const x = result.xUm[i];
      const c = profile.concentrationsMmolPerCm3[i];
      if (x === undefined || c === undefined) continue;
      lines.push(`${profile.timeS},${x},${c}`);
    }
  }
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
