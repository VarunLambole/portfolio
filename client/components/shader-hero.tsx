"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowDown, Download } from "lucide-react"
import { HyperText } from "@/components/ui/hyper-text"
import type { HeroData } from "@/lib/data"

declare global {
    interface Window {
        THREE: any
    }
}

interface ShaderAnimationProps {
    heroData?: HeroData | null;
}

// Default values for hero section
const defaultHeroData = {
    heroTitle: "Varun Lambole",
    heroSubtitle: "Web Developer • ui/ux Designer",
};

export function ShaderAnimation({ heroData }: ShaderAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<{
        camera: any
        scene: any
        renderer: any
        uniforms: any
        animationId: number | null
    }>({
        camera: null,
        scene: null,
        renderer: null,
        uniforms: null,
        animationId: null,
    })

    // Parse hero title into first and last name
    const fullName = heroData?.heroTitle || defaultHeroData.heroTitle;
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || "Varun";
    const lastName = nameParts.slice(1).join(' ') || "Lambole";

    // Parse subtitle into parts (split by • or |)
    const subtitle = heroData?.heroSubtitle || defaultHeroData.heroSubtitle;
    const subtitleParts = subtitle.split(/[•|]/).map(s => s.trim()).filter(Boolean);
    const subtitle1 = subtitleParts[0] || "Web Developer";
    const subtitle2 = subtitleParts[1] || "ui/ux Designer";

    // Get resume URL
    const resumeUrl = heroData?.resumeUrl;

    useEffect(() => {
        // Load Three.js dynamically from CDN
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js"
        script.onload = () => {
            if (containerRef.current && window.THREE) {
                initThreeJS()
            }
        }
        document.head.appendChild(script)

        return () => {
            if (sceneRef.current.animationId) {
                cancelAnimationFrame(sceneRef.current.animationId)
            }
            if (sceneRef.current.renderer) {
                sceneRef.current.renderer.dispose()
            }
            if (document.head.contains(script)) {
                document.head.removeChild(script)
            }
        }
    }, [])

    const initThreeJS = () => {
        if (!containerRef.current || !window.THREE) return

        const THREE = window.THREE
        const container = containerRef.current

        // Clear any previous canvas
        container.innerHTML = ""

        // Vertex shader
        const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

        // Fragment shader — mosaic pixelated wave effect
        const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      float random (vec2 st) {
          return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))*
              43758.5453123);
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256.0, 256.0);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

        float t = time*0.06 + random(uv.x)*0.4;
        float lineWidth = 0.0008;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));
          }
        }

        gl_FragColor = vec4(color[2],color[1],color[0],1.0);
      }
    `

        // Initialize Three.js scene
        const camera = new THREE.Camera()
        camera.position.z = 1

        const scene = new THREE.Scene()
        // PlaneBufferGeometry matches Three.js r89 (CDN version)
        const geometry = new THREE.PlaneBufferGeometry(2, 2)

        const uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() },
        }

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const renderer = new THREE.WebGLRenderer()
        renderer.setPixelRatio(window.devicePixelRatio)
        container.appendChild(renderer.domElement)

        // Store references
        sceneRef.current = {
            camera,
            scene,
            renderer,
            uniforms,
            animationId: null,
        }

        // Handle resize using getBoundingClientRect (accurate for any container)
        const onWindowResize = () => {
            const rect = container.getBoundingClientRect()
            renderer.setSize(rect.width, rect.height)
            uniforms.resolution.value.x = renderer.domElement.width
            uniforms.resolution.value.y = renderer.domElement.height
        }

        onWindowResize()
        window.addEventListener("resize", onWindowResize, false)

        // Animation loop
        const animate = () => {
            sceneRef.current.animationId = requestAnimationFrame(animate)
            uniforms.time.value += 0.05
            renderer.render(scene, camera)
        }

        animate()

        // Cleanup inner resources when initThreeJS re-runs
        return () => {
            window.removeEventListener("resize", onWindowResize)
            cancelAnimationFrame(sceneRef.current.animationId!)
            renderer.dispose()
            geometry.dispose()
            material.dispose()
        }
    }

    return (
        <div className="relative w-full h-screen">
            <div
                ref={containerRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: "#000", overflow: "hidden" }}
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    {/* Status badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
                    >
                        <motion.span
                            className="w-2 h-2 rounded-full bg-[#6366F1]"
                            animate={{
                                opacity: [1, 0.5, 1],
                                boxShadow: [
                                    "0 0 10px #6366F1",
                                    "0 0 20px #6366F1",
                                    "0 0 10px #6366F1"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-sm font-mono text-white/80">Actively Exploring Opportunities</span>
                    </motion.div>

                    {/* Animated Name - Now Dynamic */}
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mix-blend-difference overflow-hidden">
                        <motion.span
                            className="block text-white"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {firstName}
                        </motion.span>
                        <motion.span
                            className="block bg-gradient-to-r from-[#818CF8] via-[#6366F1] to-[#4F46E5] bg-clip-text text-transparent"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {lastName}
                        </motion.span>
                    </h1>

                    {/* Subtitle with HyperText effect - Now Dynamic */}
                    <motion.div
                        className="mt-6 flex items-center justify-center gap-3 pointer-events-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        <HyperText
                            text={subtitle1}
                            className="text-xl md:text-2xl font-light tracking-wide text-[#818CF8]"
                            duration={600}
                        />
                        <span className="text-white/30 text-xl md:text-2xl">•</span>
                        <HyperText
                            text={subtitle2}
                            className="text-xl md:text-2xl font-light tracking-wide text-white/70"
                            duration={800}
                        />
                    </motion.div>

                    {/* Download Resume Button */}
                    {resumeUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                            className="mt-8 pointer-events-auto"
                        >
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-full bg-gradient-to-r from-[#6366F1] via-[#818CF8] to-[#4F46E5] text-white font-medium text-lg shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105"
                            >
                                {/* Animated background shimmer */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                                {/* Icon with bounce animation */}
                                <motion.span
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Download className="w-5 h-5" />
                                </motion.span>

                                <span className="relative">Download Resume</span>
                            </a>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <ArrowDown className="w-8 h-8 text-white/50" />
                </motion.div>
            </motion.div>
        </div>
    )
}
