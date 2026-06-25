import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { FiPlus, FiEdit2, FiTrash2, FiGithub, FiExternalLink } from "react-icons/fi";

import { Link } from "react-router-dom";

export default function Projects() {
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState([]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjectError, setShowProjectError] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    repoUrl: "",
    siteUrl: "",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/project/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/project/get-projects");
        const data = await res.json();
        if (data.success === false) {
          setShowProjectError(data.message);
        } else {
          setProjects(data);
        }
      } catch (error) {
        setShowProjectError(true);
        console.log(showProjectError);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await fetch(`/api/project/delete-project/${projectId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Projects"
      subtitle="Showcase the work that defines your portfolio."
    >
      {!showForm && (
        <button
          onClick={toggleForm}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 px-6 py-8 text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-brand-300"
        >
          <FiPlus className="text-2xl transition group-hover:scale-110" />
          <span className="font-display text-lg font-semibold">
            Add New Project
          </span>
        </button>
      )}

      {showForm && (
        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="projectName" className="form-label">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Portfolio"
                  id="projectName"
                  className="form-input"
                  required
                  onChange={handleChange}
                  value={formData.projectName}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="projectDescription" className="form-label">
                  Description
                </label>
                <textarea
                  rows={4}
                  type="text"
                  placeholder="e.g. Portfolio"
                  id="projectDescription"
                  className="form-input"
                  onChange={handleChange}
                  value={formData.projectDescription}
                />
              </div>
              <div>
                <label htmlFor="repoUrl" className="form-label">
                  GitHub repo link
                </label>
                <textarea
                  rows={2}
                  type="text"
                  id="repoUrl"
                  className="form-input"
                  value={formData.repoUrl}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="siteUrl" className="form-label">
                  App / Site Link
                </label>
                <textarea
                  rows={2}
                  type="text"
                  id="siteUrl"
                  className="form-input"
                  value={formData.siteUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-6 flex flex-row justify-end gap-3">
              <button
                type="button"
                onClick={toggleForm}
                className="btn-secondary"
              >
                Back
              </button>
              <button disabled={loading} className="btn-primary">
                {loading ? "Creating..." : "Add Project"}
              </button>
            </div>
            {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
          </form>
        </div>
      )}

      {!showForm && projects && projects.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Recent Projects
          </h2>
          <div className="mt-5 grid gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="card card-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 break-words">
                  <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                    {project.projectName}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.repoUrl && (
                      <span className="chip gap-1.5">
                        <FiGithub className="text-xs" /> Repo
                      </span>
                    )}
                    {project.siteUrl && (
                      <span className="chip gap-1.5">
                        <FiExternalLink className="text-xs" /> Live
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link to={`/edit-project/${project._id}`}>
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-500/20 dark:text-brand-300">
                      <FiEdit2 className="text-xs" /> Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleDeleteProject(project._id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/20"
                  >
                    <FiTrash2 className="text-xs" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
