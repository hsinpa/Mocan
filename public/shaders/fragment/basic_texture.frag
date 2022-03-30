precision lowp float;

uniform sampler2D u_mainTex;
varying vec2 v_uv;  
varying vec2 v_vertex;

void main() {
    vec4 mainTex = texture2D(u_mainTex, v_uv);
    gl_FragColor = mainTex;
}