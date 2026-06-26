import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useData } from "../context/DataContext";

export default function Footer() {
  const { currentUser } = useSelector((state) => state.user);
  const { basicInfo } = useData();

  return (
    <footer className="border-t border-slate-200 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row">
        <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
          © 2026{" "}
          <span className="text-brand-600 dark:text-brand-300" id="footerBrand">
            {basicInfo.brandName}
          </span>
          .
        </p>
        <Link
          to={currentUser ? "/edit" : "/sign-in"}
          className="font-mono text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
        >
          {currentUser ? "Dashboard" : "Edit page"}
        </Link>
      </div>
    </footer>
  );
}
