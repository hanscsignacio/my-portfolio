import Hero from "./components/Hero/Hero";
import MotionProvider from "./context/MotionProvider";
import MotionControl from "./components/MotionControl/MotionControl";

function App() {
  return (
    // Share motion settings with the portfolio
    <MotionProvider>
      <MotionControl />

      <main>
        <Hero />
      </main>
    </MotionProvider>
  );
}

export default App;
