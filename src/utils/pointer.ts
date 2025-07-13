import { Circle } from "../primitives/Circle";
import { Object2D } from "../primitives/Object2D";

export class Pointer {
  element: HTMLElement;
  scale: number;
  isDown = false;
  isUp = true;
  tapped = false;
  downTime = 0;
  elapsedTime = 0;
  press?: () => void;
  release?: () => void;
  tap?: () => void;
  private _x = 0;
  private _y = 0;
  private boundMoveHandler: (e: MouseEvent) => void;
  private boundDownHandler: (e: MouseEvent) => void;
  private boundTouchMoveHandler: (e: TouchEvent) => void;
  private boundTouchStartHandler: (e: TouchEvent) => void;

  constructor(element: HTMLElement, scale: number = 1) {
    this.element = element;
    this.scale = scale;

    this.boundMoveHandler = this.moveHandler.bind(this);
    this.boundDownHandler = this.downHandler.bind(this);
    this.boundTouchMoveHandler = this.touchmoveHandler.bind(this);
    this.boundTouchStartHandler = this.touchstartHandler.bind(this);
    //mouse events
    this.element.addEventListener("mousemove", this.boundMoveHandler, false);
    this.element.addEventListener("mousedown", this.boundDownHandler, false);
    //bind to window to catch release outside the target element
    window.addEventListener("mouseup", this.upHandler.bind(this), false);
    //touch events
    window.addEventListener("touchend", this.touchendHandler.bind(this), false);
    this.element.addEventListener(
      "touchmove",
      this.boundTouchMoveHandler,
      false
    );

    this.element.addEventListener(
      "touchstart",
      this.boundTouchStartHandler,
      false
    );

    //disabling defaut pan and zoom actions on the canvas
    this.element.style.touchAction = "none";
  }

  get x() {
    return this._x / this.scale;
  }

  get y() {
    return this._y / this.scale;
  }

  get centerX() {
    return this.x;
  }

  get centerY() {
    return this.y;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  setPosition(rawX: number, rawY: number) {
    this._x = rawX;
    this._y = rawY;
  }

  private moveHandler(event: MouseEvent) {
    //element firing the event
    let element = event.target as HTMLElement;

    //Pointers x and y position
    if (element) {
      this._x = event.pageX - element.offsetLeft;
      this._y = event.pageY - element.offsetTop;
    }

    event.preventDefault();
  }

  private touchmoveHandler(event: TouchEvent) {
    let element = event.target as HTMLElement;

    if (element) {
      this._x = event.targetTouches[0].pageX - element.offsetLeft;
      this._y = event.targetTouches[0].pageY - element.offsetTop;
    }
    event.preventDefault();
  }

  private downHandler(event: MouseEvent) {
    this.isDown = true;
    this.isUp = false;
    this.tapped = false;

    //current time
    this.downTime = Date.now();
    if (this.press) this.press();
    event.preventDefault();
  }

  private touchstartHandler(event: TouchEvent) {
    let element = event.target as HTMLElement;
    if (element) {
      this._x = event.targetTouches[0].pageX - element.offsetLeft;
      this._y = event.targetTouches[0].pageY - element.offsetTop;
    }
    this.isDown = true;
    this.isUp = false;
    this.tapped = false;

    this.downTime = Date.now();
    if (this.press) this.press();
    event.preventDefault();
  }

  private upHandler(event: MouseEvent) {
    this.elapsedTime = Math.abs(this.downTime - Date.now());

    //if less than 200 milliseconds, then its a tap
    if (this.elapsedTime <= 200 && this.tapped === false) {
      this.tapped = true;
      if (this.tap) this.tap();
    }
    this.isUp = true;
    this.isDown = false;

    if (this.release) this.release();
    event.preventDefault();
  }

  private touchendHandler(event: TouchEvent) {
    this.elapsedTime = Math.abs(this.downTime - Date.now());

    if (this.elapsedTime <= 200 && this.tapped === false) {
      this.tapped = true;

      if (this.tap) this.tap();
    }
    this.isUp = true;
    this.isDown = false;
    if (this.release) this.release();
    event.preventDefault();
  }

  public hitTestSprite(sprite: Object2D): boolean {
    let hit = false;
    if (!sprite.circular) {
      let left = sprite.gx,
        right = sprite.gx + sprite.width,
        top = sprite.gy,
        bottom = sprite.gy + sprite.height;

      hit = this.x > left && this.x < right && this.y > top && this.y < bottom;
    } else {
      let circularSprite = sprite as Circle;
      let vx = this.x - (circularSprite.gx + circularSprite.radius),
        vy = this.y - (circularSprite.gy + circularSprite.radius);

      let distanceSq = vx * vx + vy * vy;

      hit = distanceSq < circularSprite.radius * circularSprite.radius;
    }
    return hit;
  }
}

export function pointer(element: HTMLElement, scale: number = 1): Pointer {
  return new Pointer(element, scale);
}
