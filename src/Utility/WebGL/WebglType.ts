import { Framebuffer } from "regl";

export interface GLSLDataSet {
    vertex_shader : string;
    fragment_shader : string;
}

export interface MaterialDataSet {
    name : string, 
    glsl : GLSLDataSet
}

export interface MaterialList {
    materials : MaterialDataSet[], 
}

export interface MeshShapeStruct {
    vertices: number[],
    uv : number[],
    normal: number[],
    count: number
}

export interface ShaderConfigStruct {
    material : GLSLDataSet,
    attributes : any,
    uniform : any,
    vertex_count: number,
}