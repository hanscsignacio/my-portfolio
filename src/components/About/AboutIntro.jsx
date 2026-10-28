// About opening headline.
function AboutIntro() {
  return (
    <section className="about-opening" aria-labelledby="about-heading">
      <div className="about__chapter-space" aria-hidden="true" />

      <div className="about__intro">
        <h2
          className="about__title"
          id="about-heading"
          aria-label="From what you see to what makes it work."
        >
          <span
            className="about__title-line about__title-line--1"
            aria-hidden="true"
          >
            <span className="about__phrase">FROM WHAT</span>
            <br className="about__title-break" />{" "}
            <span className="about__title-see about__phrase">YOU SEE</span>
            <br className="about__title-break" />
          </span>

          <span
            className="about__title-line about__title-line--2"
            aria-hidden="true"
          >
            <span className="about__phrase">TO WHAT</span>
            <br className="about__title-break" />{" "}
            <span className="about__title-makes about__phrase">MAKES</span>
          </span>

          <span
            className="about__title-line about__title-line--3"
            aria-hidden="true"
          >
            {" "}
            <span className="about__title-it about__phrase">IT</span>
            <br className="about__title-break" />{" "}
            <span className="about__phrase">WORK.</span>
          </span>
        </h2>
      </div>
    </section>
  );
}

export default AboutIntro;
