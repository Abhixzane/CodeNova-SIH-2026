import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Maximize2 } from 'lucide-react';

interface GatewayOfIndia3DProps {
  placeName?: string;
  onPlanVisit?: () => void;
  height?: string;
}

export const GatewayOfIndia3D: React.FC<GatewayOfIndia3DProps> = ({
  placeName = 'Heritage Monument',
  onPlanVisit,
  height = 'h-80 sm:h-96',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 14);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffaa66, 1.8);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueRimLight.position.set(-10, 10, -10);
    scene.add(blueRimLight);

    // Monument Group
    const monumentGroup = new THREE.Group();
    materialsRef.current = [];

    const stoneColor = 0xd97706;
    const trimColor = 0xb45309;

    const createMat = (color: number) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.1,
        wireframe,
      });
      materialsRef.current.push(mat);
      return mat;
    };

    const mainMat = createMat(stoneColor);
    const darkMat = createMat(trimColor);

    // Plinth / Base
    const baseGeo = new THREE.BoxGeometry(10, 0.8, 6);
    const baseMesh = new THREE.Mesh(baseGeo, darkMat);
    baseMesh.position.y = -2;
    monumentGroup.add(baseMesh);

    // Left Pillar
    const leftPillarGeo = new THREE.BoxGeometry(2, 6, 3);
    const leftPillar = new THREE.Mesh(leftPillarGeo, mainMat);
    leftPillar.position.set(-3, 1.4, 0);
    monumentGroup.add(leftPillar);

    // Right Pillar
    const rightPillarGeo = new THREE.BoxGeometry(2, 6, 3);
    const rightPillar = new THREE.Mesh(rightPillarGeo, mainMat);
    rightPillar.position.set(3, 1.4, 0);
    monumentGroup.add(rightPillar);

    // Arch Architrave / Top Beam
    const archTopGeo = new THREE.BoxGeometry(8.5, 1.5, 3.4);
    const archTop = new THREE.Mesh(archTopGeo, darkMat);
    archTop.position.set(0, 4.6, 0);
    monumentGroup.add(archTop);

    // Central Dome
    const domeGeo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMat = createMat(0xf59e0b);
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.set(0, 5.35, 0);
    monumentGroup.add(domeMesh);

    // Side Minarets / Domes
    const miniDomeGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.5, 16);
    const minaretLeft = new THREE.Mesh(miniDomeGeo, darkMat);
    minaretLeft.position.set(-3.2, 5.5, 0);
    monumentGroup.add(minaretLeft);

    const minaretRight = new THREE.Mesh(miniDomeGeo, darkMat);
    minaretRight.position.set(3.2, 5.5, 0);
    monumentGroup.add(minaretRight);

    scene.add(monumentGroup);

    // Animation loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (isRotating) {
        monumentGroup.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  useEffect(() => {
    materialsRef.current.forEach((m: any) => {
      m.wireframe = wireframe;
    });
  }, [wireframe]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-parchment-300">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-parchment-300 text-xs font-semibold text-charcoal flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {placeName} (3D Simulation)
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className={`p-2 rounded-xl border text-xs font-medium transition-all ${
            isRotating
              ? 'bg-orange-500 text-charcoal border-orange-400'
              : 'bg-slate-900/80 text-charcoal-light border-parchment-300 hover:text-charcoal'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setWireframe((prev) => !prev)}
          className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
            wireframe
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900/80 text-charcoal-light border-parchment-300 hover:text-charcoal'
          }`}
        >
          <Eye className="w-3.5 h-3.5 inline mr-1" />
          {wireframe ? 'Solid' : 'Wireframe'}
        </button>
      </div>

      <div ref={mountRef} className="w-full h-80 sm:h-96" />

      <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-charcoal-light">
        <span>Interactive WebGL 3D Architectural Model</span>
        <span className="text-[11px] text-amber-400 font-mono">Shader: PBR MeshStandard</span>
      </div>
    </div>
  );
};
