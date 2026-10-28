import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createHeroAboutScroll } from "../animations/opening/heroAboutScroll";
import { canPinOpening } from "../animations/opening/pinnedOpening";

gsap.registerPlugin(ScrollTrigger);

// Manage scroll motion, layout refreshes, and cleanup.
export function useHeroAboutScrollMotion(rootRef, mode) {
  const positionRef = useRef(null);
  const initialLinkRef = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const opening = root.querySelector(".about-opening");
    const story = root.querySelector(".opening-story");
    const chapter = root.querySelector(".about__chapter");
    const body = root.querySelector(".about");

    let sceneContext;
    let runtime;
    let pinned;

    let width = window.innerWidth;
    let height = window.innerHeight;

    let disposed = false;
    let refreshTimer;
    let anchorFrame;
    let settledAnchorFrame;
    let forceRebuild = false;

    // Preserve the reading area when the pinned layout changes.
    const capturePosition = () => {
      if (window.scrollY <= 1) return null;

      if (runtime?.scene && window.scrollY <= runtime.scene.pin.end) {
        const progress = Math.max(
          0,
          (window.scrollY - runtime.scene.pin.start) / runtime.scene.distance,
        );

        return progress < 0.28
          ? {
              view: "hero",
              nameTop: root.querySelector(".hero__name").getBoundingClientRect()
                .top,
              progress,
            }
          : { view: "intro", progress };
      }

      const top = body.getBoundingClientRect().top;

      if (top <= window.innerHeight) {
        return { view: "body", top };
      }

      return opening.getBoundingClientRect().top <= window.innerHeight * 0.4
        ? { view: "intro" }
        : {
            view: "hero",
            nameTop: root.querySelector(".hero__name").getBoundingClientRect()
              .top,
          };
    };

    const restorePosition = (position) => {
      if (!position) return;

      let top = 0;

      if (runtime.scene && position.progress !== undefined) {
        top =
          runtime.scene.pin.start + position.progress * runtime.scene.distance;
      } else if (position.view === "raw") {
        top = position.top;
      } else if (position.view === "body") {
        // Use the final height while the pin spacer settles.
        const openingHeight = runtime.scene
          ? runtime.scene.stageHeight + runtime.scene.distance
          : root.querySelector(".hero_wrap").offsetHeight +
            opening.scrollHeight;

        top =
          story.offsetTop + openingHeight - chapter.offsetHeight - position.top;
      } else if (position.view === "intro") {
        top = runtime.scene
          ? runtime.scene.pin.end
          : story.offsetTop + root.querySelector(".hero_wrap").offsetHeight;
      } else if (position.view === "hero") {
        top =
          window.scrollY +
          root.querySelector(".hero__name").getBoundingClientRect().top -
          position.nameTop;
      } else if (position.view === "anchor") {
        const anchor = document.getElementById(position.id);

        if (anchor) {
          const offset = position.id === "projects" ? 0 : chapter.offsetHeight;

          top = window.scrollY + anchor.getBoundingClientRect().top - offset;
        }
      }

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "instant",
      });

      ScrollTrigger.update();
      runtime.settle();
    };

    // Align the initial link after browser restoration and font loading.
    const alignInitialLink = () => {
      if (
        initialLinkRef.current ||
        document.readyState !== "complete" ||
        document.fonts?.status === "loading"
      ) {
        return;
      }

      const id = window.location.hash.slice(1);

      if (!id || id === "home") {
        initialLinkRef.current = true;
        return;
      }

      window.cancelAnimationFrame(anchorFrame);
      window.cancelAnimationFrame(settledAnchorFrame);

      anchorFrame = window.requestAnimationFrame(() => {
        settledAnchorFrame = window.requestAnimationFrame(() => {
          if (disposed) return;

          restorePosition(
            id === "about" ? { view: "intro" } : { view: "anchor", id },
          );

          initialLinkRef.current = true;
        });
      });
    };

    const build = (position) => {
      const previousScroll = window.scrollY;

      sceneContext?.revert();
      pinned = canPinOpening(root, mode);

      // Measure a fresh pin at the page origin.
      if (pinned) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }

      sceneContext = gsap.context(() => {
        runtime = createHeroAboutScroll(
          root,
          mode,
          window.innerWidth <= 820,
          pinned,
        );

        return runtime.cleanup;
      }, root);

      ScrollTrigger.refresh();
      ScrollTrigger.update();

      const destination =
        position ||
        (previousScroll > 1 ? { view: "raw", top: previousScroll } : null);

      restorePosition(destination);
      alignInitialLink();
    };

    let position = positionRef.current;

    // Resolve a direct link after creating the pinned layout.
    if (!initialLinkRef.current) {
      const id = window.location.hash.slice(1);

      if (id === "about") {
        position = { view: "intro" };
      } else if (id && id !== "home") {
        position = { view: "anchor", id };
      }
    }

    build(position);
    positionRef.current = null;

    // Refresh content changes or rebuild when viewport dimensions change.
    const requestRefresh = () => {
      window.clearTimeout(refreshTimer);

      refreshTimer = window.setTimeout(() => {
        if (disposed) return;

        // Skip page measurements while the project overlay is open.
        if (document.querySelector(".project-dialog[open]")) return;

        if (
          forceRebuild ||
          width !== window.innerWidth ||
          height !== window.innerHeight ||
          pinned !== canPinOpening(root, mode)
        ) {
          const position = capturePosition();

          width = window.innerWidth;
          height = window.innerHeight;
          forceRebuild = false;

          build(position);
        } else {
          ScrollTrigger.refresh();
          runtime.updateAnchor();
        }
      }, 120);
    };

    const requestRebuild = () => {
      forceRebuild = true;
      requestRefresh();
    };

    // Watch expandable descriptions and other page-height changes.
    let pageHeight = root.offsetHeight;

    const observer = new ResizeObserver(() => {
      if (pageHeight !== root.offsetHeight) {
        pageHeight = root.offsetHeight;
        requestRefresh();
      }
    });

    observer.observe(root);

    window.addEventListener("resize", requestRefresh);
    window.addEventListener("load", requestRebuild);
    window.addEventListener("portfolio:project-close", requestRefresh);

    const images = [...root.querySelectorAll("img")];

    images.forEach((image) => image.addEventListener("load", requestRebuild));

    if (document.fonts?.status !== "loaded") {
      document.fonts?.ready.then(() => {
        if (!disposed) requestRebuild();
      });
    }

    // Restore styles and remove listeners before rebuilding or unmounting.
    return () => {
      positionRef.current = capturePosition();
      disposed = true;

      window.clearTimeout(refreshTimer);
      window.cancelAnimationFrame(anchorFrame);
      window.cancelAnimationFrame(settledAnchorFrame);

      observer.disconnect();

      window.removeEventListener("resize", requestRefresh);
      window.removeEventListener("load", requestRebuild);
      window.removeEventListener("portfolio:project-close", requestRefresh);

      images.forEach((image) =>
        image.removeEventListener("load", requestRebuild),
      );

      sceneContext.revert();
    };
  }, [rootRef, mode]);
}
