import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { FaLinkedin, FaGithubSquare, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter, FaMedium, FaStackOverflow } from "react-icons/fa6";
import Section from "./Section";
import Reveal from "./Reveal";
import { useData } from "../context/DataContext";

export default function ContactComponent() {
  const { socialMedia } = useData();
  const [contact, setContact] = useState({});

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contactInfo/get-contactInfo");
        const data = await res.json();
        setContact(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchContact();
  }, []);

  const methods = [
    contact.email && {
      Icon: FaEnvelope,
      label: contact.email,
      href: `mailto:${contact.email}`,
    },
    contact.phone && {
      Icon: FaPhoneAlt,
      label: contact.phone,
      href: `tel:${contact.phone}`,
    },
    contact.whatsapp && {
      Icon: FaWhatsapp,
      label: contact.whatsapp,
      href: `https://wa.me/${String(contact.whatsapp).replace(/[^0-9]/g, "")}`,
    },
  ].filter(Boolean);

  const socials = [
    { data: socialMedia.linkedin, Icon: FaLinkedin, label: "LinkedIn" },
    { data: socialMedia.github, Icon: FaGithubSquare, label: "GitHub" },
    { data: socialMedia.stackOverflow, Icon: FaStackOverflow, label: "Stack Overflow" },
    { data: socialMedia.x, Icon: FaSquareXTwitter, label: "X" },
    { data: socialMedia.medium, Icon: FaMedium, label: "Medium" },
    { data: socialMedia.instagram, Icon: FaInstagram, label: "Instagram" },
  ].filter((s) => s.data && s.data.link);

  return (
    <Section id="contactCom" index="05" label="contact" title="Let's build something together">
      <Reveal>
        <div className="card relative overflow-hidden p-6 sm:p-8 md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Have a role, a project, or just want to say hi? My inbox is
                always open — I'll get back to you.
              </p>
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="btn-primary mt-6">
                  <FaEnvelope /> Email me
                </a>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {methods.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white"
                >
                  <Icon className="text-brand-500" />
                  <span className="break-all text-sm">{label}</span>
                </a>
              ))}

              {socials.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  {socials.map(({ data, Icon, label }) => (
                    <a
                      key={label}
                      href={data.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="text-2xl text-slate-500 transition hover:-translate-y-0.5 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
