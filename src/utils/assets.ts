import { AssetType, Asset } from "../types";

export let assets: AssetType = {
  toLoad: 0,
  loaded: 0,
  imageExtensions: ["png", "jpg", "gif"],
  fontExtensions: ["ttf", "otf", "ttc", "woff"],
  jsonExtensions: ["json"],
  audioExtensions: ["mp3", "ogg", "wav", "webm"],
  assets: {},

  getAsset(name: string): Asset | undefined {
    return this.assets[name];
  },

  load: function (sources: string[]): Promise<number> {
    return new Promise((resolve) => {
      let loadHandler = () => {
        this.loaded += 1;
        console.log(this.loaded);

        if (this.toLoad === this.loaded) {
          //All the assets have been loaded
          console.log(`Loaded ${this.toLoad} / ${this.loaded} in total.\n`);
          this.toLoad = 0;
          this.loaded = 0;

          resolve(this.loaded);
        }
      };

      console.log("Loading assets....");
      this.toLoad = sources.length;

      sources.forEach((source) => {
        let extension = source.split(".").pop();

        if (extension != undefined) {
          //is image
          if (this.imageExtensions.indexOf(extension) !== -1) {
            this.loadImage(source, loadHandler);
          }

          //is font
          else if (this.fontExtensions.indexOf(extension) !== -1) {
            this.loadFont(source, loadHandler);
          }

          //is json file
          else if (this.jsonExtensions.indexOf(extension) !== -1) {
            this.loadJson(source, loadHandler);
          }

          //is an audio file
          else if (this.audioExtensions.indexOf(extension) !== -1) {
            this.loadAudio(source, loadHandler);
          } else {
            console.log(`${source} has unsupported extension "${extension}". `);
          }
        }
      });
    });
  },
  loadImage: function (source: string, loadHandler: () => void): void {
    let image: HTMLImageElement = new Image();
    image.addEventListener("load", loadHandler, false);
    this.assets[source] = image;

    image.src = source;
  },

  loadFont: function (source: string, loadHandler: () => void): void {
    //get fontname
    let fontFamily = source.split("/").pop()?.split(".")[0];

    let newStyle = document.createElement("style");

    let fontFace =
      "@font-face {font-family: '" +
      fontFamily +
      "'; src: url('" +
      source +
      "');}";
    newStyle.appendChild(document.createTextNode(fontFace));
    document.head.appendChild(newStyle);

    loadHandler();
  },
  loadJson: function (source: string, loadHandler: () => void): void {
    let xhr = new XMLHttpRequest();
    //load json file
    xhr.open("GET", source, true);
    xhr.responseType = "text";
    xhr.onload = (event) => {
      //Check to make sure the file has loaded properly
      if (xhr.status === 200) {
        let file = JSON.parse(xhr.responseText);
        //get file name
        file.name = source;
        this.assets[file.name] = file;

        //Texture atlas support
        if (file.frames) {
          //create tileset frames
          this.createTilesetFrames(file, source, loadHandler);
        } else {
          loadHandler();
        }
      }
    };

    //request to load file
    xhr.send();
  },
  loadAudio: function (source: string, handler: () => void): void {
    //TODO: implement sound loader
  },
  createTilesetFrames: function (
    file: any,
    source: string,
    loadHandler: () => void
  ): void {
    //Get the tileset image's file path
    let baseUrl = source.replace(/[^\/]*$/, "");
    //Use the `baseUrl` and `image` name property from the JSON
    //file's `meta` object to construct the full image source path
    let imageSource = baseUrl + file.meta.image;
    //The image's load handler
    let imageLoadHandler = () => {
      //Assign the image as a property of the `assets` object so
      //you can access it like this:
      //`assets["images/imageName.png"]`
      this.assets[imageSource] = image;
      //Loop through all the frames
      Object.keys(file.frames).forEach((frame) => {
        //The `frame` object contains all the size and position
        //data for each sub-image.
        //Add the frame data to the asset object so that you
        //can access it later like this: `assets["frameName.png"]`
        this.assets[frame] = file.frames[frame];

        //Get a reference to the source so that it will be easy for
        //us to access it later
        this.assets[frame].source = image;
      });

      loadHandler();
    };
    //Load the tileset image
    let image = new Image();
    image.addEventListener("load", imageLoadHandler, false);
    image.src = imageSource;
  },
};
