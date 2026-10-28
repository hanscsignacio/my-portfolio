//useState(): lets a React component store information that can change.
//useEffect() allows React to interact with things outside React's rendering process. (example is ung screen size..)
//useMemo() tells React to reuse the previous object if the listed dependencies haven't changed.
import { useEffect, useMemo, useState } from "react";
import { MotionContext } from "./MotionContext";

const STORAGE_KEY = "portfolio-motion-preference";

const MOBILE_QUERY = "(max-width: 820px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const VALID_PREFERENCES = ["auto", "full", "soft", "still"];

// Load the saved preference or use Auto
function getStoredPreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return VALID_PREFERENCES.includes(saved) ? saved : "auto";
  } catch {
    return "auto";
  }
}

function MotionProvider({ children }) {
  const [preference, setPreference] = useState(getStoredPreference);

  // Detect the current screen and system preferences
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia(REDUCED_QUERY).matches,
  );

  // Keep preferences updated when browser settings change
  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const reducedQuery = window.matchMedia(REDUCED_QUERY);

    const updateMobile = (event) => setIsMobile(event.matches);
    const updateReduced = (event) => setPrefersReducedMotion(event.matches);

    mobileQuery.addEventListener("change", updateMobile);
    reducedQuery.addEventListener("change", updateReduced);

    // Remove listeners when the component unmounts
    return () => {
      mobileQuery.removeEventListener("change", updateMobile);
      reducedQuery.removeEventListener("change", updateReduced);
    };
  }, []);

  // Save manual preferences in the browser local storage..
  useEffect(() => {
    try {
      if (preference === "auto") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, preference);
      }
    } catch {
      // Continue without saved preferences
      console.log("No save motion pref");
    }
  }, [preference]);

  // Use manual selection first, otherwise choose automatically
  const mode =
    preference !== "auto"
      ? preference
      : prefersReducedMotion
        ? "still"
        : isMobile
          ? "soft"
          : "full";

  // Make the active mode available to CSS
  useEffect(() => {
    document.documentElement.dataset.motion = mode;
  }, [mode]);

  // Share motion settings with other components
  const value = useMemo(
    () => ({
      mode,
      preference,
      setPreference,
      isMobile,
      prefersReducedMotion,
    }),
    [mode, preference, isMobile, prefersReducedMotion],
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export default MotionProvider;
