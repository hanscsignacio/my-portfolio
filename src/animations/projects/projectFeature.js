import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Assemble each project's screens as its image field enters view.
export function createProjectFeatureMotion(root, mode, compact) {
  const visual = root.querySelector(".project-feature__visual");
  const stage = root.querySelector(".project-preview");
  const title = root.querySelector(".project-feature__title span");
  const desktop = stage.querySelector(".project-preview__desktop");
  const phone = stage.querySelector(".project-preview__phone");
  const full = mode === "full";

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: `project-${root.querySelector("h3").id}`,
      trigger: visual,
      start: "top 80%",
      end: full ? "top 12%" : "top 32%",
      scrub: full ? 0.5 : 0.2,
      invalidateOnRefresh: true,
    },
  });

  timeline.fromTo(title,
    { yPercent: full ? 110 : 35, rotation: full ? 5 : 1.5 },
    { yPercent: 0, rotation: 0, duration: 0.35 }, 0,
  );
  timeline.fromTo(stage,
    { clipPath: full ? "inset(12% 0% 88% 0%)" : "inset(4% 0% 35% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.56 }, 0,
  );

  if (desktop) {
    timeline.fromTo(desktop,
      {
        xPercent: full ? (compact ? -24 : -22) : -6,
        yPercent: full ? (compact ? -8 : 14) : 4,
        rotation: full ? -12 : (compact ? -7 : -4),
        scale: full ? 1.08 : 1.02,
      },
      { xPercent: 0, yPercent: 0, rotation: compact ? -5 : -2, scale: 1, duration: 0.76 }, 0.06,
    );
  }

  if (phone) {
    timeline.fromTo(phone,
      {
        xPercent: full ? 38 : 9,
        yPercent: full ? 32 : 7,
        rotation: full ? 14 : 6,
        scale: full ? 0.93 : 0.98,
      },
      { xPercent: 0, yPercent: 0, rotation: compact ? 3 : 4, scale: 1, duration: 0.8 }, 0.2,
    );
  }

  const stack = root.querySelector(".project-stack-preview");
  if (stack) {
    const technologyList = stack.querySelector(".project-technologies") || stack;
    const technologies = stack.querySelectorAll(".project-technologies [data-stack-reveal]");
    const technologyStart = { y: full ? 32 : 8, opacity: full ? 0 : 0.4, clipPath: full ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 30% 0%)" };
    const highlights = stack.querySelectorAll(".project-stack-preview__highlights [data-stack-reveal]");
    const highlightStart = { y: full ? 12 : 4, opacity: full ? 0 : 0.5, clipPath: full ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 20% 0%)" };
    const revealHeight = () => stack.getBoundingClientRect().bottom - technologyList.getBoundingClientRect().top;
    const stackTimeline = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        id: `stack-${root.querySelector("h3").id}`,
        trigger: technologyList,
        // Let the row enter view before playing, including at the page end.
        start: () => Math.max(0, Math.min(
          technologyList.getBoundingClientRect().top + window.scrollY - Math.min(
            window.innerHeight * 0.78,
            window.innerHeight - revealHeight() - technologyStart.y - 24,
          ),
          ScrollTrigger.maxScroll(window) - 48,
        )),
        end: "bottom top",
        toggleActions: "play none none reset",
        invalidateOnRefresh: true,
      },
    });

    technologies.forEach((technology, index) => {
      stackTimeline.fromTo(technology,
        { ...technologyStart },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: full ? 0.6 : 0.4, immediateRender: true },
        index * (full ? 0.1 : 0.03),
      );
    });
    if (highlights.length) {
      const stackTop = () => stack.getBoundingClientRect().top + window.scrollY;
      const lastRevealScroll = () => Math.max(0, ScrollTrigger.maxScroll(window) - 24);
      const highlightTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: `highlights-${root.querySelector("h3").id}`,
          trigger: stack,
          start: () => Math.max(0, Math.min(
            stackTop() - window.innerHeight * 0.74,
            lastRevealScroll() - Math.min(96, window.innerHeight * 0.16),
          )),
          end: () => Math.max(0, Math.min(
            stackTop() - window.innerHeight * (full ? 0.58 : 0.64),
            lastRevealScroll(),
          )),
          scrub: full ? 0.4 : 0.2,
          invalidateOnRefresh: true,
        },
      });
      // Preserve the highlights' original offset within the scroll sequence.
      const highlightsAt = technologies.length ? (full ? 0.7 : 0.5) + (technologies.length - 1) * (full ? 0.06 : 0.02) : 0;
      highlights.forEach((highlight, index) => {
        highlightTimeline.fromTo(highlight,
          { ...highlightStart },
          { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: full ? 0.4 : 0.3, immediateRender: true },
          highlightsAt + (full ? index * 0.06 : 0),
        );
      });
    }
  }

  return timeline;
}
