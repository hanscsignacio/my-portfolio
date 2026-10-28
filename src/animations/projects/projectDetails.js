import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reveal each reading beat inside the project scroll area.
export function createProjectDetailsMotion(root, scroller, mode) {
  const entries = [];
  const full = mode === "full";
  const strength = full ? 1 : 0.68;
  const compact = () => window.innerWidth <= 820;
  const travel = (wide, small) => () => (compact() ? small : wide) * strength;
  const enter = (timeline, targets, from, to, position = 0) => {
    // Prepare every staggered item before its individual tween begins.
    gsap.set(targets, from);
    timeline.fromTo(targets, from, { ...to, immediateRender: false }, position);
  };

  // Finish bottom reveals before scrolling ends.
  const range = (element) => {
    const offset = Number(gsap.getProperty(element, "y")) || 0;
    const top = element.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - offset;
    const height = scroller.clientHeight;
    const end = Math.max(1, Math.min(top - height * 0.42, scroller.scrollHeight - height - 1));
    const start = Math.max(0, Math.min(top - height * 0.76, end - Math.min(180, height * 0.24)));
    return { start, end };
  };

  // Give each reading block its own reveal.
  const reveal = (scope, anchor, build) => {
    if (!scope || !anchor) return;
    const timeline = gsap.timeline({ paused: true });
    build(timeline);
    const trigger = ScrollTrigger.create({
      scroller,
      trigger: anchor,
      animation: timeline,
      start: () => range(anchor).start,
      end: () => range(anchor).end,
      scrub: full ? 0.24 : 0.2,
      invalidateOnRefresh: true,
    });
    entries.push({ scope, timeline, trigger, focused: false });
  };

  const rise = (timeline, targets, position = 0, stagger = 0.1) => {
    enter(timeline, targets, { opacity: 0, y: travel(40, 28) }, {
      opacity: 1, y: 0, duration: 0.7, stagger: full ? stagger : stagger * 0.8, ease: full ? "power3.out" : "power2.out",
    }, position);
  };

  const heading = (timeline, element, position = 0) => {
    enter(timeline, element.querySelectorAll("[data-project-title-line]"), {
      yPercent: full ? 110 : 80, opacity: 0,
    }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: full ? 0.12 : 0.1, ease: full ? "power3.out" : "power2.out" }, position);
  };

  const overview = root.querySelector(".project-overview");
  reveal(overview, overview?.querySelector("h3"), (timeline) => {
    overview.querySelectorAll("[data-project-title-line]").forEach((line, index) => {
      enter(timeline, line, { x: () => (full && index % 2 ? 1 : -1) * (compact() ? 40 : 80) * strength, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: full ? "power3.out" : "power2.out",
      }, index * 0.12);
    });
    rise(timeline, overview.querySelector(".project-overview__summary"), 0.3);
  });

  const stack = root.querySelector(".project-stack");
  if (stack) {
    const title = stack.querySelector("h3");
    reveal(title, title, (timeline) => {
      enter(timeline, stack, { "--detail-rule": 0 }, { "--detail-rule": 1, duration: 0.7, ease: "power2.inOut" }, 0);
      rise(timeline, stack.querySelector(".project-stack__eyebrow"), 0);
      heading(timeline, title, 0.12);
    });

    stack.querySelectorAll(".project-stack__group").forEach((group) => {
      reveal(group, group, (timeline) => {
        enter(timeline, group, { "--detail-rule": 0 }, { "--detail-rule": 1, duration: 0.65, ease: "power2.inOut" }, 0);
        enter(timeline, group.querySelector("h4"), { x: travel(-32, -20), opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.6, ease: "power3.out",
        }, 0.08);
        enter(timeline, group.querySelectorAll(".project-technologies > li"), {
          opacity: 0, y: travel(36, 28), rotation: full ? -5 : 0,
        }, { opacity: 1, y: 0, rotation: 0, duration: 0.65, stagger: full ? 0.085 : 0.07, ease: full ? "power3.out" : "power2.out" }, 0.18);
        rise(timeline, group.querySelector("div > p"), 0.44);
      });
    });

    const label = stack.querySelector(".project-stack__highlights-label");
    reveal(label, label, (timeline) => rise(timeline, label));
    stack.querySelectorAll(".project-stack__capabilities > div").forEach((row, index) => {
      reveal(row, row, (timeline) => {
        enter(timeline, row, { "--detail-rule": 0 }, { "--detail-rule": 1, duration: 0.65, ease: "power2.inOut" }, 0);
        enter(timeline, row.querySelector("dt"), {
          opacity: 0, x: () => (full && index % 2 && !compact() ? 1 : -1) * 32 * strength,
        }, { opacity: 1, x: 0, duration: 0.65, ease: "power3.out" }, 0.12);
        rise(timeline, row.querySelector("dd"), 0.28);
      });
    });
  }

  const walkthrough = root.querySelector(".project-walkthrough");
  const nav = walkthrough?.querySelector("nav");
  reveal(nav, walkthrough, (timeline) => {
    rise(timeline, nav.querySelectorAll("button"), 0, 0.065);
    enter(timeline, walkthrough.querySelector(".project-walkthrough__body"), { opacity: 0 }, {
      opacity: 1, duration: 0.7, ease: "power2.out",
    }, 0.18);
  });

  const contribution = root.querySelector(".project-contribution");
  reveal(contribution, contribution?.querySelector("h3"), (timeline) => {
    enter(timeline, contribution, { "--detail-rule": 0 }, { "--detail-rule": 1, duration: 0.7, ease: "power2.inOut" }, 0);
    heading(timeline, contribution.querySelector("h3"), 0.12);
  });
  contribution?.querySelectorAll("p").forEach((paragraph) => {
    reveal(paragraph, paragraph, (timeline) => rise(timeline, paragraph));
  });

  const learning = root.querySelector(".project-learning");
  const learningTitle = learning?.querySelector("h3");
  reveal(learningTitle, learningTitle, (timeline) => {
    rise(timeline, learning.querySelector(":scope > p"));
    heading(timeline, learningTitle, 0.12);
  });
  const story = learning?.querySelector("details");
  reveal(story, story, (timeline) => {
    enter(timeline, story.querySelectorAll(".about-expandable-text__short, .about-expandable-text__cue"), {
      opacity: 0,
    }, { opacity: 1, duration: 0.75, stagger: 0.12, ease: "power2.out" }, 0);
  });
  const actions = learning?.querySelector(".project-learning__actions");
  reveal(actions, actions, (timeline) => {
    enter(timeline, actions, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" });
  });

  return {
    refresh() {
      entries.forEach(({ trigger, focused }) => { if (!focused) trigger.refresh(); });
    },
    revealFor(target) {
      // Keep keyboard-focused content fully visible.
      entries.forEach((entry) => {
        if (!entry.scope.contains(target)) return;
        entry.focused = true;
        entry.trigger.disable(false);
        entry.trigger.getTween()?.kill();
        entry.timeline.progress(1);
      });
    },
  };
}
