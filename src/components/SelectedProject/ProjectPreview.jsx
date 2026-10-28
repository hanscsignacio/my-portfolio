// Use the same composition in the overview and the opening transition.
function ProjectPreview({ project, previewRef, priority = false, variant = "default" }) {
  const classes = [
    "project-preview",
    variant === "showcase" ? "project-preview--showcase" : "",
    variant === "cover" ? "project-preview--cover" : "",
    !project.phone ? "project-preview--desktop-only" : "",
    !project.desktop ? "project-preview--phone-only" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} ref={previewRef}>
      {project.desktop && (
      <div className="project-preview__desktop">
        <img
          src={project.desktop}
          alt={project.desktopAlt || `${project.name}'s desktop view.`}
          width="1440"
          height="900"
          loading={priority ? "eager" : "lazy"}
          draggable="false"
        />
      </div>
      )}
      {project.phone && (
      <div className="project-preview__phone">
        <img
          src={project.phone}
          alt={project.phoneAlt || `${project.name}'s phone view.`}
          width="390"
          height="844"
          loading={priority ? "eager" : "lazy"}
          draggable="false"
        />
      </div>
      )}
      {!project.desktop && !project.phone && <p className="project-preview__missing">Project screenshots to add.</p>}
    </div>
  );
}

export default ProjectPreview;
