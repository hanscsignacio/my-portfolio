import gsap from "gsap";

// Reveal Education with the approved later timing.
export function createEducationScroll(root, mode, compact) {
  const entry = root.querySelector(".about__education-entry");
  if (!entry || mode === "still") return null;

  const strength = mode === "full" ? 1 : 0.5;
  const scrub = mode === "full" ? 0.3 : 0.2;

  const composition = entry.querySelector(".about__education-composition");
  const period = entry.querySelector(".about__period");
  const university = entry.querySelector(".about__university");
  const universityLines = university.querySelectorAll("span");
  const degree = entry.querySelector(".about__degree");
  const recognition = entry.querySelector(".about__recognition");
  const foundation = entry.querySelector(".about__foundation");

  // Reveal the heading after more of the section enters.
  const foundationTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "education-foundation",
      trigger: entry,
      start: "top 68%",
      end: "top 38%",
      scrub,
      invalidateOnRefresh: true,
    },
  });

  foundationTimeline
    .fromTo(
      foundation,
      { y: 28 * strength },
      {
        y: 0,
        duration: 1,
      },
      0,
    )
    .fromTo(
      foundation,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
      },
      0,
    );

  // Move 2023 and to Present together.
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "education-composition",
      trigger: composition,
      start: "top 68%",
      end: "bottom 46%",
      scrub,
      invalidateOnRefresh: true,
    },
  });

  timeline.to({}, { duration: 1.1 });

  timeline.fromTo(
    period,
    {
      y: (compact ? 40 : 64) * strength,
      scale: 1 - 0.04 * strength,
      transformOrigin: "left bottom",
    },
    {
      y: 0,
      scale: 1,
      duration: 1,
    },
    0,
  );

  timeline.fromTo(
    period,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.5,
    },
    0,
  );

  // Wait for the university to enter before revealing its lines.
  const universityTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "education-university",
      trigger: university,
      start: "top 72%",
      end: "bottom 36%",
      scrub,
      invalidateOnRefresh: true,
    },
  });

  universityTimeline.to({}, { duration: 1.1 });

  universityLines.forEach((line, index) => {
    universityTimeline.fromTo(
      line,
      {
        x: (index ? 1 : -1) * (compact ? 24 : 64) * strength,
        y: 30 * strength,
      },
      {
        x: 0,
        y: 0,
        duration: 0.9,
      },
      0.08 + index * 0.12,
    );

    universityTimeline.fromTo(
      line,
      {
        opacity: 0,
        clipPath: `inset(0% 0% ${100 * strength}% 0%)`,
      },
      {
        opacity: 1,
        clipPath: "inset(-12% -5% -12% -5%)",
        duration: 0.65,
      },
      index * 0.12,
    );
  });

  // Reveal the degree and major within their own visible area.
  const degreeTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "education-degree",
      trigger: degree,
      start: "top 70%",
      end: "bottom 42%",
      scrub,
      invalidateOnRefresh: true,
    },
  });

  degreeTimeline.to({}, { duration: 1 });

  [...degree.children].forEach((item, index) => {
    degreeTimeline.fromTo(
      item,
      { y: 24 * strength },
      {
        y: 0,
        duration: 0.85,
      },
      index * 0.15,
    );

    degreeTimeline.fromTo(
      item,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.55,
      },
      index * 0.1,
    );
  });

  // Reveal recognition while keeping the description stationary.
  const recognitionTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      id: "education-recognition",
      trigger: recognition,
      start: "top 70%",
      end: "bottom 44%",
      scrub,
      invalidateOnRefresh: true,
    },
  });

  recognitionTimeline.to({}, { duration: 1 });

  [...recognition.children].forEach((line, index) => {
    recognitionTimeline.fromTo(
      line,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.56,
      },
      index * 0.16,
    );
  });

  return timeline;
}
