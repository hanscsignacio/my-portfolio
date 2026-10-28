import { useLayoutEffect } from "react";
import gsap from "gsap";
import { createProjectDetailsMotion } from "../animations/projects/projectDetails";

export function useProjectDetailsMotion({ dialogRef, scrollerRef, isOpen, mode, projectId }) {
  useLayoutEffect(() => {
    if (!isOpen || mode === "still") return;
    const root = dialogRef.current;
    const scroller = scrollerRef.current;
    let motion;
    let timer = 0;
    let disposed = false;
    const context = gsap.context(() => {
      motion = createProjectDetailsMotion(root, scroller, mode);
    }, root);

    // Refresh only this overlay after its reading layout settles.
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { if (!disposed) motion.refresh(); }, 120);
    };
    const focus = (event) => motion.revealFor(event.target);
    const observer = new ResizeObserver(schedule);
    observer.observe(root.querySelector(".project-dialog__content"));
    observer.observe(scroller);
    root.addEventListener("load", schedule, true);
    root.addEventListener("focusin", focus);
    root.addEventListener("portfolio:project-ready", schedule);
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(() => { if (!disposed) schedule(); });
    schedule();

    // Remove observers and restore styles when the overlay closes.
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      observer.disconnect();
      root.removeEventListener("load", schedule, true);
      root.removeEventListener("focusin", focus);
      root.removeEventListener("portfolio:project-ready", schedule);
      window.removeEventListener("resize", schedule);
      context.revert();
    };
  }, [dialogRef, scrollerRef, isOpen, mode, projectId]);
}
