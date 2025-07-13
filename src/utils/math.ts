import { Object2D } from "../primitives/Object2D.js";
import { Pointer } from "./pointer.js";

export function followEase(
  follower: Object2D,
  leader: Object2D | Pointer,
  speed: number
) {
  let vx = leader.centerX - follower.centerX,
    vy = leader.centerY - follower.centerY,
    distanceSq = vx * vx + vy * vy;

  if (distanceSq >= 1) {
    follower.x += vx * speed;
    follower.y += vy * speed;
  }
}

export function followConstant(
  follower: Object2D,
  leader: Object2D | Pointer,
  speed: number
) {
  //Figure out the distance between the sprites
  let vx = leader.centerX - follower.centerX,
    vy = leader.centerY - follower.centerY,
    distanceSq = vx * vx + vy * vy;
  //Move the follower if it's more than 1 move
  //away from the leader
  if (distanceSq >= speed * speed) {
    const distanceInv = 1 / Math.sqrt(distanceSq);
    const dx = vx * distanceInv * speed;
    const dy = vy * distanceInv * speed;

    follower.x += dx;
    follower.y += dy;
  }
}

export function angle(s1: Object2D | Pointer, s2: Object2D | Pointer) {
  return Math.atan2(s2.centerY - s1.centerY, s2.centerX - s1.centerX);
}

export function rotateSprite(
  rotatingSprite: Object2D,
  centerSprite: Object2D,
  distance: number,
  angle: number
) {
  rotatingSprite.x =
    centerSprite.centerX -
    rotatingSprite.parent!.x +
    distance * Math.cos(angle) -
    rotatingSprite.halfWidth;
  rotatingSprite.y =
    centerSprite.centerY -
    rotatingSprite.parent!.y +
    distance * Math.sin(angle) -
    rotatingSprite.halfWidth;
}

export function rotateAroundPoint(
  sprite: Object2D,
  cx: number,
  cy: number,
  angle: number
) {
  const dx = sprite.x - cx;
  const dy = sprite.y - cy;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const rotatedX = cos * dx - sin * dy;
  const rotatedY = sin * dx + cos * dy;

  sprite.x = rotatedX + cx;
  sprite.y = rotatedY + cy;
}

export function orbit(
  sprite: Object2D,
  cx: number,
  cy: number,
  angle: number,
  radius: number
) {
  sprite.x = cx + Math.cos(angle) * radius;
  sprite.y = cy + Math.sin(angle) * radius;
}
