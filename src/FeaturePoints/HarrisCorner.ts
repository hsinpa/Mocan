import {CreateCanvasREGLCommand} from '../REGL/REGLCommands';
import ShaderManager from '../Shader/ShaderManager';
import {DrawCommand, Regl, Texture} from 'regl';
import FrameBufferHelper from '../Shader/FrameBufferHelper';


export default class HarrisCorner {

    private _cacheTexture : Texture;
    private _k : number;
    private _window_size : number;
    private _threshold : number;
    private _shaderManager : ShaderManager;
    private _frameBuffers : FrameBufferHelper

    private _gaussianBlurCommand : DrawCommand;
    private _sobelXCommand : DrawCommand;
    private _sobelYCommand : DrawCommand;

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
        let sobelXFBO = this._frameBuffers.GetFrameBufferByIndex(1);
        let sobelYFBO = this._frameBuffers.GetFrameBufferByIndex(2);

        this._gaussianBlurCommand = this._shaderManager.CreateActionCommand(gaussianBlurConfig, guassianFBO);
        
        this._sobelXCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetSobelEdgeXConfig(guassianFBO), sobelXFBO);
        this._sobelYCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetSobelEdgeYConfig(guassianFBO), sobelYFBO);
    }

    public async ProcessPrefacePipeline() {
        if (this._cacheTexture == null) return;

        this._gaussianBlurCommand();
        this._sobelXCommand();
        this._sobelYCommand();

        let sobelXFBO = this._frameBuffers.GetFrameBufferByIndex(1);
        let sobelYFBO = this._frameBuffers.GetFrameBufferByIndex(2);


        let result = await this._frameBuffers.ReadAsyncBufferPixel(sobelXFBO);
        console.log(result);
    }

    //#endregion
}