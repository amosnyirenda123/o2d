import { Object2D } from "../primitives/Object2D.js";
import { CollisionSide, ObjectWithPhysics } from "../types.js";

export function contain(
  sprite: Object2D,
  bounds: { x: number; y: number; width: number; height: number },
  bounce: boolean = false,
  callback?: () => void
) {
  let x = bounds.x;
  let y = bounds.y;
  let width = bounds.width;
  let height = bounds.height;

  let collision: CollisionSide = undefined;

  //Left

  if (sprite.x < x) {
    //bouncing if bounce
    if (bounce) sprite.vx *= -1;

    //if sprite has physics component
    if (hasPhysics(sprite)) {
      sprite.vx /= sprite.physics!.mass;
    }

    sprite.x = x;
    collision = "left";
  }

  //Top
  if (sprite.y < y) {
    if (bounce) sprite.vy *= -1;
    //if sprite has physics component
    if (hasPhysics(sprite)) {
      sprite.vy /= sprite.physics!.mass;
    }
    sprite.y = y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > width) {
    if (bounce) sprite.vx *= -1;
    if (hasPhysics(sprite)) {
      sprite.vx /= sprite.physics!.mass;
    }
    sprite.x = width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > height) {
    if (bounce) sprite.vy *= -1;
    if (hasPhysics(sprite)) {
      sprite.vy /= sprite.physics!.mass;
    }
    sprite.y = height - sprite.height;
    collision = "bottom";
  }

  if (collision && callback) {
    callback();
  }

  return collision;
}

function hasPhysics(obj: Object2D): obj is ObjectWithPhysics {
  return (obj as ObjectWithPhysics).physics !== undefined;
}
