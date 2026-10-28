import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createToolkitMotion(root, mode) {
  const full = mode === "full";
  const heading = root.querySelector(".toolkit__header");

  gsap.fromTo(root.querySelectorAll("[data-toolkit-chapter]"),
    { yPercent: full ? 120 : 70, opacity: 0 },
    {
      yPercent: 0, opacity: 1, stagger: full ? 0.07 : 0.04, ease: "none",
      scrollTrigger: {
        id: "toolkit-chapter", trigger: root, start: "clamp(top 24%)", end: "clamp(top top)",
        scrub: full ? 0.25 : 0.15, invalidateOnRefresh: true,
      },
    },
  );

  const title = gsap.timeline({
    scrollTrigger: { id: "toolkit-heading", trigger: heading, start: "clamp(top 82%)", toggleActions: "play none none reverse" },
  });
  title.fromTo(root.querySelectorAll("[data-toolkit-title]"),
    { yPercent: full ? 115 : 65, rotation: full ? 3 : 0, opacity: full ? 1 : 0 },
    { yPercent: 0, rotation: 0, opacity: 1, duration: full ? 0.85 : 0.6, stagger: full ? 0.1 : 0.08, ease: "power3.out" },
  ).fromTo(root.querySelector("[data-toolkit-intro]"),
    { x: full ? 24 : 12, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, full ? 0.3 : 0.2,
  );

  // Keep the final row's triggers within the page.
  root.querySelectorAll("[data-toolkit-copy]").forEach((copy, index) => {
    gsap.fromTo(copy, { opacity: 0, y: full ? 24 : 14 }, {
      opacity: 1, y: 0, duration: full ? 0.6 : 0.42, ease: "power3.out",
      scrollTrigger: { id: `toolkit-copy-${index}`, trigger: copy, start: "clamp(top 85%)", toggleActions: "play none none reverse" },
    });
  });

  // Each logo waits for its own reading position, including wrapped rows.
  root.querySelectorAll("[data-toolkit-item]").forEach((item, index) => {
    const logo = item.querySelector("[data-toolkit-logo]");
    const name = item.querySelector("[data-toolkit-name]");
    const timeline = gsap.timeline({
      delay: (Number(item.dataset.toolkitIndex) % 3) * (full ? 0.065 : 0.045),
      scrollTrigger: { id: `toolkit-tool-${index}`, trigger: item, start: "clamp(top 84%)", toggleActions: "play none none reverse" },
    });
    timeline.fromTo(logo,
      { opacity: 0, y: full ? 48 : 24, rotation: full ? (index % 2 ? 10 : -10) : 0, scale: full ? 0.84 : 1 },
      { opacity: 1, y: 0, rotation: 0, scale: 1, duration: full ? 0.7 : 0.5, ease: full ? "back.out(1.35)" : "power3.out" },
    ).fromTo(name,
      { opacity: 0, yPercent: full ? 110 : 45 },
      { opacity: 1, yPercent: 0, duration: full ? 0.48 : 0.38, ease: "power3.out" }, full ? 0.14 : 0.1,
    );
  });

  root.querySelectorAll("[data-toolkit-learning]").forEach((item, index) => {
    gsap.fromTo(item.querySelector("[data-toolkit-logo]"),
      { opacity: 0, x: full ? -36 : -20, rotation: full ? -12 : 0 },
      {
        opacity: 1, x: 0, rotation: 0, duration: full ? 0.75 : 0.5, delay: index * 0.08, ease: "power3.out",
        scrollTrigger: { id: `toolkit-learning-${index}`, trigger: item, start: "clamp(top 84%)", toggleActions: "play none none reverse" },
      },
    );
  });
}
