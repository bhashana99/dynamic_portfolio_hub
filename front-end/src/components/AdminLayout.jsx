import React from "react";
import Sidebar from "./Sidebar";

// Standard chrome for every dashboard page: sidebar + offset content area.
export default function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900">
      <Sidebar />
      <div className="md:pl-64">
        <div className="mx-auto max-w-4xl px-5 py-8 md:py-12">
          {title && (
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
