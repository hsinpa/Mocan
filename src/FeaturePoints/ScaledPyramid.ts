import FrameBufferHelper from "../Shader/FrameBufferHelper";
import ShaderManager from "../Shader/ShaderManager";
import CycleBuffer from "../Shader/CycleBuffer";
import {ScalePyramidStruct} from "../FeaturePoints/DataStructure";

export default class ScaledPyramid {
    private _shaderManager : ShaderManager;
    private _frameBuffers : FrameBufferHelper

    private _originalSize: number;
    private _originalWidth: number;
    private _originalHeight: number;
    private _aspectRatio: number;

    private _layer: number;
    private _octave: number;

    private _pyramid : ScalePyramidStruct[] = [];

    constructor(shaderManager : ShaderManager, frameBuffers : FrameBufferHelper) {
        this._shaderManager = shaderManager;
        this._frameBuffers = frameBuffers;
    }

    Config (originalWidth: number, originalHeight : number, originalSize: number, layer : number, octave : number) {
        this._originalWidth = originalWidth;
        this._originalHeight = originalHeight;
        this._originalSize = originalSize;
        this._aspectRatio = originalHeight / originalWidth;

        this._layer = layer;        
        this._octave = octave;

        this._pyramid = this.PrepareFrameBuffer();
    }

    private PrepareFrameBuffer() {
        let pyramid : ScalePyramidStruct[] = [];

        for (let l = 1; l <= this._layer; l++) {
            let size = Math.floor(this._originalSize / l);
            let scaleHeight =  Math.floor(size * this._aspectRatio);

            let cycleBuffer = this._frameBuffers.CreateCycleBuffer(size, scaleHeight, size, 2);
            let fbo = this._frameBuffers.CreateFrameBuffer(size, scaleHeight, false, false);

            let pyramidStruct : ScalePyramidStruct = {
                size : size,
                octave : this._octave,
                cycleBuffer : cycleBuffer,
                fbo : fbo
            };

            pyramid.push(pyramidStruct);
        }

        return pyramid;
    }
}