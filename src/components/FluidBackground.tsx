"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

// Simple 2D noise
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// 3 Octave FBM
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 3; ++i) {
        value += amplitude * noise(st);
        st = rot * st * 2.0 + shift;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    // Mouse swirl distortion
    float dist = distance(st, uMouse);
    float swirl = exp(-dist * 5.0) * 0.5;
    
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00 * uTime );
    q.y = fbm( st + vec2(1.0) );

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime + swirl );
    r.y = fbm( st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime - swirl );

    float f = fbm(st + r);

    // Color palette matching prompt
    vec3 color1 = vec3(10.0/255.0, 10.0/255.0, 15.0/255.0); // #0A0A0F void black
    vec3 color2 = vec3(28.0/255.0, 9.0/255.0, 0.0/255.0);   // #1C0900 deep ember
    vec3 color3 = vec3(232.0/255.0, 96.0/255.0, 44.0/255.0) * 0.15; // #E8602C faintly

    vec3 finalColor = mix(color1, color2, clamp((f*f)*4.0, 0.0, 1.0));
    finalColor = mix(finalColor, color3, clamp(length(q), 0.0, 1.0));
    finalColor = mix(finalColor, color1, clamp(length(r.x), 0.0, 1.0));

    // Film grain override (+/- 0.02)
    float grain = (random(st + uTime) - 0.5) * 0.04;
    finalColor += grain;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

function FluidShaderPlane() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { viewport, size, mouse } = useThree();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }),
        [size]
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.1;
            // Convert R3F mouse (-1 to +1) to shader coordinates (0 to 1)
            const targetMouseX = (mouse.x + 1) / 2;
            const targetMouseY = (mouse.y + 1) / 2;

            // Lerp mouse
            materialRef.current.uniforms.uMouse.value.x += (targetMouseX - materialRef.current.uniforms.uMouse.value.x) * 0.05;
            materialRef.current.uniforms.uMouse.value.y += (targetMouseY - materialRef.current.uniforms.uMouse.value.y) * 0.05;

            // Update resolution on resize
            materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh ref={meshRef}>
            {/* Plane covering the whole screen, position coordinates ignore camera projection through vertex shader */}
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                depthWrite={false}
            />
        </mesh>
    );
}

export default function FluidBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none">
            <Canvas orthographic camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
                <FluidShaderPlane />
            </Canvas>
        </div>
    );
}
