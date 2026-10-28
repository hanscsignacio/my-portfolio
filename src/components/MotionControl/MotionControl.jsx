import { useEffect, useRef, useState } from "react";
import { useMotion } from "../../hooks/useMotion";
import "./MotionControl.css";
import "./MotionControl.responsive.css";

const MOTION_MODES = [
  { value: "still", label: "Still" },
  { value: "soft", label: "Soft" },
  { value: "full", label: "Full" },
];

function MotionIcon({ mode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {mode === "still" && (
        <>
          <path d="M9 5v14M15 5v14" />
        </>
      )}

      {mode === "soft" && <path d="M2 12c3-6 5 6 10 0s7 6 10 0" />}

      {mode === "full" && <path d="M13 2 4 13h7l-1 9 10-12h-7l1-8Z" />}
    </svg>
  );
}

function MotionControl() {
  const { mode, preference, setPreference } = useMotion();
  const [isExpanded, setIsExpanded] = useState(false);

  const controlRef = useRef(null);
  const triggerRef = useRef(null);

  const activeLabel = MOTION_MODES.find((item) => item.value === mode)?.label;

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isExpanded) return;

    const handleOutsideClick = (event) => {
      if (!controlRef.current?.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isExpanded]);

  // Apply the selected preference
  const handleSelect = (value) => {
    setPreference(value);
    setIsExpanded(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={controlRef}
      className={`motion-control ${isExpanded ? "motion-control--expanded" : ""}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className="motion-control__trigger"
        aria-label={`Motion settings. Current mode: ${activeLabel}`}
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? "motion-control-options" : undefined}
        onClick={() => setIsExpanded((current) => !current)}
      >
        <span className="motion-control__icon">
          <MotionIcon mode={mode} />
        </span>

        <span className="motion-control__active">{activeLabel}</span>

        <svg
          className="motion-control__chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isExpanded && (
        <div
          id="motion-control-options"
          className="motion-control__panel"
          role="group"
          aria-label="Motion preferences"
        >
          <p className="motion-control__heading">MOTION</p>

          <div className="motion-control__options">
            {MOTION_MODES.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`motion-control__option ${
                  mode === item.value ? "motion-control__option--active" : ""
                }`}
                aria-pressed={preference === item.value}
                onClick={() => handleSelect(item.value)}
              >
                <MotionIcon mode={item.value} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="motion-control__auto"
            aria-pressed={preference === "auto"}
            onClick={() => handleSelect("auto")}
          >
            <span>Auto (match device)</span>
            <span>{preference === "auto" ? "ACTIVE" : "RESET"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default MotionControl;
