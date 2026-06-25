import React, { useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";

export default function BasicInfo() {
  const fileRef = useRef(null);
  const [cvFile, setCvFile] = useState(undefined);
  const [profileImg, setProfileImg] = useState(undefined);

  const [cvPerc, setCvPerc] = useState(0);
  const [profileImgPerc, setProfileImgPerc] = useState(0);
  const [cvUploadError, setCvUploadError] = useState(false);
  const [profileImgUploadError, setProfileImgUploadError] = useState(false);
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
    firstName: "",
    lastName: "",
    additionalName: "",
    headline: "",
    about: "",
    brandName: "",
    cvUrl: "",
    country: "",
    skills: "",
    profileImage:
      "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg",
    city: "",
  });

  const [initialFormData, setInitialFormData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const fetchBasicInfo = async () => {
      const res = await fetch("/api/basicInfo/get-basicInfo");
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
      setInitialFormData(data);
    };
    fetchBasicInfo();

    if (profileImg) {
      handleUpload(profileImg);
    }

    if (cvFile) {
      handleUpload(cvFile);
    }
  }, [profileImg, cvFile]);

  useEffect(() => {
    const hasFormChanged =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setIsFormChanged(hasFormChanged);
  }, [formData, initialFormData]);

  const handleUpload = (file) => {
    const isPdf = file.type.includes("pdf");
    if (isPdf) {
      setCvUploadError(false);
    } else {
      setProfileImgUploadError(false);
    }

    const data = new FormData();
    data.append("file", file);

    // XMLHttpRequest is used (instead of fetch) so we can report upload progress.
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      if (isPdf) {
        setCvPerc(progress);
      } else {
        setProfileImgPerc(progress);
      }
    };

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.url) {
          if (isPdf) {
            setFormData((prev) => ({ ...prev, cvUrl: res.url }));
            setCvPerc(100);
          } else {
            setFormData((prev) => ({ ...prev, profileImage: res.url }));
            setProfileImgPerc(100);
          }
        } else {
          throw new Error(res.message || "Upload failed");
        }
      } catch (error) {
        if (isPdf) {
          setCvUploadError(true);
        } else {
          setProfileImgUploadError(true);
        }
        console.error("Upload error:", error);
      }
    };

    xhr.onerror = () => {
      if (isPdf) {
        setCvUploadError(true);
      } else {
        setProfileImgUploadError(true);
      }
      console.error("Upload error: network error");
    };

    xhr.send(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = formData._id;
    try {
      const res = await fetch(`/api/basicInfo/update-basicInfo/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      await Toast.fire({ icon: "success", title: "Updated Successfully!" });
      window.location.reload();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const uploadStatus = (err, perc, noun) => {
    if (err) return <span className="text-red-500">Upload failed (max 20 MB)</span>;
    if (perc > 0 && perc < 100)
      return <span className="text-slate-500 dark:text-slate-400">Uploading {perc}%…</span>;
    if (perc === 100)
      return <span className="text-accent-600 dark:text-accent-400">{noun} uploaded ✓</span>;
    return null;
  };

  return (
    <AdminLayout title="Basic Info" subtitle="Your identity, headline, photo and CV.">
      <form onSubmit={handleSubmit} className="card p-6 md:p-8">
        {/* Profile image */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <input
            onChange={(e) => setProfileImg(e.target.files[0])}
            type="file"
            accept="image/*"
            id="profileImage"
            ref={fileRef}
            hidden
          />
          <div className="group relative">
            <img
              onClick={() => fileRef.current.click()}
              src={formData.profileImage}
              alt="Profile"
              className="h-28 w-28 cursor-pointer rounded-full border-4 border-white object-cover shadow-card dark:border-ink-700"
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/50 text-white opacity-0 transition group-hover:opacity-100">
              <FiUploadCloud className="text-xl" />
            </span>
          </div>
          <p className="text-xs">{uploadStatus(profileImgUploadError, profileImgPerc, "Image")}</p>
          <p className="text-xs text-slate-400">Click the photo to change it</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="form-label">
              First Name <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="e.g. Kasun" className="form-input" id="firstName" required onChange={handleChange} value={formData.firstName} />
          </div>
          <div>
            <label htmlFor="lastName" className="form-label">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="e.g. Kalhara" className="form-input" id="lastName" required onChange={handleChange} value={formData.lastName} />
          </div>
          <div>
            <label htmlFor="additionalName" className="form-label">Additional Name</label>
            <input type="text" className="form-input" id="additionalName" onChange={handleChange} value={formData.additionalName} />
          </div>
          <div>
            <label htmlFor="brandName" className="form-label">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="Shown in the header" className="form-input" id="brandName" required onChange={handleChange} value={formData.brandName} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="headline" className="form-label">
              Headline <span className="text-red-500">*</span>
            </label>
            <textarea placeholder="e.g. Software Engineer | Web Developer | UI/UX Designer" className="form-input" id="headline" rows={2} required onChange={handleChange} value={formData.headline} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="about" className="form-label">
              About <span className="text-red-500">*</span>
            </label>
            <textarea placeholder="A short intro about you." className="form-input" id="about" rows={4} required onChange={handleChange} value={formData.about} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="skills" className="form-label">
              Skills <span className="text-xs font-normal text-slate-400">(comma-separated)</span>
            </label>
            <textarea placeholder="e.g. React, Node, Express, Python, UI/UX" className="form-input" id="skills" rows={2} onChange={handleChange} value={formData.skills} />
          </div>
          <div>
            <label htmlFor="country" className="form-label">
              Country / Region <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="e.g. Sri Lanka" className="form-input" id="country" required onChange={handleChange} value={formData.country} />
          </div>
          <div>
            <label htmlFor="city" className="form-label">City</label>
            <input type="text" placeholder="e.g. Colombo" className="form-input" id="city" onChange={handleChange} value={formData.city} />
          </div>
        </div>

        {/* CV upload */}
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 dark:border-ink-700">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="cvUrl" className="form-label mb-0 flex items-center gap-2">
              <FiFileText className="text-brand-500" /> Upload your CV (PDF)
            </label>
            <input onChange={(e) => setCvFile(e.target.files[0])} type="file" accept="application/pdf" id="cvUrl" className="text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-500/10 file:px-3 file:py-1.5 file:text-brand-600 dark:file:text-brand-300" />
            <span className="text-xs">{uploadStatus(cvUploadError, cvPerc, "CV")}</span>
          </div>
          {formData.cvUrl && (
            <a href={formData.cvUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex font-mono text-sm text-brand-600 hover:underline dark:text-brand-300">
              View current CV →
            </a>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          disabled={!isFormChanged}
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update Basic Info"}
        </button>
      </form>
    </AdminLayout>
  );
}
