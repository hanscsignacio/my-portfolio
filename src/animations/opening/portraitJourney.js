import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Move one portrait from Hero into the About frame.
export function createPortraitJourney(root, mode, scene = null) {
  const hero = root.querySelector(".hero_wrap");
  const stage = root.querySelector(".opening-story__stage");
  const story = root.querySelector(".opening-story");
  const body = root.querySelector(".about");
  const opening = root.querySelector(".about-opening");
  const chapter = root.querySelector(".about__chapter");
  const source = root.querySelector(".hero__portrait-slot");
  const target = root.querySelector(".about__portrait-reveal");
  const image = root.querySelector("#portfolio-portrait");
  const frame = root.querySelector(".about__person-portrait");
  const layer = root.querySelector(".portrait-journey");
  const mover = root.querySelector(".portrait-journey__mover");

  if (!source || !target || !image || !mover) return null;

  const full = mode === "full";
  const strength = full ? 1 : 0.5;
  const ratio =
    Number(image.getAttribute("width")) / Number(image.getAttribute("height"));

  root.classList.add("portfolio--journey");

  let bounds;

  // Measure both frames and fit the portrait without cropping.
  const measure = () => {
    const origin = stage.getBoundingClientRect();
    const first = source.getBoundingClientRect();
    const slot = target.getBoundingClientRect();

    const lastWidth = Math.min(slot.width, slot.height * ratio);
    const lastHeight = lastWidth / ratio;

    const last = {
      left: slot.right - lastWidth,
      top: slot.bottom - lastHeight,
      width: lastWidth,
      height: lastHeight,
    };

    const openingHeight = scene
      ? scene.stageHeight
      : hero.offsetHeight + opening.scrollHeight;

    const targetY =
      openingHeight -
      chapter.offsetHeight +
      last.top -
      body.getBoundingClientRect().top;

    const scale = last.width / first.width;
    const frameGap = targetY - openingHeight;

    const coveredTop =
      window.innerHeight * 0.88 -
      frameGap -
      last.height -
      window.innerHeight * 0.05;

    const portraitLayout = window.matchMedia(
      "(min-width: 821px) and (orientation: portrait)",
    ).matches;

    const desiredHeldTop = Math.min(
      window.innerHeight * (full ? 0.22 : 0.31),
      coveredTop,
    );

    const heldTop = portraitLayout
      ? desiredHeldTop
      : Math.max(window.innerHeight * 0.06, desiredHeldTop);

    const descent = window.innerHeight * 0.88 - heldTop;

    bounds = {
      source: {
        x: first.left - origin.left,
        y: first.top - origin.top,
      },
      target: {
        x: last.left - origin.left,
        y: targetY,
        scale,
      },
      held: {
        x: last.left - origin.left,
        y: targetY - descent,
        scale,
      },
    };

    gsap.set(mover, {
      width: first.width,
      height: first.height,
    });
  };

  measure();
  ScrollTrigger.addEventListener("refreshInit", measure);

  const cleanup = () => {
    ScrollTrigger.removeEventListener("refreshInit", measure);
    root.classList.remove("portfolio--journey");
  };

  if (mode === "still") {
    // Switch frames while the opener covers the portrait.
    const place = (about) => {
      const position = about ? bounds.target : bounds.source;

      gsap.set(mover, {
        x: position.x,
        y: position.y,
        scale: about ? bounds.target.scale : 1,
      });
    };

    const placement = ScrollTrigger.create({
      id: "portrait-still-placement",
      trigger: story,
      start: () =>
        story.getBoundingClientRect().top + window.scrollY + hero.offsetHeight,
      end: "max",
      onToggle: (trigger) => place(window.scrollY >= trigger.start),
      onRefresh: (trigger) => place(window.scrollY >= trigger.start),
    });

    place(window.scrollY >= placement.start);
    return cleanup;
  }

  let timeline = scene?.timeline;
  let duration;
  let arrivalStart;
  let travelStart;
  let travelEnd;

  if (scene) {
    duration = scene.duration;
    arrivalStart = scene.arrivalStart;
    travelStart = scene.distance * 0.76;
    travelEnd = scene.distance * 0.99;

    // Keep the face visible before a short phone's pin begins.
    if (scene.compact && scene.offset > 1) {
      const carry = scene.offset * 0.8;

      const leadIn = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          start: "top top",
          endTrigger: frame,
          end: "top 40%",
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });

      leadIn.to({}, { duration: scene.offset + duration });

      const leadScale = full ? 0.76 : 0.84;

      leadIn
        .fromTo(
          layer,
          {
            x: 0,
            y: 0,
            scale: 1,
            transformOrigin: "top left",
          },
          {
            x: window.innerWidth * (1 - leadScale) * 0.5,
            y: carry,
            scale: leadScale,
            duration: scene.offset,
            ease: "none",
          },
          0,
        )
        .to(
          layer,
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: travelEnd - travelStart,
            ease: "power1.inOut",
          },
          scene.offset + travelStart,
        );
    }
  } else {
    const frameOffset =
      frame.getBoundingClientRect().top - body.getBoundingClientRect().top;

    const frameY =
      hero.offsetHeight +
      opening.scrollHeight -
      chapter.offsetHeight +
      frameOffset;

    duration = Math.max(1, frameY - window.innerHeight * 0.4);
    arrivalStart = Math.max(1, frameY - window.innerHeight * 0.88);

    travelStart = Math.min(hero.offsetHeight * 0.85, arrivalStart * 0.65);

    travelEnd = Math.max(
      travelStart + 1,
      arrivalStart - window.innerHeight * 0.08,
    );

    timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "portrait-flow",
        trigger: story,
        start: "top top",
        endTrigger: frame,
        end: "top 40%",
        scrub: full ? 0.25 : 0.2,
        invalidateOnRefresh: true,
      },
    });

    timeline.to({}, { duration });
  }

  // Hold the Hero portrait until the opener covers it.
  timeline
    .fromTo(
      mover,
      {
        x: () => bounds.source.x,
        y: () => bounds.source.y,
        scale: 1,
      },
      {
        x: () => bounds.source.x - 12 * strength,
        y: () => bounds.source.y + (scene ? 12 : travelStart * 0.35) * strength,
        scale: 1,
        duration: Math.max(1, travelStart),
        ease: "none",
      },
      0,
    )
    .to(
      mover,
      {
        x: () => bounds.held.x,
        y: () => bounds.held.y,
        scale: () => bounds.held.scale,
        duration: Math.max(1, travelEnd - travelStart),
        ease: "power1.inOut",
      },
      travelStart,
    );

  // Descend into the About frame at a steady size.
  timeline.to(
    mover,
    {
      x: () => bounds.target.x,
      y: () => bounds.target.y,
      scale: () => bounds.target.scale,
      duration: Math.max(1, duration - arrivalStart),
      ease: "none",
    },
    arrivalStart,
  );

  return cleanup;
}
