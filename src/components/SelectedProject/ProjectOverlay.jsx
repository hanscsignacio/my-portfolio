import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useMotion } from "../../hooks/useMotion";
import { useProjectDetailsMotion } from "../../hooks/useProjectDetailsMotion";
import { captureProjectPreview, moveProjectBridge, prepareProjectBridge } from "../../animations/projects/projectOverlay";
import ProjectPreview from "./ProjectPreview";
import ProjectStack from "./ProjectStack";
import ProjectIcon from "./ProjectIcon";
import ProjectWalkthrough from "./ProjectWalkthrough";
import AboutExpandableText from "../About/AboutExpandableText";

function clearCoverMotion(dialog) {
  gsap.set(dialog.querySelectorAll(".project-dialog__hero-title > span, [data-cover-reveal]"), {
    clearProps: "opacity,transform",
  });
}

function ProjectOverlay({ ref, project }) {
  const dialogRef = useRef(null);
  const frameRef = useRef(null);
  const surfaceRef = useRef(null);
  const shadeRef = useRef(null);
  const scrollRef = useRef(null);
  const bridgeRef = useRef(null);
  const closeRef = useRef(null);
  const barRef = useRef(null);
  const coverRef = useRef(null);
  const runtimeRef = useRef(null);
  const { mode } = useMotion();
  const [isOpen, setIsOpen] = useState(false);
  useProjectDetailsMotion({ dialogRef, scrollerRef: scrollRef, isOpen, mode, projectId: project.id });

  const openProject = useCallback((preview, opener, destination = "intro") => {
    const dialog = dialogRef.current;
    if (dialog.open) return;

    // Start the transition after React renders the selected project.
    const runtime = {
      preview,
      opener,
      visibility: preview.style.visibility,
      scrollY: window.scrollY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      sourcePose: captureProjectPreview(preview),
      closing: false,
      destination,
      mode,
    };
    runtimeRef.current = runtime;
    setIsOpen(true);
    // Fill the viewport without changing the page width.
    dialog.style.setProperty("--project-viewport-width", `${window.innerWidth}px`);
    dialog.showModal();
    scrollRef.current.scrollTop = 0;
    closeRef.current.focus({ preventScroll: true });
    gsap.set(frameRef.current, { clearProps: "opacity,transform" });
    gsap.set([surfaceRef.current, barRef.current], {
      clearProps: "transform,clipPath", opacity: mode === "still" ? 1 : 0,
    });
    gsap.set(shadeRef.current, { opacity: 0 });
  }, [mode]);

  useImperativeHandle(ref, () => ({ open: openProject }), [openProject]);

  // Keep the image continuous between the preview and the cover.
  useLayoutEffect(() => {
    const runtime = runtimeRef.current;
    if (!isOpen || !runtime || runtime.started) return;
    runtime.started = true;
    runtime.opening = true;
    runtime.coverVisibility = coverRef.current.style.visibility;
    const dialog = dialogRef.current;
    const surface = surfaceRef.current;
    const shade = shadeRef.current;
    const shadeOpacity = runtime.mode === "soft" ? 0.18 : 0.28;
    const bar = barRef.current;
    const bridge = bridgeRef.current;
    const cover = coverRef.current;
    const scroller = scrollRef.current;
    const stackTarget = runtime.destination === "stack" ? dialog.querySelector(".project-stack") : null;

    const settleCover = () => {
      runtime.bridgeActive = false;
      cover.style.visibility = runtime.coverVisibility;
      gsap.set([surface, bar], { clearProps: "opacity,transform,clipPath" });
      gsap.set(shade, { opacity: shadeOpacity });
      clearCoverMotion(dialog);
      gsap.set(bridge, { opacity: 0 });
      bridge.replaceChildren();
    };
    const finishOpening = (focusStack = false) => {
      if (runtime.closing) return;
      runtime.opening = false;
      runtime.navigating = false;
      settleCover();
      dialog.dispatchEvent(new Event("portfolio:project-ready"));
      if (focusStack) stackTarget?.querySelector("h3").focus({ preventScroll: true });
    };
    const completeCover = () => {
      if (runtime.closing || runtime.interrupted) return;
      settleCover();
      if (!stackTarget) {
        finishOpening();
        return;
      }
      const top = stackTarget.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
      runtime.navigating = true;
      if (runtime.mode === "still") {
        scroller.scrollTop = top;
        finishOpening(true);
        return;
      }
      runtime.timeline = gsap.to(scroller, {
        scrollTop: top,
        duration: runtime.mode === "soft" ? 0.24 : 0.48,
        ease: "power2.inOut",
        onComplete: () => finishOpening(true),
      });
    };
    runtime.settleOpen = (continueDestination = false) => {
      runtime.timeline?.kill();
      runtime.navigating = false;
      if (continueDestination) completeCover();
      else {
        runtime.interrupted = true;
        finishOpening();
      }
    };

    scroller.scrollTop = 0;
    if (runtime.mode === "still") {
      completeCover();
      return;
    }

    if (runtime.mode === "soft") {
      const destination = captureProjectPreview(cover);
      prepareProjectBridge(bridge, runtime.preview, runtime.sourcePose);
      runtime.preview.style.visibility = "hidden";
      cover.style.visibility = "hidden";
      runtime.bridgeActive = true;
      const title = dialog.querySelector(".project-dialog__hero-title > span");
      const details = dialog.querySelectorAll("[data-cover-reveal]");
      gsap.set(title, { x: 36, opacity: 0 });
      gsap.set(details, { opacity: 0, x: 24 });
      const timeline = gsap.timeline({ onComplete: completeCover });
      runtime.timeline = timeline;
      timeline.to(shade, { opacity: shadeOpacity, duration: 0.3 }, 0)
        .fromTo(surface, { opacity: 1, clipPath: "inset(0 100% 0 0)" }, {
          opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.54, ease: "power2.inOut",
        }, 0)
        .to(bar, { opacity: 1, duration: 0.24 }, 0.08)
        .to(title, { x: 0, opacity: 1, duration: 0.46, ease: "power2.out" }, 0.24)
        .to(details, { opacity: 1, x: 0, duration: 0.34, stagger: 0.08, ease: "power2.out" }, 0.34);
      moveProjectBridge(timeline, bridge, destination, 0.6, "power2.inOut");
      timeline.call(() => {
        cover.style.visibility = runtime.coverVisibility;
        gsap.set(bridge, { opacity: 0 });
        bridge.replaceChildren();
        runtime.bridgeActive = false;
      }, null, 0.6);
      return;
    }

    const destination = captureProjectPreview(cover);
    prepareProjectBridge(bridge, runtime.preview, runtime.sourcePose);
    runtime.preview.style.visibility = "hidden";
    cover.style.visibility = "hidden";
    runtime.bridgeActive = true;
    const title = dialog.querySelector(".project-dialog__hero-title > span");
    const details = dialog.querySelectorAll("[data-cover-reveal]");
    gsap.set(title, { yPercent: 110, rotation: 1.5 });
    gsap.set(details, { opacity: 0, y: 12 });
    const timeline = gsap.timeline({ onComplete: completeCover });
    runtime.timeline = timeline;
    timeline.to(shade, { opacity: shadeOpacity, duration: 0.3, ease: "power2.out" }, 0)
      .fromTo(surface, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0)
      .to(bar, { opacity: 1, duration: 0.24 }, 0.08)
      .to(title, { yPercent: 0, rotation: 0, duration: 0.55, ease: "power3.out" }, 0.35)
      .to(details, { opacity: 1, y: 0, duration: 0.38, stagger: 0.07, ease: "power2.out" }, 0.48);
    moveProjectBridge(timeline, bridge, destination, 0.8);
    timeline.call(() => {
      cover.style.visibility = runtime.coverVisibility;
      gsap.set(bridge, { opacity: 0 });
      bridge.replaceChildren();
      runtime.bridgeActive = false;
    }, null, 0.8);
  }, [isOpen, project.id]);

  const closeProject = useCallback(() => {
    const runtime = runtimeRef.current;
    if (!runtime || runtime.closing) return;
    runtime.closing = true;
    runtime.timeline?.kill();

    // Restore the page and opener after closing.
    const finish = () => {
      runtime.timeline?.kill();
      runtime.preview.style.visibility = runtime.visibility;
      coverRef.current.style.visibility = runtime.coverVisibility || "";
      dialogRef.current.close();
      dialogRef.current.style.removeProperty("--project-viewport-width");
      gsap.set(frameRef.current, { clearProps: "opacity,transform" });
      gsap.set([surfaceRef.current, barRef.current], { clearProps: "opacity,transform,clipPath" });
      gsap.set(shadeRef.current, { opacity: 0 });
      clearCoverMotion(dialogRef.current);
      gsap.set(bridgeRef.current, { opacity: 0 });
      bridgeRef.current.replaceChildren();
      window.scrollTo({ top: runtime.scrollY, behavior: "instant" });
      if (runtime.opener.isConnected) runtime.opener.focus({ preventScroll: true });
      window.dispatchEvent(new Event("portfolio:project-close"));
      runtimeRef.current = null;
      setIsOpen(false);
    };

    runtime.finishClose = finish;
    if (mode === "still" || !runtime.started) {
      finish();
      return;
    }

    const cover = coverRef.current;
    const bounds = cover.getBoundingClientRect();
    const readingArea = surfaceRef.current.getBoundingClientRect();
    const coverVisible = bounds.bottom > readingArea.top && bounds.top < readingArea.bottom;
    const sameViewport = runtime.viewportWidth === window.innerWidth && runtime.viewportHeight === window.innerHeight;
    // Return the devices while the cover is visible.
    const returnImage = sameViewport && (runtime.bridgeActive || coverVisible);
    const timeline = gsap.timeline({ onComplete: finish });
    runtime.timeline = timeline;

    // Start Soft's wipe from a numeric mask.
    if (mode === "soft" && getComputedStyle(surfaceRef.current).clipPath === "none") {
      gsap.set(surfaceRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
    }

    if (!returnImage) {
      runtime.preview.style.visibility = runtime.visibility;
      if (mode === "soft") {
        timeline.to(surfaceRef.current, { clipPath: "inset(0% 100% 0% 0%)", duration: 0.46, ease: "power2.inOut" }, 0)
          .to(shadeRef.current, { opacity: 0, duration: 0.46 }, 0)
          .to(barRef.current, { opacity: 0, duration: 0.28 }, 0.1)
          .to(bridgeRef.current, { opacity: 0, duration: 0.2 }, 0);
        return;
      }
      // Close the navbar and content together.
      timeline.to(frameRef.current, { scale: 0.96, duration: 0.5, ease: "power3.inOut" }, 0)
        .to(frameRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.1)
        .to(shadeRef.current, { opacity: 0, duration: 0.5 }, 0)
        .to(bridgeRef.current, { opacity: 0, duration: 0.18 }, 0);
      return;
    }

    if (!runtime.bridgeActive) {
      prepareProjectBridge(bridgeRef.current, cover, captureProjectPreview(cover));
      cover.style.visibility = "hidden";
    }
    if (mode === "soft") {
      timeline.to(surfaceRef.current, { clipPath: "inset(0 100% 0 0)", duration: 0.34, ease: "power2.inOut" }, 0.04)
        .to(shadeRef.current, { opacity: 0, duration: 0.44 }, 0)
        .to(barRef.current, { opacity: 0, duration: 0.2 }, 0.08);
      moveProjectBridge(timeline, bridgeRef.current, runtime.sourcePose, 0.46, "power2.inOut");
      return;
    }
    timeline.to(surfaceRef.current, { opacity: 0, duration: 0.38 }, 0.08)
      .to(shadeRef.current, { opacity: 0, duration: 0.5 }, 0.05)
      .to(barRef.current, { opacity: 0, duration: 0.2 }, 0.08);
    moveProjectBridge(timeline, bridgeRef.current, runtime.sourcePose, 0.55);
  }, [mode]);

  // Let scrolling and resizing interrupt the opening without leaving a clone.
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const scroller = scrollRef.current;
    const settle = () => {
      const runtime = runtimeRef.current;
      if (runtime?.opening && !runtime.closing) runtime.settleOpen?.();
    };
    const scroll = () => {
      if (!runtimeRef.current?.navigating && scroller.scrollTop !== 0) settle();
    };
    const resize = () => {
      const runtime = runtimeRef.current;
      dialog.style.setProperty("--project-viewport-width", `${window.innerWidth}px`);
      if (runtime?.closing) runtime.finishClose?.();
      else if (runtime?.opening) runtime.settleOpen?.(true);
    };
    const pointer = (event) => {
      if (!event.target.closest(".project-dialog__close")) settle();
    };
    const keyboard = (event) => {
      const scrollKey = ["Tab", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key);
      const space = event.key === " " && !event.target.closest("button, a, input, textarea");
      if (scrollKey || space) settle();
    };
    scroller.addEventListener("scroll", scroll, { passive: true });
    scroller.addEventListener("wheel", settle, { passive: true });
    scroller.addEventListener("touchstart", settle, { passive: true });
    dialog.addEventListener("pointerdown", pointer);
    dialog.addEventListener("keydown", keyboard);
    window.addEventListener("resize", resize);
    return () => {
      scroller.removeEventListener("scroll", scroll);
      scroller.removeEventListener("wheel", settle);
      scroller.removeEventListener("touchstart", settle);
      dialog.removeEventListener("pointerdown", pointer);
      dialog.removeEventListener("keydown", keyboard);
      window.removeEventListener("resize", resize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (mode !== "still") return;
    const runtime = runtimeRef.current;
    if (runtime?.closing) runtime.finishClose?.();
    else if (runtime?.opening) {
      runtime.mode = "still";
      runtime.settleOpen?.(true);
    }
  }, [mode]);

  // Stop motion when the overlay unmounts.
  useEffect(() => () => {
    const runtime = runtimeRef.current;
    runtime?.timeline?.kill();
    if (runtime) runtime.preview.style.visibility = runtime.visibility;
  }, []);

  // Keep Tab cycling through the visible project controls.
  const handleKeyDown = (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialogRef.current.querySelectorAll("button:not([disabled]), a[href]")]
      .filter((control) => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  return createPortal(
    <dialog
      className="project-dialog"
      ref={dialogRef}
      aria-labelledby="project-dialog-title"
      onKeyDown={handleKeyDown}
      onCancel={(event) => { event.preventDefault(); closeProject(); }}
    >
      <div className="project-dialog__shade" ref={shadeRef} aria-hidden="true" inert />
      <div className="project-dialog__frame" ref={frameRef}>
        <div className="project-dialog__bar" ref={barRef}>
          <div className="project-dialog__bar-title">
            <span className="project-dialog__bar-context">Project details</span>
            <span className="project-dialog__bar-separator" aria-hidden="true">/</span>
            <span className="project-dialog__bar-name">{project.name}</span>
          </div>
          <button className="project-button project-dialog__close" type="button" onClick={closeProject} ref={closeRef}>
            Close project <ProjectIcon name="close" />
          </button>
        </div>
        <div className="project-dialog__surface" ref={surfaceRef}>
          <div className="project-dialog__scroll" ref={scrollRef}>
            <div className="project-dialog__content">
              <header className="project-dialog__hero">
                <ProjectPreview project={project} previewRef={coverRef} priority={isOpen} variant="cover" />
                <div className="project-dialog__hero-copy">
                  <h2 id="project-dialog-title" className="project-dialog__hero-title"><span>{project.name.toUpperCase()}</span></h2>
                  <p className="project-dialog__hero-description" data-cover-reveal>{project.description}.</p>
                  <div className="project-dialog__hero-meta" data-cover-reveal>
                    <p className="project-dialog__hero-context"><span>{project.type}</span>{" "}<span>{project.period}</span></p>
                    <p className="project-dialog__hero-role"><span>My role</span>{" "}{project.role}</p>
                  </div>
                </div>
              </header>

              <section className="project-overview" id={`${project.id}-overview`} aria-labelledby="project-overview-title">
                <h3 id="project-overview-title">{project.overviewTitle.map((line) => <span className="project-motion-mask" key={line}><span data-project-title-line>{line}</span></span>)}</h3>
                <p className="project-overview__summary">{project.summary}</p>
              </section>

              <ProjectStack project={project} />

              <ProjectWalkthrough project={project} isOpen={isOpen} scrollerRef={scrollRef} />

              <section className="project-contribution" aria-labelledby="project-contribution-title">
                <h3 id="project-contribution-title"><span className="project-motion-mask"><span data-project-title-line>My part</span></span><span className="project-motion-mask"><span data-project-title-line>in the project.</span></span></h3>
                <div>
                  {project.contributions.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {project.contributionNote && <p className="project-contribution__note">{project.contributionNote}</p>}
                </div>
              </section>

              <section className="project-learning" aria-labelledby="project-learning-title">
                <p>What I took from it</p>
                <h3 id="project-learning-title">{project.learning.title.map((line) => <span className="project-motion-mask" key={line}><span data-project-title-line>{line}</span></span>)}</h3>
                {isOpen && <AboutExpandableText label="What this project taught me" summary={project.learning.summary} paragraphs={project.learning.paragraphs} scrollerRef={scrollRef} motionVariant="project" />}
                <div className="project-learning__actions">
                  {project.url && <a className="project-button project-button--dark" href={project.url} target="_blank" rel="noreferrer">Visit site <ProjectIcon name="arrow-up-right" /></a>}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="project-dialog__bridge" ref={bridgeRef} aria-hidden="true" inert />
    </dialog>, document.body,
  );
}

export default ProjectOverlay;
