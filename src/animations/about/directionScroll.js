import gsap from "gsap";

// Close About with learning first, followed by building.
export function createDirectionScroll(root, mode, compact) {
  const heading = root.querySelector(".about__next");
  if (!heading || mode === "still") return null;

  const strength = mode === "full" ? 1 : 0.5;
  const lines = heading.querySelectorAll(".about__next-line");

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "direction-statement",
      trigger: heading,
      start: "top 90%",
      end: "bottom 58%",
      scrub: mode === "full" ? 0.3 : 0.2,
      invalidateOnRefresh: true,
    },
  });

  timeline.to({}, { duration: 1.1 });

  lines.forEach((line, index) => {
    const start = index * 0.25;
    const word = line.querySelector(".about__next-word");

    // Move each MORE TO prefix together with its word.
    timeline.fromTo(
      line,
      {
        x: (index ? 1 : -1) * (compact ? 48 : 144) * strength,
        y: (compact ? 24 : 40) * strength,
        opacity: mode === "full" ? 0.15 : 0.45,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.62,
      },
      start,
    );

    // Reveal the words while preserving BUILD's outline.
    timeline.fromTo(
      word,
      {
        clipPath: index
          ? `inset(-12% 0% -12% ${100 * strength}%)`
          : `inset(-12% ${100 * strength}% -12% 0%)`,
      },
      {
        clipPath: "inset(-12% -6% -12% -6%)",
        duration: 0.5,
      },
      start + 0.06,
    );
  });

  return timeline;
}
