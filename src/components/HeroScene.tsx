import { Environment, Float, Lightformer, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '../lib/hooks'

function Rings() {
  const outer = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!outer.current) return
    outer.current.rotation.z += delta * 0.045
    outer.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.1
  })

  return (
    <group ref={outer} rotation={[0.42, -0.15, 0.2]}>
      <mesh>
        <torusGeometry args={[1.95, 0.03, 28, 220]} />
        <meshStandardMaterial
          color="#E9C983"
          metalness={1}
          roughness={0.16}
          emissive="#6b4f1d"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh rotation={[1.18, 0.45, 0]}>
        <torusGeometry args={[2.35, 0.014, 20, 220]} />
        <meshStandardMaterial color="#D6AD55" metalness={0.95} roughness={0.28} />
      </mesh>
      <mesh rotation={[0.65, -0.95, 0.35]}>
        <torusGeometry args={[2.7, 0.009, 16, 220]} />
        <meshStandardMaterial
          color="#F4E3BA"
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={0.65}
        />
      </mesh>
      <mesh rotation={[1.55, 0.15, 0.1]}>
        <torusGeometry args={[1.65, 0.045, 24, 180]} />
        <meshStandardMaterial color="#1E3E70" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  )
}

function Core() {
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial color="#183A6B" metalness={0.72} roughness={0.2} />
      </mesh>
      <mesh scale={1.015}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial color="#E9C983" wireframe transparent opacity={0.55} />
      </mesh>
      <pointLight color="#f7dfa8" intensity={6} distance={7} decay={2} />
    </group>
  )
}

function Scene() {
  const root = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  useFrame((state, delta) => {
    if (!root.current) return
    root.current.rotation.y += delta * 0.07
    root.current.rotation.x = THREE.MathUtils.lerp(
      root.current.rotation.x,
      0.18 + pointer.current.y * 0.12,
      0.03,
    )
    root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, pointer.current.x * 0.5, 0.03)
    root.current.position.y = THREE.MathUtils.lerp(root.current.position.y, -pointer.current.y * 0.35, 0.03)
    root.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
  })

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={1.8} color="#fff3d6" />
      <directionalLight position={[-5, -2, 3]} intensity={0.7} color="#4b74b8" />
      <Environment resolution={128}>
        <Lightformer intensity={2.6} position={[0, 3, 4]} scale={[8, 8, 1]} color="#fff1cf" />
        <Lightformer intensity={1.2} position={[-5, -1, 2]} scale={[4, 8, 1]} color="#8fb4ff" />
        <Lightformer form="ring" intensity={3} position={[4, 1, -3]} scale={4} color="#d6ad55" />
      </Environment>
      <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.7}>
        <group ref={root} rotation={[0.32, -0.2, 0.16]} scale={0.92}>
          <Core />
          <Rings />
          <Sparkles count={55} scale={8} size={2.4} speed={0.25} color="#F3DEA6" opacity={0.7} />
        </group>
      </Float>
    </>
  )
}

export default function HeroScene() {
  const reduced = usePrefersReducedMotion()
  if (reduced) return null

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 7.4], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
