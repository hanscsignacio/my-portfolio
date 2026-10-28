import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotion } from "../../hooks/useMotion";
import { projects } from "./projectData";
import { createProjectChapterMotion, createProjectHeadingMotion } from "../../animations/projects/projectHeading";
import ProjectFeature from "./ProjectFeature";
import ProjectOverlay from "./ProjectOverlay";
import "./SelectedProject.css";
import "./SelectedProject.responsive.css";

function SelectedProject({ projectList = projects }) {
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const [activeProject, setActiveProject] = useState(projectList[0]);
  const { mode } = useMotion();

  // Reveal the chapter label and section title.
  useLayoutEffect(() => {
    if (mode === "still" || !rootRef.current) return;

    const context = gsap.context(() => {
      createProjectChapterMotion(rootRef.current, mode);
      createProjectHeadingMotion(rootRef.current, mode);
    }, rootRef);

    return () => context.revert();
  }, [mode]);

  const openProject = (project, preview, opener, destination = "intro") => {
    setActiveProject(project);
    overlayRef.current.open(preview, opener, destination);
  };

  if (!projectList.length) return null;

  return (
    <section className="selected-project" id="projects" ref={rootRef} aria-labelledby="projects-heading">
      <nav className="selected-project__chapter" aria-label="Projects chapter">
        <a href="#projects">
          <span className="selected-project__chapter-mask"><span className="selected-project__chapter-piece">02</span></span>
          <span className="selected-project__chapter-mask" aria-hidden="true"><span className="selected-project__chapter-piece">/</span></span>
          <span className="selected-project__chapter-mask"><span className="selected-project__chapter-piece">PROJECTS</span></span>
        </a>
      </nav>

      <h2 className="selected-project__title" id="projects-heading" aria-label="Selected projects">
        <span className="selected-project__title-lead" aria-hidden="true">Selected</span>
        <span className="selected-project__heading-mask" aria-hidden="true">
          <span className="selected-project__title-word">PROJECTS</span>
        </span>
      </h2>

      <div className="selected-project__projects">
        {projectList.map((project) => (
          <ProjectFeature key={project.id} project={project} mode={mode} onOpen={openProject} />
        ))}
      </div>

      <ProjectOverlay ref={overlayRef} project={activeProject} />
    </section>
  );
}

export default SelectedProject;
