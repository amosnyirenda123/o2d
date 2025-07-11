import { Object2D } from "./Object2D.js";

export class Group extends Object2D {
  private _newWidth = 0;
  private _newHeight = 0;

  constructor(...spritesToGroup: Object2D[]) {
    super();
    spritesToGroup.forEach((sprite) => this.addChild(sprite));
  }

  addChild(sprite: Object2D): void {
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }
    sprite.parent = this;
    this.children.push(sprite);

    //computing new size of group
    this.calculateSize();
  }

  removeChild(sprite: Object2D): void {
    if (sprite.parent === this) {
      this.children.splice(this.children.indexOf(sprite), 1);
      //computing new group size
      this.calculateSize();
    } else {
      throw new Error(`${sprite} is not a child of ${this}`);
    }
  }

  calculateSize(): void {
    if (this.children.length > 0) {
      this._newWidth = 0;
      this._newHeight = 0;

      this.children.forEach((child) => {
        this._newWidth = Math.max(this._newWidth, child.x + child.width);
        this._newHeight = Math.max(this._newHeight, child.y + child.height);
      });

      this.width = this._newWidth;
      this.height = this._newHeight;
    }
  }
}

export function group(...spritesToGroup: Object2D[]) {
  let sprite = new Group(...spritesToGroup);

  return sprite;
}
