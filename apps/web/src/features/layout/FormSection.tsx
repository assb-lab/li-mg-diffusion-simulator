import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={["form-section", className].filter(Boolean).join(" ")}>
      <header className="form-section-header">
        <h3 className="form-section-title">{title}</h3>
        {description ? <p className="form-section-description">{description}</p> : null}
      </header>
      <div className="form-section-body">{children}</div>
    </section>
  );
}
