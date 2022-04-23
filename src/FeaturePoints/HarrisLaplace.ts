import FrameBufferHelper from "../Shader/FrameBufferHelper";
import ShaderManager from "../Shader/ShaderManager";
import ScaledPyramid from "./ScaledPyramid";


export default class HarrisLaplace {

    _scaledPyramid : ScaledPyramid;

    constructor(shaderManager : ShaderManager, frameBuffers : FrameBufferHelper) {
        this._scaledPyramid = new ScaledPyramid(shaderManager, frameBuffers);
    }

    Config(inputTexWidth: number, inputTexHeight : number, targetSize : number) {
        this._scaledPyramid.Config(inputTexWidth, inputTexHeight, targetSize, 4, 4);
    }
    
    
    
}