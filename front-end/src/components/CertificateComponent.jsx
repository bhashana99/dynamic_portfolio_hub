import React, { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { TbCertificate } from "react-icons/tb";
import Section from "./Section";
import Reveal from "./Reveal";

export default function CertificateComponent() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch("/api/certificate/get-certificates");
        const data = await res.json();
        setCertificates(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCertificates();
  }, []);

  if (certificates.length === 0) return null;

  // Detailed cards when the list is short; compact list when there are many.
  const detailed = certificates.length < 4;

  return (
    <Section id="certificateCom" index="04" label="certificates" title="Certifications">
      <div className={`grid gap-5 ${detailed ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {certificates.map((certificate, i) => (
          <Reveal key={certificate._id} delay={i * 0.05}>
            <div className="card card-hover flex h-full flex-col p-5">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/15 text-accent-600 dark:text-accent-400">
                <TbCertificate className="text-xl" />
              </span>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white break-words">
                {certificate.name}
              </h3>

              {detailed && (
                <>
                  <p className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                    {certificate.issuingOrganization}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                    Issued{" "}
                    {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {certificate.credentialId && (
                    <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                      ID: {certificate.credentialId}
                    </p>
                  )}
                </>
              )}

              {certificate.credentialUrl && (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm text-brand-600 hover:underline dark:text-brand-300"
                >
                  View certificate <FiExternalLink />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
