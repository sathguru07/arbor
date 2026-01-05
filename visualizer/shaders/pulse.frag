#include <flutter/runtime_effect.glsl>

uniform vec2 uCenter;
uniform vec3 uColor;
uniform float uProgress; // 0.0 to 1.0
uniform float uRadius;

out vec4 fragColor;

void main() {
    vec2 pos = FlutterFragCoord().xy;
    float dist = distance(pos, uCenter);
    
    // Create a expanding ring
    float innerR = uRadius * uProgress;
    float width = 30.0;
    
    // Smooth pulse ring
    // 1.0 when dist is in [innerR, innerR + width]
    float ring = smoothstep(innerR, innerR + 10.0, dist) * (1.0 - smoothstep(innerR + width - 10.0, innerR + width, dist));
    
    // Fade out as it expands
    float alpha = ring * (1.0 - uProgress) * 0.8;
    
    fragColor = vec4(uColor * alpha, alpha);
}
