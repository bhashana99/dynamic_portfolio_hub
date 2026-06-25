import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Education() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [educations, setEducations] = useState([]);
  const [showEducationsError, setShowEducationsError] = useState(false);

  const [formData, setFormData] = useState({
    school: "",
    degreeName: "",
    startDate: "",
    endDate: "",
    gpa: "",
    description: "",
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
      const res = await fetch("/api/education/create-education", {
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
    const fetchEducations = async () => {
      try {
        const res = await fetch("/api/education/get-educations");
        const data = await res.json();
        if (data.success === false) {
          setShowEducationsError(data.message);
        } else {
          setEducations(data);
        }
      } catch (error) {
        setShowEducationsError(true);
        console.log(showEducationsError);
      }
    };
    fetchEducations();
}, []);

const handleDeleteEducation = async (id) => {
    try {
      const res = await fetch(`/api/education/delete-education/${id}`, {
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
      title="Education"
      subtitle="Document your academic journey and qualifications."
    >
      {!showForm && (
        <button
          onClick={toggleForm}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 px-6 py-8 text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-brand-300"
        >
          <FiPlus className="text-2xl transition group-hover:scale-110" />
          <span className="font-display text-lg font-semibold">
            Add New Education
          </span>
        </button>
      )}

      {showForm && (
        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="school" className="form-label">
                  School <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. University of Colombo"
                  id="school"
                  className="form-input"
                  required
                  onChange={handleChange}
                  value={formData.school}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="degreeName" className="form-label">
                  Degree Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering BSc (Hons) "
                  id="degreeName"
                  className="form-input"
                  required
                  value={formData.degreeName}
                  onChange={handleChange}
                />
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
              <div>
                <label htmlFor="gpa" className="form-label">
                  GPA
                </label>
                <input
                  type="number"
                  id="gpa"
                  className="form-input"
                  min="1.00"
                  max="4.00"
                  defaultValue={3.54}
                  step="0.01"
                  value={formData.gpa}
                  onChange={handleChange}
                />
              </div>
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
            <div className="mt-6 flex flex-row justify-end gap-3">
              <button
                type="button"
                onClick={toggleForm}
                className="btn-secondary"
              >
                Back
              </button>
              <button disabled={loading} className="btn-primary">
                {loading ? "Creating..." : "Add Education"}
              </button>
            </div>
            {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
          </form>
        </div>
      )}

      {!showForm && educations && educations.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Education History
          </h2>
          <div className="mt-5 grid gap-4">
            {educations.map((education) => (
              <div
                key={education._id}
                className="card card-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 break-words">
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {education.school}
                  </p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {education.degreeName}
                  </p>
                  {education.gpa && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      GPA: <span className="font-semibold text-accent-500">{education.gpa}</span>
                    </p>
                  )}
                  <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {new Date(education.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - {new Date(education.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{education.description}</p>
                </div>

                <div className="flex shrink-0 flex-col items-stretch gap-2">
                  <Link to={`/edit-education/${education._id}`}>
                    <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-500/20 dark:text-brand-300">
                      <FiEdit2 className="text-xs" /> Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleDeleteEducation(education._id);
                    }}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/20"
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
