import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { createProjectFeatureMotion } from "../../animations/projects/projectFeature";
import ProjectPreview from "./ProjectPreview";
import TechnologyList from "./TechnologyList";
import ProjectIcon from "./ProjectIcon";
import "./ProjectFeature.css";
import "./ProjectFeature.responsive.css";

// Give each project its own preview and animation scope.
function ProjectFeature({ project, mode, onOpen }) {
  const rootRef = useRef(null);
  const previewRef = useRef(null);
  const titleId = `project-${project.id}-title`;

  useLayoutEffect(() => {
    if (mode === "still") return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add({ compact: "(max-width: 820px)", wide: "(min-width: 821px)" }, (query) => {
        createProjectFeatureMotion(rootRef.current, mode, query.conditions.compact);
      });
      return () => media.revert();
    }, rootRef);

    return () => context.revert();
  }, [mode, project.id]);

  return (
    <article className="project-feature" aria-labelledby={titleId} ref={rootRef}>
      <div className="project-feature__intro">
        <h3 className="project-feature__title" id={titleId}>
          <span>{project.name}</span>
        </h3>
      </div>

      <div className="project-feature__visual">
        <ProjectPreview project={project} previewRef={previewRef} variant="showcase" />
      </div>

      <div className="project-feature__information">
        <div className="project-feature__summary">
          <p className="project-feature__description">{project.description}</p>
          <p className="project-feature__context"><span>{project.type}</span>{" "}<span>{project.period}</span></p>
        </div>
        <div className="project-feature__role"><span>My role</span><p>{project.role}</p></div>
        <button
          className="project-button project-button--dark"
          type="button"
          aria-haspopup="dialog"
          aria-label={`View ${project.name} project`}
          onClick={(event) => onOpen(project, previewRef.current, event.currentTarget)}
        >
          View project <ProjectIcon name="arrow-up-right" />
        </button>
      </div>

      {project.stack?.groups?.length > 0 && (
        <div className="project-stack-preview">
          <h4>Built with</h4>
          <div className="project-stack-preview__technologies">
            <TechnologyList items={project.stack.preview} label={`${project.name} technologies`} />
            <button
              className="project-stack-preview__link"
              type="button"
              aria-haspopup="dialog"
              aria-label={`View ${project.name}'s full stack`}
              onClick={(event) => onOpen(project, previewRef.current, event.currentTarget, "stack")}
            >
              View full stack
            </button>
          </div>
          {project.stack.highlights?.length > 0 && (
            <div className="project-stack-preview__highlights">
              <h4>Technical highlights</h4>
              <ul>
                {project.stack.highlights.map((highlight) => <li key={highlight} data-stack-reveal>{highlight}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default ProjectFeature;
