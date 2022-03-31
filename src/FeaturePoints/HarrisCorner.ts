import {CreateCanvasREGLCommand} from '../REGL/REGLCommands';
import ShaderManager from '../Shader/ShaderManager';
import {DrawCommand, Regl, Texture} from 'regl';
import FrameBufferHelper from '../Shader/FrameBufferHelper';
import numjs from 'numjs';

export default class HarrisCorner {

    private _cacheTexture : Texture;
    private _k : number;
    private _window_size : number;
    private _threshold : number;
    private _shaderManager : ShaderManager;
    private _frameBuffers : FrameBufferHelper

    private _gaussianBlurCommand : DrawCommand;
    private _sobelEdgeCommand : DrawCommand;
    private _harrisCornerCommand : DrawCommand;
    private _renderTexCommand : DrawCommand;

    constructor(shaderManager : ShaderManager, frameBuffers : FrameBufferHelper) {
        this._shaderManager = shaderManager;
        this._frameBuffers = frameBuffers;
    }

    SetConfig(k : number, window_size : number, threshold : number) {
        this._k = k;
        this._window_size = window_size;
        this._threshold = threshold;
    }

    //#region RenderPipeline
    public async PrepareCommands(texture : Texture) {
        this._cacheTexture = texture;

        let gaussianBlurConfig = this._shaderManager.GetGaussianBlurConfig(this._cacheTexture);
        let guassianFBO = this._frameBuffers.GetFrameBufferByIndex(0);
        let sobelFBO = this._frameBuffers.GetFrameBufferByIndex(1);
        let cornerFBO = this._frameBuffers.GetFrameBufferByIndex(2);

        this._gaussianBlurCommand = this._shaderManager.CreateActionCommand(gaussianBlurConfig, guassianFBO);
        
        this._sobelEdgeCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetSobelEdgeConfig(guassianFBO), sobelFBO);
        this._harrisCornerCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetCornerConfig(guassianFBO, sobelFBO), cornerFBO);

        this._renderTexCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetRenderConfig(cornerFBO), null);
    }

    public async ProcessPrefacePipeline() {
        if (this._cacheTexture == null) return;

        this._gaussianBlurCommand();
        this._sobelEdgeCommand();
        this._harrisCornerCommand();
        this._renderTexCommand();
    }

    //#endregion
}