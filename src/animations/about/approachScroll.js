import gsap from "gsap";

// Reveal the application layers in reading order.
export function createApproachScroll(root, mode, compact) {
  const heading = root.querySelector(".about__layers");
  if (!heading || mode === "still") return null;

  const strength = mode === "full" ? 1 : 0.5;

  const portrait = window.matchMedia(
    "(min-width: 821px) and (orientation: portrait)",
  ).matches;

  const move = (pixels) => () =>
    pixels * strength * (portrait ? window.innerWidth / 1440 : 1);

  const layers = [
    {
      element: heading.querySelector(".about__layer--interface"),
      start: 0,
      x: move(-(compact ? 72 : 160)),
      y: move(28),
    },
    {
      element: heading.querySelector(".about__layer--logic"),
      start: 0.2,
      x: move(compact ? 88 : 200),
      y: move(-24),
      mask: `inset(0% 0% 0% ${65 * strength}%)`,
    },
    {
      element: heading.querySelector(".about__layer--data"),
      start: 0.43,
      x: move(-24),
      y: move(-Math.min(heading.offsetHeight * 0.18, 96)),
      mask: `inset(0% 0% ${55 * strength}% 0%)`,
    },
  ];

  // Use the stable heading as the scroll trigger.
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "approach-layers",
      trigger: heading,
      start: "top 92%",
      end: "bottom 64%",
      scrub: mode === "full" ? 0.3 : 0.2,
      invalidateOnRefresh: true,
    },
  });

  timeline.to({}, { duration: 1 });

  layers.forEach(({ element, start, x, y, mask }, index) => {
    if (!element) return;

    const word = element.querySelector(".about__layer-word");
    const caption = element.querySelector(".about__layer-caption");

    const from = {
      x,
      y,
      opacity: portrait ? 0 : mode === "full" ? 0 : 0.2,
    };

    const to = {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.38,
    };

    // Preserve the Interface panel's cut corner.
    if (mask) {
      from.clipPath = mask;
      to.clipPath = "inset(0% 0% 0% 0%)";
    }

    timeline.fromTo(element, from, to, start);

    // Reveal each panel's title, then its caption.
    timeline.fromTo(
      word,
      {
        x: move(index === 1 ? 24 : -24),
        y: move(18),
        opacity: 0,
        clipPath: `inset(0% 0% ${100 * strength}% 0%)`,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        clipPath: "inset(-8% -5% -8% -5%)",
        duration: 0.28,
      },
      start + 0.08,
    );

    timeline.fromTo(
      caption,
      {
        y: move(12),
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.18,
      },
      start + 0.2,
    );
  });

  return timeline;
}
