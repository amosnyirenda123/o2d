import { Object2D } from "./primitives/Object2D";
import { CanvasWithContext } from "./types";

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
