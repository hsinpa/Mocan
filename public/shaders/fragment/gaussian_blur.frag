precision highp float;

uniform sampler2D u_mainTex;
uniform vec2 u_texSize;

varying vec2 v_uv;  
varying vec2 v_vertex;  

const float TWO_PI = 6.28319;
const float E = 2.71828;
const float THRESHOLD = 2.71828;
const float KERNEL_SIZE = 5.0;

vec4 LuminanceGrayscale(vec4 color) {
    float gray = color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
    return vec4(gray, gray, gray, 1.0);
}

vec4 GetColorWithUV(vec2 uv, float weight, float offset_x, float offset_y) {

    float offsetX = (uv.x * u_texSize.x + offset_x) / u_texSize.x;
    float offsetY = (uv.y * u_texSize.y + offset_y ) / u_texSize.y;

    vec2 offsetuv = vec2(offsetX, offsetY);
    vec4 tex = texture2D(u_mainTex, offsetuv);

    return LuminanceGrayscale(tex) * weight;
}

void main() {
    vec4 mainTex = texture2D(u_mainTex, v_uv);
    vec4 grayscale = LuminanceGrayscale(mainTex);

    float scale = 1.0 / 16.0;
    vec4 color = vec4(0,0,0,0);

    //Top 
    color += GetColorWithUV(v_uv, 1.0, -1.0, 1.0);
    color += GetColorWithUV(v_uv, 2.0, 0.0, 1.0);
    color += GetColorWithUV(v_uv, 1.0, 1.0, 1.0);

    //Middle
    color += GetColorWithUV(v_uv, 2.0, -1.0, 0.0);
    color += GetColorWithUV(v_uv, 4.0, 0.0, 0.0);
    color += GetColorWithUV(v_uv, 2.0, 1.0, 0.0);

    //Bottom
    color += GetColorWithUV(v_uv, 1.0, -1.0, -1.0);
    color += GetColorWithUV(v_uv, 2.0, 0.0, -1.0);
    color += GetColorWithUV(v_uv, 1.0, 1.0, -1.0);

    color *= scale;

    color.w = 1.0;
    gl_FragColor = color;
    //gl_FragColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);

}