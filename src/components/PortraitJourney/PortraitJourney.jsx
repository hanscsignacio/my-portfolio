import portrait from "../../assets/images/portrait-transparent.png";

// Share one portrait between Hero and About.
function PortraitJourney({ portraitRef }) {
  return (
    <div className="portrait-journey">
      <div className="portrait-journey__mover">
        <img
          id="portfolio-portrait"
          ref={portraitRef}
          src={portrait}
          alt="Portrait of Hans Christian Ignacio"
          width="1263"
          height="1245"
          fetchPriority="high"
          draggable="false"
        />
      </div>
    </div>
  );
}

export default PortraitJourney;
