import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload the realistic 3D human body mesh asset
useGLTF.preload('/models/human_body.glb');

// ── Concentric Radar Pulse for Selected Hotspot ─────────────────────────────
function RadarPulse3D({ color, scaleMultiplier = 1 }) {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 1.8;

    // Wave 1
    const p1 = (t % 2) / 2;
    if (ring1.current) {
      const s = (1 + p1 * 2.5) * scaleMultiplier;
      ring1.current.scale.set(s, s, s);
      ring1.current.material.opacity = Math.max(0, (1 - p1) * 0.85);
    }

    // Wave 2 (offset)
    const p2 = ((t + 0.66) % 2) / 2;
    if (ring2.current) {
      const s = (1 + p2 * 2.5) * scaleMultiplier;
      ring2.current.scale.set(s, s, s);
      ring2.current.material.opacity = Math.max(0, (1 - p2) * 0.6);
    }

    // Wave 3 (offset)
    const p3 = ((t + 1.33) % 2) / 2;
    if (ring3.current) {
      const s = (1 + p3 * 2.5) * scaleMultiplier;
      ring3.current.scale.set(s, s, s);
      ring3.current.material.opacity = Math.max(0, (1 - p3) * 0.35);
    }
  });

  return (
    <group>
      {/* Wave 1 */}
      <mesh ref={ring1}>
        <ringGeometry args={[0.10, 0.14, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
      {/* Wave 2 */}
      <mesh ref={ring2}>
        <ringGeometry args={[0.10, 0.14, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
      {/* Wave 3 */}
      <mesh ref={ring3}>
        <ringGeometry args={[0.10, 0.14, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Interactive 3D Hotspot Marker ───────────────────────────────────────────
function OrganMarker({ organ, isSelected, onClick, onHover, hovered, organName }) {
  const meshRef = useRef();
  const [localHover, setLocalHover] = useState(false);
  const isHovered = hovered === organ.key || localHover;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * 3 + organ.key.length;
      const pulse = isSelected ? 1 + Math.sin(t) * 0.14 : isHovered ? 1.15 : 1 + Math.sin(t) * 0.05;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={organ.position}>
      {/* Concentric radar waves if selected */}
      {isSelected && <RadarPulse3D color={organ.color} />}

      {/* Point Light casting organ glow on realistic skin */}
      <pointLight
        color={organ.color}
        intensity={isSelected ? 1.8 : isHovered ? 1.2 : 0.4}
        distance={1.5}
        decay={2}
      />

      {/* Outer Halo Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(organ.key);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setLocalHover(true);
          onHover(organ.key);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setLocalHover(false);
          onHover(null);
        }}
        cursor="pointer"
      >
        <sphereGeometry args={[isSelected ? 0.095 : isHovered ? 0.085 : 0.07, 32, 32]} />
        <meshStandardMaterial
          color={organ.color}
          emissive={organ.color}
          emissiveIntensity={isSelected ? 1.6 : isHovered ? 1.2 : 0.7}
          roughness={0.25}
          metalness={0.05}
          transparent
          opacity={0.95}
          depthTest={true}
          depthWrite={true}
        />
      </mesh>

      {/* Inner Bright Core */}
      <mesh>
        <sphereGeometry args={[isSelected ? 0.045 : 0.035, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" depthTest={true} />
      </mesh>

      {/* 3D Floating Tooltip / Label */}
      {(isSelected || isHovered) && (
        <Html
          position={[0, 0.22, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none', transition: 'all 0.2s ease' }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.90)',
              backdropFilter: 'blur(10px)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              boxShadow: `0 4px 20px ${organ.color}66`,
              border: `1.5px solid ${organ.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: organ.color,
                display: 'inline-block',
                boxShadow: `0 0 8px ${organ.color}`,
              }}
            />
            {organName}
          </div>
        </Html>
      )}
    </group>
  );
}

// ── Realistic Human 3D Body Mesh ────────────────────────────────────────────
function RealisticHumanBody({ renderMode, onSelectOrgan }) {
  const { scene } = useGLTF('/models/human_body.glb');

  // Clone and configure materials for realistic studio human look matching Image 2
  const clonedScene = useMemo(() => {
    const clone = scene.clone();

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (renderMode === 'hologram') {
          // Cyber hologram shader
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#0284C7'),
            emissive: new THREE.Color('#0369A1'),
            emissiveIntensity: 0.35,
            roughness: 0.25,
            metalness: 0.1,
            transparent: true,
            opacity: 0.55,
            depthWrite: true,
          });
        } else if (renderMode === 'xray') {
          // Medical X-ray shader
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#CBD5E1'),
            emissive: new THREE.Color('#64748B'),
            emissiveIntensity: 0.2,
            roughness: 0.3,
            transparent: true,
            opacity: 0.4,
            depthWrite: true,
          });
        } else {
          // Default 'clinical' mode: Realistic, smooth, neutral light-gray / off-white studio skin
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#EAEAEA'),
            roughness: 0.45, // Soft, non-shiny matte skin
            metalness: 0.03, // Organic, non-metallic
          });
        }
      }
    });

    return clone;
  }, [scene, renderMode]);

  // Click on body mesh to select nearest region
  const handleBodyClick = (e) => {
    e.stopPropagation();
    if (!e.point || !onSelectOrgan) return;
    const y = e.point.y;
    const x = e.point.x;

    if (y > 1.6) {
      onSelectOrgan('eyes');
    } else if (y > 0.6) {
      if (Math.abs(x) > 0.5) {
        onSelectOrgan('nerves');
      } else {
        onSelectOrgan('heart');
      }
    } else if (y > -0.1) {
      if (Math.abs(x) > 0.4) {
        onSelectOrgan('nerves');
      } else {
        onSelectOrgan('kidneys');
      }
    } else if (y > -0.6) {
      onSelectOrgan('kidneys');
    } else if (y > -1.7) {
      onSelectOrgan('blood_vessels');
    } else {
      onSelectOrgan('feet');
    }
  };

  return (
    <group
      position={[0, 0, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={[4.5, 4.5, 4.5]}
      onClick={handleBodyClick}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// ── Loading Fallback ────────────────────────────────────────────────────────
function ModelLoadingFallback() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 2;
    }
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.3, 0.03, 16, 40]} />
        <meshBasicMaterial color="#0284C7" wireframe />
      </mesh>
      <Html center>
        <div
          style={{
            marginTop: '50px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#64748B',
            background: 'rgba(255,255,255,0.95)',
            padding: '4px 12px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            whiteSpace: 'nowrap',
          }}
        >
          Loading 3D Anatomy...
        </div>
      </Html>
    </group>
  );
}

// ── Camera Controller for Orbit & Focus ─────────────────────────────────────
function CameraRig({ selectedOrgan, organs, viewPreset, controlsRef }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.0, 6.0));
  const lookTarget = useRef(new THREE.Vector3(0, 0.0, 0));

  useEffect(() => {
    if (viewPreset === 'front') {
      targetPos.current.set(0, 0.0, 6.0);
      lookTarget.current.set(0, 0.0, 0);
    } else if (viewPreset === 'side') {
      targetPos.current.set(5.8, 0.0, 0.0);
      lookTarget.current.set(0, 0.0, 0);
    } else if (viewPreset === 'back') {
      targetPos.current.set(0, 0.0, -6.0);
      lookTarget.current.set(0, 0.0, 0);
    } else if (viewPreset === 'upper') {
      targetPos.current.set(0, 1.1, 3.4);
      lookTarget.current.set(0, 1.1, 0);
    } else if (viewPreset === 'lower') {
      targetPos.current.set(0, -1.1, 3.4);
      lookTarget.current.set(0, -1.1, 0);
    }
  }, [viewPreset]);

  // Smoothly center focus on selected organ
  useEffect(() => {
    if (!selectedOrgan) return;
    const organ = organs.find((o) => o.key === selectedOrgan);
    if (!organ) return;

    const [ox, oy] = organ.position;
    lookTarget.current.set(0, oy * 0.7, 0);
    targetPos.current.set(ox * 0.3, oy * 0.7, 4.4);
  }, [selectedOrgan, organs]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookTarget.current, 0.05);
      controlsRef.current.update();
    }
  });

  return null;
}

// ── Main BodyScene Component ────────────────────────────────────────────────
function BodyScene({
  organs,
  selectedOrgan,
  onSelectOrgan,
  renderMode,
  autoRotate,
  viewPreset,
  t,
}) {
  const controlsRef = useRef();
  const [hoveredOrgan, setHoveredOrgan] = useState(null);

  return (
    <>
      {/* ── Studio Medical Lighting ─────────────────────────── */}
      <ambientLight intensity={renderMode === 'hologram' ? 0.45 : 0.75} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={renderMode === 'hologram' ? 0.7 : 1.2}
      />
      <directionalLight
        position={[-4, 3, 4]}
        intensity={renderMode === 'hologram' ? 0.5 : 0.65}
        color="#F8FAFC"
      />
      <directionalLight
        position={[0, 4, -4]}
        intensity={0.45}
        color="#E2E8F0"
      />
      <pointLight position={[0, -1, 3.5]} intensity={0.3} color="#FFFFFF" />

      {/* Realistic 3D Human Body Mesh */}
      <RealisticHumanBody
        renderMode={renderMode}
        onSelectOrgan={onSelectOrgan}
      />

      {/* Interactive Hotspot Markers */}
      {organs.map((organ) => (
        <OrganMarker
          key={organ.key}
          organ={organ}
          isSelected={selectedOrgan === organ.key}
          onClick={onSelectOrgan}
          onHover={setHoveredOrgan}
          hovered={hoveredOrgan}
          organName={t ? t(`body_explorer.${organ.key}`) : organ.key}
        />
      ))}

      {/* Subtle Studio Contact Shadow beneath the feet */}
      <ContactShadows
        position={[0, -2.26, 0]}
        opacity={0.42}
        scale={4.2}
        blur={2.4}
        far={1.8}
        color="#94A3B8"
      />

      {/* Camera Rig & Orbit Controls */}
      <CameraRig
        selectedOrgan={selectedOrgan}
        organs={organs}
        viewPreset={viewPreset}
        controlsRef={controlsRef}
      />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={2.0}
        maxDistance={8.5}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        makeDefault
      />
    </>
  );
}

// ── Exported BodyModel3D Component ───────────────────────────────────────────
export default function BodyModel3D({
  organs,
  selectedOrgan,
  onSelectOrgan,
  renderMode = 'clinical',
  autoRotate = false,
  viewPreset = 'front',
  t,
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.0, 6.0], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Suspense fallback={<ModelLoadingFallback />}>
          <BodyScene
            organs={organs}
            selectedOrgan={selectedOrgan}
            onSelectOrgan={onSelectOrgan}
            renderMode={renderMode}
            autoRotate={autoRotate}
            viewPreset={viewPreset}
            t={t}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
