// About subsections.
import AboutStory from "./AboutStory";
import AboutApproach from "./AboutApproach";
import AboutEducation from "./AboutEducation";
import AboutDirection from "./AboutDirection";

// About styles.
import "./About.css";
import "./About.responsive.css";

function About() {
  return (
    <section
      className="about"
      id="about-content"
      aria-labelledby="about-heading"
    >
      <div className="about__chapter-space" aria-hidden="true" />

      <AboutStory />
      <AboutApproach />
      <AboutEducation />
      <AboutDirection />
    </section>
  );
}

export default About;
