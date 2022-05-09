import { DrawCommand } from "regl";
import { FBO_SIZE } from "../REGL/RectShape";
import FrameBufferHelper from "../Shader/FrameBufferHelper";
import ShaderManager from "../Shader/ShaderManager";
import ScaledPyramid from "./ScaledPyramid";
import {RescaleSize} from "../Utility/UtilityMethod";
import CycleBuffer from "../Shader/CycleBuffer";


export default class HarrisLaplace {

    _scaledPyramid : ScaledPyramid;
    _pyramidCornerCommand : DrawCommand;
    _shaderManager : ShaderManager;
    _frameBuffers : FrameBufferHelper;
    _cycleFBOBuffer  : CycleBuffer;

    constructor(shaderManager : ShaderManager, frameBuffers : FrameBufferHelper) {
        this._scaledPyramid = new ScaledPyramid(shaderManager, frameBuffers);
        this._shaderManager = shaderManager;
        this._frameBuffers = frameBuffers;
    }

    Config(inputTexWidth: number, inputTexHeight : number, targetSize : number) {
        this._cycleFBOBuffer = this._frameBuffers.CreateCycleBuffer(inputTexWidth, inputTexHeight, targetSize, 2);
        this._scaledPyramid.Config(inputTexWidth, inputTexHeight, targetSize, 4, 4);
        this._pyramidCornerCommand = this._shaderManager.CreateActionCommand(this._shaderManager.GetPyramidCornerConfig(inputTexWidth, inputTexHeight));
    }
    
    ProcessScaleCornerDetection() {
        let pyramids = this._scaledPyramid.Pyramid;
        let pyramidLens = pyramids.length;
        
        for (let i = 0; i < pyramidLens; i++) {



        }
    }

    ProcessCommand() {
        
    }    
}