import CycleBuffer from "../Shader/CycleBuffer";
import { Framebuffer2D } from "regl";

export interface ScalePyramidStruct {
    cycleBuffer : CycleBuffer,
    fbo : Framebuffer2D
    octave : number,
    size : number
}