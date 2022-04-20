//Features from Accelerated Segment Test
precision mediump float;

uniform sampler2D u_mainTex;
uniform float u_threshold;

uniform mat3 u_kernel_x;
uniform mat3 u_kernel_y;

varying vec2 v_uv;  
varying vec2 v_vertex;

void ImageMoment() {
    
}

void GuassianFilter() {

}

void main() {

    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}