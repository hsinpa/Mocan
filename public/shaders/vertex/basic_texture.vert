
//.vert
export let BasicTextureVert = `
precision mediump float;

attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;
varying vec2 v_vertex;

void main() {
    gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
    v_vertex = vec2(gl_Position.x, gl_Position.y);
    v_uv = a_uv;
}
`;