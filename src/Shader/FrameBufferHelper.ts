import {DrawCommand, Regl, Framebuffer2D} from 'regl';
import CycleBuffer from './CycleBuffer';

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

    constructor(reglContext : Regl) {
        this._reglContext = reglContext;
    }

    public CreateCycleBuffer(textureWidth: number, textureHeight : number, targetSize : number, layerCount : number) {
        let aspectRatio = textureHeight / textureWidth;        
        let outputWidth = targetSize;
        let outputHeight = Math.floor(targetSize * aspectRatio);

        return new CycleBuffer(this.CreateFrameBuffers(outputWidth, outputHeight, layerCount), outputWidth, outputHeight);
    }

    public ReadAsyncBufferPixel(fbo : Framebuffer2D) : Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            this._reglContext({framebuffer: fbo})(() => {
                var pixels = this._reglContext.read();

                resolve( this.RetrieveGrayColor(pixels) );
            });     
        });
    }

    public CreateFrameBuffer(width : number, height : number, stencil: boolean, depth : boolean) {
        return this._reglContext.framebuffer({
            width: width,
            height: height,
            stencil: stencil,
            depth : depth
        });
    }

    private CreateFrameBuffers( textureWidth: number, textureHeight : number, bufferCount : number) {
        let fbos = [];

        for (let i = 0; i < bufferCount; i++) {
            fbos.push(
                this.CreateFrameBuffer(textureWidth, textureHeight, false, false)
            );
        }

        return fbos;
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