import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Certificate() {
  const [showForm, setShowForm] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    issuingOrganization: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };



  useEffect(() => {
    const fetchCertificate = async () => {
      const certificateId = params.certificateId;
      const res = await fetch(`/api/certificate/get-certificate/${certificateId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      const formattedData = {
        ...data,
        issueDate: new Date(data.issueDate).toISOString().substring(0, 10),

      };

      setFormData(formattedData);
      setInitialFormData(formattedData);
    };

    fetchCertificate();
  }, [params.certificateId]);

  useEffect(() => {
    const hasFormChanged =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setIsFormChanged(hasFormChanged);
  }, [formData, initialFormData]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`/api/certificate/update-certificate/${params.certificateId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),

      })

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate("/certificate");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Edit Certificate"
      subtitle="Update the details of this certification."
    >
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
            <Link to="/certificate">
              <button type="button" className="btn-secondary w-full">
                Back
              </button>
            </Link>
            <button
              disabled={loading || !isFormChanged}
              className="btn-primary"
            >
              {loading ? "Editing..." : "Edit"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
