import { Framebuffer2D } from "regl";

export default class CycleBuffer {
    
    public get Width() : number { return this._width; }
    private _width : number;

    public get Height() : number { return this._height; }
    private _height : number;

    public get AspectRatio() : number { return this._height / this._width; }

    private index : number = 0;
    private _cycleFrameBuffers : Framebuffer2D[];

    constructor(fboBuffers: Framebuffer2D[], textureWidth: number, textureHeight : number) {
        this._cycleFrameBuffers = fboBuffers;
        this._width = textureWidth;
        this._height = textureHeight;
    }

    public GetFrameBuffer() {
        let FBO = this._cycleFrameBuffers[this.index];
        this.index = (this.index + 1) % this._cycleFrameBuffers.length;
        return FBO;
    }

    public PreviousFrameBuffer() {
        let index = this.index - 1;

        if (index < 0)
            index = this._cycleFrameBuffers.length - 1;

        return this._cycleFrameBuffers[index];
    }

    public GetFrameBufferByIndex(index : number) {
        //To prevent index error
        let normalize_index = (index) % this._cycleFrameBuffers.length;

        //console.log(`CycleBuffer : Index ${normalize_index}, length ${this._cycleFrameBuffers.length}`);

        return this._cycleFrameBuffers[normalize_index];
    }

}