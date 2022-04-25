import {CreateCanvasREGLCommand, ProcessREGLCommand} from '../REGL/REGLCommands';
import ShaderManager from '../Shader/ShaderManager';
import {DrawCommand, Framebuffer2D, Regl, Texture} from 'regl';
import FrameBufferHelper from '../Shader/FrameBufferHelper';
import numjs from 'numjs';
import CycleBuffer from '../Shader/CycleBuffer';
import {FBO_SIZE} from '../REGL/RectShape';

export default class HarrisCorner {

    private _cacheTexture : Texture;
    private _guassianFBO : Framebuffer2D;
    private _sobelFBO : Framebuffer2D;
    private _cornerFBO : Framebuffer2D;

    private _k : number;
    private _window_size : number;
    private _threshold : number;
    private _shaderManager : ShaderManager;
    private _frameBuffers : FrameBufferHelper

    private _gaussianBlurCommand : DrawCommand;
    private _sobelEdgeCommand : DrawCommand;
    private _harrisCornerCommand : DrawCommand;
    private _renderTexCommand : DrawCommand;

    private _cycleBuffer : CycleBuffer;

    constructor(shaderManager : ShaderManager, frameBuffers : FrameBufferHelper) {
        this._shaderManager = shaderManager;
        this._frameBuffers = frameBuffers;
    }

    SetConfig(originalWidth : number, originalHeight : number, k : number, window_size : number, threshold : number) {
        this._k = k;
        this._window_size = window_size;
        this._threshold = threshold;

        this._cycleBuffer = this._frameBuffers.CreateCycleBuffer(originalWidth, originalHeight, FBO_SIZE, 3);
    }

    //#region RenderPipeline
    public async PrepareCommands(texture : Texture) {
        this._cacheTexture = texture;

        let gaussianBlurConfig = this._shaderManager.GetGaussianBlurConfig(this._cacheTexture.width, this._cacheTexture.height);
        
        this._guassianFBO = this._cycleBuffer.GetFrameBufferByIndex(0);
        this._sobelFBO = this._cycleBuffer.GetFrameBufferByIndex(1);
        this._cornerFBO = this._cycleBuffer.GetFrameBufferByIndex(2);

        this._gaussianBlurCommand = this._shaderManager.CreateActionCommand(gaussianBlurConfig);
        
        this._sobelEdgeCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetSobelEdgeConfig());
        this._harrisCornerCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetCornerConfig(this._guassianFBO, this._sobelFBO));

        this._renderTexCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetRenderConfig(this._cornerFBO));
    }

    public async ProcessPrefacePipeline() {
        if (this._cacheTexture == null) return;

        ProcessREGLCommand(this._guassianFBO, this._gaussianBlurCommand, {u_mainTex : this._cacheTexture});
        ProcessREGLCommand(this._sobelFBO, this._sobelEdgeCommand, {u_mainTex : this._guassianFBO, u_texSize : [this._cycleBuffer.Width, this._cycleBuffer.Height]});
        ProcessREGLCommand(this._cornerFBO, this._harrisCornerCommand);

        this._renderTexCommand();
    }

    //#endregion
}