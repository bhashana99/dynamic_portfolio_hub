import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { FiPlus, FiTrash2, FiEdit2, FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Certificate() {
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [showCertificatesError, setShowCertificatesError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    issuingOrganization: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
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
      const res = await fetch("/api/certificate/create-certificate", {
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
    const fetchCertificates = async () => {
      try {
        const res = await fetch("/api/certificate/get-certificates");
        const data = await res.json();
        if (data.success === false) {
          setShowCertificatesError(data.message);
        } else {
          setCertificates(data);
        }
      } catch (error) {
        setShowCertificatesError(true);
        console.log(showEducationsError);
      }
    };
    fetchCertificates();
  }, []);

  const handleDeleteCertificate = async (id) => {
    try {
      const res = await fetch(`/api/certificate/delete-certificate/${id}`, {
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
      title="Certificate"
      subtitle="Showcase your credentials and certifications."
    >
      <div>
        {!showForm && (
          <button
            type="button"
            onClick={toggleForm}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-5 text-brand-600 transition hover:border-brand-500 hover:bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/5 dark:text-brand-300 dark:hover:bg-brand-500/10"
          >
            <FiPlus className="text-xl" />
            <span className="font-semibold">Add New Certificate</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="card p-5 md:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="name" className="form-label">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS Cloud Practitioner Essentials"
                  id="name"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="issuingOrganization" className="form-label">
                  Issuing organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amazon Web Services (AWS)"
                  id="issuingOrganization"
                  className="form-input"
                  required
                  value={formData.issuingOrganization}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="issueDate" className="form-label">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="issueDate"
                  className="form-input"
                  required
                  onChange={handleChange}
                  value={formData.issueDate}
                />
              </div>
              <div>
                <label htmlFor="credentialId" className="form-label">
                  Credential ID
                </label>
                <input
                  type="text"
                  id="credentialId"
                  className="form-input"
                  onChange={handleChange}
                  value={formData.credentialId}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="credentialUrl" className="form-label">
                  Credential URL
                </label>
                <textarea
                  rows={2}
                  type="text"
                  id="credentialUrl"
                  className="form-input"
                  onChange={handleChange}
                  value={formData.credentialUrl}
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
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && certificates && certificates.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Recent Add Certificates
          </h2>
          <div className="mt-4 grid gap-4">
            {certificates.map((certificate) => (
              <div
                key={certificate._id}
                className="card p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 break-words">
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {certificate.name}
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-600 dark:text-slate-300">
                    {certificate.issuingOrganization}
                  </p>
                  {certificate.credentialId && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Credential ID{" "}
                      <span className="break-all font-mono text-slate-700 dark:text-slate-300">
                        {certificate.credentialId}
                      </span>
                    </p>
                  )}

                  <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {new Date(certificate.issueDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long" }
                    )}{" "}
                  </p>
                  {certificate.credentialUrl && (
                    <Link to={certificate.credentialUrl}>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                        <FiExternalLink /> View Certificate
                      </p>
                    </Link>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleDeleteCertificate(certificate._id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/20"
                  >
                    <FiTrash2 /> Delete
                  </button>

                  <Link to={`/edit-certificate/${certificate._id}`}>
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
