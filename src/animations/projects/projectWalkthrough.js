// One scroll position drives the screenshots, copy, and chapter indicator.
export function createWalkthroughRenderer(root, mode) {
  const panels = [...root.querySelectorAll(".project-walkthrough__panel")];
  const cards = panels.map((panel) => panel.querySelector(".project-walkthrough__card"));
  const copies = panels.map((panel) => panel.querySelector(".project-walkthrough__copy"));
  const labels = copies.map((copy) => copy.querySelector(".project-walkthrough__label"));
  const titles = copies.map((copy) => copy.querySelector("h3"));
  const descriptions = copies.map((copy) => [...copy.querySelectorAll(".project-walkthrough__description, .project-walkthrough__detail")]);
  const clamp = (value) => Math.max(0, Math.min(1, value));
  let previousPhase = -1;

  return {
    paint(phase) {
      if (phase === previousPhase) return;
      previousPhase = phase;
      const from = Math.floor(phase);
      const to = Math.min(from + 1, cards.length - 1);
      const progress = phase - from;
      const eased = progress * progress * (3 - 2 * progress);
      // Move the incoming screen over the previous screen.
      cards.forEach((card, index) => {
        const outgoing = index === from;
        const incoming = index === to && progress > 0;
        let opacity = 0;
        let x = 0;
        let y = 0;
        let rotation = 0;
        let scale = 1;
        if (outgoing) {
          opacity = 1;
          if (mode === "soft") x = -3 * eased;
          if (mode === "full") {
            x = -4 * eased;
            y = -2 * eased;
            rotation = -eased;
            scale = 1 - 0.045 * eased;
          }
        } else if (incoming) {
          opacity = 1;
          if (mode === "soft") x = 18 * (1 - eased);
          if (mode === "full") {
            x = 100 * (1 - eased);
            y = 12 * (1 - eased);
            rotation = 3 * (1 - eased);
            scale = 1 - 0.015 * (1 - eased);
          }
        }
        card.style.opacity = String(opacity);
        card.style.visibility = opacity > 0 ? "visible" : "hidden";
        card.style.zIndex = String(index + 1);
        card.style.transform = `translate3d(${x}%, ${y}%, 0) rotate(${rotation}deg) scale(${scale})`;
        card.style.clipPath = mode === "soft" && incoming ? `inset(0 ${100 * (1 - eased)}% 0 0)` : "none";
        const textOffset = mode === "full" ? (outgoing ? -8 * eased : incoming ? 8 * (1 - eased) : 0) : 0;
        copies[index].style.transform = `translate3d(0, ${textOffset}px, 0)`;
        // Follow the screenshot with its heading and description.
        const textProgress = outgoing ? 1 : incoming ? clamp((progress - (mode === "soft" ? 0.3 : 0.42)) / (mode === "soft" ? 0.5 : 0.42)) : 0;
        const detailProgress = outgoing ? 1 : incoming ? clamp((progress - (mode === "soft" ? 0.4 : 0.5)) / (mode === "soft" ? 0.5 : 0.4)) : 0;
        labels[index].style.opacity = String(textProgress);
        titles[index].style.opacity = String(textProgress);
        titles[index].style.transform = mode === "soft" ? `translateX(${16 * (1 - textProgress)}px)` : `translateY(${24 * (1 - textProgress)}px)`;
        titles[index].style.clipPath = mode === "full" && textProgress < 1 ? `inset(0 -3% ${100 * (1 - textProgress)}% -3%)` : "none";
        descriptions[index].forEach((description) => {
          description.style.opacity = String(detailProgress);
          description.style.transform = `translateY(${(mode === "full" ? 16 : 10) * (1 - detailProgress)}px)`;
        });
      });
    },
    destroy() {
      // Restore the static screen layout.
      cards.forEach((card) => {
        for (const property of ["opacity", "visibility", "z-index", "transform", "clip-path"]) card.style.removeProperty(property);
      });
      copies.forEach((copy) => copy.style.removeProperty("transform"));
      [...labels, ...titles, ...descriptions.flat()].forEach((element) => {
        for (const property of ["opacity", "transform", "clip-path"]) element.style.removeProperty(property);
      });
    },
  };
}
