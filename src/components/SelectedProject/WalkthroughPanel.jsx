function WalkthroughPanel({ scene, projectId, index, active, staticFlow = false }) {
  // Preserve each screenshot's dimensions and crop settings.
  const width = scene.imageWidth || 1600;
  const height = scene.imageHeight || 1000;
  const cropTop = scene.imageCropTop || 0;
  const cropRight = scene.imageCropRight || 0;
  const cropBottom = scene.imageCropBottom || 0;
  const cropLeft = scene.imageCropLeft || 0;
  const visibleWidth = width - cropLeft - cropRight;
  const visibleHeight = height - cropTop - cropBottom;

  return (
    <article id={`${projectId}-${scene.id}-panel`} className={`project-walkthrough__panel${active ? " is-active" : ""}`} data-scene-index={index} aria-hidden={!staticFlow && !active}>
      <div className="project-walkthrough__image-slot">
        <figure className="project-walkthrough__card">
          <div className="project-walkthrough__image-window">
            <div className="project-walkthrough__capture" style={{ "--capture-ratio": `${visibleWidth} / ${visibleHeight}`, "--capture-offset": `${cropTop / height * 100}%`, "--capture-width": `${width / visibleWidth * 100}%`, "--capture-left": `${cropLeft / visibleWidth * 100}%` }}>
              <img src={scene.image} alt={scene.alt} width={width} height={height} loading="lazy" decoding="async" />
            </div>
          </div>
          <figcaption>{scene.caption}</figcaption>
        </figure>
      </div>
      <div className="project-walkthrough__copy">
        <p className="project-walkthrough__label">{String(index + 1).padStart(2, "0")} / {scene.label}</p>
        <h3 id={`${projectId}-${scene.id}-title`}>{scene.title}</h3>
        <p className="project-walkthrough__description">{scene.description}</p>
        {(scene.detailLead || scene.detail) && (
          <p className="project-walkthrough__detail">
            {scene.detailLead && <><strong>{scene.detailLead}</strong><br /></>}
            {scene.detail}
          </p>
        )}
      </div>
    </article>
  );
}

export default WalkthroughPanel;
