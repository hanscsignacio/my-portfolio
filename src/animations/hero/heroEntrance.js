import gsap from "gsap";

export function createHeroEntrance(root, mode, portraitTarget = null) {
  if (!root || mode === "still") return null;

  const find = (selector) => root.querySelector(selector);
  const findAll = (selector) => [...root.querySelectorAll(selector)];

  const name = findAll(".hero__name-line");

  // Use the supplied shared portrait or the existing Hero image.
  const portrait =
    portraitTarget ||
    find(".hero__portrait img") ||
    root.closest(".portfolio")?.querySelector(".portrait-journey img");

  const branding = find(".hero__branding");
  const role = find(".hero__role");
  const description = find(".hero__description");
  const resume = find(".hero__resume");
  const student = find(".hero__student");
  const divider = find(".hero__side-divider");
  const keywords = find(".hero__keywords");
  const buttons = findAll(".hero__button");

  const buttonInner = findAll(".hero__button-inner");

  const animatedElements = [
    ...name,
    portrait,
    branding,
    role,
    description,
    resume,
    student,
    divider,
    keywords,
    ...buttons,
  ].filter(Boolean);

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      // Restore normal styles after the entrance
      gsap.set(animatedElements, {
        clearProps: "opacity,transform,clipPath,transformOrigin",
      });
    },
  });

  // Soft: gentle editorial entrance
  if (mode === "soft") {
    timeline
      // Name and portrait enter together
      .from(
        name,
        {
          opacity: 0,
          y: 18,
          duration: 0.62,
          stagger: 0.1,
          ease: "power2.out",
        },
        0,
      )
      .from(
        portrait,
        {
          opacity: 0,
          x: 14,
          duration: 0.75,
          ease: "power2.out",
        },
        0,
      )
      // Supporting details follow
      .from(
        [branding, student, keywords],
        {
          opacity: 0,
          y: 8,
          duration: 0.45,
          stagger: 0.07,
        },
        0.42,
      )
      .fromTo(
        divider,
        {
          scaleY: 0,
          transformOrigin: "top center",
        },
        {
          scaleY: 1,
          duration: 0.65,
          ease: "power2.inOut",
        },
        0.5,
      )
      .from(
        [role, description, resume],
        {
          opacity: 0,
          y: 12,
          duration: 0.48,
          stagger: 0.08,
        },
        0.56,
      )
      // Buttons complete the entrance
      .from(
        buttons,
        {
          opacity: 0,
          duration: 0.4,
          stagger: 0.07,
        },
        0.92,
      )
      .from(
        buttonInner,
        {
          x: -12,
          duration: 0.4,
          stagger: 0.07,
        },
        0.92,
      );

    return timeline;
  }

  // Full: bold editorial entrance
  timeline
    .fromTo(
      name[0],
      {
        y: 65,
        clipPath: "inset(0% 0% 100% 0%)",
      },
      {
        y: 0,
        clipPath: "inset(-30% -10% -30% -10%)",
        duration: 0.95,
      },
      0.05,
    )
    .fromTo(
      name[1],
      {
        y: 85,
        clipPath: "inset(0% 0% 100% 0%)",
      },
      {
        y: 0,
        clipPath: "inset(-30% -10% -30% -10%)",
        duration: 1.05,
      },
      0.22,
    )
    .fromTo(
      portrait,
      {
        x: 35,
        clipPath: "inset(0% 100% 0% 0%)",
      },
      {
        x: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.25,
        ease: "power2.inOut",
      },
      0.18,
    )
    .from(
      [branding, student, keywords],
      {
        opacity: 0,
        y: 12,
        duration: 0.55,
        stagger: 0.1,
      },
      0.7,
    )
    .fromTo(
      divider,
      {
        scaleY: 0,
        transformOrigin: "top center",
      },
      {
        scaleY: 1,
        duration: 0.7,
        ease: "power2.inOut",
      },
      0.9,
    )
    .from(
      [role, description, resume],
      {
        opacity: 0,
        y: 25,
        duration: 0.65,
        stagger: 0.12,
      },
      0.98,
    )

    .from(
      buttons,
      {
        opacity: 0,
        duration: 0.5,
        stagger: 0.09,
      },
      1.32,
    )
    .from(
      buttonInner,
      {
        x: -20,
        duration: 0.5,
        stagger: 0.09,
      },
      1.32,
    );

  return timeline;
}
