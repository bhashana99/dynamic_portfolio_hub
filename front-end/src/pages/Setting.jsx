import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useSelector } from "react-redux";
import {
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Setting() {
  const {currentUser,loading,error} = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleAddButton = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return dispatch(changePasswordFailure("Password does not match!"));
    }
    dispatch(changePasswordStart());
    try {
      const res = await fetch(`api/user/change-password/${currentUser.username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(changePasswordFailure(data.message));
        return;
      }
      dispatch(changePasswordSuccess());
      setShowForm(!showForm);
      Toast.fire({
        icon: "success",
        title: "Password Changed in successful"
      });
    } catch (error) {
      dispatch(changePasswordFailure(error.message));
    }
  };

  return (
    <AdminLayout
      title="Account Setting"
      subtitle="Manage your account details and password."
    >
      {!showForm && (
        <div className="card p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              value={currentUser.username}
              id="username"
              className="form-input cursor-not-allowed opacity-70"
              disabled
            />
          </div>
          <button
            type="button"
            className="mt-6 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            onClick={toggleForm}
          >
            Change Password
          </button>
        </div>
      )}

      {showForm && (
        <div className="card p-6 md:p-8">
          <h2 className="mb-6 font-display text-lg font-semibold text-slate-900 dark:text-white">
            Change Password
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="form-input"
                required
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-input"
                minLength={5}
                required
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                minLength={5}
                required
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={toggleForm}
                className="btn-secondary w-full"
              >
                Back
              </button>
              <button
                disabled={loading}
                type="submit"
                className="btn-primary w-full disabled:opacity-80"
              >
                {loading ? "Loading.." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
