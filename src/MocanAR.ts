import WebglCanvas from './Utility/WebGL/WebglCanvas';
import {GetRectShape, FBO_SIZE} from './REGL/RectShape';
import ShaderManager from './Shader/ShaderManager';
import Materials from './Utility/WebGL/Materials';
import {MaterialList} from './Utility/WebGL/WebglType';
import HarrisCorner from './FeaturePoints/HarrisCorner';
import FrameBufferHelper from './Shader/FrameBufferHelper';
import TextureManager from './Utility/TextureManager';

export default class WebAR extends WebglCanvas {

    private _textureManager : TextureManager;
    private _materials : Materials;
    private _shaderManager : ShaderManager;
    private _harrisCorner : HarrisCorner;
    private _frameBufferHelper : FrameBufferHelper;

    constructor(webglQuery : string) {
        super(webglQuery);
    }

    async SetUp(materials_json: MaterialList) {
        this._reglContext = await this.CreatREGLCanvas(this._webglDom);
        this._textureManager = new TextureManager(this._reglContext);

        this._materials = new Materials();
        await this._materials.AsyncSetUp(materials_json);
        
        this._frameBufferHelper = new FrameBufferHelper(this._reglContext, this.CanvasWidth, this.CanvasHeight, FBO_SIZE);
        this._shaderManager = new ShaderManager(this._reglContext, this._materials);
        this._harrisCorner = new HarrisCorner(this._shaderManager, this._frameBufferHelper);
        this._harrisCorner.SetConfig(0.04, 5, 10000);

        let initTexture = await this._textureManager.GetREGLTexture("./texture/landscape_sample_01.jpg");
        this._harrisCorner.PrepareCommands(initTexture);
    }

    async Render() {
        return await this._harrisCorner.ProcessPrefacePipeline();
    }
}