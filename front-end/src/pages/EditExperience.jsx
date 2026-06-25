import React, { useState,useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { Link,useNavigate,useParams } from "react-router-dom";

export default function Experience() {
  const [showForm, setShowForm] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  const [initialFormData, setInitialFormData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  const params = useParams();
  const navigate = useNavigate();


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

  useEffect(() => {
    const fetchWork = async () => {
      const Id = params.workId;
      const res = await fetch(`/api/work/get-work/${Id}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString().substring(0, 7),
        endDate: new Date(data.endDate).toISOString().substring(0, 7),
      };

      setFormData(formattedData);
      setInitialFormData(formattedData);
    };

    fetchWork();
  }, [params.workId]);

  const handleCurrentJob = (e) => {
    setIsCurrentJob(e.target.checked);
    const { checked } = e.target;
    setFormData({
      ...formData,
      currentlyWorking: checked,
      endDate: checked ? "" : formData.endDate,
    });
  };

  useEffect(() => {
    const hasFormChanged =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setIsFormChanged(hasFormChanged);
  }, [formData, initialFormData]);

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
        const res = await fetch(`/api/work/update-work/${params.workId}`, {
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
            navigate("/experience");
          }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };




  return (
    <AdminLayout
      title="Edit Work Experience"
      subtitle="Update the details of this role."
    >
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
            <Link to="/experience">
              <button type="button" className="btn-secondary w-full">
                Back
              </button>
            </Link>
            <button
              disabled={loading || !isFormChanged}
              className="btn-primary"
            >
              {loading ? "Updating..." : "Edit Experience"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
