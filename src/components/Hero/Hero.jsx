import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMotion } from "../../hooks/useMotion";
import { createHeroEntrance } from "../../animations/hero/heroEntrance";

import "./Hero.css";
import "./Hero.responsive.css";

gsap.registerPlugin(useGSAP);

function Hero({ portraitRef }) {
  const { mode } = useMotion();

  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const previousModeRef = useRef(mode);

  // Play the Hero entrance on mount
  useGSAP(
    () => {
      timelineRef.current = createHeroEntrance(
        heroRef.current,
        mode,
        portraitRef?.current,
      );

      // Finish the entrance when opening a next section
      const deepLink = window.location.hash && window.location.hash !== "#home";

      if (deepLink || heroRef.current.getBoundingClientRect().bottom <= 0) {
        timelineRef.current?.progress(1);
      }

      return () => {
        timelineRef.current = null;
      };
    },
    { scope: heroRef },
  );

  // Finish the entrance before rebuilding scroll motion.
  useLayoutEffect(() => {
    if (previousModeRef.current !== mode) {
      timelineRef.current?.progress(1);
      previousModeRef.current = mode;
    }
  }, [mode]);

  return (
    <div className="hero_wrap" ref={heroRef}>
      <section className="hero" aria-labelledby="hero-heading">
        <p className="hero__branding">PERSONAL PORTFOLIO</p>
        <div className="hero_main">
          <div className="hero__content">
            <h1 className="hero__name" id="hero-heading">
              <span className="hero__name-line">
                <span className="hero__name-scroll">HANS</span>
              </span>
              <span className="hero__name-line">
                <span className="hero__name-scroll">IGNACIO</span>
              </span>
            </h1>

            <div className="hero__intro">
              <p className="hero__role">Aspiring Web Developer</p>

              <p className="hero__description">
                I enjoy building web applications and exploring how their
                different parts work together.
              </p>

              <a
                className="hero__resume"
                href="https://res.cloudinary.com/nufaddnr/image/upload/v1793228023/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View my resume (PDF, opens in a new tab)"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
                  <path d="M14 3v6h6M8 13h8m-8 4h5" />
                </svg>
                <span className="hero__resume-label">View my resume</span>
                <span className="hero__resume-type" aria-hidden="true">
                  PDF
                </span>
              </a>
            </div>
          </div>

          <div className="hero__side-details">
            <p className="hero__student">
              4TH-YEAR
              <span>IT STUDENT</span>
            </p>

            <span className="hero__side-divider" aria-hidden="true" />

            <p className="hero__keywords">
              <span>LEARN</span>
              <span>BUILD</span>
              <span>EXPLORE</span>
              <span>GROW</span>
            </p>
          </div>
        </div>

        <div className="hero__dark-panel">
          <div className="hero__actions">
            <div className="hero__actions-scroll">
              <a
                className="hero__button hero__button--primary"
                href="#projects"
              >
                <span className="hero__button-inner">
                  <span>View projects</span>

                  <svg
                    className="hero__arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 12h16M13 5l7 7-7 7" />
                  </svg>
                </span>
              </a>

              <a className="hero__button hero__button--outline" href="#contact">
                <span className="hero__button-inner">Contact me</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="hero__portrait" aria-hidden="true">
        {/* Reserve the shared portrait's Hero position. */}
        <div className="hero__portrait-slot" />
      </div>
    </div>
  );
}

export default Hero;
