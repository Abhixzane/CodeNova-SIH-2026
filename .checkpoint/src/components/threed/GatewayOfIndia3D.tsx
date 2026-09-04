import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Maximize2, Compass } from 'lucide-react';

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

    // Scene with clean architectural gallery backdrop
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf5f3ee);

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

    // Lights - Warm architectural studio lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.5);
    sunLight.position.set(10, 18, 12);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.8);
    fillLight.position.set(-10, 8, -10);
    scene.add(fillLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(24, 24, 0xd6d3d1, 0xe7e5e4);
    gridHelper.position.y = -2.01;
    scene.add(gridHelper);

    // Monument Group
    const monumentGroup = new THREE.Group();
    materialsRef.current = [];

    const stoneColor = 0xd97706; // Rich yellow basalt
    const trimColor = 0xb45309;  // Dark stone trim

    const createMat = (color: number) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
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

    // Interactive mouse drag rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };
      monumentGroup.rotation.y += deltaMove.x * 0.008;
      monumentGroup.rotation.x += deltaMove.y * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (isRotating && !isDragging) {
        monumentGroup.rotation.y += 0.006;
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
      currentMount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
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
    <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-xs font-bold text-stone-800 shadow-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{placeName}</span>
          <span className="text-[11px] text-stone-500 font-normal">(3D WebGL Simulation)</span>
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
            isRotating
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white/90 text-stone-700 border-stone-200 hover:bg-white'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'Rotating' : 'Paused'}</span>
        </button>

        <button
          onClick={() => setWireframe((prev) => !prev)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
            wireframe
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-white/90 text-stone-700 border-stone-200 hover:bg-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{wireframe ? 'Solid' : 'Wireframe'}</span>
        </button>
      </div>

      <div ref={mountRef} className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing" />

      <div className="p-3.5 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-stone-400" />
          <span>Click & drag to rotate monument perspective freely</span>
        </span>
        <span className="text-[11px] font-semibold text-emerald-700">Renderer: Three.js PBR</span>
      </div>
    </div>
  );
};
