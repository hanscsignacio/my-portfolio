import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotion } from "../../hooks/useMotion";
import { createContactMotion } from "../../animations/contact/contactMotion";
import { contactEmail, contactSocials } from "./contactData";
import ContactIcon from "./ContactIcon";
import "./Contact.css";
import "./Contact.responsive.css";

function Contact() {
  const rootRef = useRef(null);
  const copyTimer = useRef(null);
  const { mode } = useMotion();
  const [copyState, setCopyState] = useState("idle");
  const [emailName, emailDomain] = contactEmail.split("@");

  // Remove the old motion and listeners when the mode changes.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (mode === "still") return;
    const context = gsap.context(() => createContactMotion(root, mode), rootRef);
    return () => {
      context.revert();
      // Clear the chapter's scrubbed pose after reverting.
      root.querySelectorAll("[data-contact-chapter]").forEach(piece => {
        piece.style.removeProperty("transform");
        piece.style.removeProperty("opacity");
      });
    };
  }, [mode]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const copyEmail = async () => {
    window.clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    copyTimer.current = window.setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <section className="contact" id="contact" ref={rootRef} aria-labelledby="contact-heading">
      <div className="contact__curtain" aria-hidden="true" />
      <nav className="contact__chapter" aria-label="Contact chapter">
        <a href="#contact">
          {["04", "/", "CONTACT"].map(piece => (
            <span className="contact__mask" key={piece} aria-hidden={piece === "/" ? true : undefined}>
              <span data-contact-chapter>{piece}</span>
            </span>
          ))}
        </a>
      </nav>

      <div className="contact__body">
        <header className="contact__header">
          <p className="contact__availability" data-contact-availability>Open to web development OJT</p>
          <h2 id="contact-heading" aria-label="Get in touch.">
            <span className="contact__title-mask" aria-hidden="true"><span data-contact-title>GET IN</span></span>{" "}
            <span className="contact__title-mask" aria-hidden="true"><span data-contact-title>TOUCH.</span></span>
          </h2>
        </header>

        <div className="contact__email" data-contact-email>
          <div className="contact__email-content" data-contact-email-content>
            <span className="contact__eyebrow">Send an email</span>
            <div className="contact__email-row">
              <a className="contact__email-link" href={`mailto:${contactEmail}`}>
                {emailName}<wbr />@{emailDomain}
              </a>
              <button className="contact__copy" type="button" onClick={copyEmail} aria-label="Copy email address">
                <ContactIcon name={copyState === "copied" ? "check" : "copy"} />
                <span>{copyState === "copied" ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
          <span className="contact__email-line" data-contact-email-line aria-hidden="true" />
          <span className="contact__copy-status" role="status">
            {copyState === "copied" ? "Email address copied." : copyState === "error" ? "Please select and copy the email address." : ""}
          </span>
        </div>

        <nav className="contact__socials" aria-label="Find me online">
          {contactSocials.map(social => (
            <a className="contact-social" href={social.href} key={social.name} target="_blank" rel="noopener noreferrer" aria-label={`${social.name}: ${social.description} (opens in a new tab)`}>
              <span className="contact-social__body" data-contact-social>
                <span className={`contact-social__logo${social.wordmark ? " contact-social__logo--wordmark" : ""}`} style={{ "--social-logo": `url("${social.logo}")` }} aria-hidden="true" />
                <span className="contact-social__copy">
                  <span className="contact-social__name">{social.name}</span>
                  <span className="contact-social__description">{social.description}</span>
                </span>
              </span>
            </a>
          ))}
        </nav>

        <footer className="contact__footer" data-contact-footer>
          <span>Hans Christian Ignacio</span>
          <a href="#home">Back to top <ContactIcon name="up" /></a>
        </footer>
      </div>
    </section>
  );
}

export default Contact;
