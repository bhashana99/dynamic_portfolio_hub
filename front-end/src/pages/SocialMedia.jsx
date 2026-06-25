import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { FaLinkedin, FaStackOverflow, FaInstagram } from "react-icons/fa";
import { FaSquareGithub, FaSquareXTwitter, FaMedium } from "react-icons/fa6";
import Swal from "sweetalert2";

export default function SocialMedia() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });


  const [formData, setFormData] = useState({
    linkedin: {
      username: "",
      link: "",
    },
    x: {
      username: "",
      link: "",
    },
    medium: {
      username: "",
      link: "",
    },
    github: {
      username: "",
      link: "",
    },
    stackOverflow: {
      username: "",
      link: "",
    },
    instagram: {
      username: "",
      link: "",
    },
  });

  const [initialFormData, setInitialFormData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      const res = await fetch("/api/socialMedia/get-socialMedia");
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
      setInitialFormData(data);
    };

    fetchSocialMedia();
  }, []);

  useEffect(() => {
    const hasFormChanged =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setIsFormChanged(hasFormChanged);
  }, [formData, initialFormData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const [key, field] = id.split("-");
    setFormData({
      ...formData,
      [key]: {
        ...formData[key],
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = formData._id;

    try {
      const res = await fetch(`api/socialMedia/update-socialMedia/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log(data);
      if (data.success === false) {
        setError(data.message);
      }
      setLoading(false);
      await Toast.fire({
        icon: "success",
        title: "Updated Successfully!",
      });
      window.location.reload();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Social Media"
      subtitle="Connect your social profiles to your portfolio."
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Linkedin */}
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <FaLinkedin className="text-2xl text-blue-600" />
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Linkedin
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="linkedin-username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. kasunkalhara "
                  className="form-input"
                  id="linkedin-username"
                  value={formData.linkedin.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="linkedin-link" className="form-label">
                  Profile Url
                </label>
                <textarea
                  className="form-input"
                  placeholder="e.g. www.linkedin.com"
                  id="linkedin-link"
                  cols={2}
                  value={formData.linkedin.link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* X */}
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <FaSquareXTwitter className="text-2xl text-slate-900 dark:text-white" />
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                X
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="x-username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. kasunkalhara "
                  className="form-input"
                  id="x-username"
                  value={formData.x.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="xLink" className="form-label">
                  Profile Url
                </label>
                <textarea
                  className="form-input"
                  placeholder="e.g. www.x.com"
                  id="x-link"
                  cols={2}
                  value={formData.x.link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Medium */}
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <FaMedium className="text-2xl text-slate-900 dark:text-white" />
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Medium
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="medium-username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. kasunkalhara "
                  className="form-input"
                  id="medium-username"
                  value={formData.medium.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="medium-link" className="form-label">
                  Profile Url
                </label>
                <textarea
                  className="form-input"
                  placeholder="e.g. www.medium.com"
                  id="medium-link"
                  cols={2}
                  value={formData.medium.link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* GitHub */}
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <FaSquareGithub className="text-2xl text-slate-900 dark:text-white" />
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                GitHub
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="github-username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. kasunkalhara "
                  className="form-input"
                  id="github-username"
                  value={formData.github.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="github-link" className="form-label">
                  Profile Url
                </label>
                <textarea
                  className="form-input"
                  placeholder="e.g. www.github.com"
                  id="github-link"
                  cols={2}
                  value={formData.github.link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Stack Overflow */}
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <FaStackOverflow className="text-2xl text-orange-500" />
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Stack Overflow
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="stackOverflow-username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. kasunkalhara "
                  className="form-input"
                  id="stackOverflow-username"
                  value={formData.stackOverflow.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="stackOverflow-link" className="form-label">
                  Profile Url
                </label>
                <textarea
                  className="form-input"
                  placeholder="e.g. www.stackoverflow.com"
                  id="stackOverflow-link"
                  cols={2}
                  value={formData.stackOverflow.link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-3">
              <FaInstagram className="text-2xl text-pink-600" />
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Instagram
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="instagram-username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. kasunkalhara "
                  className="form-input"
                  id="instagram-username"
                  value={formData.instagram.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="instagram-link" className="form-label">
                  Profile Url
                </label>
                <textarea
                  className="form-input"
                  placeholder="e.g. www.instagram.com"
                  id="instagram-link"
                  cols={2}
                  value={formData.instagram.link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          disabled={!isFormChanged}
          className={`btn-primary mt-6 w-full ${
            !isFormChanged ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Social Media Info"}
        </button>
        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </form>
    </AdminLayout>
  );
}
