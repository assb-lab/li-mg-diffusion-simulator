import { formatSimulationDurationS } from "@li-mg/shared";

interface TimeSeekBarProps {
  valueS: number;
  maxS: number;
  onChange: (nextS: number) => void;
}

export function TimeSeekBar({ valueS, maxS, onChange }: TimeSeekBarProps) {
  const formatted = formatSimulationDurationS(valueS);

  return (
    <div className="time-seek-bar">
      <label htmlFor="figure9-time-seek">
        Time
        <output>{formatted.label}</output>
      </label>
      <input
        id="figure9-time-seek"
        aria-label="Simulation time seek"
        type="range"
        min={0}
        max={maxS}
        step={Math.max(maxS / 500, 1)}
        value={valueS}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="time-seek-labels">
        <span>0 s</span>
        <span>{formatSimulationDurationS(maxS).label}</span>
      </div>
    </div>
  );
}
