import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Contact() {
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
    phone: "",
    email: "",
    whatsapp: "",
  });

  const [initialFormData, setInitialFormData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      const response = await fetch("/api/contactInfo/get-contactInfo");
      const data = await response.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
      setInitialFormData(data);
    };
    fetchContactInfo();
  }, []);

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

    const id = formData._id;

    try {
      const res = await fetch(`/api/contactInfo/update-contactInfo/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),

      });
      const data = await res.json();
      setLoading(false);

      if(data.success === false){
        setError(data.message);
      }
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
      title="Contact Information"
      subtitle="Manage the contact details shown on your portfolio."
    >
      <div className="card p-6 md:p-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="form-label flex items-center gap-2">
              <FaPhoneAlt className="text-brand-500" />
              Phone
            </label>
            <input
              onChange={handleChange}
              type="tel"
              id="phone"
              className="form-input"
              placeholder="e.g. +94769136107"
              value={formData.phone}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="form-label flex items-center gap-2">
              <FaEnvelope className="text-brand-500" />
              E-Mail
            </label>
            <input
              onChange={handleChange}
              type="email"
              id="email"
              className="form-input"
              placeholder="e.g. example@mail.com"
              value={formData.email}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="whatsapp" className="form-label flex items-center gap-2">
              <FaWhatsapp className="text-emerald-500" />
              Whatsapp
            </label>
            <input
              onChange={handleChange}
              type="tel"
              id="whatsapp"
              className="form-input"
              placeholder="e.g. +7611100025"
              value={formData.whatsapp}
            />
          </div>

          <button
            disabled={!isFormChanged}
            className={`btn-primary w-full ${
              !isFormChanged ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Contact Info"}
          </button>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
