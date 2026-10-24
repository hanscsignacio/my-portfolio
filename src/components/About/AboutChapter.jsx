// About chapter navigation.
function AboutChapter() {
  return (
    <nav
      className="about__chapter"
      aria-label="About chapter"
      aria-hidden="true"
      inert
    >
      <a className="about__chapter-link" href="#about">
        <span>01</span>
        <span aria-hidden="true">/</span>
        <span>ABOUT</span>
      </a>
    </nav>
  );
}

export default AboutChapter;
