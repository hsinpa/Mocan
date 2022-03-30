import {MeshShapeStruct} from "../Utility/WebGL/WebglType";

export const FBO_SIZE = 128;

export function GetRectShape() : MeshShapeStruct  {
    let meshType : MeshShapeStruct = {
        vertices : GetQuadVertex(),
        uv : GetQuadUV(),
        normal : GetQuadNormal(),
        count : 6
    };

    return meshType
}

function GetQuadVertex() : number[] {

    return [-1, -1,
        -1, 1,
        1, -1,
        1, -1,
        -1, 1,
        1, 1];
}

function GetQuadUV() : number[] {
    return [0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1];
}

function GetQuadNormal() : number[] {
    return [0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1];
}