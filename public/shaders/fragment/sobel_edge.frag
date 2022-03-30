precision highp float;

uniform sampler2D u_mainTex;
uniform vec2 u_texSize;
uniform mat3 u_kernel;

varying vec2 v_uv;  
varying vec2 v_vertex;

float Normalize(float v, float s, float n) {
    return (v + s) / n;
}

vec4 GetColorWithUV(vec2 uv, float weight, float offset_x, float offset_y) {

    float offsetX = (uv.x * u_texSize.x + offset_x) / u_texSize.x;
    float offsetY = (uv.y * u_texSize.y + offset_y ) / u_texSize.y;

    vec2 offsetuv = vec2(offsetX, offsetY);
    vec4 tex = texture2D(u_mainTex, offsetuv);

    return tex * weight;
}

void main() {
    vec4 mainTex = texture2D(u_mainTex, v_uv);

    vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);

    //Top 
    finalColor += GetColorWithUV(v_uv, u_kernel[0][0], -1.0, 1.0);
    finalColor += GetColorWithUV(v_uv, u_kernel[0][1], 0.0, 1.0);
    finalColor += GetColorWithUV(v_uv, u_kernel[0][2], 1.0, 1.0);

    //Middle
    finalColor += GetColorWithUV(v_uv, u_kernel[1][0], -1.0, 0.0);
    finalColor += GetColorWithUV(v_uv, u_kernel[1][1], 0.0, 0.0);
    finalColor += GetColorWithUV(v_uv, u_kernel[1][2], 1.0, 0.0);

    //Bottom
    finalColor += GetColorWithUV(v_uv, u_kernel[2][0], -1.0, -1.0);
    finalColor += GetColorWithUV(v_uv, u_kernel[2][1], 0.0, -1.0);
    finalColor += GetColorWithUV(v_uv, u_kernel[2][2], 1.0, -1.0);
    finalColor /= 6.0;
    finalColor.w = 1.0;

    gl_FragColor = finalColor;
}