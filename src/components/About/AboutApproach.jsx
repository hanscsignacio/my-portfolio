// Capstone content and expandable text.
import { approachContent } from "./aboutContent";
import AboutExpandableText from "./AboutExpandableText";

// Interface, logic, and data.
function AboutApproach() {
  return (
    <section
      className="about__scene about__approach"
      id="about-approach"
      aria-labelledby="approach-heading"
    >
      <div className="about__approach-inner">
        {/* Layered headline. */}
        <h3
          className="about__layers"
          id="approach-heading"
          aria-label="Interface. Logic. Data."
        >
          {/* Interface layer. */}
          <span
            className="about__layer about__layer--interface"
            aria-hidden="true"
          >
            <span className="about__layer-word">INTERFACE.</span>
            <span className="about__layer-caption">UI/UX + frontend</span>
          </span>

          {/* Backend layer. */}
          <span className="about__layer about__layer--logic" aria-hidden="true">
            <span className="about__layer-word">LOGIC.</span>
            <span className="about__layer-caption">Backend development</span>
          </span>

          {/* Database layer. */}
          <span className="about__layer about__layer--data" aria-hidden="true">
            <span className="about__layer-word">DATA.</span>
            <span className="about__layer-caption">Database design</span>
          </span>
        </h3>

        {/* Expandable capstone description. */}
        <div className="about__approach-content">
          <AboutExpandableText
            label={approachContent.label}
            summary={approachContent.summary}
            paragraphs={approachContent.paragraphs}
          />
        </div>
      </div>
    </section>
  );
}

// Export the component.
export default AboutApproach;
