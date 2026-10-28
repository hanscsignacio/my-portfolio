import gsap from "gsap";

// Reveal the application layers in reading order.
export function createApproachScroll(root, mode, compact) {
  const heading = root.querySelector(".about__layers");
  if (!heading || mode === "still") return null;

  const strength = mode === "full" ? 1 : 0.5;

  const layers = [
    {
      element: heading.querySelector(".about__layer--interface"),
      start: 0,
      x: -(compact ? 72 : 160) * strength,
      y: 28 * strength,
    },
    {
      element: heading.querySelector(".about__layer--logic"),
      start: 0.2,
      x: (compact ? 88 : 200) * strength,
      y: -24 * strength,
      mask: `inset(0% 0% 0% ${65 * strength}%)`,
    },
    {
      element: heading.querySelector(".about__layer--data"),
      start: 0.43,
      x: -24 * strength,
      y: -Math.min(heading.offsetHeight * 0.18, 96) * strength,
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
      opacity: mode === "full" ? 0 : 0.2,
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
        x: (index === 1 ? 24 : -24) * strength,
        y: 18 * strength,
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
        y: 12 * strength,
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
