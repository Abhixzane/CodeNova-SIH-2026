import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Sun, 
  Moon, 
  Sunset, 
  Box, 
  RotateCcw, 
  Navigation, 
  Sparkles, 
  Play, 
  Info,
  Eye,
  Camera
} from 'lucide-react';
import { VideoExperienceModal } from './VideoExperienceModal';

interface GatewayOfIndia3DProps {
  onPlanVisit?: () => void;
  height?: string;
}

interface Hotspot {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
}

export const GatewayOfIndia3D: React.FC<GatewayOfIndia3DProps> = ({
  onPlanVisit,
  height = 'h-[520px]',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('day');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [navigationMode, setNavigationMode] = useState<boolean>(false);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [activeCameraView, setActiveCameraView] = useState<'orbit' | 'front' | 'top' | 'side'>('orbit');

  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const lightsRef = useRef<{ dirLight: THREE.DirectionalLight; hemiLight: THREE.HemisphereLight } | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const hotspots: Hotspot[] = [
    {
      id: 'central-arch',
      title: 'Grand Central Archway',
      description: 'The monumental 26-meter (85 ft) central arch crafted in yellow basalt, blending Indo-Saracenic and Roman triumphal arch styles.',
      position: [0, 8, 2],
    },
    {
      id: 'plaque',
      title: 'Royal Inscription Plaque',
      description: 'Commemorates the landing of King George V and Queen Mary on 2 December 1911 at Apollo Bunder port.',
      position: [0, 16, 2],
    },
    {
      id: 'dome',
      title: 'Central Pierced Dome',
      description: 'A 15-meter diameter central dome flanked by four minaret-like turrets inspired by 16th-century Gujarati architecture.',
      position: [0, 20, 0],
    },
    {
      id: 'seafront',
      title: 'Apollo Bunder Waterfront',
      description: 'Stepped basalt plinth opening directly to Mumbai Harbour and the Arabian Sea, serving as the gateway ferry hub to Elephanta Island.',
      position: [0, -1, 10],
    },
  ];

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const heightPx = currentMount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080d19');
    scene.fog = new THREE.FogExp2('#080d19', 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(24, 18, 38);
    camera.lookAt(0, 8, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // Lights
    const hemiLight = new THREE.HemisphereLight('#f8fafc', '#0f172a', 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight('#fed7aa', 1.8);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    lightsRef.current = { dirLight, hemiLight };

    // Material tracking for wireframe/lighting
    const materials: THREE.MeshStandardMaterial[] = [];

    const basaltMat = new THREE.MeshStandardMaterial({
      color: '#d4a373',
      roughness: 0.75,
      metalness: 0.15,
    });
    materials.push(basaltMat);

    const darkBasaltMat = new THREE.MeshStandardMaterial({
      color: '#a98467',
      roughness: 0.85,
    });
    materials.push(darkBasaltMat);

    const waterMat = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    });
    materials.push(waterMat);

    materialsRef.current = materials;

    // Build Procedural Indo-Saracenic Gateway Model
    const modelGroup = new THREE.Group();

    // 1. Base Stepped Plinth
    const baseGeo = new THREE.BoxGeometry(32, 2, 20);
    const baseMesh = new THREE.Mesh(baseGeo, darkBasaltMat);
    baseMesh.position.y = 0;
    baseMesh.receiveShadow = true;
    modelGroup.add(baseMesh);

    // 2. Pillars / Side Pylons
    const pylonGeo = new THREE.BoxGeometry(7, 16, 12);
    const leftPylon = new THREE.Mesh(pylonGeo, basaltMat);
    leftPylon.position.set(-9.5, 9, 0);
    leftPylon.castShadow = true;
    leftPylon.receiveShadow = true;
    modelGroup.add(leftPylon);

    const rightPylon = new THREE.Mesh(pylonGeo, basaltMat);
    rightPylon.position.set(9.5, 9, 0);
    rightPylon.castShadow = true;
    rightPylon.receiveShadow = true;
    modelGroup.add(rightPylon);

    // 3. Central Lintel / Crown
    const lintelGeo = new THREE.BoxGeometry(26, 4, 12);
    const lintelMesh = new THREE.Mesh(lintelGeo, basaltMat);
    lintelMesh.position.set(0, 19, 0);
    lintelMesh.castShadow = true;
    modelGroup.add(lintelMesh);

    // 4. Central Large Dome
    const domeGeo = new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, basaltMat);
    domeMesh.position.set(0, 21, 0);
    domeMesh.castShadow = true;
    modelGroup.add(domeMesh);

    // 5. Four Corner Turrets (Minarets)
    const turretGeo = new THREE.CylinderGeometry(0.8, 1, 6, 16);
    const turretDomeGeo = new THREE.SphereGeometry(1.1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);

    const cornerCoords = [
      [-12, 0, -5],
      [-12, 0, 5],
      [12, 0, -5],
      [12, 0, 5],
    ];

    cornerCoords.forEach(([x, y, z]) => {
      const turret = new THREE.Mesh(turretGeo, basaltMat);
      turret.position.set(x, 20, z);
      turret.castShadow = true;
      modelGroup.add(turret);

      const tDome = new THREE.Mesh(turretDomeGeo, basaltMat);
      tDome.position.set(x, 23, z);
      tDome.castShadow = true;
      modelGroup.add(tDome);
    });

    // 6. Water Plane
    const seaGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
    const seaMesh = new THREE.Mesh(seaGeo, waterMat);
    seaMesh.rotation.x = -Math.PI / 2;
    seaMesh.position.y = -1;
    seaMesh.receiveShadow = true;
    scene.add(seaMesh);

    scene.add(modelGroup);

    // Mouse Drag Rotation
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotationSpeed = 0.003;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      modelGroup.rotation.y += deltaX * 0.005;
      camera.position.y = Math.max(4, Math.min(45, camera.position.y + deltaY * 0.05));
      camera.lookAt(0, 8, 0);

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle water ripple
      const pos = seaGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        pos.setZ(i, Math.sin(u * 0.2 + elapsedTime * 1.5) * 0.15 + Math.cos(v * 0.2 + elapsedTime * 1.2) * 0.15);
      }
      pos.needsUpdate = true;

      // Gentle auto-spin when not dragging
      if (!isDragging && activeCameraView === 'orbit') {
        modelGroup.rotation.y += rotationSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Lighting Mode
  useEffect(() => {
    if (!lightsRef.current) return;
    const { dirLight, hemiLight } = lightsRef.current;

    if (lightingMode === 'day') {
      dirLight.color.set('#fed7aa');
      dirLight.intensity = 1.8;
      hemiLight.color.set('#f8fafc');
      hemiLight.groundColor.set('#0f172a');
    } else if (lightingMode === 'sunset') {
      dirLight.color.set('#f97316');
      dirLight.intensity = 2.4;
      hemiLight.color.set('#fdba74');
      hemiLight.groundColor.set('#31102f');
    } else {
      // night
      dirLight.color.set('#38bdf8');
      dirLight.intensity = 0.6;
      hemiLight.color.set('#1e293b');
      hemiLight.groundColor.set('#020617');
    }
  }, [lightingMode]);

  // Update Wireframe
  useEffect(() => {
    materialsRef.current.forEach((m) => {
      m.wireframe = wireframe;
    });
  }, [wireframe]);

  // Camera presets
  const setCameraPreset = (view: 'orbit' | 'front' | 'top' | 'side') => {
    setActiveCameraView(view);
    const camera = cameraRef.current;
    if (!camera) return;

    if (view === 'front') {
      camera.position.set(0, 10, 36);
      camera.lookAt(0, 8, 0);
    } else if (view === 'top') {
      camera.position.set(0, 48, 2);
      camera.lookAt(0, 0, 0);
    } else if (view === 'side') {
      camera.position.set(36, 16, 12);
      camera.lookAt(0, 8, 0);
    } else {
      camera.position.set(24, 18, 38);
      camera.lookAt(0, 8, 0);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-emerald-500/30 bg-parchment shadow-2xl">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className={`w-full ${height} cursor-grab active:cursor-grabbing`} />

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Camera Views Selector */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-parchment-50/90 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-xl">
          <button
            onClick={() => setCameraPreset('front')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeCameraView === 'front' ? 'bg-terracotta text-slate-950 shadow-md' : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            <Camera size={14} /> Front View
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeCameraView === 'top' ? 'bg-terracotta text-slate-950 shadow-md' : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            <Eye size={14} /> Top View
          </button>
          <button
            onClick={() => setCameraPreset('side')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeCameraView === 'side' ? 'bg-terracotta text-slate-950 shadow-md' : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            <RotateCcw size={14} /> Side / Orbit
          </button>
        </div>

        {/* Action Buttons: 3D Video & 3D Nav */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setVideoModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
          >
            <Play size={14} className="fill-slate-950" />
            <span>Watch 3D Experience</span>
          </button>

          <button
            onClick={() => setNavigationMode(!navigationMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
              navigationMode
                ? 'bg-terracotta text-slate-950 border-emerald-400'
                : 'bg-parchment-50/90 text-terracotta border-emerald-500/30 hover:bg-slate-800'
            }`}
          >
            <Navigation size={14} />
            <span>3D Navigation {navigationMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Bar: Lighting & Hotspots */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Lighting & Wireframe Controls */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 bg-parchment-50/90 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-xl">
          <button
            onClick={() => setLightingMode('day')}
            className={`p-2 rounded-xl text-xs font-bold transition ${
              lightingMode === 'day' ? 'bg-terracotta text-slate-950' : 'text-charcoal-light hover:text-charcoal'
            }`}
            title="Day Lighting"
          >
            <Sun size={16} />
          </button>
          <button
            onClick={() => setLightingMode('sunset')}
            className={`p-2 rounded-xl text-xs font-bold transition ${
              lightingMode === 'sunset' ? 'bg-amber-500 text-slate-950' : 'text-charcoal-light hover:text-charcoal'
            }`}
            title="Sunset Lighting"
          >
            <Sunset size={16} />
          </button>
          <button
            onClick={() => setLightingMode('night')}
            className={`p-2 rounded-xl text-xs font-bold transition ${
              lightingMode === 'night' ? 'bg-indigo-500 text-charcoal' : 'text-charcoal-light hover:text-charcoal'
            }`}
            title="Night Illumination"
          >
            <Moon size={16} />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              wireframe ? 'bg-terracotta text-slate-950' : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            <Box size={14} className="inline mr-1" /> Wireframe
          </button>
        </div>

        {/* Hotspots Dropdown */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-parchment-50/90 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-xl">
          <Info size={16} className="text-terracotta ml-2" />
          <span className="text-xs font-bold text-charcoal-light pr-1">Hotspots:</span>
          {hotspots.map((h) => (
            <button
              key={h.id}
              onClick={() => setActiveHotspot(h)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                activeHotspot?.id === h.id
                  ? 'bg-terracotta text-slate-950 font-bold'
                  : 'text-charcoal-light hover:text-charcoal hover:bg-slate-800'
              }`}
            >
              {h.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Hotspot Info Drawer */}
      {activeHotspot && (
        <div className="absolute top-20 right-4 z-20 w-80 bg-parchment-50/95 backdrop-blur-xl border border-sage rounded-3xl p-5 shadow-2xl text-charcoal animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-base font-bold text-charcoal leading-snug">{activeHotspot.title}</h4>
            <button onClick={() => setActiveHotspot(null)} className="text-charcoal-light hover:text-charcoal">✕</button>
          </div>
          <p className="text-xs text-charcoal-light leading-relaxed mb-4">{activeHotspot.description}</p>
          {onPlanVisit && (
            <button
              onClick={onPlanVisit}
              className="w-full py-2 rounded-xl bg-terracotta text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
            >
              Plan Route to this Landmark
            </button>
          )}
        </div>
      )}

      {/* 3D Navigation Overlay */}
      {navigationMode && (
        <div className="absolute bottom-20 left-4 z-20 bg-parchment-50/95 backdrop-blur-xl border border-sage rounded-2xl p-4 shadow-2xl text-charcoal max-w-sm">
          <div className="flex items-center gap-2 text-terracotta text-xs font-bold mb-1">
            <Navigation size={14} /> 3D Route Corridor Active
          </div>
          <p className="text-xs text-charcoal-light">
            Bearing 182° South towards Gateway of India. Distance from CSMT: 2.8 km.
          </p>
        </div>
      )}

      {/* Video Modal */}
      <VideoExperienceModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        placeName="Gateway of India"
        videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      />
    </div>
  );
};
