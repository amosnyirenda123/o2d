import { Object2D } from "./primitives/Object2D.js";
import { CanvasWithContext, Renderable } from "./types";

export function createCanvas(
  width = 256,
  height = 256,
  border = "1px dashed black",
  backgroundColor = "white"
): CanvasWithContext {
  const canvas = document.createElement("canvas") as CanvasWithContext;
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = border;
  canvas.style.backgroundColor = backgroundColor;
  document.body.appendChild(canvas);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to get 2D context for canvas.");
  }
  canvas.ctx = context;

  return canvas;
}

export function createStage(canvas: CanvasWithContext): Object2D {
  let stage = new Object2D();
  stage.width = canvas.width;
  stage.height = canvas.height;

  return stage;
}

export const render = (canvas: CanvasWithContext, stage: Object2D) => {
  const ctx = canvas.ctx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stage.children.forEach((sprite) => {
    displaySprite(sprite);
  });
  function displaySprite(sprite: Object2D) {
    if (sprite.visible) {
      ctx.save();
      //shifting canvas to sprites position
      ctx.translate(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
      ctx.rotate(sprite.rotation);
      if (sprite.parent) {
        ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
      }

      ctx.scale(sprite.scaleX, sprite.scaleY);
      //call childs render method.
      if (isRenderable(sprite)) sprite.render(ctx);
      if (sprite.children && sprite.children.length > 0) {
        //Reset the context back to the parent sprite's top-left corner
        ctx.translate(-sprite.width / 2, -sprite.height / 2);
        sprite.children.forEach((child) => displaySprite(child));
      }
      ctx.restore();
    }
  }
};

function isRenderable(sprite: any): sprite is Renderable {
  return typeof sprite.render === "function";
}
