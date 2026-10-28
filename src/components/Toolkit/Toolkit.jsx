import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMotion } from "../../hooks/useMotion";
import { createToolkitMotion } from "../../animations/toolkit/toolkitMotion";
import { learningTools, toolkitGroups, workingKnowledge } from "./toolkitData";
import "./Toolkit.css";
import "./Toolkit.responsive.css";

function Toolkit() {
  const rootRef = useRef(null);
  const { mode } = useMotion();

  // Revert the previous mode before creating its replacement.
  useLayoutEffect(() => {
    if (mode === "still") return;
    const context = gsap.context(() => {
      createToolkitMotion(rootRef.current, mode);
    }, rootRef);
    return () => context.revert();
  }, [mode]);

  return (
    <section className="toolkit" id="toolkit" ref={rootRef} aria-labelledby="toolkit-title">
      <nav className="toolkit__chapter" aria-label="Toolkit chapter">
        <a href="#toolkit">
          {["03", "/", "TOOLKIT"].map((piece) => (
            <span className="toolkit__chapter-mask" key={piece} aria-hidden={piece === "/" ? true : undefined}>
              <span data-toolkit-chapter>{piece}</span>
            </span>
          ))}
        </a>
      </nav>

      <div className="toolkit__body">
        <header className="toolkit__header">
          <h2 id="toolkit-title">
            <span className="toolkit__title-mask"><span data-toolkit-title>My growing</span></span>{" "}
            <span className="toolkit__title-mask"><span data-toolkit-title>toolkit.</span></span>
          </h2>
          <p data-toolkit-intro>Tools I’ve used in projects, and what I’m learning next.</p>
        </header>

        <div className="toolkit__groups">
          {toolkitGroups.map((group) => (
            <section className="toolkit-group" key={group.id} aria-labelledby={`toolkit-${group.id}`}>
              <div className="toolkit-group__copy" data-toolkit-copy>
                <h3 id={`toolkit-${group.id}`}>{group.name}</h3>
                <p>{group.description}</p>
              </div>
              <ul className="toolkit-group__tools" aria-label={`${group.name} technologies`}>
                {group.tools.map((tool, index) => (
                  <li className="toolkit-tool" key={tool.name} data-toolkit-item data-toolkit-index={index}>
                    <span className={`toolkit-tool__logo${tool.wide ? " toolkit-tool__logo--wide" : ""}`} data-toolkit-logo>
                      <img src={tool.logo} alt="" width="48" height="48" loading="lazy" />
                    </span>
                    <span className="toolkit-tool__name-mask"><span data-toolkit-name>{tool.name}</span></span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="toolkit__working" data-toolkit-copy>
          <span>Working knowledge</span>
          <ul aria-label="Other languages">
            {workingKnowledge.map((tool) => (
              <li key={tool.name}>
                <img src={tool.logo} alt="" width="28" height="28" loading="lazy" />
                <span>{tool.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <section className="toolkit-learning" aria-labelledby="toolkit-learning-title">
          <h3 id="toolkit-learning-title" data-toolkit-copy>Currently learning</h3>
          <ul>
            {learningTools.map((tool) => (
              <li key={tool.name} data-toolkit-learning>
                <span className="toolkit-learning__logo" data-toolkit-logo>
                  <img src={tool.logo} alt="" width="56" height="56" loading="lazy" />
                </span>
                <div data-toolkit-copy>
                  <h4>{tool.name}</h4>
                  <p>{tool.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

export default Toolkit;
