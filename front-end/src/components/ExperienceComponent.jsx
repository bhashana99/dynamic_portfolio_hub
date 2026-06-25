import React, { useEffect, useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import Section from "./Section";
import Reveal from "./Reveal";

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });

export default function ExperienceComponent() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/work/get-works");
        const data = await res.json();
        setWorks(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchExperiences();
  }, []);

  if (works.length === 0) return null;

  return (
    <Section id="exeCom" index="02" label="experience" title="Where I've worked">
      <div className="relative ml-3 border-l border-slate-200 dark:border-white/10">
        {works.map((work, i) => (
          <Reveal key={work._id} delay={i * 0.05}>
            <div className="relative pl-8 pb-10 last:pb-0">
              <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand-500 bg-white dark:bg-ink-900">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              </span>
              <div className="card card-hover p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs text-accent-600 dark:text-accent-400">
                    {fmt(work.startDate)} —{" "}
                    {work.currentlyWorking ? "Present" : fmt(work.endDate)}
                  </p>
                  {work.locationType && (
                    <span className="chip text-xs">{work.locationType}</span>
                  )}
                </div>
                <h3 className="mt-1 flex items-center gap-2 break-words font-display text-lg font-bold text-slate-900 dark:text-white">
                  <FaBriefcase className="shrink-0 text-brand-500" />
                  {work.title}
                </h3>
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  {work.companyName}
                  {work.employmentType ? ` · ${work.employmentType}` : ""}
                </p>
                {work.companyLocation && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {work.companyLocation}
                  </p>
                )}
                {work.description && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {work.description}
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
