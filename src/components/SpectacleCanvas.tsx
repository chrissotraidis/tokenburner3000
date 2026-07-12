import { Component, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export interface SpectacleCanvasProps {
  intensity?: number;
  variant?: 'lobby' | 'arena' | 'faceoff' | 'fight';
  reduced?: boolean;
  pulse?: number;
}

class SpectacleBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { /* Static art is the fallback. */ }
  render() { return this.state.failed ? null : this.props.children; }
}

function ParticleTunnel({ intensity, pulse }: { intensity: number; pulse: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(120 * 3);
    for (let index = 0; index < 120; index += 1) {
      const angle = index * 2.399;
      const radius = 1.8 + (index % 17) * .19;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = Math.sin(angle) * radius * .58;
      values[index * 3 + 2] = -2 - (index % 24) * .38;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.z += delta * (.04 + intensity * .025);
    points.current.position.z = ((state.clock.elapsedTime * (.22 + intensity * .14)) % 3.8) - .8;
    points.current.rotation.x = state.pointer.y * .08;
    points.current.rotation.y = state.pointer.x * .1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={pulse % 2 ? '#ff2bd6' : '#50f5ff'} size={.035 + intensity * .012} transparent opacity={.75} sizeAttenuation />
    </points>
  );
}

function EnergyCore({ intensity, variant, pulse }: Required<Pick<SpectacleCanvasProps, 'intensity' | 'variant' | 'pulse'>>) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z -= delta * (.18 + intensity * .08);
    group.current.rotation.x = state.pointer.y * .14;
    group.current.rotation.y = state.pointer.x * .18;
    const surge = 1 + Math.sin(state.clock.elapsedTime * 2.2 + pulse) * .035 * intensity;
    group.current.scale.setScalar(surge);
  });
  const scale = variant === 'fight' ? 1.15 : variant === 'faceoff' ? 1.45 : variant === 'arena' ? 1.6 : 1.8;
  return (
    <group ref={group} position={[0, 0, -4]} scale={scale}>
      <Float speed={1.4 + intensity * .3} rotationIntensity={.18} floatIntensity={.2}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, .018, 8, 96]} />
          <meshBasicMaterial color="#ff1bd6" transparent opacity={.72} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, .25, .4]}>
          <torusGeometry args={[1.08, .012, 8, 96]} />
          <meshBasicMaterial color="#45ecff" transparent opacity={.7} />
        </mesh>
        <mesh rotation={[.2, .5, 0]}>
          <octahedronGeometry args={[.56, 1]} />
          <meshBasicMaterial color={pulse % 2 ? '#ff2bd6' : '#39ff14'} wireframe transparent opacity={.28 + intensity * .08} />
        </mesh>
      </Float>
    </group>
  );
}

function Scene({ intensity, variant, pulse }: Required<Pick<SpectacleCanvasProps, 'intensity' | 'variant' | 'pulse'>>) {
  return (
    <>
      <fog attach="fog" args={['#020205', 5, 16]} />
      <ParticleTunnel intensity={intensity} pulse={pulse} />
      <EnergyCore intensity={intensity} variant={variant} pulse={pulse} />
    </>
  );
}

export default function SpectacleCanvas({ intensity = 1, variant = 'lobby', reduced = false, pulse = 0 }: SpectacleCanvasProps) {
  if (reduced) return null;
  return (
    <SpectacleBoundary>
      <div className={`spectacle-canvas spectacle-${variant}`} aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
          <Scene intensity={Math.max(.4, Math.min(3, intensity))} variant={variant} pulse={pulse} />
        </Canvas>
      </div>
    </SpectacleBoundary>
  );
}
