import gsap from "gsap";

const layers = [".project-preview__desktop", ".project-preview__phone"];

// Capture each device independently so it can move into the cover.
export function captureProjectPreview(preview) {
  const bounds = preview.getBoundingClientRect();
  return {
    x: bounds.left,
    y: bounds.top,
    width: bounds.width,
    height: bounds.height,
    layers: layers.flatMap((selector) => {
      const element = preview.querySelector(selector);
      if (!element) return [];
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const matrix = new DOMMatrixReadOnly(style.transform === "none" ? undefined : style.transform);
      const scaleX = Math.hypot(matrix.a, matrix.b);
      const scaleY = Math.hypot(matrix.c, matrix.d);
      const width = parseFloat(style.width) * scaleX;
      const height = parseFloat(style.height) * scaleY;
      return [{
        selector,
        x: rect.left + rect.width / 2 - bounds.left - width / 2,
        y: rect.top + rect.height / 2 - bounds.top - height / 2,
        width,
        height,
        rotation: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
        padding: parseFloat(style.paddingTop) * scaleX,
        borderRadius: style.borderRadius,
        imageRadius: getComputedStyle(element.querySelector("img")).borderRadius,
      }];
    }),
  };
}

function devicePose(layer) {
  return {
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    rotation: layer.rotation,
    padding: layer.padding,
    borderRadius: layer.borderRadius,
  };
}

export function prepareProjectBridge(bridge, preview, pose) {
  const clone = preview.cloneNode(true);
  clone.removeAttribute("id");
  clone.className = "project-preview";
  clone.removeAttribute("style");
  bridge.replaceChildren(clone);
  gsap.set(bridge, { x: pose.x, y: pose.y, width: pose.width, height: pose.height, opacity: 1 });
  gsap.set(clone, { width: "100%", height: "100%", aspectRatio: "auto", clipPath: "none" });
  pose.layers.forEach((layer) => {
    const element = clone.querySelector(layer.selector);
    element.removeAttribute("style");
    gsap.set(element, {
      position: "absolute", left: 0, top: 0, right: "auto", bottom: "auto", margin: 0,
      transformOrigin: "50% 50%", scale: 1, ...devicePose(layer),
    });
    gsap.set(element.querySelector("img"), {
      width: "100%", height: "100%", objectFit: "fill", borderRadius: layer.imageRadius,
    });
  });
}

export function moveProjectBridge(timeline, bridge, pose, duration, ease = "power3.inOut") {
  timeline.to(bridge, {
    x: pose.x, y: pose.y, width: pose.width, height: pose.height,
    duration, ease,
  }, 0);
  pose.layers.forEach((layer) => {
    const element = bridge.querySelector(layer.selector);
    if (!element) return;
    timeline.to(element, { ...devicePose(layer), duration, ease }, 0);
    timeline.to(element.querySelector("img"), { borderRadius: layer.imageRadius, duration }, 0);
  });
}
