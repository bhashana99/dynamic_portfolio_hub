import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { FiUser, FiShare2, FiFolder, FiBookOpen, FiAward, FiBriefcase, FiMail, FiArrowRight } from "react-icons/fi";

const cards = [
  { to: "/basic-info", label: "Basic Info", desc: "Name, headline, photo & CV", Icon: FiUser },
  { to: "/social-media", label: "Social Media", desc: "Your profile links", Icon: FiShare2 },
  { to: "/projects", label: "Projects", desc: "Showcase your work", Icon: FiFolder },
  { to: "/education", label: "Education", desc: "Schools & degrees", Icon: FiBookOpen },
  { to: "/certificate", label: "Certificate", desc: "Certifications earned", Icon: FiAward },
  { to: "/experience", label: "Work Experience", desc: "Roles & companies", Icon: FiBriefcase },
  { to: "/contact", label: "Contact", desc: "How people reach you", Icon: FiMail },
];

export default function Edit() {
  return (
    <AdminLayout
      title="Welcome back 👋"
      subtitle="Pick a section to customize your portfolio."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ to, label, desc, Icon }) => (
          <Link key={to} to={to} className="card card-hover group flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <Icon className="text-xl" />
            </span>
            <div className="flex-1">
              <p className="font-display font-bold text-slate-900 dark:text-white">{label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
            <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand-600 dark:group-hover:text-brand-300" />
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
