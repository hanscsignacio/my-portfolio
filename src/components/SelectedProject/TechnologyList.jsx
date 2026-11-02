import { projectTechnologies } from "./projectTechnologies";
import "./TechnologyList.css";
import "./TechnologyList.responsive.css";

function TechnologyList({ items, label }) {
  if (!items?.length) return null;

  return (
    <ul className="project-technologies" aria-label={label}>
      {items.map((id) => {
        const technology = projectTechnologies[id];
        return (
          <li key={id} data-stack-reveal>
            {technology?.logo && <img src={technology.logo} width="28" height="28" alt="" loading="lazy" />}
            <span>{technology?.name || id}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default TechnologyList;
