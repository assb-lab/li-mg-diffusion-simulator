import { FIGURE9_CASES, formatSimulationDurationS } from "@li-mg/shared";
import type { Figure9Result } from "@li-mg/shared";

interface UtilizationTableProps {
  result: Figure9Result;
}

export function UtilizationTable({ result }: UtilizationTableProps) {
  return (
    <table>
      <caption>Figure 9 beta-phase Li utilization validation</caption>
      <thead>
        <tr>
          <th scope="col">Case</th>
          <th scope="col">Current density (A cm⁻²)</th>
          <th scope="col">Target beta util. (%)</th>
          <th scope="col">Calculated (%)</th>
          <th scope="col">Time to β lower bound</th>
          <th scope="col">Error (pp)</th>
          <th scope="col">Pass</th>
        </tr>
      </thead>
      <tbody>
        {result.cases.map((caseItem) => {
          const target = FIGURE9_CASES.find((c) => c.label === caseItem.label);
          const calculated = caseItem.result.betaPhaseUtilization * 100;
          const targetValue = target?.targetBetaUtilizationPercent ?? 0;
          const error = calculated - targetValue;
          const pass = Math.abs(error) <= 5;
          const stopTimeLabel =
            caseItem.result.stopReason === "BetaLowerBoundReached"
              ? formatSimulationDurationS(caseItem.result.stopTimeS).label
              : "—";
          return (
            <tr key={caseItem.label}>
              <td>{caseItem.label}</td>
              <td>{caseItem.currentDensityAcm2.toExponential(2)}</td>
              <td>{targetValue}</td>
              <td>{calculated.toFixed(1)}</td>
              <td>{stopTimeLabel}</td>
              <td>{error.toFixed(1)}</td>
              <td>{pass ? "pass" : "fail"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
