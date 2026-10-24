import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Check whether the opening fits the viewport.
export function getOpeningLayout(root, mode = "full") {
  const hero = root.querySelector(".hero_wrap");
  const content = root.querySelector(".hero");
  const name = root.querySelector(".hero__name");
  const heading = root.querySelector(".about__title");
  const chapter = root.querySelector(".about__chapter");
  const intro = root.querySelector(".about__intro");

  const compact = window.innerWidth <= 820;
  const viewHeight = window.innerHeight;

  const heroHeight = Math.max(
    content.offsetHeight,
    compact ? 0 : Math.min(viewHeight, window.innerWidth * 0.9),
  );

  const nameTop =
    name.getBoundingClientRect().top - hero.getBoundingClientRect().top;

  const padding = compact
    ? 80
    : parseFloat(getComputedStyle(intro).paddingTop) +
      parseFloat(getComputedStyle(intro).paddingBottom);

  const openerFits =
    heading.offsetHeight + chapter.offsetHeight + padding <= viewHeight + 1;

  const offset =
    compact && heroHeight > viewHeight
      ? Math.max(heroHeight - viewHeight, nameTop - viewHeight * 0.18)
      : 0;

  const heroFits = compact
    ? heroHeight - nameTop <= viewHeight * 0.9 && nameTop - offset >= 16
    : heroHeight <= viewHeight + 1;

  return {
    eligible: heroFits && openerFits,
    compact,
    heroHeight,
    viewHeight,
    offset,
    stageHeight: viewHeight + offset,
    distance:
      viewHeight *
      (mode === "full" ? (compact ? 1.35 : 1.5) : compact ? 0.95 : 1.05),
  };
}

export function canPinOpening(root, mode) {
  return mode !== "still" && getOpeningLayout(root, mode).eligible;
}

// Coordinate the Hero exit and About opener.
export function createPinnedOpening(root, mode) {
  const layout = getOpeningLayout(root, mode);

  const { compact, heroHeight, viewHeight, offset, stageHeight, distance } =
    layout;

  const full = mode === "full";
  const strength = full ? 1 : 0.5;

  const story = root.querySelector(".opening-story");
  const stage = root.querySelector(".opening-story__stage");
  const opening = root.querySelector(".about-opening");
  const frame = root.querySelector(".about__person-portrait");
  const names = root.querySelectorAll(".hero__name-scroll");
  const phrases = [...root.querySelectorAll(".about__phrase")];

  const supports = root.querySelectorAll(
    ".hero__intro, .hero__side-details, .hero__actions-scroll",
  );

  const hero = root.querySelector(".hero");

  story.style.setProperty("--story-stage-height", stageHeight + "px");
  story.style.setProperty("--story-hero-height", heroHeight + "px");
  story.style.setProperty("--story-view-height", viewHeight + "px");
  story.style.setProperty("--story-pin-offset", offset + "px");

  root.classList.add("portfolio--pinned");
  root.classList.toggle("portfolio--compact-pin", compact);

  const start = () =>
    story.getBoundingClientRect().top + window.scrollY + offset;

  const pin = ScrollTrigger.create({
    id: "opening-pin",
    trigger: story,
    pin: stage,
    start,
    end: () => start() + distance,
    anticipatePin: 1,
    refreshPriority: 10,
    invalidateOnRefresh: true,
  });

  // Continue through the portrait's arrival in About.
  const body = root.querySelector(".about");
  const chapter = root.querySelector(".about__chapter");

  const frameOffset =
    frame.getBoundingClientRect().top - body.getBoundingClientRect().top;

  const duration =
    distance + viewHeight * 0.6 - chapter.offsetHeight + frameOffset;

  const arrivalStart = Math.max(
    distance,
    distance + viewHeight * 0.12 - chapter.offsetHeight + frameOffset,
  );

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "opening-story",
      trigger: story,
      start,
      endTrigger: frame,
      end: "top 40%",
      scrub: 0.25,
      invalidateOnRefresh: true,
      onUpdate: (trigger) => {
        // Remove covered Hero links from keyboard navigation.
        hero.inert = trigger.progress * duration > distance * 0.34;
      },
    },
  });

  timeline.to({}, { duration });

  // Move the name lines in opposite directions.
  timeline.fromTo(
    names,
    { x: 0, y: 0 },
    {
      x: (index) => window.innerWidth * (index ? 0.22 : -0.2) * strength,
      y: (index) =>
        (index ? (compact ? 12 : 30) : compact ? -10 : -24) * strength,
      duration: distance * 0.44,
    },
    full ? 0 : distance * 0.1,
  );

  // Finish the name fade before the About headline arrives.
  timeline.fromTo(
    names,
    { opacity: 1 },
    {
      opacity: 0,
      duration: distance * 0.28,
    },
    distance * (full ? 0.2 : 0.34),
  );

  timeline.fromTo(
    supports,
    { opacity: 1, y: 0 },
    {
      opacity: 0,
      y: (compact ? -16 : -30) * strength,
      duration: distance * 0.22,
    },
    distance * 0.12,
  );

  timeline.fromTo(
    opening,
    { yPercent: 100 },
    {
      yPercent: 0,
      duration: distance * (compact ? 0.43 : 0.38),
    },
    distance * (compact ? 0.32 : 0.22),
  );

  // Keep MAKES IT together in the phone headline.
  phrases.forEach((phrase, index) => {
    const row = compact
      ? index < 2
        ? 0
        : index < 5
          ? 1
          : 2
      : Math.floor(index / 2);

    const position = compact
      ? [0, 0.025, 0, 0.025, 0.025, 0][index]
      : (index % 2) * 0.018;

    timeline.fromTo(
      phrase,
      {
        x: () =>
          window.innerWidth *
          (row === 1 ? 1 : -1) *
          (compact ? 0.1 : 0.14) *
          strength,
        y: (row === 2 ? (compact ? 24 : 60) : 20) * strength,
        opacity: full ? 0 : 0.15,
        clipPath: full ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 65% 0%)",
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        clipPath: "inset(-12% -10% -12% -10%)",
        duration: distance * (compact ? 0.18 : 0.2),
        ease: "power2.out",
      },
      distance *
        ((compact ? 0.54 : 0.42) + row * (compact ? 0.115 : 0.135) + position),
    );
  });

  return {
    pin,
    timeline,
    distance,
    duration,
    arrivalStart,
    offset,
    stageHeight,
    heroHeight,
    compact,
  };
}
