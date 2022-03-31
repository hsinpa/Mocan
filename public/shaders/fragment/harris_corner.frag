precision highp float;

uniform sampler2D u_mainTex;
uniform sampler2D u_sobelTex;
uniform float u_threshold;
uniform float u_k;

uniform vec2 u_texSize;

varying vec2 v_uv;  
varying vec2 v_vertex;

vec4 GetColorWithUV(vec2 uv, float offset_x, float offset_y) {

    float offsetX = (uv.x * u_texSize.x + offset_x) / u_texSize.x;
    float offsetY = (uv.y * u_texSize.y + offset_y ) / u_texSize.y;

    vec2 offsetuv = vec2(offsetX, offsetY);
    vec4 tex = texture2D(u_sobelTex, offsetuv);

    return tex;
}

vec4 ProcessConvolution(vec2 uv) {
    vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);

    //Top 
    finalColor += GetColorWithUV(v_uv, -1.0, 1.0);
    finalColor += GetColorWithUV(v_uv, 0.0, 1.0);
    finalColor += GetColorWithUV(v_uv, 1.0, 1.0);

    //Middle
    finalColor += GetColorWithUV(v_uv, -1.0, 0.0);
    finalColor += GetColorWithUV(v_uv, 0.0, 0.0);
    finalColor += GetColorWithUV(v_uv, 1.0, 0.0);

    //Bottom
    finalColor += GetColorWithUV(v_uv, -1.0, -1.0);
    finalColor += GetColorWithUV(v_uv, 0.0, -1.0);
    finalColor += GetColorWithUV(v_uv, 1.0, -1.0);

    return (finalColor) / 9.0;
}

float CalDet(float Ixx, float Iyy, float Ixy) {
    return (Ixx * Iyy) - (Ixy * Ixy);
}

float CalTrace(float Ixx, float Iyy) {
    return Ixx + Iyy;
}

void main() {
    vec4 tex = texture2D(u_mainTex, v_uv);

    vec4 conv = ProcessConvolution(v_uv);
    //float k = 0.04;

    float det = CalDet(conv.x, conv.y, conv.z);
    float trace = CalTrace(conv.x, conv.y);
    float R = det - (u_k * (trace*trace));

    vec4 pointCol = vec4(0.0, 1.0, 0.0, 1.0);

    if (R > u_threshold) {
        tex = pointCol;
    }

    gl_FragColor = tex;
}