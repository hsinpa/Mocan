import {ShaderConfigStruct, MaterialDataSet, MeshShapeStruct, MaterialList} from "../Utility/WebGL/WebglType";
import Materials from "../Utility/WebGL/Materials";
import {Shaders} from "./ShaderStaticFlag";
import {GetRectShape, FBO_SIZE} from "../REGL/RectShape";
import REGL, {Framebuffer, Framebuffer2D, Regl, Texture, Texture2D, Vec2} from 'regl';
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
        return CreateCanvasREGLCommand(this._regl, config.material.vertex_shader, config.material.fragment_shader, config.attributes, config.uniform, config.vertex_count);
    }

    //#endregion

    //#region Config
    GetGaussianBlurConfig(width : number, height : number) : ShaderConfigStruct{
        let material = this._materials.get_shader(Shaders.GaussianBlur);
        let shaderConfig = this.GetGeneralShaderConfig(material);
        shaderConfig.uniform = this.GetGaussianUniform( width, height);

        return shaderConfig;
    }
    
    public GetSobelEdgeConfig() {
        return this.GetMatConfig(Shaders.SobelEdge, this.GetSobelEdgeUniform());
    }

    public GetCornerConfig(blurFBO: Framebuffer2D, sobelFBO : Framebuffer2D) {
        return this.GetMatConfig(Shaders.HarrisCorner, this.GetCornerUniform(blurFBO, sobelFBO, FBO_SIZE));
    }

    public GetRenderConfig(input : Framebuffer2D) {        
        return this.GetMatConfig(Shaders.RenderTexture, {u_mainTex : input});
    }

    private GetMatConfig(material_name : string, uniforms: any ) {
        let material = this._materials.get_shader(material_name);
        let shaderConfig = this.GetGeneralShaderConfig(material);
        shaderConfig.uniform = uniforms;
        return shaderConfig;
    }

    private GetSobelKernelX() {
        return [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    }

    private GetSobelKernelY() {
        return [1, 2, 1, 0, 0, 0, -1, -2, -1];
    }

    private GetGaussianUniform(width : number, height : number) {
        return {
            u_mainTex : this._regl.prop<any, "u_mainTex">("u_mainTex"),
            u_texSize : [width, height]
        }
    }

    private GetSobelEdgeUniform() {
        return {
            u_mainTex : this._regl.prop<any, "u_mainTex">("u_mainTex"),
            u_texSize : this._regl.prop<any, "u_texSize">("u_texSize"),
            u_kernel_x : this.GetSobelKernelX(),
            u_kernel_y : this.GetSobelKernelY()
        }
    }

    private GetCornerUniform(blurFBO: Framebuffer2D, sobelFBO : Framebuffer2D, size : number) {
        return {
            u_mainTex : blurFBO,
            u_sobelTex : sobelFBO,
            u_texSize : [size, size],
            u_threshold : 0.03,
            u_k : 0.04,
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