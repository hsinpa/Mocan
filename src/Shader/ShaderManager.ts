import {ShaderConfigStruct, MaterialDataSet, MeshShapeStruct, MaterialList} from "../Utility/WebGL/WebglType";
import Materials from "../Utility/WebGL/Materials";
import {Shaders} from "./ShaderStaticFlag";
import {GetRectShape} from "../REGL/RectShape";
import REGL, {Framebuffer, Regl, Texture, Texture2D, Vec2} from 'regl';
import {CreateCanvasREGLCommand} from '../REGL/REGLCommands'

export default class ShaderManager {
    
    private _materials : Materials;
    private _rectShape : MeshShapeStruct;
    private _regl : Regl;

    constructor(regl : Regl, materials : Materials) {
        this._regl = regl;
        this._materials = materials;
        this._rectShape = GetRectShape();
    }

    //#region REGLCommands
    CreateActionCommand( config : ShaderConfigStruct) {
        return CreateCanvasREGLCommand(this._regl, config.material.vertex_shader, config.material.fragment_shader, null, config.attributes, config.uniform, config.vertex_count);
    }

    //#endregion

    //#region Config
    GetGaussianBlurConfig(input : Texture) : ShaderConfigStruct{

        console.log(`Width ${input.width}, Height ${input.height}`);
        let material = this._materials.get_shader(Shaders.GaussianBlur);
        let shaderConfig = this.GetGeneralShaderConfig(material);
        shaderConfig.uniform = this.GetGaussianUniform(input);

        return shaderConfig;
    }
    
    GetSobelEdgeXConfig() {
    
    }
    
    GetSobelEdgeYConfig() {
    
    }

    private GetGaussianUniform(texture : Texture) {
        return {
            u_mainTex : texture,
            u_texSize : [texture.width, texture.height]
            // u_texSize : this._regl.prop<any, "u_texSize">("u_texSize")
        }
    }

    private GetGeneralShaderConfig(material : MaterialDataSet) : ShaderConfigStruct {
        return {
            material : material.glsl,
            attributes : this.GetGeneralAttributes(), 
            vertex_count : this._rectShape.count,
            uniform : {}
        }
    }

    private GetGeneralAttributes() {
        return {
            a_position: this._rectShape.vertices,
            a_uv :  this._rectShape.uv,
        }
    }
    //#endregion

}