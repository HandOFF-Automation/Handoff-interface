import { useEffect, useRef } from 'react'
import { MotionValue } from 'framer-motion'
import * as THREE from 'three'
import { getCryptoLogoUrl } from '../../../utils/logo-dev'

type WormholeProps = {
    progress?: MotionValue<number>
    theme?: 'light' | 'dark'
}

// Helper to generate circular glowing dot texture
function createCircleTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')
    if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 16, 16)
    }
    return new THREE.CanvasTexture(canvas)
}

export function Wormhole({ progress, theme = 'dark' }: WormholeProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const width = container.clientWidth
        const height = container.clientHeight

        const isDark = theme === 'dark'

        // Read colors from global CSS variables (defined in index.css)
        const rootStyles = getComputedStyle(document.documentElement)
        const cssColor = (varName: string, fallback: string) => {
            const val = rootStyles.getPropertyValue(varName).trim()
            return val || fallback
        }

        const themeColors = {
            grid: new THREE.Color(cssColor('--wormhole-line-color', isDark ? '#ffffff' : 'rgba(15,23,42,0.15)')),
            ring1: new THREE.Color(cssColor('--wormhole-ring-color-1', '#00d2ff')),
            ring2: new THREE.Color(cssColor('--wormhole-ring-color-2', '#0066ff')),
            pulse2: new THREE.Color(cssColor('--wormhole-pulse-color-2', '#00a4ff')),
            pulse3: new THREE.Color(cssColor('--wormhole-pulse-color-3', '#b3f0ff')),
            fog: isDark ? 0x00020a : 0xf3f5f8
        }

        // 1. Scene
        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(themeColors.fog, 0.012)

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 1000)

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        // 4. Constants
        const TUNNEL_RADIUS = 3.0
        const TUNNEL_BOTTOM = -220.0

        // Gravity-well surface height for a given radial distance
        const getWellY = (r: number): number => {
            if (r <= TUNNEL_RADIUS) return -10.0
            return -10.0 * Math.pow(TUNNEL_RADIUS / r, 1.3)
        }

        // 5. ONE single camera spline — starts above, descends straight down
        //    No two-phase disconnect anymore.
        const cameraSpline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 12.0, 34.0),   // start: further back, zoomed out
            new THREE.Vector3(0, 8.0, 22.0),   // approaching
            new THREE.Vector3(0, 5.0, 12.0),   // closer
            new THREE.Vector3(0, 2.5, 5.0),   // nearing rim
            new THREE.Vector3(0, 1.0, 1.5),   // right above rim
            new THREE.Vector3(0, 0.2, 0.2),   // entering
            new THREE.Vector3(0, -2.0, 0.0),   // inside hole
            new THREE.Vector3(0, -10.0, 0.0),   // inside tunnel
            new THREE.Vector3(0, -30.0, 0.0),
            new THREE.Vector3(0, -55.0, 0.0),
            new THREE.Vector3(0, -85.0, 0.0),
            new THREE.Vector3(0, -120.0, 0.0),
            new THREE.Vector3(0, -160.0, 0.0),
            new THREE.Vector3(0, -195.0, 0.0),
            new THREE.Vector3(0, TUNNEL_BOTTOM, 0.0)
        ])

        // 6. Grid material
        // 6. Grid material with custom shader for smooth opacity gradient blending
        const gridMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: themeColors.grid }
            },
            vertexShader: `
        varying vec3 vWorldPosition;
        varying float vViewDist;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDist = length(mvPosition.xyz);
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vWorldPosition;
        void main() {
          float r = length(vWorldPosition.xz);
          float y = vWorldPosition.y;
          
          float alpha = 0.35;
          
          if (y >= -10.0) {
            // Floor grid: fade out towards the outer boundaries
            alpha *= smoothstep(40.0, 22.0, r);
          } else {
            // Tunnel interior: fade out as it goes deeper
            alpha *= smoothstep(-200.0, -10.0, y);
          }
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
            transparent: true,
            depthWrite: false
        })

        // 6b. Radial lines material with speed-pulses shader
        const radialMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: themeColors.grid },
                uPulseColor: { value: themeColors.pulse2 }, // Use global neon blue variable
                uTime: { value: 0 }
            },
            vertexShader: `
        attribute float aOffset;
        varying vec3 vWorldPosition;
        varying float vOffset;
        void main() {
          vOffset = aOffset;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uPulseColor;
        uniform float uTime;
        varying vec3 vWorldPosition;
        varying float vOffset;
        void main() {
          float r = length(vWorldPosition.xz);
          float y = vWorldPosition.y;
          
          // Coordinate along the radial path (0.0 to 2.0)
          float s = (y >= -10.0) ? ((40.0 - r) / 37.0) : (1.0 + (-10.0 - y) / 210.0);
          
          // Boundaries fade factors
          float outerFade = (y >= -10.0) ? smoothstep(40.0, 22.0, r) : 1.0;
          float tunnelFade = (y < -10.0) ? smoothstep(-200.0, -10.0, y) : 1.0;
          float baseFade = outerFade * tunnelFade;
          
          // Base grid line visibility
          float baseAlpha = 0.35 * baseFade;
          
          // Speed pulses zipping down: much longer (frequency 4.5, smoothstep 0.3) and slower (speed 3.0)
          float pulseWave = sin(s * 4.5 - (uTime * 3.0 + vOffset * 15.0));
          float pulse = smoothstep(0.3, 1.0, pulseWave);
          
          // Fade the pulse itself out at the boundaries so the blue color blends smoothly
          float pulseBlend = pulse * baseFade;
          float pulseAlpha = pulseBlend * 0.8;
          
          // Final color and alpha blending
          vec3 finalColor = mix(uColor, uPulseColor, pulseBlend);
          float finalAlpha = max(baseAlpha, pulseAlpha);
          
          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
            transparent: true,
            depthWrite: false
        })

        // 7. Radial lines — funnel surface above, straight cylinder below
        const radialCount = 24
        const radialLines: THREE.Line[] = []

        for (let j = 0; j < radialCount; j++) {
            const theta = (j / radialCount) * Math.PI * 2
            const cx = Math.cos(theta)
            const sz = Math.sin(theta)

            const pts = [
                new THREE.Vector3(cx * 40, getWellY(40), sz * 40),
                new THREE.Vector3(cx * 26, getWellY(26), sz * 26),
                new THREE.Vector3(cx * 15, getWellY(15), sz * 15),
                new THREE.Vector3(cx * 8.5, getWellY(8.5), sz * 8.5),
                new THREE.Vector3(cx * 4.6, getWellY(4.6), sz * 4.6),
                new THREE.Vector3(cx * TUNNEL_RADIUS, -10.0, sz * TUNNEL_RADIUS),
                new THREE.Vector3(cx * TUNNEL_RADIUS, -25.0, sz * TUNNEL_RADIUS),
                new THREE.Vector3(cx * TUNNEL_RADIUS, -45.0, sz * TUNNEL_RADIUS),
                new THREE.Vector3(cx * TUNNEL_RADIUS, -65.0, sz * TUNNEL_RADIUS),
                new THREE.Vector3(cx * TUNNEL_RADIUS, -90.0, sz * TUNNEL_RADIUS),
                new THREE.Vector3(cx * TUNNEL_RADIUS, -120.0, sz * TUNNEL_RADIUS),
                new THREE.Vector3(cx * TUNNEL_RADIUS, -155.0, sz * TUNNEL_RADIUS),
                new THREE.Vector3(cx * TUNNEL_RADIUS, -190.0, sz * TUNNEL_RADIUS),
                new THREE.Vector3(cx * TUNNEL_RADIUS, TUNNEL_BOTTOM, sz * TUNNEL_RADIUS)
            ]

            const curve = new THREE.CatmullRomCurve3(pts)
            const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60))
            
            // Stagger offsets using golden ratio distribution so pulses don't sync up
            const offsetValue = (j * 0.6180339887) % 1.0
            const vertexCount = geom.attributes.position.count
            const offsetArray = new Float32Array(vertexCount)
            for (let k = 0; k < vertexCount; k++) {
                offsetArray[k] = offsetValue
            }
            geom.setAttribute('aOffset', new THREE.BufferAttribute(offsetArray, 1))

            const line = new THREE.Line(geom, radialMaterial)
            scene.add(line)
            radialLines.push(line)
        }

        // 8. Concentric circles — on funnel surface AND inside the tunnel
        const circleLines: THREE.Line[] = []

        // Surface rings (on the funnel)
        const surfaceRadii = [40, 33, 27, 21.5, 16.8, 12.8, 9.5, 6.8, 4.8, 3.5]
        surfaceRadii.forEach((r) => {
            const pts: THREE.Vector3[] = []
            const y = getWellY(r)
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2
                pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r))
            }
            const geom = new THREE.BufferGeometry().setFromPoints(pts)
            const line = new THREE.Line(geom, gridMaterial)
            scene.add(line)
            circleLines.push(line)
        })

        // Tunnel wall rings (inside the vertical shaft)
        const tunnelRingYs = [-15, -22, -30, -40, -50, -60, -72, -85, -100, -115, -130, -148, -165, -185, -200, -215]
        tunnelRingYs.forEach((y) => {
            const pts: THREE.Vector3[] = []
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2
                pts.push(new THREE.Vector3(Math.cos(a) * TUNNEL_RADIUS, y, Math.sin(a) * TUNNEL_RADIUS))
            }
            const geom = new THREE.BufferGeometry().setFromPoints(pts)
            const line = new THREE.Line(geom, gridMaterial)
            scene.add(line)
            circleLines.push(line)
        })

        // 8b. Solid curved masking funnel mesh to hide the vertical cylinder of the tunnel
        //     so it is only visible when looking directly inside the hole, not through the floor grid.
        const maskFunnelGeom = new THREE.CylinderGeometry(40.0, TUNNEL_RADIUS, 10.0, 64, 16, true)
        const maskPosAttr = maskFunnelGeom.attributes.position
        for (let i = 0; i < maskPosAttr.count; i++) {
            const x = maskPosAttr.getX(i)
            const z = maskPosAttr.getZ(i)
            const r = Math.sqrt(x * x + z * z)
            maskPosAttr.setY(i, getWellY(r))
        }
        maskFunnelGeom.computeVertexNormals()

        const maskFunnelMat = new THREE.MeshBasicMaterial({
            colorWrite: false, // invisible, lets gradient show through
            depthWrite: true,  // still blocks objects behind it
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: 1.0,
            polygonOffsetUnits: 1.0
        })
        const maskFunnel = new THREE.Mesh(maskFunnelGeom, maskFunnelMat)
        maskFunnel.position.y = -0.08
        scene.add(maskFunnel)

        // 9. Particles — small, soft dots along the radial lines
        const particleCount = 800
        const particleGeom = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)
        const col1 = themeColors.ring1
        const col2 = themeColors.pulse3

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2
            const cx = Math.cos(theta)
            const sz = Math.sin(theta)

            // Random y position across funnel + tunnel
            const yRange = Math.random()
            let x: number, y: number, z: number

            if (yRange < 0.3) {
                // On the funnel surface
                const r = TUNNEL_RADIUS + Math.random() * 37
                y = getWellY(r) + (Math.random() - 0.5) * 0.3
                x = cx * r
                z = sz * r
            } else {
                // Inside the tunnel shaft
                const rOffset = TUNNEL_RADIUS * (0.3 + Math.random() * 0.7)
                y = -10 - Math.random() * 100
                x = cx * rOffset
                z = sz * rOffset
            }

            positions[i * 3] = x
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = z

            const c = Math.random() > 0.5 ? col1 : col2
            colors[i * 3] = c.r
            colors[i * 3 + 1] = c.g
            colors[i * 3 + 2] = c.b
        }

        particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const circleTexture = createCircleTexture()
        const particleMat = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            map: circleTexture,
            depthWrite: false
        })

        scene.add(new THREE.Points(particleGeom, particleMat))

        // 9b. Flying Coins (WebGL Meshes)
        const coinSymbols = ['MNT', 'BTC', 'ETH', 'SOL', 'USDC', 'ARB']
        const loader = new THREE.TextureLoader()
        const coinTextures = coinSymbols.map(sym => {
            const url = getCryptoLogoUrl(sym, { size: 128 })
            const tex = loader.load(url)
            tex.colorSpace = THREE.SRGBColorSpace
            return tex
        })

        const coinsList: {
            group: THREE.Group
            s: number
            speed: number
            radius: number
            theta: number
            rotX: number
            rotY: number
            rotZ: number
            edgeMat: THREE.MeshBasicMaterial
            faceMat: THREE.MeshBasicMaterial
        }[] = []

        // 3D coin: CylinderGeometry gives real thickness/depth
        const COIN_RADIUS = 0.55
        const COIN_THICKNESS = 0.18
        const coinCylGeom = new THREE.CylinderGeometry(COIN_RADIUS, COIN_RADIUS, COIN_THICKNESS, 32)

        const rimColors = [
            new THREE.Color('#00e699'), // Mantle Turquoise
            new THREE.Color('#00d2ff'), // Neon Cyan
            new THREE.Color('#ffcc00')  // Gold
        ]

        const coinCount = 6
        for (let i = 0; i < coinCount; i++) {
            const texIndex = Math.floor(Math.random() * coinTextures.length)

            // Face material — the top/bottom caps show the crypto logo
            // fog: false keeps coins crisp regardless of distance
            const faceMat = new THREE.MeshBasicMaterial({
                map: coinTextures[texIndex],
                transparent: true,
                depthWrite: true,
                fog: false
            })

            // Edge material — the cylinder side shows a metallic rim color
            const edgeMat = new THREE.MeshBasicMaterial({
                color: rimColors[Math.floor(Math.random() * rimColors.length)],
                transparent: true,
                depthWrite: true,
                opacity: 0.7,
                fog: false
            })

            // CylinderGeometry has 3 material groups: [side, top cap, bottom cap]
            const coinMesh = new THREE.Mesh(coinCylGeom, [edgeMat, faceMat, faceMat])

            // Tilt the coin so the face is visible (cylinder Y-axis -> rotate to face camera)
            coinMesh.rotation.x = Math.PI / 2

            const group = new THREE.Group()
            group.add(coinMesh)
            scene.add(group)

            // Distributed nicely inside the vertical shaft (s >= 0.55)
            const s = 0.55 + (i / coinCount) * 0.38

            coinsList.push({
                group,
                s,
                speed: 0.03 + Math.random() * 0.03,
                radius: 0.8 + Math.random() * 1.4,
                theta: Math.random() * Math.PI * 2,
                rotX: (Math.random() - 0.5) * 2.0,
                rotY: (Math.random() - 0.5) * 2.0,
                rotZ: (Math.random() - 0.5) * 2.0,
                edgeMat,
                faceMat
            })
        }

        const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)
        const smoothstep = (min: number, max: number, value: number) => {
            const x = clamp((value - min) / (max - min), 0.0, 1.0)
            return x * x * (3.0 - 2.0 * x)
        }

        const clock = new THREE.Clock()

        // 10. Subtle point light that follows the camera
        const pointLight = new THREE.PointLight(themeColors.pulse2, 2.0, 40)
        scene.add(pointLight)

        // 11. Render loop
        let frameId = 0
        let prog = 0

        const tick = () => {
            prog = progress ? progress.get() : (prog + 0.001) % 1

            // Update shader time for zipping pulses
            radialMaterial.uniforms.uTime.value = performance.now() * 0.001

            // Map progress 0→1 to spline parameter 0→0.95
            const t = Math.min(prog * 0.95, 0.95)
            const tLook = Math.min(t + 0.04, 1.0)

            const camPos = new THREE.Vector3()
            const lookAt = new THREE.Vector3()
            cameraSpline.getPointAt(t, camPos)
            cameraSpline.getPointAt(tLook, lookAt)

            camera.position.copy(camPos)
            camera.lookAt(lookAt)

            pointLight.position.copy(camPos)

            // Animate coins list
            const dt = Math.min(clock.getDelta(), 0.1)
            coinsList.forEach(coin => {
                coin.s -= coin.speed * dt
                
                const minThreshold = Math.max(0.50, t)

                // If coin passes behind camera or approaches hole mouth, reset it deep in tunnel
                if (coin.s < minThreshold) {
                    coin.s = Math.min(minThreshold + 0.35 + Math.random() * 0.10, 0.95)
                    coin.radius = 0.8 + Math.random() * 1.4
                    coin.theta = Math.random() * Math.PI * 2
                    // Swap texture to random asset
                    const texIndex = Math.floor(Math.random() * coinTextures.length)
                    coin.faceMat.map = coinTextures[texIndex]
                }

                // Opacity fade: fade out completely before reaching minThreshold
                const entranceFade = smoothstep(minThreshold, minThreshold + 0.12, coin.s)
                const deepFade = smoothstep(0.95, 0.80, coin.s)
                const fade = entranceFade * deepFade

                coin.faceMat.opacity = fade
                coin.edgeMat.opacity = fade * 0.7

                const pos = new THREE.Vector3()
                cameraSpline.getPointAt(coin.s, pos)

                const tangent = new THREE.Vector3()
                cameraSpline.getTangentAt(coin.s, tangent)

                const normal = new THREE.Vector3(1, 0, 0)
                const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize()

                pos.addScaledVector(normal, Math.cos(coin.theta) * coin.radius)
                pos.addScaledVector(binormal, Math.sin(coin.theta) * coin.radius)

                coin.group.position.copy(pos)

                coin.group.rotation.x += coin.rotX * dt
                coin.group.rotation.y += coin.rotY * dt
                coin.group.rotation.z += coin.rotZ * dt
            })

            renderer.render(scene, camera)
            frameId = requestAnimationFrame(tick)
        }

        tick()

        // 12. Resize
        const onResize = () => {
            if (!containerRef.current) return
            const w = container.clientWidth
            const h = container.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', onResize)

        // 13. Cleanup
        return () => {
            window.removeEventListener('resize', onResize)
            cancelAnimationFrame(frameId)
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
            gridMaterial.dispose()
            radialMaterial.dispose()
            radialLines.forEach((l) => l.geometry.dispose())
            circleLines.forEach((l) => l.geometry.dispose())
            maskFunnelGeom.dispose()
            maskFunnelMat.dispose()
            circleTexture.dispose()
            particleGeom.dispose()
            particleMat.dispose()

            // Dispose coin assets
            coinCylGeom.dispose()
            coinTextures.forEach(t => t.dispose())
            coinsList.forEach(c => {
                c.edgeMat.dispose()
                c.faceMat.dispose()
            })

            renderer.dispose()
        }
    }, [progress, theme])

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'hidden',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    )
}
