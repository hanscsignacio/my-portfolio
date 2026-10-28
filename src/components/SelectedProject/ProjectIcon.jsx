// Close and external-link icons.
function ProjectIcon({ name }) {
  return (
    <svg
      className="project-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "close" ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </>
      ) : (
        <>
          <line x1="6" y1="18" x2="18" y2="6" />
          <polyline points="8 6 18 6 18 16" />
        </>
      )}
    </svg>
  );
}

export default ProjectIcon;
