import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createContactMotion(root, mode) {
  const full = mode === "full";
  const animations = [];
  const trigger = (element, start = "clamp(top 82%)") => ({
    trigger: element,
    start,
    toggleActions: "play none none reverse",
  });

  animations.push(
    gsap.fromTo(
      root.querySelector(".contact__curtain"),
      { autoAlpha: 1, yPercent: 0 },
      {
        autoAlpha: 0,
        yPercent: full ? -100 : -12,
        duration: full ? 0.95 : 0.6,
        ease: "power3.out",
        scrollTrigger: trigger(root, "clamp(top 94%)"),
      },
    ),
  );

  animations.push(
    gsap.fromTo(
      root.querySelectorAll("[data-contact-chapter]"),
      { yPercent: full ? 120 : 70, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: full ? 0.07 : 0.04,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "clamp(top 24%)",
          end: "clamp(top top)",
          scrub: full ? 0.25 : 0.15,
        },
      },
    ),
  );

  const heading = gsap.timeline({
    scrollTrigger: trigger(root.querySelector(".contact__header")),
  });
  heading
    .fromTo(
      root.querySelector("[data-contact-availability]"),
      { opacity: 0, y: full ? 20 : 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
    )
    .fromTo(
      root.querySelectorAll("[data-contact-title]"),
      { yPercent: full ? 115 : 65, skewY: full ? 3 : 0, opacity: full ? 1 : 0 },
      {
        yPercent: 0,
        skewY: 0,
        opacity: 1,
        stagger: full ? 0.1 : 0.07,
        duration: full ? 0.9 : 0.6,
        ease: "power3.out",
      },
      0.12,
    );
  animations.push(heading);

  const email = gsap.timeline({
    scrollTrigger: trigger(root.querySelector("[data-contact-email]")),
  });
  email
    .fromTo(
      root.querySelector("[data-contact-email-content]"),
      { y: full ? 32 : 16, opacity: 0 },
      { y: 0, opacity: 1, duration: full ? 0.7 : 0.45, ease: "power3.out" },
    )
    .fromTo(
      root.querySelector("[data-contact-email-line]"),
      { scaleX: 0 },
      { scaleX: 1, duration: full ? 0.8 : 0.5, ease: "power3.out" },
      0.1,
    );
  animations.push(email);

  root.querySelectorAll("[data-contact-social]").forEach((body, index) => {
    animations.push(
      gsap.fromTo(
        body,
        { x: full ? 48 : 18, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: full ? 0.7 : 0.45,
          delay: index * (full ? 0.09 : 0.05),
          ease: "power3.out",
          scrollTrigger: trigger(body.parentElement),
        },
      ),
    );
  });

  animations.push(
    gsap.fromTo(
      root.querySelector("[data-contact-footer]"),
      { opacity: 0, y: full ? 20 : 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        scrollTrigger: trigger(
          root.querySelector("[data-contact-footer]"),
          "clamp(top 92%)",
        ),
      },
    ),
  );

  // Keyboard navigation reveals the controls immediately.
  const revealControls = () =>
    animations.forEach((animation) => animation.progress(1));
  root.addEventListener("focusin", revealControls);
  return () => root.removeEventListener("focusin", revealControls);
}
