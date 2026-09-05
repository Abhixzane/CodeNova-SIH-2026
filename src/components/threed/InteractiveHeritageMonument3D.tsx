import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Compass, Maximize2, ShieldCheck } from 'lucide-react';

export type Monument3DType =
  | 'gateway-of-india'
  | 'taj-mahal'
  | 'qutub-minar'
  | 'konark-sun-temple'
  | 'hampi-stone-temple'
  | 'amber-palace';

interface InteractiveHeritageMonument3DProps {
  monumentType: Monument3DType;
  monumentName: string;
  cityName?: string;
  heightClass?: string;
  onExploreDetails?: () => void;
  autoRotateDefault?: boolean;
}

export const InteractiveHeritageMonument3D: React.FC<InteractiveHeritageMonument3DProps> = ({
  monumentType,
  monumentName,
  cityName,
  heightClass = 'h-72 sm:h-96',
  onExploreDetails,
  autoRotateDefault = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(autoRotateDefault);
  const [wireframe, setWireframe] = useState(false);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 350;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf8f5); // Warm cream canvas

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 12);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting: Warm Indian Sun + Soft Atmospheric Sky Fill
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    sunLight.position.set(8, 16, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0xe0f2fe, 0.7);
    skyFill.position.set(-8, 6, -8);
    scene.add(skyFill);

    // 5. Architectural Sandstone Plinth Floor
    const gridHelper = new THREE.GridHelper(20, 20, 0xd6d3d1, 0xe7e5e4);
    gridHelper.position.y = -2.01;
    scene.add(gridHelper);

    // 6. Monument Model Group
    const modelGroup = new THREE.Group();
    groupRef.current = modelGroup;
    materialsRef.current = [];

    const createMat = (color: number, roughness = 0.35, metalness = 0.1) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        wireframe,
      });
      materialsRef.current.push(mat);
      return mat;
    };

    // -------------------------------------------------------------
    // Procedural Architectural Volumetric Sculptures
    // -------------------------------------------------------------
    if (monumentType === 'taj-mahal') {
      // Makrana Pure White Marble Material
      const marbleMat = createMat(0xf8fafc, 0.25, 0.05);
      const goldFinialMat = createMat(0xf59e0b, 0.2, 0.5);
      const plinthMat = createMat(0xe2e8f0, 0.4, 0.05);

      // Elevated Plinth
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(9, 0.8, 9), plinthMat);
      plinth.position.y = -1.6;
      modelGroup.add(plinth);

      // Main Cubic Chamber
      const mainChamber = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.8, 4.6), marbleMat);
      mainChamber.position.y = 0.7;
      modelGroup.add(mainChamber);

      // Chamfered / arched niche accents
      const archFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.0, 4.8), marbleMat);
      archFrame.position.y = 0.5;
      modelGroup.add(archFrame);

      // Monumental Onion Dome
      const domeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2.2, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.75),
        marbleMat
      );
      domeMesh.position.y = 3.6;
      domeMesh.scale.set(1, 1.25, 1);
      modelGroup.add(domeMesh);

      // Brass Finial Kalash
      const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.25, 1.4, 16), goldFinialMat);
      finial.position.y = 5.8;
      modelGroup.add(finial);

      // 4 Octagonal Corner Minarets with Three Tiered Balconies
      const minaretPositions = [
        [-3.8, -3.8],
        [3.8, -3.8],
        [-3.8, 3.8],
        [3.8, 3.8],
      ];

      minaretPositions.forEach(([mx, mz]) => {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 6.2, 16), marbleMat);
        shaft.position.set(mx, 1.5, mz);
        modelGroup.add(shaft);

        const chhatri = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 12), marbleMat);
        chhatri.position.set(mx, 4.7, mz);
        modelGroup.add(chhatri);
      });
    } else if (monumentType === 'qutub-minar') {
      // Red Sandstone with Marble Inlay Bands
      const redStone = createMat(0x9a3412, 0.5, 0.1);
      const darkStone = createMat(0x7c2d12, 0.55, 0.1);
      const marbleTrim = createMat(0xf8fafc, 0.3, 0.05);

      // Base Plinth
      const base = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 0.8, 32), darkStone);
      base.position.y = -1.6;
      modelGroup.add(base);

      // 5 Tapering Fluted Stories with Projecting Balconies
      const stories = [
        { bottomR: 2.8, topR: 2.2, height: 2.4, y: -0.2, mat: redStone },
        { bottomR: 2.1, topR: 1.7, height: 2.0, y: 1.8, mat: redStone },
        { bottomR: 1.6, topR: 1.3, height: 1.8, y: 3.5, mat: redStone },
        { bottomR: 1.25, topR: 1.0, height: 1.5, y: 5.0, mat: marbleTrim },
        { bottomR: 0.95, topR: 0.75, height: 1.2, y: 6.2, mat: marbleTrim },
      ];

      stories.forEach((st) => {
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(st.topR, st.bottomR, st.height, 24),
          st.mat
        );
        mesh.position.y = st.y;
        modelGroup.add(mesh);

        // Projecting Muqarnas Balcony Bracket
        const balcony = new THREE.Mesh(
          new THREE.CylinderGeometry(st.topR + 0.35, st.topR + 0.1, 0.25, 24),
          darkStone
        );
        balcony.position.y = st.y + st.height / 2;
        modelGroup.add(balcony);
      });
    } else if (monumentType === 'konark-sun-temple') {
      // Khondalite Sandstone with 24-Spoked Sun Wheels
      const stoneMat = createMat(0xb45309, 0.6, 0.1);
      const accentMat = createMat(0x92400e, 0.6, 0.1);

      // Platform Chariot Base
      const chariot = new THREE.Mesh(new THREE.BoxGeometry(8, 1.4, 5.5), stoneMat);
      chariot.position.y = -1.3;
      modelGroup.add(chariot);

      // Pyramidal Jagamohana (Porch)
      const jagamohana = new THREE.Mesh(new THREE.ConeGeometry(3.5, 5.0, 4), stoneMat);
      jagamohana.position.set(0, 1.8, 0);
      jagamohana.rotation.y = Math.PI / 4;
      modelGroup.add(jagamohana);

      // 4 Iconic Carved Sun Wheels on Chariot Sides
      const wheelGeo = new THREE.TorusGeometry(1.1, 0.22, 16, 32);
      const wheelPositions = [
        [-2.4, -1.2, 2.8],
        [2.4, -1.2, 2.8],
        [-2.4, -1.2, -2.8],
        [2.4, -1.2, -2.8],
      ];

      wheelPositions.forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, accentMat);
        wheel.position.set(wx, wy, wz);
        modelGroup.add(wheel);

        // Axle Hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), accentMat);
        hub.rotation.x = Math.PI / 2;
        hub.position.set(wx, wy, wz);
        modelGroup.add(hub);
      });
    } else if (monumentType === 'hampi-stone-temple') {
      // Granite Monolithic Stone Chariot & Dravidian Shikhara
      const graniteMat = createMat(0x78716c, 0.65, 0.1);
      const goldTrim = createMat(0xd97706, 0.4, 0.2);

      // Monolithic Chariot Base
      const chariot = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.5, 4.2), graniteMat);
      chariot.position.y = -1.2;
      modelGroup.add(chariot);

      // 4 Granite Carved Chariot Wheels
      const wheelPositions = [
        [-1.8, -1.2, 2.2],
        [1.8, -1.2, 2.2],
        [-1.8, -1.2, -2.2],
        [1.8, -1.2, -2.2],
      ];
      wheelPositions.forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.18, 16, 24), goldTrim);
        wheel.position.set(wx, wy, wz);
        modelGroup.add(wheel);
      });

      // Shikhara Vimana Shrine on Top
      const vimana = new THREE.Mesh(new THREE.ConeGeometry(2.4, 4.2, 4), graniteMat);
      vimana.position.set(0, 1.8, 0);
      vimana.rotation.y = Math.PI / 4;
      modelGroup.add(vimana);
    } else {
      // Default: Gateway of India (Yellow Basalt Arch & Central Dome)
      const stoneColor = 0xd97706;
      const trimColor = 0xb45309;
      const mainMat = createMat(stoneColor);
      const darkMat = createMat(trimColor);

      // Plinth
      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(9, 0.8, 5.5), darkMat);
      baseMesh.position.y = -1.6;
      modelGroup.add(baseMesh);

      // Left & Right Fluted Pylons
      const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.5, 2.8), mainMat);
      leftPillar.position.set(-2.6, 1.4, 0);
      modelGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.5, 2.8), mainMat);
      rightPillar.position.set(2.6, 1.4, 0);
      modelGroup.add(rightPillar);

      // Grand Architrave Beam
      const archTop = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.5, 3.2), darkMat);
      archTop.position.set(0, 4.4, 0);
      modelGroup.add(archTop);

      // Central Dome
      const domeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
        createMat(0xf59e0b)
      );
      domeMesh.position.set(0, 5.15, 0);
      modelGroup.add(domeMesh);

      // Minarets
      const minaretLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.4, 16), darkMat);
      minaretLeft.position.set(-2.8, 5.3, 0);
      modelGroup.add(minaretLeft);

      const minaretRight = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.4, 16), darkMat);
      minaretRight.position.set(2.8, 5.3, 0);
      modelGroup.add(minaretRight);
    }

    scene.add(modelGroup);

    // 7. Interactive Mouse / Touch Drag Rotation
    let isDragging = false;
    let previousPos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousPos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPos.x;
      const deltaY = e.clientY - previousPos.y;
      modelGroup.rotation.y += deltaX * 0.009;
      modelGroup.rotation.x = Math.max(-0.4, Math.min(0.4, modelGroup.rotation.x + deltaY * 0.005));
      previousPos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (isRotating && !isDragging) {
        modelGroup.rotation.y += 0.007;
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
  }, [monumentType, isRotating]);

  useEffect(() => {
    materialsRef.current.forEach((m) => {
      m.wireframe = wireframe;
    });
  }, [wireframe]);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#EFE8DF] shadow-warm">
      {/* Top Header Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EFE8DF] text-xs font-bold text-stone-900 shadow-2xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>{monumentName}</span>
          {cityName && <span className="text-stone-500 font-normal">({cityName})</span>}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
            isRotating
              ? 'bg-amber-800 text-white border-amber-800'
              : 'bg-white text-stone-700 border-[#EFE8DF] hover:bg-stone-50'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span>{isRotating ? 'Rotating' : 'Paused'}</span>
        </button>

        <button
          onClick={() => setWireframe((prev) => !prev)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
            wireframe
              ? 'bg-amber-100 text-amber-950 border-amber-300'
              : 'bg-white text-stone-700 border-[#EFE8DF] hover:bg-stone-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{wireframe ? 'Solid' : 'Wireframe'}</span>
        </button>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className={`w-full ${heightClass} cursor-grab active:cursor-grabbing select-none`}
      />

      {/* Bottom Info & Action Bar */}
      <div className="p-4 bg-white border-t border-[#EFE8DF] flex items-center justify-between text-xs text-stone-600">
        <span className="flex items-center gap-1.5 text-stone-600">
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden sm:inline">Click & drag to rotate 360° architectural perspective freely</span>
          <span className="sm:hidden">Drag to rotate 3D view</span>
        </span>

        {onExploreDetails && (
          <button
            onClick={onExploreDetails}
            className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold transition flex items-center gap-1 text-[11px]"
          >
            <span>Explore Details</span>
            <ShieldCheck className="w-3 h-3 text-amber-700" />
          </button>
        )}
      </div>
    </div>
  );
};
