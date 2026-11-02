import { useRef } from "react";
import { useMotion } from "../../hooks/useMotion";
import { useWalkthroughScene } from "./useWalkthroughScene";
import WalkthroughPanel from "./WalkthroughPanel";
import "./ProjectWalkthrough.css";
import "./ProjectWalkthrough.responsive.css";

function ProjectWalkthrough({ project, isOpen, scrollerRef }) {
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const { mode } = useMotion();
  const { activeScene, staticFlow } = useWalkthroughScene({
    rootRef, navRef, scrollerRef, isOpen, mode, projectId: project.id,
  });

  // Keep the selected screen below the wrapped pills.
  const jumpTo = (scene) => {
    const target = document.getElementById(`${project.id}-${scene.id}`);
    const scroller = scrollerRef.current;
    scroller.scrollTo({
      top: target.getBoundingClientRect().top - scroller.getBoundingClientRect().top
        + scroller.scrollTop - navRef.current.offsetHeight - 16,
      behavior: mode === "still" ? "instant" : "smooth",
    });
  };

  return (
    <section className="project-walkthrough" ref={rootRef} data-flow={staticFlow} aria-label={`A walkthrough of ${project.name}`}>
      <nav className="project-walkthrough__nav" ref={navRef} aria-label="Project walkthrough">
        {project.scenes.map((scene, index) => (
          <button key={scene.id} type="button" aria-current={activeScene === index ? "step" : undefined} aria-controls={`${project.id}-${scene.id}-panel`} onClick={() => jumpTo(scene)}>{scene.label}</button>
        ))}
      </nav>
      <div className="project-walkthrough__body">
      {staticFlow ? (
        <div className="project-walkthrough__flow">
          {project.scenes.map((scene, index) => (
            <section key={scene.id} id={`${project.id}-${scene.id}`} data-project-step={index} aria-labelledby={`${project.id}-${scene.id}-title`}>
              <WalkthroughPanel scene={scene} projectId={project.id} index={index} active staticFlow />
            </section>
          ))}
        </div>
      ) : (
        <div className="project-walkthrough__journey">
          <div className="project-walkthrough__stage">
            {project.scenes.map((scene, index) => (
              <WalkthroughPanel key={scene.id} scene={scene} projectId={project.id} index={index} active={activeScene === index} />
            ))}
          </div>
          <div className="project-walkthrough__markers" aria-hidden="true">
            {project.scenes.map((scene, index) => (
              <div key={scene.id} id={`${project.id}-${scene.id}`} data-project-step={index} className="project-walkthrough__marker" />
            ))}
          </div>
        </div>
      )}
      </div>
    </section>
  );
}

export default ProjectWalkthrough;
