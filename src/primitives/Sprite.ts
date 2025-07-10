import { AtlasFrame, SourceType, TextureAtlas } from "../types";
import { Object2D } from "./Object2D";

class Sprite extends Object2D {
  source: SourceType;
  x: number;
  y: number;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  tilesetFrame: undefined | AtlasFrame;
  constructor(source: SourceType, x: number, y: number) {
    super();
    this.source = source;
    this.x = x;
    this.y = y;
    this.sourceX = 0;
    this.sourceY = 0;
    this.sourceWidth = 0;
    this.sourceHeight = 0;

    if (source instanceof HTMLImageElement) {
      this.createFromImage(source);
    }
    //Image from texture atlas
    else if (isAtlasFrame(source)) {
      this.createFromAtlas(source);
    }
  }

  createFromImage(source: HTMLImageElement) {
    // Load asset file
    // then assets.getAsset("key") to locate image
    if (!(source instanceof HTMLImageElement)) {
      throw new Error(`${source} is not an image object`);
    } else {
      //create sprite
      this.source = source;
      this.sourceX = 0;
      this.sourceY = 0;
      this.width = source.width;
      this.height = source.height;
      this.sourceWidth = source.width;
      this.sourceHeight = source.height;
    }
  }
  createFromAtlas(source: AtlasFrame) {
    // load image atlas and json file
    // then assets.getAsset("key");
    this.tilesetFrame = source;
    this.source = this.tilesetFrame.source;
    this.sourceX = this.tilesetFrame.frame.x;
    this.sourceY = this.tilesetFrame.frame.y;
    this.width = this.tilesetFrame.frame.w;
    this.height = this.tilesetFrame.frame.h;
    this.sourceWidth = this.tilesetFrame.frame.w;
    this.sourceHeight = this.tilesetFrame.frame.h;
  }
}

function isTextureAtlas(asset: SourceType): asset is TextureAtlas {
  return (
    typeof asset === "object" &&
    asset !== null &&
    "frames" in asset &&
    "meta" in asset
  );
}

function isAtlasFrame(source: SourceType): source is AtlasFrame {
  return (
    typeof source === "object" &&
    source != null &&
    "source" in source &&
    "frame" in source
  );
}

// if (isTextureAtlas(source)) {
//   console.log(source.frames["cat.png"].frame.w); //
// }
