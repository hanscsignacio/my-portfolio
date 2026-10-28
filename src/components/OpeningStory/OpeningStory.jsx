import Hero from "../Hero/Hero";
import AboutIntro from "../About/AboutIntro";
import PortraitJourney from "../PortraitJourney/PortraitJourney";

// Keep section links outside the pinned stage.
function OpeningStory({ portraitRef }) {
  return (
    <div className="opening-story" id="home">
      <div className="opening-story__stage">
        <PortraitJourney portraitRef={portraitRef} />
        <Hero portraitRef={portraitRef} />
        <AboutIntro />
      </div>

      <span
        className="opening-story__about-anchor"
        id="about"
        aria-hidden="true"
      />
    </div>
  );
}

export default OpeningStory;
