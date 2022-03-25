import {ShaderConfigStruct, MaterialDataSet} from "../Utility/WebGL/WebglType";
import Materials from "../Utility/WebGL/Materials";
import {Shaders} from "./ShaderStaticFlag";

export default class ShaderManager {
    
    private _materials : Materials;

    constructor(materials : Materials) {
        this._materials = materials;
    }

    GetGuassianBlurConfig() {
        let material = this._materials.get_shader(Shaders.GuassianBlur);
        
    }
    
    GetSobelEdgeXConfig() {
    
    }
    
    GetSobelEdgeYConfig() {
    
    }


}