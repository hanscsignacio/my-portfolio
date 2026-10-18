import { useEffect, useId, useRef } from "react";
import { useMotion } from "../../hooks/useMotion";
import { useExpandCollapseMotion } from "../../hooks/useExpandCollapseMotion";

// Expandable text styles.
import "./AboutExpandableText.css";
import "./AboutExpandableText.responsive.css";

// Expandable About description.
function AboutExpandableText({ label, summary, paragraphs }) {
  // References to the expandable area, summary, and full text.
  const rootRef = useRef(null);
  const summaryRef = useRef(null);
  const panelRef = useRef(null);

  // Store the pending text-click timer.
  const clickTimerRef = useRef(null);

  // Create a unique ID for the full-text area.
  const panelId = useId();

  // Read the selected motion mode and prepare the animation controls.
  const { mode } = useMotion();
  const { toggle, close } = useExpandCollapseMotion(
    rootRef,
    summaryRef,
    panelRef,
    mode,
  );

  // Cancel a pending text click.
  const cancelTextClick = () => {
    clearTimeout(clickTimerRef.current);
  };

  // Clear the timer on unmount or a motion-mode change.
  useEffect(() => {
    return () => {
      clearTimeout(clickTimerRef.current);
    };
  }, [mode]);

  // Use the animation hook instead of the browser's instant toggle.
  const handleSummaryClick = (event) => {
    event.preventDefault();
    cancelTextClick();
    toggle();
  };

  // Collapse the full text after a single click.
  const handleTextClick = (event) => {
    if (!panelRef.current.contains(event.target)) return;

    // Leave links, buttons, and form controls to handle their own clicks.
    const clickedControl = event.target.closest(
      "a, button, input, select, textarea, label, [contenteditable]",
    );

    if (clickedControl) return;

    cancelTextClick();

    // Preserve double-clicks and text selection.
    if (event.detail > 1 || !window.getSelection()?.isCollapsed) return;

    // Allow time for a second click before collapsing.
    clickTimerRef.current = setTimeout(() => {
      if (window.getSelection()?.isCollapsed) {
        close();
      }
    }, 250);
  };

  return (
    <details
      className="about-expandable-text"
      ref={rootRef}
      onClick={handleTextClick}
      onDoubleClick={cancelTextClick}
      onPointerDown={cancelTextClick}
    >
      {/* Short description and expand/collapse control. */}
      <summary
        ref={summaryRef}
        aria-controls={panelId}
        onClick={handleSummaryClick}
      >
        <span className="about-expandable-text__short">{summary}</span>

        <span className="about-expandable-text__cue">
          <span className="about-expandable-text__open-label">Read story</span>

          <span className="about-expandable-text__close-label">Show less</span>

          {/* Identify the description for screen readers. */}
          <span className="about-expandable-text__sr-only">: {label}</span>

          {/* Visual indicators for the open and closed states. */}
          <span className="about-expandable-text__mark" aria-hidden="true">
            <span className="about-expandable-text__open-label">+</span>
            <span className="about-expandable-text__close-label">−</span>
          </span>
        </span>
      </summary>

      {/* Full description paragraphs. */}
      <div className="about-expandable-text__body" ref={panelRef} id={panelId}>
        {paragraphs.map((text) => (
          <p
            className="about-expandable-text__paragraph"
            data-reveal
            key={text}
          >
            {text}
          </p>
        ))}

        {/* Close control at the end of the full description. */}
        <button
          className="about-expandable-text__return"
          type="button"
          data-reveal
          aria-label={`Show less: ${label}`}
          onClick={close}
        >
          Return to the short version
          <span aria-hidden="true">−</span>
        </button>
      </div>
    </details>
  );
}

// Export the component.
export default AboutExpandableText;
