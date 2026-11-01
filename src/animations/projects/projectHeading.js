import gsap from "gsap";

// Let the word emerge from the section's reading edge.
export function createProjectHeadingMotion(root, mode) {
  const heading = root.querySelector(".selected-project__title");
  const word = heading.querySelector(".selected-project__title-word");
  const lead = heading.querySelector(".selected-project__title-lead");
  const full = mode === "full";

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "projects-heading",
      trigger: heading,
      start: "top 80%",
      end: full ? "top 30%" : "top 48%",
      scrub: full ? 0.45 : 0.2,
      invalidateOnRefresh: true,
    },
  });

  timeline.fromTo(
    lead,
    { x: full ? -56 : -16, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.4 },
    0,
  );
  timeline.fromTo(
    word,
    {
      yPercent: full ? 115 : 45,
      xPercent: full ? -9 : -2,
      rotation: full ? -5 : -1.5,
    },
    { yPercent: 0, xPercent: 0, rotation: 0, duration: 1 },
    0,
  );

  return timeline;
}

// Roll the label into place as Projects takes over from About.
export function createProjectChapterMotion(root, mode) {
  const pieces = root.querySelectorAll(".selected-project__chapter-piece");
  const full = mode === "full";
  const from = {
    y: 0,
    yPercent: full ? 120 : 40,
    opacity: 0,
  };

  gsap.set(pieces, { ...from });

  return gsap.fromTo(pieces, from, {
    y: 0,
    yPercent: 0,
    opacity: 1,
    stagger: full ? 0.08 : 0.025,
    ease: "none",
    scrollTrigger: {
      id: "projects-chapter",
      trigger: root,
      start: "top 24%",
      end: "top top",
      scrub: full ? 0.25 : 0.15,
      invalidateOnRefresh: true,
    },
  });
}
