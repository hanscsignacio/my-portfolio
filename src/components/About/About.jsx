// About subsections.
import AboutStory from "./AboutStory";
import AboutApproach from "./AboutApproach";
import AboutEducation from "./AboutEducation";

// About styles.
import "./About.css";
import "./About.responsive.css";

// About section.
function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      {/* Chapter navigation. */}
      <nav className="about__chapter" aria-label="About chapter">
        <a className="about__chapter-link" href="#about">
          <span>01</span>
          <span aria-hidden="true">/</span>
          <span>ABOUT</span>
        </a>
      </nav>

      {/* Introductory headline. */}
      <div className="about__intro">
        <h2
          className="about__title"
          id="about-heading"
          aria-label="From what you see to what makes it work."
        >
          {/* First desktop row. */}
          <span
            className="about__title-line about__title-line--1"
            aria-hidden="true"
          >
            FROM WHAT
            <br className="about__title-break" />{" "}
            <span className="about__title-see">YOU SEE</span>
            <br className="about__title-break" />
          </span>

          {/* Second desktop row. */}
          <span
            className="about__title-line about__title-line--2"
            aria-hidden="true"
          >
            TO WHAT
            <br className="about__title-break" />{" "}
            <span className="about__title-makes">MAKES</span>
          </span>

          {/* Third desktop row. */}
          <span
            className="about__title-line about__title-line--3"
            aria-hidden="true"
          >
            {" "}
            IT
            <br className="about__title-break" /> WORK.
          </span>
        </h2>
      </div>

      {/* Personal introduction. */}
      <AboutStory />

      {/* 'Interface, logic, and data.' Section */}
      <AboutApproach />

      {/* 'Education and academic journey.' Section */}
      <AboutEducation />
    </section>
  );
}

// Export the About component.
export default About;
