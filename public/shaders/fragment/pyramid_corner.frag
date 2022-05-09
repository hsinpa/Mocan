precision highp float;

uniform sampler2D u_mainTex;
uniform sampler2D u_pyramidScaleTex;
uniform vec2 u_texSize;

varying vec2 v_uv;  
varying vec2 v_vertex;

void main() {
    vec4 tex = texture2D(u_mainTex, v_uv);

    gl_FragColor = tex;
}