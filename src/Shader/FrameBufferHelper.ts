import {DrawCommand, Regl, Framebuffer2D} from 'regl';

export default class FrameBufferHelper {
    private _reglContext : Regl;

    private index : number = 0;
    private _cycleFrameBuffers : Framebuffer2D[];

    private _texWidth : number;
    private _texHeight : number;

    private _outputWidth : number;
    private _outputHeight: number;

    public get OutputWidth() { return this._outputWidth; }
    public get OutputHeight() { return this._outputHeight; }

    constructor(reglContext : Regl, textureWidth: number, textureHeight : number, targetSize : number) {
        this._reglContext = reglContext;
        this._texWidth = textureWidth;
        this._texHeight = textureHeight;

        let aspectRatio = textureHeight / textureWidth;
        console.log("AspectRatio " + aspectRatio);
        
        this._outputWidth = targetSize;
        this._outputHeight = Math.floor(targetSize * aspectRatio);

        this._cycleFrameBuffers = this.CreateFrameBuffers(3);
    }

    public ReadAsyncBufferPixel(fbo : Framebuffer2D) : Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            this._reglContext({framebuffer: fbo})(() => {
                var pixels = this._reglContext.read();

                resolve( this.RetrieveGrayColor(pixels) );
            });     
        });
    }

    public GetFrameBuffer() {
        let FBO = this._cycleFrameBuffers[this.index];
        this.index = (this.index + 1) % this._cycleFrameBuffers.length;
        return FBO;
    }

    public GetFrameBufferByIndex(index : number) {
        //To prevent index error
        index = (index) % this._cycleFrameBuffers.length;
        return this._cycleFrameBuffers[index];
    }

    private CreateFrameBuffers(bufferCount : number) {
        let fbos = [];

        for (let i = 0; i < bufferCount; i++) {
            fbos.push(
                this.CreateFrameBuffer(this._outputWidth, this._outputHeight, false, false)
            );
        }

        return fbos;
    }

    private CreateFrameBuffer(width : number, height : number, stencil: boolean, depth : boolean) {
        return this._reglContext.framebuffer({
            width: width,
            height: height,
            stencil: stencil,
            depth : depth
        });
    }

    private RetrieveGrayColor(colorArray: Uint8Array) {
        let length = colorArray.length;
        let grayColorArray : Uint8Array = new Uint8Array(length / 4);
        let gIndex = 0;

        for (let i = 0; i < length; i += 4) {
            grayColorArray[gIndex] = colorArray[i];
            gIndex++;
        }
        return grayColorArray;
    }
}