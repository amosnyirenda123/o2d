let draggableSprites: Object2D[] = [];
let buttons: Object2D[] = [];

function makeInteractive(ob: Object2D) {}

export class Object2D {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  alpha: number;
  scaleX: number;
  visible: boolean;
  scaleY: number;
  pivotX: number;
  pivotY: number;
  vx: number;
  vy: number;
  children: Object2D[];
  parent: Object2D | undefined;
  shadow: boolean;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowColor: string;
  blendMode: string | undefined;
  private _layer: number;
  frames: never[];
  loop: boolean;
  private _currentFrame: number;
  playing: boolean;
  private _draggable: boolean | undefined;
  private _circular: boolean;
  private _interactive: boolean;
  constructor() {
    //position and size
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    //Rotation, alpha, visible, and scale properties
    this.rotation = 0;
    this.alpha = 1;
    this.visible = true;
    this.scaleX = 1;
    this.scaleY = 1;

    //rotation axis (default in center)
    this.pivotX = 0.5;
    this.pivotY = 0.5;
    this.vx = 0;
    this.vy = 0;
    this.children = [];
    this.parent = undefined;

    //Set `shadow` to `true` if you want the sprite to display a shadow
    this.shadow = false;
    this.shadowColor = "rgba(100, 100, 100, 0.5)";
    this.shadowOffsetX = 3;
    this.shadowOffsetY = 3;
    this.shadowBlur = 3;

    //blend mode
    this.blendMode = undefined;

    //A "private" `_layer` property
    this._layer = 0;

    //Image states and animation
    this.frames = [];
    this.loop = true;
    this._currentFrame = 0;
    this.playing = false;

    //Can the sprite be dragged?
    this._draggable = undefined;
    //Is the sprite circular? If it is, it will be given a `radius`
    //and `diameter`
    this._circular = false;
    //Is the sprite `interactive`? If it is, it can become clickable
    //or touchable
    this._interactive = false;
  }

  get gx(): number {
    if (this.parent) {
      return this.x + this.parent.gx;
    } else {
      return this.x;
    }
  }

  get gy(): number {
    if (this.parent) {
      return this.y + this.parent.gy;
    } else {
      return this.y;
    }
  }

  get halfWidth(): number {
    return this.width / 2;
  }
  get halfHeight(): number {
    return this.height / 2;
  }

  get centerX(): number {
    return this.x + this.halfWidth;
  }
  get centerY(): number {
    return this.y + this.halfHeight;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  get localBounds() {
    return {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    };
  }

  get globalBounds() {
    return {
      x: this.gx,
      y: this.gy,
      width: this.gx + this.width,
      height: this.gy + this.height,
    };
  }

  get empty() {
    if (this.children.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  get currentFrame() {
    return this._currentFrame;
  }

  get circular() {
    return this._circular;
  }

  get draggable(): boolean | undefined {
    return this._draggable;
  }

  get interactive() {
    return this._interactive;
  }

  //Depth layer
  get layer(): number {
    return this._layer;
  }
  set layer(value) {
    this._layer = value;
    if (this.parent) {
      this.parent.children.sort((a, b) => a.layer - b.layer);
    }
  }

  set circular(value: boolean) {
    //Give the sprite `diameter` and `radius` properties
    //if `circular` is `true`
    if (value === true && this._circular === false) {
      Object.defineProperties(this, {
        diameter: {
          get() {
            return this.width;
          },
          set(value) {
            this.width = value;
            this.height = value;
          },
          enumerable: true,
          configurable: true,
        },
        radius: {
          get() {
            return this.halfWidth;
          },
          set(value) {
            this.width = value * 2;
            this.height = value * 2;
          },
          enumerable: true,
          configurable: true,
        },
      });
      //Set this sprite's `_circular` property to `true`
      this._circular = true;
    }
    //Remove the sprite's `diameter` and `radius` properties
    //if `circular` is `false`
    if (value === false && this._circular === true) {
      "diameter" in this && delete this.diameter;
      "radius" in this && delete this.radius;
      this._circular = false;
    }
  }

  set draggable(value: boolean) {
    if (value === true) {
      draggableSprites.push(this);
      this._draggable = true;
    }
    //If it's `false`, remove it from the `draggableSprites` array
    if (value === false) {
      draggableSprites.splice(draggableSprites.indexOf(this), 1);
    }
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  addChild(sprite: Object2D): void {
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }
    sprite.parent = this;
    this.children.push(sprite);
  }

  removeChild(sprite: Object2D): void {
    if (sprite.parent === this) {
      this.children.splice(this.children.indexOf(sprite), 1);
    } else {
      throw new Error(sprite + "is not descendant of " + this);
    }
  }

  //position b in center of current sprite
  putCenter(b: Object2D, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.halfWidth - b.halfWidth + xOffset;
    b.y = a.y + a.halfHeight - b.halfHeight + yOffset;
  }

  //Position `b` above `a`
  putTop(b: Object2D, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.halfWidth - b.halfWidth + xOffset;
    b.y = a.y - b.height + yOffset;
  }

  //Position `b` to the right of `a`
  putRight(b: Object2D, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.width + xOffset;
    b.y = a.y + a.halfHeight - b.halfHeight + yOffset;
  }

  //Position `b` below `a`
  putBottom(b: Object2D, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.halfWidth - b.halfWidth + xOffset;
    b.y = a.y + a.height + yOffset;
  }

  //Position `b` to the left of `a`
  putLeft(b: Object2D, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x - b.width + xOffset;
    b.y = a.y + a.halfHeight - b.halfHeight + yOffset;
  }

  //manipulating child sprites
  //Swap the depth layer positions of two child sprites
  swapChildren(child1: Object2D, child2: Object2D) {
    let index1 = this.children.indexOf(child1),
      index2 = this.children.indexOf(child2);
    if (index1 !== -1 && index2 !== -1) {
      //Swap the indexes
      child1.layer = index2;
      child2.layer = index1;
      //Swap the array positions
      this.children[index1] = child2;
      this.children[index2] = child1;
    } else {
      throw new Error(`Both objects must be a child of the caller ${this}`);
    }
  }

  //`add` and `remove` let you add and remove many sprites at the same time
  add(...spritesToAdd: Object2D[]) {
    spritesToAdd.forEach((sprite) => this.addChild(sprite));
  }

  remove(...spritesToRemove: Object2D[]) {
    spritesToRemove.forEach((sprite) => this.removeChild(sprite));
  }

  set interactive(value) {
    if (value === true) {
      //Add interactive properties to the sprite
      //so that it can act like a button
      makeInteractive(this);
      //Add the sprite to the global `buttons` array so
      //it can be updated each frame
      buttons.push(this);
      //Set this sprite’s private `_interactive` property to `true`
      this._interactive = true;
    }
    if (value === false) {
      //Remove the sprite's reference from the
      //`buttons` array so that it's no longer affected
      //by mouse and touch interactivity
      buttons.splice(buttons.indexOf(this), 1);
      this._interactive = false;
    }
  }
}
