import { useRef } from "react";
import OpeningStory from "./components/OpeningStory/OpeningStory";
import About from "./components/About/About";
import AboutChapter from "./components/About/AboutChapter";
import SelectedProject from "./components/SelectedProject/SelectedProject";
import MotionProvider from "./context/MotionProvider";
import MotionControl from "./components/MotionControl/MotionControl";
import { useMotion } from "./hooks/useMotion";
import { useHeroAboutScrollMotion } from "./hooks/useHeroAboutScrollMotion";

import "./styles/scrollMotion.css";

// Keep page motion inside the motion provider.
function PortfolioContent() {
  const pageRef = useRef(null);
  const portraitRef = useRef(null);
  const { mode } = useMotion();

  useHeroAboutScrollMotion(pageRef, mode);

  return (
    <main className="portfolio" ref={pageRef}>
      <AboutChapter />
      <OpeningStory portraitRef={portraitRef} />
      <About />
      <SelectedProject />
    </main>
  );
}

function App() {
  return (
    <MotionProvider>
      <MotionControl />
      <PortfolioContent />
    </MotionProvider>
  );
}

export default App;
