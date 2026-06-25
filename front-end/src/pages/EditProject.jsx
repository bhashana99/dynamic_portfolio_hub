import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

export default function Projects() {
  const [file, setFile] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    repoUrl: "",
    siteUrl: "",
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [initialFormData, setInitialFormData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const projectId = params.projectId;
      const res = await fetch(`/api/project/get-project/${projectId}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
      setInitialFormData(data);
    };

    fetchProject();
  }, [params.projectId]);

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
      const res = await fetch(
        `/api/project/update-project/${params.projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate("/projects");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Edit Project"
      subtitle="Update the details of this project."
    >
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
                value={formData.projectName}
                onChange={handleChange}
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
                value={formData.projectDescription}
                onChange={handleChange}
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
            <Link to="/projects">
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
              {loading ? "Updating..." : "Update project"}
            </button>
          </div>
          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
        </form>
      </div>
    </AdminLayout>
  );
}
