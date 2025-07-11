import { Object2D } from "./Object2D.js";
import { FillStyleType, StrokeStyleType } from "../types";

export class Circle extends Object2D {
  mask: boolean;
  strokeStyle: StrokeStyleType;
  lineWidth: number;
  fillStyle: FillStyleType;
  diameter: number;
  radius: number;

  constructor(
    diameter = 32,
    fillStyle: FillStyleType = "gray",
    strokeStyle: StrokeStyleType = "none",
    lineWidth = 0,
    x = 0,
    y = 0
  ) {
    super();

    this.circular = true;

    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
    this.diameter = diameter;
    this.radius = diameter / 2;
    this.x = x;
    this.y = y;

    this.mask = false;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.arc(
      this.radius + -this.diameter * this.pivotX,
      this.radius + -this.diameter * this.pivotY,
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    if (this.strokeStyle !== "none") ctx.stroke();
    if (this.fillStyle !== "none") ctx.fill();
    if (this.mask && this.mask === true) ctx.clip();
  }
}

export function circle(
  diameter: number,
  fillStyle: FillStyleType,
  strokeStyle: StrokeStyleType,
  lineWidth: number,
  x: number,
  y: number
) {
  let sprite = new Circle(diameter, fillStyle, strokeStyle, lineWidth, x, y);

  return sprite;
}
