import { Circle } from "./primitives/Circle";
import { Object2D } from "./primitives/Object2D";

type ImageAsset = HTMLImageElement;
type JSONAsset = any;
type AudioAsset = HTMLAudioElement;
type FontAsset = FontFace;

//textur atlass
export type FrameRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type AtlasFrame = {
  source: HTMLImageElement;
  frame: FrameRect;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: FrameRect;
  pivot: {
    x: number;
    y: number;
  };
  sourceSize: {
    w: number;
    h: number;
  };
};

export type TextureAtlasMeta = {
  image: string;
  size: {
    w: number;
    h: number;
  };
  scale: string;
};

export type TextureAtlas = {
  frames: Record<string, AtlasFrame>;
  meta: TextureAtlasMeta;
  name?: string;
};

export type Asset = ImageAsset | JSONAsset | AudioAsset | FontAsset;

export type AssetType = {
  toLoad: number;
  loaded: number;
  imageExtensions: string[];
  fontExtensions: string[];
  jsonExtensions: string[];
  audioExtensions: string[];
  assets: { [key: string]: Asset };
  getAsset: (name: string) => Asset | undefined;
  load: (sources: string[]) => Promise<number>;
  loadImage: (source: string, loadHandler: () => void) => void;
  loadFont: (source: string, loadHandler: () => void) => void;
  loadJson: (source: string, loadHandler: () => void) => void;
  loadAudio: (source: string, loadHandler: () => void) => void;
  createTilesetFrames: (
    file: any,
    source: string,
    loadHandler: () => void
  ) => void;
};

export type CanvasWithContext = HTMLCanvasElement & {
  ctx: CanvasRenderingContext2D;
};

export type FillStyleType = string | CanvasGradient | CanvasPattern;
export type StrokeStyleType = string | CanvasGradient | CanvasPattern;
export type SourceType = string | HTMLImageElement | AtlasFrame | TextureAtlas;

export interface Renderable {
  render(ctx: CanvasRenderingContext2D): void;
}

export interface Physics {
  mass: number;
  frictionX: number;
  frictionY: number;
  accelerationX: number;
  accelarationY: number;
  gravity: number;
}

export type ObjectWithPhysics = Object2D & { physics?: Physics };
export type CircleWithPhysics = Circle & { physics?: Physics };

export type CollisionSide = "left" | "right" | "top" | "bottom" | undefined;
