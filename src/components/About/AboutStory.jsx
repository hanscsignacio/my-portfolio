// Portrait, personal content, and expandable text.
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
        <span className="about__person-name-motion" aria-hidden="true">
          <span className="about__person-prefix">I’M</span>
          <span>HANS.</span>
        </span>
      </h3>

      {/* Portrait image. */}
      <figure className="about__person-portrait">
        {/* Reserve the shared portrait's About position. */}
        <span className="about__portrait-field" aria-hidden="true" />
        <div className="about__portrait-reveal" aria-hidden="true" />
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
