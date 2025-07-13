import { Circle } from "../primitives/Circle.js";
import { Object2D } from "../primitives/Object2D.js";
import { ObjectWithPhysics, Point, Surface, Vector } from "../types.js";

export function hitTestPoint(
  point: Point,
  sprite: Object2D
): boolean | undefined {
  let shape: "circle" | "rectangle",
    left: number,
    right: number,
    top: number,
    bottom: number,
    vx: number,
    vy: number,
    mangitudeSq: number,
    hit: boolean | undefined;

  if (sprite instanceof Circle) {
    shape = "circle";
  } else {
    shape = "rectangle";
  }

  if (shape === "rectangle") {
    left = sprite.x;
    right = sprite.x + sprite.width;
    top = sprite.y;
    bottom = sprite.y + sprite.height;

    hit =
      point.x > left && point.x < right && point.y > top && point.y < bottom;
  }

  if (shape === "circle") {
    let circularShape = sprite as Circle;

    vx = point.x - sprite.centerX;
    vy = point.y - sprite.centerY;

    mangitudeSq = vx * vx + vy * vy;

    hit = mangitudeSq < circularShape.radius * circularShape.radius;
  }

  return hit;
}
export function hitTestCircle(c1: Circle, c2: Circle, global = false) {
  let vx: number, vy: number, mangitudeSq: number, combinedRadii: number;

  if (global) {
    vx = c2.gx + c2.radius - (c1.gx + c1.radius);
    vy = c2.gy + c2.radius - (c1.gy + c1.radius);
  } else {
    vx = c2.centerX - c1.centerX;
    vy = c2.centerY - c1.centerY;
  }

  mangitudeSq = vx * vx + vy * vy;
  combinedRadii = c1.radius + c2.radius;

  return mangitudeSq < combinedRadii * combinedRadii;
}
export function hitTestRectangle() {}
export function hitTestCirclePoint() {}
export function hitTestCircleRectangle() {}
export function hit() {}
export function rectangleCollision() {}
export function circleCollision(
  c1: Circle,
  c2: Circle,
  bounce = false,
  global = false
) {
  let vx: number,
    vy: number,
    mangitudeSq: number,
    combinedRadii: number,
    hit: boolean | undefined,
    overlap: number,
    surface: Surface;

  if (global) {
    vx = c2.gx + c2.radius - (c1.gx + c1.radius);
    vy = c2.gy + c2.radius - (c1.gy + c1.radius);
  } else {
    vx = c2.centerX - c1.centerX;
    vy = c2.centerY - c1.centerY;
  }

  mangitudeSq = vx * vx + vy * vy;
  combinedRadii = c1.radius + c2.radius;
  let combinedRadiiSq = combinedRadii * combinedRadii;

  if (mangitudeSq < combinedRadiiSq) {
    hit = true;
    overlap = combinedRadiiSq - mangitudeSq;

    let quantumPadding = 0.3;
    overlap += quantumPadding;

    //TODO: approximate magnitude
    let dx = vx / Math.sqrt(mangitudeSq);
    let dy = vy / Math.sqrt(mangitudeSq);

    //move circle 1 away
    c1.x -= overlap * dx;
    c1.y -= overlap * dy;

    if (bounce) {
      surface!.x = vy;
      surface!.y = -vx;

      //   bounceOffSurface(c1, surface);
    }
  }

  return hit;
}
export function circleRectangleCollision() {}
export function circlePointCollsion() {}
export function movingCircleCollision() {}

function bounceOffSurface(o: ObjectWithPhysics, s: Surface) {
  let dp1,
    dp2,
    p1: Vector,
    p2: Vector,
    bounce: Point,
    mass = o.physics!.mass || 1;

  //1. Calculate the collision surface's properties
  //Find the surface vector's left normal
  s.lx = s.y;
  s.ly = -s.x;

  //Find its magnitude
  s.magnitude = Math.sqrt(s.x * s.x + s.y * s.y);

  //Find its normalized values
  s.dx = s.x / s.magnitude;
  s.dy = s.y / s.magnitude;

  //2. Bounce the object (o) off the surface (s)

  //Find the dot product between the object and the surface
  dp1 = o.vx * s.dx + o.vy * s.dy;

  //Project the object's velocity onto the collision surface
  p1!.vx = dp1 * s.dx;
  p1!.vy = dp1 * s.dy;

  //Find the dot product of the object and the surface's left normal (s.lx and s.ly)
  dp2 = o.vx * (s.lx / s.magnitude) + o.vy * (s.ly / s.magnitude);

  //Project the object's velocity onto the surface's left normal
  p2!.vx = dp2 * (s.lx / s.magnitude);
  p2!.vy = dp2 * (s.ly / s.magnitude);

  //Reverse the projection on the surface's left normal
  p2!.vx *= -1;
  p2!.vy *= -1;

  //Add up the projections to create a new bounce vector
  bounce!.x = p1!.vx + p2!.vx;
  bounce!.y = p1!.vy + p2!.vy;

  //Assign the bounce vector to the object's velocity
  //with optional mass to dampen the effect
  o.vx = bounce!.x / mass;
  o.vy = bounce!.y / mass;
}
