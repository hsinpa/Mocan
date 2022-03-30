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

        let offset = Math.floor(this._window_size / 2);
        let y_range = this._frameBuffers.OutputHeight - offset;
        let x_range = this._frameBuffers.OutputWidth - offset;
        
        let sobelXFBO = this._frameBuffers.GetFrameBufferByIndex(1);
        let sobelYFBO = this._frameBuffers.GetFrameBufferByIndex(2);

        let xGradientArray = await this._frameBuffers.ReadAsyncBufferPixel(sobelXFBO);
        let yGradientArray = await this._frameBuffers.ReadAsyncBufferPixel(sobelYFBO);
        let dx : any = numjs.uint32(xGradientArray);
            dx = dx.reshape(this._frameBuffers.OutputWidth, this._frameBuffers.OutputHeight);
        let dy : any = numjs.uint32(yGradientArray);
            dy = dy.reshape(this._frameBuffers.OutputWidth, this._frameBuffers.OutputHeight);

        let Ixx = dx.pow(2);
        let Ixy = numjs.multiply(dx, dy);
        let Iyy = dy.pow(2);
        // console.log(Ixx);
        // console.log(Ixy);
        // console.log(Iyy);

        //console.log(ynumGradient);

        for (let y = offset; y < y_range; y++) {
            for (let x = offset; x < x_range; x++) {
                //Values of sliding window
                let start_y = y - offset
                let end_y = y + offset + 1
                let start_x = x - offset
                let end_x = x + offset + 1
                
                //console.log(start_y, end_y,  start_x,  end_x);
            
                //The variable names are representative to 
                //the variable of the Harris corner equation
                let windowIxx = Ixx.slice([start_y, end_y], [start_x, end_x]);
                let windowIxy = Ixy.slice([start_y, end_y], [start_x, end_x]);
                let windowIyy = Iyy.slice([start_y, end_y], [start_x, end_x]);


                let Sxx = windowIxx.sum();
                let Sxy = windowIxy.sum();
                let Syy = windowIyy.sum();

                

            }
        }
    }

    //#endregion
}