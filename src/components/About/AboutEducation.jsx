// Education content and expandable text.
import { educationContent } from "./aboutContent";
import AboutExpandableText from "./AboutExpandableText";

// Education and academic journey.
function AboutEducation() {
  return (
    <section
      className="about__scene about__education"
      id="about-education"
      aria-labelledby="education-heading"
    >
      <div className="about__education-entry">
        {/* Subsection heading. */}
        <h3 className="about__foundation" id="education-heading">
          My foundation.
        </h3>

        {/* Study period and university. */}
        <div className="about__education-composition">
          <p className="about__period" aria-label="2023 to present">
            <span className="about__education-year" aria-hidden="true">
              2023
            </span>

            <span className="about__education-present" aria-hidden="true">
              to Present
            </span>
          </p>

          <p className="about__university">
            <span>Bataan Peninsula </span>
            <span>State University</span>
          </p>
        </div>

        {/* Degree and major. */}
        <dl className="about__degree">
          <div>
            <dt>Degree</dt>
            <dd>BS Information Technology</dd>
          </div>

          <div>
            <dt>Major</dt>
            <dd>Network and Web Application</dd>
          </div>
        </dl>

        {/* Academic recognition. */}
        <p className="about__recognition">
          <span className="about__recognition-label">Academic recognition</span>

          <span className="about__recognition-title">
            Consistent academic achiever
          </span>

          <span className="about__recognition-period">1st Year to Present</span>
        </p>

        {/* Expandable school-project description. */}
        <div className="about__education-content">
          <AboutExpandableText
            label={educationContent.label}
            summary={educationContent.summary}
            paragraphs={educationContent.paragraphs}
          />
        </div>
      </div>
    </section>
  );
}

// Export the component.
export default AboutEducation;
