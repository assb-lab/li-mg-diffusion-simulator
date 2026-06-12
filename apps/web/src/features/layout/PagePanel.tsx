import type { ReactNode } from "react";

interface PagePanelProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function PagePanel({ title, description, children, className }: PagePanelProps) {
  return (
    <section className={["page-panel", className].filter(Boolean).join(" ")}>
      <header className="page-panel-header">
        <h2 className="page-panel-title">{title}</h2>
        {description ? <p className="page-panel-description">{description}</p> : null}
      </header>
      <div className="page-panel-body">{children}</div>
    </section>
  );
}
