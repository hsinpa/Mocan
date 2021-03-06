import FrameBufferHelper from "../Shader/FrameBufferHelper";
import ShaderManager from "../Shader/ShaderManager";
import {ScalePyramidStruct} from "../FeaturePoints/DataStructure";
import REGL, { DrawCommand, Framebuffer2D, Regl } from "regl";
import {ProcessREGLCommand} from '../REGL/REGLCommands';
import {FBO_SIZE} from '../REGL/RectShape';

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
    public get Pyramid() { return this._pyramid; }

    private _gaussianBlurCommand : DrawCommand;
    private _sobelEdgeCommand : DrawCommand;
    private _renderTexCommand : DrawCommand;
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

        this._pyramid = this.CreatePyramidStruct();

        let gaussianBlurConfig = this._shaderManager.GetGaussianBlurConfig(this._originalWidth, this._originalHeight);

        this._gaussianBlurCommand = this._shaderManager.CreateActionCommand(gaussianBlurConfig);

        this._sobelEdgeCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetSobelEdgeConfig());

        this._renderTexCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetRenderConfig(this._pyramid[1].fbo));
    }

    public ProcessBlurPipeline(inputTexture : REGL.Texture) {
        type TextureType = REGL.Texture | Framebuffer2D;

        let fboInputTex : TextureType = inputTexture;
        let self = this;
        for (let p_index = 0; p_index < this._pyramid.length; p_index++) {
            let p_layer = this._pyramid[p_index];

            if (p_index > 0) {
                fboInputTex = this._pyramid[p_index - 1].fbo;
            }

            for (let o = 0; o < p_layer.octave; o++) {

                if (o > 0) {
                    fboInputTex = p_layer.cycleBuffer.PreviousFrameBuffer();
                }

                let drawFBO = p_layer.cycleBuffer.GetFrameBuffer();

                if (o == p_layer.octave - 1) {
                    drawFBO = p_layer.fbo;
                }

                ProcessREGLCommand(drawFBO, self._gaussianBlurCommand, {u_mainTex : fboInputTex});
            }

            ProcessREGLCommand(p_layer.sobel, self._sobelEdgeCommand, {u_mainTex : p_layer.fbo, u_texSize : [p_layer.width, p_layer.height]});
        }
    }

    public Preview() {
        this._renderTexCommand();
    }

    private CreatePyramidStruct() {
        let pyramid : ScalePyramidStruct[] = [];
        let log2 = Math.log2(this._originalSize);

        for (let l = 0; l < this._layer; l++) {
            let width = Math.round((Math.pow(2, (log2 - l))));
            let height =  Math.floor(width * this._aspectRatio);

            let cycleBuffer = this._frameBuffers.CreateCycleBuffer(width, height, width, 2);
            let mainFBO = this._frameBuffers.CreateFrameBuffer(width, height, false, false);
            let sobelFBO = this._frameBuffers.CreateFrameBuffer(width, height, false, false);

            let pyramidStruct : ScalePyramidStruct = {
                width : width,
                height : height,
                octave : this._octave,
                cycleBuffer : cycleBuffer,
                fbo : mainFBO,
                sobel: sobelFBO
            };

            pyramid.push(pyramidStruct);
        }

        return pyramid;
    }


}