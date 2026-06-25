import React, { useEffect, useState } from "react";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { HiOutlineFolder } from "react-icons/hi";
import Section from "./Section";
import Reveal from "./Reveal";

export default function ProjectComponent() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/project/get-projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, []);

  if (projects.length === 0) return null;

  return (
    <Section id="projectCom" index="03" label="projects" title="Things I've built">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project._id} delay={i * 0.06}>
            <div className="card card-hover group flex h-full flex-col p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                  <HiOutlineFolder className="text-xl" />
                </span>
                <div className="flex items-center gap-3 text-slate-400">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub repository"
                      className="transition hover:text-brand-600 dark:hover:text-brand-300"
                    >
                      <FiGithub className="text-lg" />
                    </a>
                  )}
                  {project.siteUrl && (
                    <a
                      href={project.siteUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Live demo"
                      className="transition hover:text-brand-600 dark:hover:text-brand-300"
                    >
                      <FiExternalLink className="text-lg" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="font-display text-lg font-bold text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300 break-words">
                {project.projectName}
              </h3>
              <p className="mt-2 flex-grow break-words text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {project.projectDescription}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-secondary px-4 py-2 text-xs">
                    <FiGithub /> Code
                  </a>
                )}
                {project.siteUrl && (
                  <a href={project.siteUrl} target="_blank" rel="noreferrer" className="btn-primary px-4 py-2 text-xs">
                    <FiExternalLink /> Live demo
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
