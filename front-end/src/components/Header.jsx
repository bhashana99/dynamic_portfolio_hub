import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useSelector } from "react-redux";
import { IoIosSettings } from "react-icons/io";
import { useData } from "../context/DataContext";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { basicInfo } = useData();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSectionEmpty, setIsSectionEmpty] = useState({
    certificate: true,
    project: true,
    education: true,
    work: true,
  });
  // Hold the nav back until we know which sections exist, so the menu doesn't
  // flash a partial "Home / Contact" state and then pop in the rest.
  const [navReady, setNavReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Retry while the backend is waking up so the nav reliably appears.
    const checkIfSectionsEmpty = async (attempt = 0) => {
      try {
        const responses = await Promise.all([
          fetch("/api/certificate/is-empty"),
          fetch("/api/project/is-empty"),
          fetch("/api/education/is-empty"),
          fetch("/api/work/is-empty"),
        ]);
        if (responses.some((r) => !r.ok)) throw new Error("section check failed");

        const [certData, projData, eduData, workData] = await Promise.all(
          responses.map((r) => r.json())
        );

        setIsSectionEmpty({
          certificate: certData.isEmpty,
          project: projData.isEmpty,
          education: eduData.isEmpty,
          work: workData.isEmpty,
        });
        setNavReady(true);
      } catch (error) {
        console.log(error);
        if (attempt < 6) {
          setTimeout(() => checkIfSectionsEmpty(attempt + 1), 5000);
        }
      }
    };

    checkIfSectionsEmpty();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  const navLinks = [
    { label: "Home", hash: "#welcomeCom", show: true },
    { label: "Education", hash: "#eduCom", show: !isSectionEmpty.education },
    { label: "Experience", hash: "#exeCom", show: !isSectionEmpty.work },
    { label: "Projects", hash: "#projectCom", show: !isSectionEmpty.project },
    {
      label: "Certificate",
      hash: "#certificateCom",
      show: !isSectionEmpty.certificate,
    },
    { label: "Contact", hash: "#contactCom", show: true },
  ].filter((l) => l.show);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-slate-950/70"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="text-lg sm:text-2xl">
          <span className="text-brand-600 dark:text-brand-300" id="brandName-show">
            {basicInfo.brandName}
          </span>
        </Link>

        {/* Desktop nav — hidden until we know the real section list */}
        <nav className="hidden items-center gap-1 md:flex">
          {navReady &&
            navLinks.map((link) => (
            <Link
              key={link.hash}
              to={link.hash}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300 ${
                location.hash === link.hash
                  ? "text-brand-600 dark:text-brand-300"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {currentUser && (
            <Link
              to="/edit"
              aria-label="Dashboard"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:text-brand-600 md:inline-flex dark:border-white/15 dark:text-slate-300"
            >
              <IoIosSettings className="text-lg" />
            </Link>
          )}
          {navReady && (
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 md:hidden dark:border-white/15 dark:text-slate-200"
            >
              <AiOutlineMenu size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[78%] max-w-xs border-l border-slate-200 bg-white p-6 shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-900 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xl text-brand-600 dark:text-brand-300" id="brandName-show">
              {basicInfo.brandName}
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-slate-500 dark:text-slate-300"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.hash} to={link.hash} onClick={() => setOpen(false)}>
                <li className="rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-brand-500/10 hover:text-brand-600 dark:text-slate-200">
                  {link.label}
                </li>
              </Link>
            ))}
            {currentUser && (
              <Link to="/edit" onClick={() => setOpen(false)}>
                <li className="mt-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white">
                  Edit Page
                </li>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
