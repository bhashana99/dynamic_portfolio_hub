import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithubSquare, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter, FaMedium, FaStackOverflow } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import PropagateLoader from "react-spinners/PropagateLoader";

export default function Welcome() {
  const [basicInfo, setBasicInfo] = useState({});
  const [socialMedia, setSocialMedia] = useState({});
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const res = await fetch("/api/socialMedia/get-socialMedia");
        const data = await res.json();
        setSocialMedia(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBasicInfo = async () => {
      try {
        const res = await fetch("/api/basicInfo/get-basicInfo");
        const data = await res.json();
        setBasicInfo(data);
        fetchSocialMedia();
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBasicInfo();
  }, []);

  const skillsArray = basicInfo.skills
    ? basicInfo.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const socials = [
    { data: socialMedia.linkedin, Icon: FaLinkedin, label: "LinkedIn" },
    { data: socialMedia.github, Icon: FaGithubSquare, label: "GitHub" },
    { data: socialMedia.stackOverflow, Icon: FaStackOverflow, label: "Stack Overflow" },
    { data: socialMedia.x, Icon: FaSquareXTwitter, label: "X" },
    { data: socialMedia.medium, Icon: FaMedium, label: "Medium" },
    { data: socialMedia.instagram, Icon: FaInstagram, label: "Instagram" },
  ].filter((s) => s.data && s.data.link);

  // Boot-sequence lines for the terminal signature. The name lives in the
  // heading above — the terminal complements it with role / location / stack,
  // so nothing is repeated.
  const fullName = [basicInfo.firstName, basicInfo.lastName]
    .filter(Boolean)
    .join(" ");
  const location = [basicInfo.city, basicInfo.country].filter(Boolean).join(", ");
  const topSkills = skillsArray.slice(0, 5).join("  ");
  const termLines = [
    { cmd: "cat role" },
    { out: basicInfo.headline || "—" },
    ...(location ? [{ cmd: "echo $LOCATION" }, { out: location }] : []),
    ...(topSkills ? [{ cmd: "ls skills/" }, { out: topSkills }] : []),
    { cmd: "status" },
    { ok: "open to opportunities" },
  ];

  if (loading) {
    return (
      <section
        id="welcomeCom"
        className="flex min-h-screen items-center justify-center"
      >
        <PropagateLoader color="#3b82f6" />
      </section>
    );
  }

  return (
    <section
      id="welcomeCom"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16 md:pt-24"
    >
      {/* Faint structural grid — quiet, static. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: pitch */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Avatar — shown at the top on mobile; on desktop it lives in the
              right column beside the terminal instead. */}
          <div className="relative mb-6 w-fit lg:hidden">
            <div className="absolute -inset-2 rounded-full bg-brand-500/20 blur-2xl" />
            <img
              src={basicInfo.profileImage}
              alt={fullName || "Profile"}
              className="relative h-24 w-24 rounded-full border border-white/10 object-cover sm:h-28 sm:w-28"
            />
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="gradient-text">{basicInfo.firstName}</span>{" "}
            {basicInfo.lastName}
          </h1>

          {basicInfo.additionalName && (
            <p className="mt-1 font-mono text-sm text-slate-500">
              {basicInfo.additionalName}
            </p>
          )}

          {basicInfo.headline && (
            <p className="mt-4 max-w-xl font-mono text-sm text-slate-400 md:text-base">
              {basicInfo.headline}
            </p>
          )}

          {basicInfo.about && (
            <>
              <p
                className={`mt-5 max-w-xl text-base leading-relaxed text-slate-400 ${
                  isExpanded ? "" : "line-clamp-4"
                }`}
              >
                {basicInfo.about}
              </p>
              <button
                className="mt-1 font-mono text-sm text-brand-400 hover:underline md:hidden"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "see less" : "see more"}
              </button>
            </>
          )}

          {skillsArray.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {skillsArray.slice(0, 12).map((skill, i) => (
                <span key={i} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contactCom" className="btn-primary">
              Get in touch
            </a>
            {basicInfo.cvUrl && (
              <a
                href={basicInfo.cvUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <FiDownload /> Resume
              </a>
            )}
          </div>

          {socials.length > 0 && (
            <div className="mt-8 flex items-center gap-4">
              {socials.map(({ data, Icon, label }) => (
                <a
                  key={label}
                  href={data.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-2xl text-slate-500 transition-colors hover:text-brand-400"
                >
                  <Icon />
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: avatar + terminal signature */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative hidden lg:block">
            <div className="absolute -inset-2 rounded-full bg-brand-500/20 blur-2xl" />
            <img
              src={basicInfo.profileImage}
              alt={fullName || "Profile"}
              className="relative h-36 w-36 rounded-full border border-white/10 object-cover md:h-44 md:w-44"
            />
          </div>

          <div className="terminal w-full max-w-md">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-green-400/80" />
              <span className="ml-2 text-xs text-slate-500">
                ~/portfolio — bash
              </span>
            </div>
            <div className="space-y-1.5 break-words p-4 leading-relaxed">
              {termLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.22, duration: 0.2 }}
                >
                  {line.cmd && (
                    <p className="text-slate-500">
                      <span className="text-brand-400">$</span> {line.cmd}
                    </p>
                  )}
                  {line.out && <p className="pl-4 text-slate-200">{line.out}</p>}
                  {line.ok && (
                    <p className="pl-4 text-brand-400">● {line.ok}</p>
                  )}
                </motion.div>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + termLines.length * 0.22 }}
                className="text-slate-500"
              >
                <span className="text-brand-400">$</span>
                <span className="caret" />
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
