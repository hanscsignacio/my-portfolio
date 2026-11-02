import TechnologyList from "./TechnologyList";
import "./ProjectStack.css";
import "./ProjectStack.responsive.css";

function ProjectStack({ project }) {
  if (!project.stack?.groups?.length) return null;

  return (
    <section className="project-stack" id={`${project.id}-stack`} aria-labelledby={`${project.id}-stack-title`}>
      <p className="project-stack__eyebrow">Stack & technical work</p>
      <h3 id={`${project.id}-stack-title`} tabIndex={-1}><span className="project-motion-mask"><span data-project-title-line>The stack behind {project.name}.</span></span></h3>

      <div className="project-stack__groups">
        {project.stack.groups.map((group) => (
          <div className="project-stack__group" key={group.name}>
            <h4>{group.name}</h4>
            <div>
              <TechnologyList items={group.technologies} label={`${group.name} technologies`} />
              <p>{group.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="project-stack__eyebrow project-stack__highlights-label">Technical highlights</p>
      <dl className="project-stack__capabilities">
        {project.stack.capabilities.map((capability) => (
          <div key={capability.title}>
            <dt>{capability.title}</dt>
            <dd>{capability.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default ProjectStack;
