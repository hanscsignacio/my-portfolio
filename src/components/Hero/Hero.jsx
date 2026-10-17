import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMotion } from "../../hooks/useMotion";
import { createHeroEntrance } from "../../animations/heroEntrance";
import portrait from "../../assets/images/portrait-transparent.png";

import "./Hero.css";
import "./Hero.responsive.css";

gsap.registerPlugin(useGSAP);

function Hero() {
  const { mode } = useMotion();

  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const previousModeRef = useRef(mode);

  // Play the Hero entrance on mount
  useGSAP(
    () => {
      timelineRef.current = createHeroEntrance(heroRef.current, mode);

      return () => {
        timelineRef.current = null;
      };
    },
    { scope: heroRef },
  );

  // Finish the entrance if the motion mode changes
  useEffect(() => {
    if (previousModeRef.current !== mode) {
      timelineRef.current?.progress(1);
      previousModeRef.current = mode;
    }
  }, [mode]);

  return (
    <div className="hero_wrap" ref={heroRef}>
      <section className="hero" id="home" aria-labelledby="hero-heading">
        <p className="hero__branding">PERSONAL PORTFOLIO</p>
        <div className="hero_main">
          <div className="hero__content">
            <h1 className="hero__name" id="hero-heading">
              <span className="hero__name-line">HANS</span>
              <span className="hero__name-line">IGNACIO</span>
            </h1>

            <div className="hero__intro">
              <p className="hero__role">Aspiring Web Developer</p>

              <p className="hero__description">
                I enjoy building web applications and exploring how their
                different parts work together.
              </p>
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

        <div className="hero__dark-panel" aria-hidden="true">
          <div className="hero__actions">
            <a className="hero__button hero__button--primary" href="#work">
              <span className="hero__button-inner">
                <span>View work</span>

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
      </section>

      <div className="hero__portrait">
        <img
          src={portrait}
          alt="Portrait of Hans Ignacio"
          fetchPriority="high"
          draggable="false"
        />
      </div>
    </div>
  );
}

export default Hero;
