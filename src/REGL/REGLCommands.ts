import REGL, {Framebuffer, Regl, Texture, Texture2D} from 'regl';


export function CreateCanvasREGLCommand(regl : Regl, vertex : string, fragment : string, frameBuffer : Framebuffer, attributes : any, uniforms : any, vertex_count: number) 
{
    return regl({
        framebuffer : frameBuffer,

        frag: fragment,
        vert: vertex,

        attributes: attributes,
        uniforms: uniforms,

        count: vertex_count
    });
};