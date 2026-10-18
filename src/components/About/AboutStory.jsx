// Portrait, personal content, and expandable text.
import portrait from "../../assets/images/portrait-transparent.png";
import { personContent } from "./aboutContent";
import AboutExpandableText from "./AboutExpandableText";

// Personal introduction.
function AboutStory() {
  return (
    <section
      className="about__scene about__person"
      id="about-person"
      aria-labelledby="person-heading"
    >
      {/* Personal introduction heading. */}
      <h3
        className="about__person-title"
        id="person-heading"
        aria-label="I’m Hans."
      >
        <span className="about__person-prefix" aria-hidden="true">
          I’M
        </span>
        <span aria-hidden="true">HANS.</span>
      </h3>

      {/* Portrait image. */}
      <figure className="about__person-portrait">
        <img
          src={portrait}
          alt="Portrait of Hans Christian Ignacio"
          width="1263"
          height="1245"
          loading="lazy"
          decoding="async"
        />
      </figure>

      {/* Expandable personal description. */}
      <div className="about__person-content">
        <AboutExpandableText
          label={personContent.label}
          summary={personContent.summary}
          paragraphs={personContent.paragraphs}
        />
      </div>
    </section>
  );
}

// Export the component.
export default AboutStory;
