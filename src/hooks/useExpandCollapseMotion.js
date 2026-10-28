import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

// Animate text expansion and collapse.
export function useExpandCollapseMotion(
  rootRef,
  summaryRef,
  panelRef,
  mode,
  scrollerRef,
  motionVariant = "default",
) {
  // Store the active animation and its intended open state.
  const timelineRef = useRef(null);
  const targetRef = useRef(false);

  // Finish the transition and restore normal layout styles.
  const settle = useCallback(
    (open) => {
      const root = rootRef.current;
      if (!root) return;

      timelineRef.current?.kill();
      root.open = open;
      targetRef.current = open;

      gsap.set(root, { clearProps: "height,overflow" });

      gsap.set(
        [
          summaryRef.current,
          ...panelRef.current.querySelectorAll("[data-reveal]"),
        ],
        { clearProps: "opacity,transform" },
      );
    },
    [rootRef, summaryRef, panelRef],
  );

  // Open or close the description.
  const animate = useCallback(
    (open) => {
      const root = rootRef.current;
      const summary = summaryRef.current;
      const items = [...panelRef.current.querySelectorAll("[data-reveal]")];
      const wasOpen = root.open;
      const projectSoft = mode === "soft" && motionVariant === "project";

      timelineRef.current?.kill();
      targetRef.current = open;

      // Keep the summary visible in its scroll container when closing.
      if (!open && wasOpen) {
        const scroller = scrollerRef?.current;
        const top = summary.getBoundingClientRect().top;

        if (scroller) {
          const readingTop = scroller.getBoundingClientRect().top + 24;

          if (top < readingTop) {
            scroller.scrollTo({
              top: Math.max(0, scroller.scrollTop + top - readingTop),
              behavior: mode === "full" || projectSoft ? "smooth" : "instant",
            });
          }
        } else {
          const chapter = root
            .closest(".about")
            ?.querySelector(".about__chapter");

          const chapterHeight = chapter?.getBoundingClientRect().height ?? 0;

          if (top < chapterHeight + 24) {
            window.scrollTo({
              top: Math.max(0, window.scrollY + top - chapterHeight - 24),
              behavior: mode === "full" ? "smooth" : "instant",
            });
          }
        }
      }

      // Apply the state immediately in Still mode.
      if (mode === "still" || (!open && !wasOpen)) {
        settle(open);

        if (!open) {
          summary.focus({ preventScroll: true });
        }

        return;
      }

      const begin = () => {
        // Measure the current and destination heights.
        const currentHeight = root.getBoundingClientRect().height;

        root.style.height = "auto";
        root.open = open;

        const nextHeight = root.getBoundingClientRect().height;

        // Keep the content available during the height animation.
        root.open = true;
        gsap.set(root, {
          height: currentHeight,
          overflow: "hidden",
        });

        const timeline = gsap.timeline({
          onComplete: () => {
            settle(open);

            // Restore focus and reveal the short description.
            if (!open) {
              summary.focus({ preventScroll: true });

              timelineRef.current = gsap.fromTo(
                summary,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.16,
                  onComplete: () => {
                    gsap.set(summary, {
                      clearProps: "opacity,transform",
                    });
                  },
                },
              );
            }
          },
        });

        timelineRef.current = timeline;

        // Move the following page content with the description.
        timeline.to(
          root,
          {
            height: nextHeight,
            duration: mode === "full" ? 0.5 : projectSoft ? 0.38 : 0.24,
            ease: "power3.inOut",
          },
          0,
        );

        if (open) {
          // Prepare the full description for its entrance.
          if (!wasOpen) {
            gsap.set(items, {
              opacity: 0,
              x: mode === "full" ? (index) => (index % 2 ? 16 : -12) : 0,
              y: mode === "full" ? 10 : projectSoft ? 16 : 0,
            });
          }

          timeline.to(summary, { opacity: 1, duration: 0.2 }, 0);

          // Stagger the project story in Soft mode.
          timeline.to(
            items,
            {
              opacity: 1,
              x: 0,
              y: 0,
              stagger: mode === "full" ? 0.065 : projectSoft ? 0.055 : 0,
              duration: mode === "full" ? 0.36 : projectSoft ? 0.32 : 0.2,
              ease: "power3.out",
            },
            mode === "full" ? 0.1 : projectSoft ? 0.05 : 0,
          );
        } else {
          // Fade the full description before closing.
          timeline.to(
            items,
            {
              opacity: 0,
              x: mode === "full" ? -8 : 0,
              y: projectSoft ? -6 : 0,
              stagger: mode === "full" ? 0.025 : 0,
              duration: 0.16,
            },
            0,
          );

          timeline.to(summary, { opacity: 0, duration: 0.16 }, 0.08);
        }
      };

      // Fade the short description before opening in Full mode.
      if (open && !wasOpen && mode === "full") {
        timelineRef.current = gsap.to(summary, {
          opacity: 0,
          duration: 0.12,
          onComplete: begin,
        });
      } else {
        begin();
      }
    },
    [mode, rootRef, summaryRef, panelRef, scrollerRef, motionVariant, settle],
  );

  // Reverse the intended state, including during an active animation.
  const toggle = () => {
    const open = timelineRef.current?.isActive()
      ? targetRef.current
      : rootRef.current.open;

    animate(!open);
  };

  // Finish the current transition when the motion mode changes.
  useEffect(() => {
    settle(targetRef.current);
  }, [mode, settle]);

  // Restore natural sizing when the description width changes.
  useEffect(() => {
    const root = rootRef.current;
    let width = root.getBoundingClientRect().width;

    const observer = new ResizeObserver(([entry]) => {
      if (Math.abs(entry.contentRect.width - width) > 1) {
        width = entry.contentRect.width;

        const open =
          root.open && !timelineRef.current?.isActive()
            ? true
            : targetRef.current;

        settle(open);
      }
    });

    observer.observe(root);

    // Remove the observer and animation when the component unmounts.
    return () => {
      observer.disconnect();
      timelineRef.current?.kill();
    };
  }, [rootRef, settle]);

  return {
    toggle,
    close: () => animate(false),
  };
}
