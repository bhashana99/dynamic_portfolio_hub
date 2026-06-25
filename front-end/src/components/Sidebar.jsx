import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { VscSignOut } from "react-icons/vsc";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FiUser, FiShare2, FiFolder, FiBookOpen, FiAward, FiBriefcase, FiMail, FiSettings, FiArrowLeft } from "react-icons/fi";
import {
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";

const navItems = [
  { to: "/basic-info", label: "Basic Info", Icon: FiUser },
  { to: "/social-media", label: "Social Media", Icon: FiShare2 },
  { to: "/projects", label: "Projects", Icon: FiFolder },
  { to: "/education", label: "Education", Icon: FiBookOpen },
  { to: "/certificate", label: "Certificate", Icon: FiAward },
  { to: "/experience", label: "Work Experience", Icon: FiBriefcase },
  { to: "/contact", label: "Contact", Icon: FiMail },
  { to: "/setting", label: "Settings", Icon: FiSettings },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    Swal.fire({
      title: "Sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, sign out",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        dispatch(signOutStart());
        const res = await fetch("/api/user/sign-out");
        const data = await res.json();
        if (data.success === false) {
          dispatch(signOutFailure(data.message));
          Swal.fire({ title: "Error", text: data.message, icon: "error" });
          return;
        }
        dispatch(signOutSuccess(data));
        navigate("/");
      } catch (error) {
        dispatch(signOutFailure(error.message));
        Swal.fire({ title: "Error", text: error.message, icon: "error" });
      }
    });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-brand-600 text-white shadow-glow"
        : "text-slate-600 hover:bg-brand-500/10 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white"
    }`;

  const panel = (
    <div className="flex h-full flex-col p-5">
      <Link to="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="text-xl text-brand-600 dark:text-brand-300" id="brandName-show">
          Dashboard
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={() => setOpen(false)}>
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-4 dark:border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-brand-500/10 hover:text-brand-600 dark:text-slate-300"
        >
          <FiArrowLeft className="text-lg" /> Back to Portfolio
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
        >
          <VscSignOut className="text-lg" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur md:hidden dark:border-white/10 dark:bg-ink-900/80">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 dark:border-white/15 dark:text-slate-200"
        >
          <AiOutlineMenu size={20} />
        </button>
        <span className="text-lg text-brand-600 dark:text-brand-300" id="brandName-show">
          Dashboard
        </span>
        <span className="w-9" />
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white md:block dark:border-white/10 dark:bg-ink-800">
        {panel}
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white shadow-2xl transition-transform dark:border-white/10 dark:bg-ink-800 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-3 top-3 text-slate-500 dark:text-slate-300"
          >
            <AiOutlineClose size={22} />
          </button>
          {panel}
        </div>
      </div>
    </>
  );
}
