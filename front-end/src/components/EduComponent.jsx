import React, { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import Section from "./Section";
import Reveal from "./Reveal";

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });

export default function EduComponent() {
  const [educations, setEducations] = useState([]);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const res = await fetch("/api/education/get-educations");
        const data = await res.json();
        setEducations(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEducations();
  }, []);

  if (educations.length === 0) return null;

  return (
    <Section id="eduCom" index="01" label="education" title="Where I studied">
      <div className="relative ml-3 border-l border-slate-200 dark:border-white/10">
        {educations.map((education, i) => (
          <Reveal key={education._id} delay={i * 0.05}>
            <div className="relative pl-8 pb-10 last:pb-0">
              <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand-500 bg-white dark:bg-ink-900">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              </span>
              <div className="card card-hover p-5">
                <p className="font-mono text-xs text-accent-600 dark:text-accent-400">
                  {fmt(education.startDate)} — {fmt(education.endDate)}
                </p>
                <h3 className="mt-1 flex items-center gap-2 break-words font-display text-lg font-bold text-slate-900 dark:text-white">
                  <FaGraduationCap className="shrink-0 text-brand-500" />
                  {education.school}
                </h3>
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  {education.degreeName}
                </p>
                {education.gpa && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    GPA <span className="text-brand-600 dark:text-brand-300">{education.gpa}</span>
                  </p>
                )}
                {education.description && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {education.description}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
