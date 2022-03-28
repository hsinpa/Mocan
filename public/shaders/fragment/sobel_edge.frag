precision highp float;

uniform sampler2D u_mainTex;
uniform vec2 u_texSize;
uniform mat3 u_kernel;

varying vec2 v_uv;  
varying vec2 v_vertex;

void main() {
    gl_FragColor = vec4(1.0, 0.0 ,0.0, 1.0);
}