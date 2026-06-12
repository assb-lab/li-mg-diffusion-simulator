import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./features/figure9/Figure9ColormapPage", () => ({
  Figure9ColormapPage: () => <div>Figure 9 Colormap mock</div>,
}));
vi.mock("./features/figure9/Figure9ProfilePage", () => ({
  Figure9ProfilePage: () => <div>Figure 9 Profiles mock</div>,
}));
vi.mock("./features/concentration-profile/SingleSimulationPage", () => ({
  SingleSimulationPage: () => <div>Single Simulation mock</div>,
}));
vi.mock("./features/utilization-sweep/Figure10Page", () => ({
  Figure10Page: () => <div>Figure 10 mock</div>,
}));

describe("App", () => {
  it("renders the simulator title and navigation", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /Li-Mg Alloy Diffusion Simulator/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Figure 9 Colormap/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Figure 9 Profiles/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Single Simulation/i })).toBeInTheDocument();
  });
});
