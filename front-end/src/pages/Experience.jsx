import React, { useState,useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Experience() {
  const [showForm, setShowForm] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [works, setWorks] = useState([]);
  const [showWorksError, setShowWorksError] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    employmentType: "",
    companyName: "",
    companyLocation: "",
    locationType: "",
    currentlyWorking: false,
    startDate: "",
    endDate: "",
    description: "",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleCurrentJob = (e) => {
    setIsCurrentJob(e.target.checked);
    const { checked } = e.target;
    setFormData({
      ...formData,
      currentlyWorking: checked,
      endDate: checked ? "" : formData.endDate,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleValidation = () => {
    const today = new Date().toISOString().split("T")[0];
    if (formData.startDate > today) {
      return "Start date cannot be a future date.";
    }
    if (
      !formData.currentlyWorking &&
      (formData.endDate > today || formData.endDate < formData.startDate)
    ) {
      return "End date cannot be a future date or before the start date.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = handleValidation();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/work/create-work", {
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
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch("/api/work/get-works");
        const data = await res.json();
        if (data.success === false) {
          setShowWorksError(data.message);
        } else {
          setWorks(data);
        }
      } catch (error) {
        setShowWorksError(true);
        console.log(showWorksError);
      }
    };
    fetchWorks();
  }, []);

  const handleDeleteWork = async (WorkId) => {
    try {
      const res = await fetch(`/api/work/delete-work/${WorkId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);

      } else {
        setLoading(false)
        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);

    }
}

  return (
    <AdminLayout
      title="Work Experience"
      subtitle="Add and manage your professional experience."
    >
      <div>
        {!showForm && (
          <button
            type="button"
            onClick={toggleForm}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-5 text-brand-600 transition hover:border-brand-500 hover:bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/5 dark:text-brand-300 dark:hover:bg-brand-500/10"
          >
            <FiPlus className="text-xl" />
            <span className="font-semibold">Add New Experience</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="card p-5 md:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="title" className="form-label">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer"
                  id="title"
                  className="form-input"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="employmentType" className="form-label">
                  Employment type <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-input"
                  id="employmentType"
                  onChange={handleChange}
                  value={formData.employmentType}
                >
                  <option value="">Please select</option>
                  <option value="fullTime">Full-time </option>
                  <option value="partTime">Part-time</option>
                  <option value="selfEmployed">Self-employed</option>
                  <option value="freelance">Freelance</option>
                  <option value="">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="apprenticeship">Apprenticeship</option>
                  <option value="seasonal">Seasonal</option>
                </select>
              </div>
              <div>
                <label htmlFor="companyName" className="form-label">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google"
                  id="companyName"
                  className="form-input"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="companyLocation" className="form-label">
                  Company Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Colombo, Sri Lanka"
                  id="companyLocation"
                  className="form-input"
                  required
                  value={formData.companyLocation}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="locationType" className="form-label">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-input"
                  id="locationType"
                  value={formData.locationType}
                  onChange={handleChange}
                >
                  <option value="">Please select</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="currentJob"
                    id="currentJob"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    onChange={handleCurrentJob}
                    checked={formData.currentlyWorking}
                  />
                  I am currently working in this role
                </label>
              </div>

              <div>
                <label htmlFor="startDate" className="form-label">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  id="startDate"
                  className="form-input"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              {!isCurrentJob && (
                <div>
                  <label htmlFor="endDate" className="form-label">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="month"
                    id="endDate"
                    className="form-input"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  rows={4}
                  type="text"
                  id="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={toggleForm}
                className="btn-secondary"
              >
                Back
              </button>
              <button disabled={loading} className="btn-primary">
                {loading ? "Creating..." : "Add Experience"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && works && works.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Recent Add Experience
          </h2>
          <div className="mt-4 grid gap-4">
            {works.map((work) => (
              <div
                key={work._id}
                className="card p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 break-words">
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {work.name}
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-600 dark:text-slate-300">
                    {work.companyName}
                  </p>

                  <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {new Date(work.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}{" "}
                    -{" "}
                    {work.currentlyWorking
                      ? "Present"
                      : new Date(work.endDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long" }
                        )}{" "}
                  </p>
                  <span className="chip mt-3">{work.employmentType}</span>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                   onClick={()=>{handleDeleteWork(work._id)}}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/20"
                  >
                    <FiTrash2 /> Delete
                  </button>

                  <Link to={`/edit-experience/${work._id}`}>
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-500/20 dark:text-brand-400">
                      <FiEdit2 /> Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
