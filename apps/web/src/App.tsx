import { MODEL_VERSION } from "@li-mg/shared";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import { Figure9ColormapPage } from "./features/figure9/Figure9ColormapPage";
import { Figure9ProfilePage } from "./features/figure9/Figure9ProfilePage";
import { SingleSimulationPage } from "./features/concentration-profile/SingleSimulationPage";
import { Figure10Page } from "./features/utilization-sweep/Figure10Page";

function App() {
  return (
    <BrowserRouter>
      <main className="app-shell">
        <header className="site-header">
          <div className="site-header-brand">
            <h1 className="site-title">Li-Mg Alloy Diffusion Simulator</h1>
            <p className="site-meta">Model version {MODEL_VERSION}</p>
          </div>
          <nav className="site-nav" aria-label="Main">
            <NavLink to="/figure9/colormap">Figure 9 Colormap</NavLink>
            <NavLink to="/figure9/profiles">Figure 9 Profiles</NavLink>
            <NavLink to="/simulation">Single Simulation</NavLink>
            <NavLink to="/figure10">Figure 10</NavLink>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Figure9ColormapPage />} />
          <Route path="/figure9" element={<Figure9ColormapPage />} />
          <Route path="/figure9/colormap" element={<Figure9ColormapPage />} />
          <Route path="/figure9/profiles" element={<Figure9ProfilePage />} />
          <Route path="/simulation" element={<SingleSimulationPage />} />
          <Route path="/figure10" element={<Figure10Page />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
