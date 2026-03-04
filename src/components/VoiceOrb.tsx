"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

function OrbMesh({ state }: { state: "idle" | "listening" | "processing" }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const { mouse, viewport } = useThree();

    // Initial Idle Animation setup
    useEffect(() => {
        if (!meshRef.current || !materialRef.current) return;

        const ctx = gsap.context(() => {
            if (state === "idle") {
                gsap.to(meshRef.current!.scale, {
                    x: 1.06, y: 1.06, z: 1.06,
                    duration: 1.5,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                });
                gsap.to(materialRef.current!, {
                    emissiveIntensity: 0.1,
                    duration: 1,
                });
            } else if (state === "listening") {
                // Spring overshoot on scale
                gsap.to(meshRef.current!.scale, {
                    x: 1.3, y: 1.3, z: 1.3,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.5)",
                });
                gsap.to(materialRef.current!, {
                    emissiveIntensity: 0.8,
                    duration: 0.4,
                });
            } else if (state === "processing") {
                gsap.to(meshRef.current!.scale, {
                    x: 1.15, y: 1.15, z: 1.15,
                    duration: 0.4,
                    ease: "back.out(1.5)",
                });
                gsap.to(meshRef.current!.rotation, {
                    y: "+=" + Math.PI * 2,
                    duration: 0.4,
                    ease: "expo.out",
                });
            }
        });

        return () => ctx.revert();
    }, [state]);

    useFrame((stateObj, delta) => {
        if (!meshRef.current) return;

        // Continuous idle rotation
        if (state === "idle") {
            meshRef.current.rotation.y += 0.003;
            meshRef.current.rotation.x = Math.sin(stateObj.clock.elapsedTime * 0.4) * 0.12;
        } else if (state === "processing") {
            meshRef.current.rotation.y += 0.009; // 3x faster
            // Simulated vertex noise displacement in a shader would typically go here 
            // but without a custom ShaderMaterial we'll simulate visual chaos with scaling
            meshRef.current.scale.x = 1.15 + Math.sin(stateObj.clock.elapsedTime * 20) * 0.05;
            meshRef.current.scale.y = 1.15 + Math.cos(stateObj.clock.elapsedTime * 23) * 0.05;
            meshRef.current.scale.z = 1.15 + Math.sin(stateObj.clock.elapsedTime * 17) * 0.05;
        }

        // Mouse Parallax (only in idle)
        if (state === "idle") {
            // Mouse coordinates are -1 to 1 in R3F
            const targetRotX = (mouse.y * viewport.height) * 0.05;
            const targetRotY = (mouse.x * viewport.width) * 0.05;

            meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.05;
            meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.05;
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[1.4, 6]} />
            <meshStandardMaterial
                ref={materialRef}
                color="#1A0F08"
                emissive="#E8602C"
                emissiveIntensity={0.1}
                roughness={0.15}
                metalness={0.8}
            />
        </mesh>
    );
}

function SoundRings({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (!groupRef.current) return;

        const rings = groupRef.current.children as THREE.Mesh[];

        if (active) {
            const tl = gsap.timeline();
            rings.forEach((ring, i) => {
                // Reset
                gsap.set(ring.scale, { x: 1, y: 1, z: 1 });
                gsap.set(ring.material as THREE.MeshBasicMaterial, { opacity: 0.8 });

                tl.to(
                    ring.scale,
                    {
                        x: 1.7, y: 1.7, z: 1.7,
                        duration: 1.5,
                        ease: "power2.out",
                    },
                    i * 0.15 // Stagger
                );
                tl.to(
                    ring.material as THREE.MeshBasicMaterial,
                    {
                        opacity: 0,
                        duration: 1.5,
                        ease: "power2.out",
                    },
                    i * 0.15
                );
            });
        } else {
            // Collapse
            rings.forEach((ring) => {
                gsap.to(ring.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
                gsap.to(ring.material as THREE.MeshBasicMaterial, { opacity: 0, duration: 0.4 });
            });
        }
    }, [active]);

    return (
        <group ref={groupRef}>
            {[0, 1, 2].map((i) => (
                <mesh key={i}>
                    <torusGeometry args={[1.5, 0.01, 16, 100]} />
                    <meshBasicMaterial color="#E8602C" transparent opacity={0} depthWrite={false} />
                </mesh>
            ))}
        </group>
    );
}

export default function VoiceOrb() {
    const [orbState, setOrbState] = useState<"idle" | "listening" | "processing">("idle");
    const containerRef = useRef<HTMLDivElement>(null);

    // Status text
    const statusLabels = {
        idle: "",
        listening: "Listening…",
        processing: "Got it. Searching…",
    };

    const handleClick = () => {
        if (orbState === "idle") {
            setOrbState("listening");
            // Simulate processing after 3s
            setTimeout(() => setOrbState("processing"), 3000);
            // Simulate done after 5s
            setTimeout(() => setOrbState("idle"), 5000);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-[300px] h-[300px] cursor-none flex flex-col items-center justify-center"
            onClick={handleClick}
            role="button"
            data-cursor={orbState === "idle" ? "orb-idle" : "orb-active"}
        >
            <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
                    <ambientLight color="#F5EDD6" intensity={0.3} />
                    <pointLight color="#E8602C" position={[2, 2, 2]} intensity={3} />
                    <pointLight color="#FFFFFF" position={[-3, -1, -2]} intensity={0.8} />

                    <OrbMesh state={orbState} />
                    <SoundRings active={orbState === "listening"} />
                </Canvas>
            </div>

            <div
                className={`absolute -bottom-8 font-mono text-sm tracking-widest text-accent transition-opacity duration-300 ${orbState !== "idle" ? "opacity-100" : "opacity-0"
                    }`}
            >
                {statusLabels[orbState]}
            </div>
        </div>
    );
}
