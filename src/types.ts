type ImageAsset = HTMLImageElement;
type JSONAsset = any;
type AudioAsset = HTMLAudioElement;
type FontAsset = FontFace;

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
