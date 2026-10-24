// OJT content and expandable text.
import { directionContent } from "./aboutContent";
import AboutExpandableText from "./AboutExpandableText";

// OJT goal and current interests.
function AboutDirection() {
  return (
    <section
      className="about__scene about__direction"
      id="contact"
      aria-labelledby="direction-heading"
    >
      <div className="about__direction-inner">
        {/* Closing headline. */}
        <h3
          className="about__next"
          id="direction-heading"
          aria-label="More to learn. More to build."
        >
          {/* Learn line. */}
          <span className="about__next-line" aria-hidden="true">
            <span className="about__next-prefix">
              <span>MORE</span>
              <span>TO</span>
            </span>

            <span className="about__next-word">LEARN.</span>
          </span>

          {/* Build line. */}
          <span
            className="about__next-line about__next-line--build"
            aria-hidden="true"
          >
            <span className="about__next-prefix">
              <span>MORE</span>
              <span>TO</span>
            </span>

            <span className="about__next-word about__next-word--outline">
              BUILD.
            </span>
          </span>
        </h3>

        {/* Expandable OJT description. */}
        <div className="about__direction-content">
          <AboutExpandableText
            label={directionContent.label}
            summary={directionContent.summary}
            paragraphs={directionContent.paragraphs}
          />
        </div>
      </div>
    </section>
  );
}

// Export the component.
export default AboutDirection;
