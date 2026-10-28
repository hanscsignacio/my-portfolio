import { useLayoutEffect, useState } from "react";
import { createWalkthroughRenderer } from "../../animations/projects/projectWalkthrough";

const clamp = (value) => Math.max(0, Math.min(1, value));

export function useWalkthroughScene({ rootRef, navRef, scrollerRef, isOpen, mode, projectId }) {
  const [activeScene, setActiveScene] = useState(0);
  const [needsFlow, setNeedsFlow] = useState(false);
  const staticFlow = mode === "still" || needsFlow;

  useLayoutEffect(() => {
    if (!isOpen) return;
    const root = rootRef.current;
    const scroller = scrollerRef.current;
    const steps = [...root.querySelectorAll("[data-project-step]")];
    const panels = [...root.querySelectorAll(".project-walkthrough__panel")];
    const renderer = staticFlow ? null : createWalkthroughRenderer(root, mode);
    let frame = 0;
    let disposed = false;

    const update = () => {
      frame = 0;
      // Measure wrapped pills before placing the sticky screen.
      const navHeight = navRef.current.offsetHeight;
      const navSize = `${navHeight}px`;
      if (root.style.getPropertyValue("--walkthrough-nav-height") !== navSize) root.style.setProperty("--walkthrough-nav-height", navSize);
      const panelHeight = Math.max(...panels.map((panel) => panel.offsetHeight));
      const transitionDistance = Math.min(192, (scroller.clientHeight - navHeight) * 0.28);
      if (!staticFlow) {
        const stepDistance = Math.max(transitionDistance + 128, panelHeight * 0.85);
        const sizes = {
          "--walkthrough-step-distance": `${Math.round(stepDistance)}px`,
          "--walkthrough-panel-height": `${Math.ceil(panelHeight)}px`,
        };
        for (const [property, value] of Object.entries(sizes)) {
          if (root.style.getPropertyValue(property) !== value) root.style.setProperty(property, value);
        }
      }
      // Use normal scrolling when the screen cannot fit.
      const tooTall = panelHeight > scroller.clientHeight - navHeight - 32;
      setNeedsFlow((previous) => previous === tooTall ? previous : tooTall);
      const viewportTop = scroller.getBoundingClientRect().top;
      let current = 0;
      if (staticFlow) {
        const readingLine = viewportTop + navHeight + Math.min(144, (scroller.clientHeight - navHeight) * 0.24);
        for (const step of steps) {
          if (step.getBoundingClientRect().top <= readingLine) current = Number(step.dataset.projectStep);
        }
      } else {
        // Drive the screenshot and active pill from one position.
        const stageTop = viewportTop + navHeight + 16;
        let phase = 0;
        for (let index = 1; index < steps.length; index += 1) {
          const progress = clamp((stageTop + transitionDistance - steps[index].getBoundingClientRect().top) / transitionDistance);
          if (progress > 0) phase = index - 1 + progress;
        }
        current = Math.round(phase);
        renderer.paint(phase);
      }
      setActiveScene((previous) => previous === current ? previous : current);
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(scroller);
    steps.forEach((step) => observer.observe(step));
    const stage = root.querySelector(".project-walkthrough__stage");
    if (stage) observer.observe(stage);
    root.addEventListener("load", schedule, true);
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(schedule);
    update();

    // Remove listeners and restore the screen styles.
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("load", schedule, true);
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      renderer?.destroy();
      root.style.removeProperty("--walkthrough-nav-height");
      root.style.removeProperty("--walkthrough-step-distance");
      root.style.removeProperty("--walkthrough-panel-height");
    };
  }, [isOpen, mode, staticFlow, projectId, rootRef, navRef, scrollerRef]);

  return { activeScene, staticFlow };
}
