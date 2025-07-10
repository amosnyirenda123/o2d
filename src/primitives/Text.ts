import { Object2D } from "./Object2D";

class Text extends Object2D {
  textBaseline: CanvasTextBaseline;
  strokeText: string;
  font: string;
  maxWidth: number;
  content: string;
  constructor(
    content = "Hello!",
    font = "12px sans-serif",
    maxWidth = 0,
    x = 0,
    y = 0
  ) {
    super();
    this.font = font;
    this.content = content;
    this.maxWidth = maxWidth;
    this.x = x;
    this.y = y;

    this.textBaseline = "top";
    this.strokeText = "none";
  }

  //The `render` method explains how to draw the sprite
  render(ctx: CanvasRenderingContext2D) {
    ctx.font = this.font;
    ctx.lineWidth = this.maxWidth;

    //Measure the width and height of the text
    if (this.width === 0) this.width = ctx.measureText(this.content).width;
    if (this.height === 0) this.height = ctx.measureText("M").width;

    ctx.translate(-this.width * this.pivotX, -this.height * this.pivotY);
    ctx.textBaseline = this.textBaseline;
    ctx.fillText(this.content, 0, 0);
    if (this.strokeText !== "none")
      ctx.strokeText(this.content, 0, 0, this.maxWidth);
  }
}

export function text(
  content: string,
  font: string,
  maxWidth: number,
  x: number,
  y: number
) {
  let sprite = new Text(content, font, maxWidth, x, y);
  return sprite;
}
