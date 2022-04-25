import REGL, {DrawCommand, Framebuffer, Framebuffer2D, Regl, Texture, Texture2D} from 'regl';


export function CreateCanvasREGLCommand(regl : Regl, vertex : string, fragment : string, attributes : any, uniforms : any, vertex_count: number) 
{
    return regl({
        //framebuffer : frameBuffer,

        frag: fragment,
        vert: vertex,

        attributes: attributes,
        uniforms: uniforms,

        count: vertex_count
    });
};

export function ProcessREGLCommand(frameBuffer : Framebuffer2D, drawCommand : DrawCommand, properties : any = {}) {

    if (frameBuffer != null) {

        frameBuffer.use(function() {
            drawCommand(properties);
        });

        return;
    }
    
    drawCommand(properties);
}