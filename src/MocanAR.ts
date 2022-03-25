import WebglCanvas from './Utility/WebGL/WebglCanvas';
import {GetRectShape} from './REGL/RectShape';
import ShaderManager from './Shader/ShaderManager';
import Materials from './Utility/WebGL/Materials';
import {MaterialList} from './Utility/WebGL/WebglType';

export default class WebAR extends WebglCanvas {

    private _materials : Materials;
    private _shaderManager : ShaderManager;

    constructor(webglQuery : string) {
        super(webglQuery);
    }

    async SetUp(materials_json: MaterialList) {
        this._materials = new Materials();
        await this._materials.AsyncSetUp(materials_json);
        
        this._shaderManager = new ShaderManager(this._materials);
        let rectShape = GetRectShape();


    }

}