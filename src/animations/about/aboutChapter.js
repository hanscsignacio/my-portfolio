import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Keep one chapter marker through the opener and About body.
export function createAboutChapter(root, scene) {
  const chapter = root.querySelector(".about__chapter");
  const opening = root.querySelector(".about-opening");
  const body = root.querySelector(".about");
  const setY = gsap.quickSetter(chapter, "y", "px");

  let shown;

  const update = () => {
    const openingTop = opening.getBoundingClientRect().top;
    const bodyBottom = body.getBoundingClientRect().bottom;

    const visible = openingTop < window.innerHeight && bodyBottom > 0;

    setY(Math.min(Math.max(0, openingTop), bodyBottom - chapter.offsetHeight));

    if (shown !== visible) {
      shown = visible;
      chapter.style.visibility = visible ? "visible" : "hidden";
      chapter.inert = !visible;
      chapter.setAttribute("aria-hidden", String(!visible));
    }
  };

  gsap.set(chapter, { y: window.innerHeight });

  const trigger = ScrollTrigger.create({
    id: "about-chapter",
    trigger: root,
    start: 0,
    end: "max",
    onUpdate: update,
    onRefresh: update,
  });

  // Follow the opener while its scrub animation settles.
  scene?.timeline.eventCallback("onUpdate", update);
  update();

  return {
    update,
    cleanup: () => {
      trigger.kill();
      scene?.timeline.eventCallback("onUpdate", null);

      chapter.inert = true;
      chapter.setAttribute("aria-hidden", "true");
      chapter.style.removeProperty("visibility");
      chapter.style.removeProperty("transform");
    },
  };
}
