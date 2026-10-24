import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createPortraitJourney } from "./portraitJourney";
import { createPinnedOpening } from "./pinnedOpening";
import { createApproachScroll } from "../about/approachScroll";
import { createEducationScroll } from "../about/educationScroll";
import { createDirectionScroll } from "../about/directionScroll";
import { createAboutChapter } from "../about/aboutChapter";

gsap.registerPlugin(ScrollTrigger);

// Keep the natural-scroll name movement within its visible range.
function createHeroExit(root, mode, compact) {
  const hero = root.querySelector(".hero_wrap");
  const heading = root.querySelector(".hero__name");
  const names = root.querySelectorAll(".hero__name-scroll");

  const full = mode === "full";
  const strength = full ? 1 : 0.5;

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: heading,
      start: () => hero.getBoundingClientRect().top + window.scrollY,
      end: () =>
        Math.max(
          1,
          heading.getBoundingClientRect().bottom +
            window.scrollY -
            window.innerHeight * 0.12,
        ),
      scrub: full ? 0.25 : 0.2,
      invalidateOnRefresh: true,
    },
  });

  timeline.fromTo(
    names,
    { x: 0, y: 0 },
    {
      x: (index) =>
        (index ? 1 : -1) *
        window.innerWidth *
        (compact ? 0.18 : 0.16) *
        strength,
      y: (index) => (index ? 1 : -1) * 18 * strength,
      duration: 1,
    },
    0,
  );

  // Fade the name as it leaves the viewport.
  gsap.fromTo(
    names,
    { opacity: 1 },
    {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: heading,
        start: () => heading.getBoundingClientRect().top + window.scrollY - 32,
        end: () => heading.getBoundingClientRect().bottom + window.scrollY - 16,
        scrub: full ? 0.25 : 0.2,
        invalidateOnRefresh: true,
      },
    },
  );

  return timeline;
}

// Reveal the opener's visible rows during natural scrolling.
function createAboutOpener(root, mode, compact) {
  const heading = root.querySelector(".about__title");
  const phrases = [...root.querySelectorAll(".about__phrase")];

  const full = mode === "full";
  const strength = full ? 1 : 0.5;

  const rows = compact
    ? [
        [phrases[0]],
        [phrases[1]],
        [phrases[2]],
        [phrases[3], phrases[4]],
        [phrases[5]],
      ]
    : [phrases.slice(0, 2), phrases.slice(2, 4), phrases.slice(4, 6)];

  return rows.map((row, index) => {
    // Measure the row independently of its animated offset.
    const rowTop = () =>
      row[0].getBoundingClientRect().top +
      window.scrollY -
      Number(gsap.getProperty(row[0], "y"));

    return gsap.fromTo(
      row,
      {
        x: (index % 2 ? 1 : -1) * (compact ? 32 : 112) * strength,
        y: (compact ? 54 : 76) * strength,
        opacity: full ? 0.1 : 0.25,
        clipPath: full ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 65% 0%)",
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        clipPath: "inset(-12% -10% -12% -10%)",
        ease: "none",
        scrollTrigger: {
          trigger: heading,
          start: () => rowTop() - window.innerHeight * 0.9,
          end: () => rowTop() - window.innerHeight * 0.48,
          scrub: full ? 0.25 : 0.2,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

// Reveal the portrait field and personal heading.
function createPersonalEntrance(root, mode, compact) {
  const frame = root.querySelector(".about__person-portrait");
  const field = root.querySelector(".about__portrait-field");
  const heading = root.querySelector(".about__person-title");
  const prefix = root.querySelector(".about__person-prefix");
  const name = root.querySelector(
    ".about__person-name-motion > span:last-child",
  );

  const full = mode === "full";
  const strength = full ? 1 : 0.5;

  gsap.fromTo(
    field,
    {
      scaleX: full ? 0.64 : 0.82,
      opacity: full ? 0.3 : 0.65,
      transformOrigin: "right center",
    },
    {
      scaleX: 1,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top 94%",
        end: "top 40%",
        scrub: full ? 0.25 : 0.2,
        invalidateOnRefresh: true,
      },
    },
  );

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "personal-name",
      trigger: heading,
      start: "top 92%",
      end: "top 38%",
      scrub: full ? 0.25 : 0.2,
      invalidateOnRefresh: true,
    },
  });

  timeline
    .fromTo(
      prefix,
      {
        x: (compact ? -24 : -72) * strength,
        y: 12 * strength,
        opacity: full ? 0.15 : 0.45,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "none",
      },
      0,
    )
    .fromTo(
      name,
      {
        x: -Math.min(window.innerWidth * 0.14, 192) * strength,
        y: (compact ? 28 : 60) * strength,
        opacity: full ? 0.15 : 0.45,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "none",
      },
      0.18,
    );

  timeline.to({}, { duration: 0.12 });
  return timeline;
}

// Connect the opening and About animations.
export function createHeroAboutScroll(root, mode, compact, pinned) {
  const story = root.querySelector(".opening-story");
  const scene = pinned ? createPinnedOpening(root, mode) : null;
  const moving = mode !== "still";

  const cleanupJourney = createPortraitJourney(root, mode, scene);
  const chapter = createAboutChapter(root, scene);

  if (!pinned && moving) {
    createHeroExit(root, mode, compact);
    createAboutOpener(root, mode, compact);
  }

  if (moving) {
    createPersonalEntrance(root, mode, compact);
    createApproachScroll(root, mode, compact);
    createEducationScroll(root, mode, compact);
    createDirectionScroll(root, mode, compact);
  }

  // Align the About link with the completed opening.
  const updateAnchor = () => {
    const chapterHeight = root.querySelector(".about__chapter").offsetHeight;

    const offset = scene
      ? scene.pin.end - story.offsetTop
      : root.querySelector(".hero_wrap").offsetHeight;

    story.style.setProperty(
      "--story-about-offset",
      offset + chapterHeight + "px",
    );
  };

  updateAnchor();

  return {
    scene,
    updateAnchor,
    settle: () => {
      // Apply the current pose after direct links or mode changes.
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger && root.contains(trigger.trigger)) {
          trigger.getTween()?.progress(1);
        }
      });

      chapter.update();
    },
    cleanup: () => {
      cleanupJourney?.();
      chapter.cleanup();

      root.querySelector(".hero").inert = false;
      root.classList.remove("portfolio--pinned", "portfolio--compact-pin");

      [
        "--story-about-offset",
        "--story-stage-height",
        "--story-hero-height",
        "--story-view-height",
        "--story-pin-offset",
      ].forEach((property) => story.style.removeProperty(property));
    },
  };
}
