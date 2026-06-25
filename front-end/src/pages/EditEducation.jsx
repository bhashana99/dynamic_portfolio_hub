import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useParams } from "react-router-dom";
import { Link ,useNavigate} from "react-router-dom";

export default function EditEducation() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchEducation = async () => {
      const eduId = params.educationId;
      const res = await fetch(`/api/education/get-education/${eduId}`);
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

    fetchEducation();
  }, [params.educationId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`/api/education/update-education/${params.educationId}`, {
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
        navigate("/education");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Edit Education"
      subtitle="Update the details of this qualification."
    >
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
                value={formData.school}
                onChange={handleChange}
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
                step="0.01"
                value={formData.gpa}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea rows={4} type="text" id="description" className="form-input" value={formData.description} onChange={handleChange} />
            </div>
          </div>
          <div className="mt-6 flex flex-row justify-end gap-3">
            <Link to="/education">
              <button type="button" className="btn-secondary">
                Back
              </button>
            </Link>
            <button
              disabled={loading || !isFormChanged}
              className={`btn-primary ${
                !isFormChanged ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Editing..." : "Edit"}
            </button>
          </div>
          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
        </form>
      </div>
    </AdminLayout>
  );
}
