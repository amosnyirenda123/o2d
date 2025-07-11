import { Object2D } from "./Object2D.js";
import { Renderable, StrokeStyleType } from "../types";

class Line extends Object2D implements Renderable {
  strokeStyle: StrokeStyleType;
  lineWidth: number;
  lineJoin: CanvasLineJoin;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  constructor(
    strokeStyle: StrokeStyleType = "none",
    lineWidth = 0,
    ax = 0,
    ay = 0,
    bx = 32,
    by = 32
  ) {
    super();
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
    this.ax = ax;
    this.ay = ay;
    this.bx = bx;
    this.by = by;

    this.lineJoin = "round";
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = this.lineJoin;
    ctx.beginPath();
    ctx.moveTo(this.ax, this.ay);
    ctx.lineTo(this.bx, this.by);
    if (this.strokeStyle !== "none") ctx.stroke();
  }
}

export function line(
  strokeStyle: StrokeStyleType,
  lineWidth: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
) {
  let sprite = new Line(strokeStyle, lineWidth, ax, ay, bx, by);
  return sprite;
}
