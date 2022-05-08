import WebglCanvas from './Utility/WebGL/WebglCanvas';
import {GetRectShape, FBO_SIZE} from './REGL/RectShape';
import ShaderManager from './Shader/ShaderManager';
import Materials from './Utility/WebGL/Materials';
import {MaterialList} from './Utility/WebGL/WebglType';
import HarrisCorner from './FeaturePoints/HarrisCorner';
import FrameBufferHelper from './Shader/FrameBufferHelper';
import TextureManager from './Utility/TextureManager';
import ScaledPyramid from './FeaturePoints/ScaledPyramid';
import REGL, { Regl } from 'regl';
import HarrisLaplace from './FeaturePoints/HarrisLaplace';

export default class WebAR extends WebglCanvas {

    private _textureManager : TextureManager;
    private _materials : Materials;
    private _shaderManager : ShaderManager;
    private _harrisCorner : HarrisCorner;
    private _harrisLaplaceCorner : HarrisLaplace;

    private _frameBufferHelper : FrameBufferHelper;

    private _scaledPyramid : ScaledPyramid;
    private _inputTexture : REGL.Texture;

    constructor(webglQuery : string) {
        super(webglQuery);
    }

    async SetUp(materials_json: MaterialList) {
        this._reglContext = await this.CreatREGLCanvas(this._webglDom);
        this._textureManager = new TextureManager(this._reglContext);

        this._materials = new Materials();
        await this._materials.AsyncSetUp(materials_json);
        
        this._frameBufferHelper = new FrameBufferHelper(this._reglContext);
        this._shaderManager = new ShaderManager(this._reglContext, this._materials);
        this._harrisCorner = new HarrisCorner(this._shaderManager, this._frameBufferHelper);
        this._harrisCorner.SetConfig(this.CanvasWidth, this.CanvasHeight, 0.04, 5, 10000);
        this._harrisLaplaceCorner = new HarrisLaplace(this._shaderManager, this._frameBufferHelper);

        this._scaledPyramid = new ScaledPyramid(this._shaderManager, this._frameBufferHelper);

        this._inputTexture = await this._textureManager.GetREGLTexture("./texture/landscape_sample_01.jpg");
        this._harrisCorner.PrepareCommands(this._inputTexture);

        this._harrisLaplaceCorner.Config(this.CanvasWidth, this.CanvasHeight, 1024);
    }

    async Render() {
        this._harrisCorner.ProcessPrefacePipeline();

        // this._scaledPyramid.ProcessBlurPipeline(this._inputTexture);
        // this._scaledPyramid.Preview();
    }
}