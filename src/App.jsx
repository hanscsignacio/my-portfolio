// Page sections.
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";

import MotionProvider from "./context/MotionProvider";
import MotionControl from "./components/MotionControl/MotionControl";

function App() {
  return (
    // Share motion settings with the portfolio
    <MotionProvider>
      <MotionControl />

      <main>
        <Hero />

        {/* About opener. */}
        <About />
      </main>
    </MotionProvider>
  );
}

export default App;
