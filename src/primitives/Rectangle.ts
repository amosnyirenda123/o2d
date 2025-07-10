import { Object2D } from "./Object2D";
import { FillStyleType, StrokeStyleType } from "../types";

class Rectangle extends Object2D {
  mask: boolean;
  strokeStyle: StrokeStyleType;
  lineWidth: number;
  fillStyle: FillStyleType;
  constructor(
    width = 32,
    height = 32,
    fillStyle: FillStyleType = "gray",
    strokeStyle: StrokeStyleType = "none",
    lineWidth = 0,
    x = 0,
    y = 0
  ) {
    super();
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
    this.width = width;
    this.height = height;
    this.mask = false;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.rect(
      //Draw the sprite around its `pivotX` and `pivotY` point
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      this.width,
      this.height
    );
    if (this.strokeStyle !== "none") ctx.stroke();
    if (this.fillStyle !== "none") ctx.fill();
    if (this.mask && this.mask === true) ctx.clip();
  }
}

export function rectangle(
  width: number,
  height: number,
  fillStyle: FillStyleType,
  strokeStyle: StrokeStyleType,
  lineWidth: number,
  x: number,
  y: number
): Rectangle {
  let sprite = new Rectangle(
    width,
    height,
    fillStyle,
    strokeStyle,
    lineWidth,
    x,
    y
  );

  return sprite;
}
