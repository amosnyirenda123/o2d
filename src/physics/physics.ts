import { Physics } from "../types";

export function initPhysics(
  mass: number = 1,
  accelerationX: number = 0,
  accelarationY: number = 0,
  frictionX: number = 1,
  frictionY: number = 0,
  gravity: number = 0.3
): Physics {
  return {
    mass,
    accelerationX,
    accelarationY,
    frictionX,
    frictionY,
    gravity,
  };
}
