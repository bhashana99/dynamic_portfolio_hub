import React from "react";
import Reveal from "./Reveal";

// Shared public-section shell: a monospace eyebrow carrying the section's
// index (the portfolio's intended reading order) + a display title.
export default function Section({ id, index, label, title, children }) {
  return (
    <section id={id} className="section">
      <Reveal>
        <p className="eyebrow">
          <span className="text-accent-500">{index}</span>
          <span className="text-slate-400 dark:text-slate-500">/</span>
          {label}
        </p>
        <h2 className="section-title">{title}</h2>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}
