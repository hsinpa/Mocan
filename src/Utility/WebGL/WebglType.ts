export interface GLSLDataSet {
    name : string, 
    vertex_shader : string;
    fragment_shader : string;
}


export interface MaterialList {
    materials : GLSLDataSet[], 
}
