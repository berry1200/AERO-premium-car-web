import React, { useEffect, useRef, useState, useId } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Layers, 
  Wind, 
  Eye, 
  Volume2, 
  VolumeX, 
  Compass, 
  Gauge, 
  Maximize2,
  Sparkles,
  Camera,
  X
} from 'lucide-react';
import { CarSpec, View3DMode } from '../types';
import { startEngine, revEngine, stopEngine, playShiftGear } from '../utils/audioEngine';

interface Car3DStudioProps {
  car: CarSpec;
  currentColor: string;
  onColorChange?: (colorHex: string) => void;
  onClose?: () => void;
  className?: string;
}

export const Car3DStudio: React.FC<Car3DStudioProps> = ({
  car,
  currentColor,
  onColorChange,
  onClose,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rpmSliderId = useId();

  // State
  const [viewMode, setViewMode] = useState<View3DMode>('STUDIO');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [caliperColor, setCaliperColor] = useState('#ef4444');
  const [isDynoRunning, setIsDynoRunning] = useState(false);
  const [dynoRpm, setDynoRpm] = useState(1200);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeCamPreset, setActiveCamPreset] = useState<string>('front-3-4');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const bodyMaterialsRef = useRef<THREE.Material[]>([]);
  const wireframeMaterialsRef = useRef<THREE.LineSegments[]>([]);
  const caliperMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const particlePositionsRef = useRef<Float32Array | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 5, radius: 9.5 });
  const targetCamAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 5, radius: 9.5 });

  // Preset cameras
  const applyCameraPreset = (preset: string) => {
    setActiveCamPreset(preset);
    playShiftGear();
    if (preset === 'front-3-4') {
      targetCamAngleRef.current = { theta: Math.PI * 0.28, phi: 0.32, radius: 9.2 };
    } else if (preset === 'profile') {
      targetCamAngleRef.current = { theta: 0, phi: 0.18, radius: 8.8 };
    } else if (preset === 'rear-wing') {
      targetCamAngleRef.current = { theta: Math.PI * 0.85, phi: 0.38, radius: 8.5 };
    } else if (preset === 'top-cad') {
      targetCamAngleRef.current = { theta: 0.01, phi: Math.PI / 2 - 0.05, radius: 10.5 };
    } else if (preset === 'ground-stance') {
      targetCamAngleRef.current = { theta: Math.PI * 0.35, phi: 0.08, radius: 8.0 };
    }
  };

  // Build the sports car procedural geometry
  const createCarMesh = (accentHex: string) => {
    const carGroup = new THREE.Group();
    wheelsRef.current = [];
    bodyMaterialsRef.current = [];
    caliperMaterialsRef.current = [];
    wireframeMaterialsRef.current = [];

    // Car Body Main Material
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(accentHex),
      metalness: 0.75,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    bodyMaterialsRef.current.push(bodyMat);

    // Carbon fiber material
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.6,
    });

    // Glass material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      transmission: 0.85,
      opacity: 0.92,
      transparent: true,
      roughness: 0.08,
      metalness: 0.1,
      ior: 1.52,
    });

    // Interior Roll Cage / Dash
    const interiorMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.8,
    });

    // Main Chassis Monocoque (Lower Wedge)
    const chassisGeo = new THREE.BoxGeometry(4.2, 0.45, 1.95);
    const chassisMesh = new THREE.Mesh(chassisGeo, bodyMat);
    chassisMesh.position.y = 0.55;
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    carGroup.add(chassisMesh);

    // Aerodynamic Sculpted Hood & Nose Cone
    const noseGeo = new THREE.CylinderGeometry(0.85, 1.0, 1.8, 4);
    noseGeo.rotateZ(Math.PI / 2);
    noseGeo.rotateY(Math.PI / 4);
    const noseMesh = new THREE.Mesh(noseGeo, bodyMat);
    noseMesh.scale.set(0.9, 0.35, 1.9);
    noseMesh.position.set(1.4, 0.58, 0);
    carGroup.add(noseMesh);

    // Sloped Cabin Greenhouse Glass
    const cabinGeo = new THREE.CylinderGeometry(0.68, 0.98, 2.1, 4);
    cabinGeo.rotateZ(Math.PI / 2);
    cabinGeo.rotateY(Math.PI / 4);
    const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
    cabinMesh.scale.set(0.95, 0.55, 1.45);
    cabinMesh.position.set(-0.25, 1.08, 0);
    carGroup.add(cabinMesh);

    // Carbon Roof Panel
    const roofGeo = new THREE.BoxGeometry(1.65, 0.06, 1.32);
    const roofMesh = new THREE.Mesh(roofGeo, carbonMat);
    roofMesh.position.set(-0.28, 1.34, 0);
    carGroup.add(roofMesh);

    // Front Splitter (Two-Stage Carbon)
    const splitterGeo = new THREE.BoxGeometry(0.95, 0.06, 2.15);
    const splitterMesh = new THREE.Mesh(splitterGeo, carbonMat);
    splitterMesh.position.set(2.1, 0.28, 0);
    carGroup.add(splitterMesh);

    // Splitter Endplates
    const endplateLGeo = new THREE.BoxGeometry(0.35, 0.25, 0.04);
    const endplateL = new THREE.Mesh(endplateLGeo, carbonMat);
    endplateL.position.set(2.2, 0.38, 1.08);
    carGroup.add(endplateL);
    const endplateR = endplateL.clone();
    endplateR.position.z = -1.08;
    carGroup.add(endplateR);

    // Rear Carbon Swan-Neck GT Wing
    const wingBladeGeo = new THREE.BoxGeometry(0.48, 0.05, 2.2);
    const wingBlade = new THREE.Mesh(wingBladeGeo, carbonMat);
    wingBlade.position.set(-2.05, 1.48, 0);
    wingBlade.rotation.z = -0.08; // Aero angle of attack
    carGroup.add(wingBlade);

    // Swan-neck Stanchions (Dual pylons)
    const pylonGeo = new THREE.BoxGeometry(0.08, 0.55, 0.05);
    const pylonL = new THREE.Mesh(pylonGeo, carbonMat);
    pylonL.position.set(-1.88, 1.25, 0.55);
    pylonL.rotation.z = -0.25;
    carGroup.add(pylonL);
    const pylonR = pylonL.clone();
    pylonR.position.z = -0.55;
    carGroup.add(pylonR);

    // Wing Side Endplates
    const wingEndGeo = new THREE.BoxGeometry(0.45, 0.32, 0.03);
    const wingEndL = new THREE.Mesh(wingEndGeo, carbonMat);
    wingEndL.position.set(-2.05, 1.5, 1.1);
    carGroup.add(wingEndL);
    const wingEndR = wingEndL.clone();
    wingEndR.position.z = -1.1;
    carGroup.add(wingEndR);

    // Rear Diffuser with 4 vertical fins
    const diffuserGeo = new THREE.BoxGeometry(0.65, 0.12, 1.85);
    const diffuserMesh = new THREE.Mesh(diffuserGeo, carbonMat);
    diffuserMesh.position.set(-2.0, 0.3, 0);
    carGroup.add(diffuserMesh);

    for (let f = -3; f <= 3; f += 2) {
      const finGeo = new THREE.BoxGeometry(0.45, 0.18, 0.03);
      const finMesh = new THREE.Mesh(finGeo, carbonMat);
      finMesh.position.set(-2.05, 0.28, f * 0.25);
      carGroup.add(finMesh);
    }

    // Dual Titanium Exhaust Tips
    const exhaustGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.25, 16);
    exhaustGeo.rotateZ(Math.PI / 2);
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.15,
    });
    const exhaustL = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaustL.position.set(-2.15, 0.52, 0.28);
    carGroup.add(exhaustL);
    const exhaustR = exhaustL.clone();
    exhaustR.position.z = -0.28;
    carGroup.add(exhaustR);

    // LED Headlights / Lightbars
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const headlightGeo = new THREE.BoxGeometry(0.25, 0.08, 0.45);
    const headlightL = new THREE.Mesh(headlightGeo, headlightMat);
    headlightL.position.set(1.98, 0.64, 0.72);
    carGroup.add(headlightL);
    const headlightR = headlightL.clone();
    headlightR.position.z = -0.72;
    carGroup.add(headlightR);

    // Taillight Neon Lightbar
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const taillightGeo = new THREE.BoxGeometry(0.1, 0.06, 1.8);
    const taillightMesh = new THREE.Mesh(taillightGeo, taillightMat);
    taillightMesh.position.set(-2.1, 0.72, 0);
    carGroup.add(taillightMesh);

    // Internal V8/V10 Engine Block (visible in X-Ray)
    const engineBlockGeo = new THREE.BoxGeometry(1.1, 0.48, 0.85);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.85,
      roughness: 0.3,
    });
    const engineMesh = new THREE.Mesh(engineBlockGeo, engineMat);
    engineMesh.position.set(-0.85, 0.65, 0);
    carGroup.add(engineMesh);

    // 4 Wheels (Tire, Rim, Brake Rotor, Caliper)
    const wheelPositions = [
      { x: 1.42, y: 0.42, z: 0.98, isFront: true },
      { x: 1.42, y: 0.42, z: -0.98, isFront: true },
      { x: -1.45, y: 0.45, z: 1.02, isFront: false },
      { x: -1.45, y: 0.45, z: -1.02, isFront: false },
    ];

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.85,
      metalness: 0.1,
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x222429,
      metalness: 0.9,
      roughness: 0.2,
    });

    const rotorMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.1,
    });

    const caliperMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(caliperColor),
      metalness: 0.6,
      roughness: 0.2,
    });
    caliperMaterialsRef.current.push(caliperMat);

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      const radius = pos.isFront ? 0.42 : 0.45;
      const width = 0.32;

      // Rubber Tire
      const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
      tireGeo.rotateX(Math.PI / 2);
      const tireMesh = new THREE.Mesh(tireGeo, tireMat);
      wheelGroup.add(tireMesh);

      // Alloy Rim Spokes
      const rimGeo = new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, width + 0.02, 16);
      rimGeo.rotateX(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      wheelGroup.add(rimMesh);

      // Carbon Ceramic Brake Rotor
      const rotorGeo = new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, 0.04, 16);
      rotorGeo.rotateX(Math.PI / 2);
      const rotorMesh = new THREE.Mesh(rotorGeo, rotorMat);
      wheelGroup.add(rotorMesh);

      // Brembo Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.18, 0.16, 0.12);
      const caliperMesh = new THREE.Mesh(caliperGeo, caliperMat);
      caliperMesh.position.set(0, radius * 0.38, 0);
      wheelGroup.add(caliperMesh);

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    // Wireframe overlay for CAD / Blueprint Mode
    carGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const wireframeGeo = new THREE.WireframeGeometry(child.geometry);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.0, // hidden initially
          linewidth: 1,
        });
        const wireframeLines = new THREE.LineSegments(wireframeGeo, lineMat);
        wireframeLines.position.copy(child.position);
        wireframeLines.rotation.copy(child.rotation);
        wireframeLines.scale.copy(child.scale);
        wireframeMaterialsRef.current.push(wireframeLines);
        carGroup.add(wireframeLines);
      }
    });

    return carGroup;
  };

  // Build Wind Tunnel Flow Particles
  const createAirflowParticles = () => {
    const particleCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Start ahead of car
      positions[idx] = 4.5 + Math.random() * 2.5; // X: in front
      positions[idx + 1] = 0.2 + Math.random() * 1.8; // Y: height
      positions[idx + 2] = (Math.random() - 0.5) * 3.2; // Z: width

      // Airflow velocity color (high velocity cyan to low velocity red)
      const t = Math.random();
      colors[idx] = t > 0.7 ? 0.9 : 0.1; // R
      colors[idx + 1] = t > 0.7 ? 0.2 : 0.8; // G
      colors[idx + 2] = 0.95; // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const pMesh = new THREE.Points(geometry, pMat);
    particlePositionsRef.current = positions;
    particlesRef.current = pMesh;
    return pMesh;
  };

  // Switch Rendering Mode
  useEffect(() => {
    if (!carGroupRef.current) return;

    if (viewMode === 'STUDIO') {
      bodyMaterialsRef.current.forEach((mat) => {
        if (mat instanceof THREE.MeshPhysicalMaterial) {
          mat.wireframe = false;
          mat.transparent = false;
          mat.opacity = 1.0;
        }
      });
      wireframeMaterialsRef.current.forEach((lines) => {
        (lines.material as THREE.LineBasicMaterial).opacity = 0.0;
      });
      if (particlesRef.current) particlesRef.current.visible = false;
    } else if (viewMode === 'BLUEPRINT') {
      bodyMaterialsRef.current.forEach((mat) => {
        if (mat instanceof THREE.MeshPhysicalMaterial) {
          mat.wireframe = true;
          mat.transparent = true;
          mat.opacity = 0.35;
        }
      });
      wireframeMaterialsRef.current.forEach((lines) => {
        (lines.material as THREE.LineBasicMaterial).opacity = 0.75;
      });
      if (particlesRef.current) particlesRef.current.visible = false;
    } else if (viewMode === 'WIND_TUNNEL') {
      bodyMaterialsRef.current.forEach((mat) => {
        if (mat instanceof THREE.MeshPhysicalMaterial) {
          mat.wireframe = false;
          mat.transparent = true;
          mat.opacity = 0.75;
        }
      });
      wireframeMaterialsRef.current.forEach((lines) => {
        (lines.material as THREE.LineBasicMaterial).opacity = 0.15;
      });
      if (particlesRef.current) particlesRef.current.visible = true;
    } else if (viewMode === 'X_RAY') {
      bodyMaterialsRef.current.forEach((mat) => {
        if (mat instanceof THREE.MeshPhysicalMaterial) {
          mat.wireframe = false;
          mat.transparent = true;
          mat.opacity = 0.28;
        }
      });
      wireframeMaterialsRef.current.forEach((lines) => {
        (lines.material as THREE.LineBasicMaterial).opacity = 0.45;
      });
      if (particlesRef.current) particlesRef.current.visible = false;
    }
  }, [viewMode]);

  // Update Body Paint Color
  useEffect(() => {
    bodyMaterialsRef.current.forEach((mat) => {
      if (mat instanceof THREE.MeshPhysicalMaterial) {
        mat.color.set(currentColor);
      }
    });
  }, [currentColor]);

  // Update Caliper Color
  useEffect(() => {
    caliperMaterialsRef.current.forEach((mat) => {
      mat.color.set(caliperColor);
    });
  }, [caliperColor]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08090b);
    sceneRef.current = scene;

    // Subtle dark fog for infinite studio depth
    scene.fog = new THREE.FogExp2(0x08090b, 0.045);

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Renderer with high precision
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Lighting (Studio Showroom Rig)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Rim / Backlight (Motorsport Dramatic Accent)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 1.2);
    fillLight.position.set(0, 6, -6);
    scene.add(fillLight);

    // Studio Floor with Blueprint Grid
    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d11,
      roughness: 0.65,
      metalness: 0.35,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // CAD Measuring Grid in Floor
    const gridHelper = new THREE.GridHelper(24, 24, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.002;
    scene.add(gridHelper);

    // Add Car Model
    const carGroup = createCarMesh(currentColor);
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // Add Wind Tunnel Flow
    const airflow = createAirflowParticles();
    airflow.visible = false;
    scene.add(airflow);

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Smooth camera interpolation toward target
      const cam = cameraRef.current;
      if (cam) {
        const cur = cameraAngleRef.current;
        const target = targetCamAngleRef.current;

        // Auto rotate if enabled and not dragging
        if (isAutoRotate && !isDraggingRef.current) {
          target.theta += 0.35 * delta;
        }

        // Interpolate angles
        cur.theta += (target.theta - cur.theta) * 0.08;
        cur.phi += (target.phi - cur.phi) * 0.08;
        cur.radius += (target.radius - cur.radius) * 0.08;

        // Spherical to Cartesian
        const x = cur.radius * Math.cos(cur.phi) * Math.sin(cur.theta);
        const y = cur.radius * Math.sin(cur.phi);
        const z = cur.radius * Math.cos(cur.phi) * Math.cos(cur.theta);

        cam.position.set(x, Math.max(y, 0.4), z);
        cam.lookAt(0, 0.65, 0);
      }

      // Rotate wheels if Dyno running
      if (isDynoRunning) {
        const wheelRotSpeed = (dynoRpm / 60) * Math.PI * 2 * delta * 0.2;
        wheelsRef.current.forEach((w) => {
          w.rotation.z += wheelRotSpeed;
        });
      }

      // Animate Wind Tunnel Streamlines
      if (viewMode === 'WIND_TUNNEL' && particlePositionsRef.current && particlesRef.current) {
        const positions = particlePositionsRef.current;
        const count = positions.length / 3;
        const flowSpeed = (isDynoRunning ? 14 : 7) * delta;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          positions[idx] -= flowSpeed; // move backward along -X
          
          // Deflect around car body
          const px = positions[idx];
          const py = positions[idx + 1];
          const pz = positions[idx + 2];

          // If close to hood/roof, lift upwards
          if (px > -2.2 && px < 2.0 && Math.abs(pz) < 1.1) {
            positions[idx + 1] += 0.15 * delta;
          }

          // Reset when behind car
          if (positions[idx] < -4.5) {
            positions[idx] = 4.5 + Math.random() * 1.5;
            positions[idx + 1] = 0.2 + Math.random() * 1.8;
            positions[idx + 2] = (Math.random() - 0.5) * 3.0;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize Observer for flawless responsive canvas
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Mouse & Touch interaction handlers for 360 Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMousePosRef.current.x;
    const dy = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    const target = targetCamAngleRef.current;
    target.theta -= dx * 0.0075;
    target.phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.05, target.phi + dy * 0.006));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const target = targetCamAngleRef.current;
    target.radius = Math.max(4.5, Math.min(16, target.radius + e.deltaY * 0.008));
  };

  // Toggle Dyno Test
  const toggleDyno = () => {
    const nextState = !isDynoRunning;
    setIsDynoRunning(nextState);
    if (nextState) {
      if (soundEnabled) {
        startEngine(car.engine);
        revEngine(0.4);
      }
      setDynoRpm(3800);
    } else {
      stopEngine();
      setDynoRpm(1200);
    }
  };

  // Dyno RPM Slider
  const handleRpmChange = (newRpm: number) => {
    setDynoRpm(newRpm);
    if (isDynoRunning && soundEnabled) {
      revEngine(newRpm / 9000);
    }
  };

  // Toggle Sound
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      if (isDynoRunning) {
        startEngine(car.engine);
        revEngine(dynoRpm / 9000);
      }
    } else {
      stopEngine();
    }
  };

  return (
    <div id="car-3d-studio-container" className={`relative w-full rounded-[2px] overflow-hidden border border-white/5 bg-[#0a0a0a] ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[540px] md:h-[620px] relative cursor-grab active:cursor-grabbing touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* CAD Crosshairs & Overlay Coordinates */}
        <div className="absolute inset-0 pointer-events-none p-4 md:p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="bg-[#0a0a0a]/90 backdrop-blur-md px-3 py-1.5 rounded-[2px] border border-white/10 font-mono text-xs text-white/80">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-2" />
              <span>3D STUDIO // {car.brand} {car.model}</span>
              <div className="text-[10px] text-white/40 mt-0.5">
                PITCH: 14.2° | YAW: {(cameraAngleRef.current.theta * (180 / Math.PI) % 360).toFixed(1)}° | SCALE: 1:1
              </div>
            </div>

            {/* View Mode Badge & Close Section Tab */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 bg-[#0a0a0a]/90 backdrop-blur-md p-1 rounded-[2px] border border-white/10">
                {(['STUDIO', 'BLUEPRINT', 'WIND_TUNNEL', 'X_RAY'] as View3DMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setViewMode(mode);
                      playShiftGear();
                    }}
                    className={`pointer-events-auto px-2.5 py-1 text-[10px] font-mono rounded-[2px] uppercase tracking-wider transition-colors ${
                      viewMode === mode
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {mode === 'WIND_TUNNEL' ? 'WIND TUNNEL' : mode}
                  </button>
                ))}
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="pointer-events-auto flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-[2px] shadow-md transition-colors"
                  title="Close 3D Studio"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>CLOSE [X]</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom HUD: Telemetry readouts and dimensions in space */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-3 rounded-[2px] border border-white/10 font-mono text-xs max-w-xs">
              <div className="text-[10px] uppercase text-white/40 tracking-wider">AERODYNAMIC TELEMETRY</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1.5 text-white/70 text-[11px]">
                <div>DOWNFORCE: <span className="text-white font-bold">{car.downforce?.split(' ')[0] || '409'} KG</span></div>
                <div>DRAG COEFF: <span className="text-white/90 font-bold">0.31 Cd</span></div>
                <div>LENGTH: <span className="text-white">{car.lengthMm} MM</span></div>
                <div>WIDTH: <span className="text-white">{car.widthMm} MM</span></div>
              </div>
            </div>

            {/* Quick Camera Preset Controls */}
            <div className="pointer-events-auto flex items-center gap-1 bg-[#0a0a0a]/90 backdrop-blur-md p-1.5 rounded-[2px] border border-white/10 font-mono">
              <button
                type="button"
                onClick={() => applyCameraPreset('front-3-4')}
                className={`px-2 py-1 text-[10px] rounded-[2px] uppercase tracking-wider transition-colors ${activeCamPreset === 'front-3-4' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                3/4 FRONT
              </button>
              <button
                type="button"
                onClick={() => applyCameraPreset('profile')}
                className={`px-2 py-1 text-[10px] rounded-[2px] uppercase tracking-wider transition-colors ${activeCamPreset === 'profile' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                PROFILE
              </button>
              <button
                type="button"
                onClick={() => applyCameraPreset('rear-wing')}
                className={`px-2 py-1 text-[10px] rounded-[2px] uppercase tracking-wider transition-colors ${activeCamPreset === 'rear-wing' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                AERO WING
              </button>
              <button
                type="button"
                onClick={() => applyCameraPreset('top-cad')}
                className={`px-2 py-1 text-[10px] rounded-[2px] uppercase tracking-wider transition-colors ${activeCamPreset === 'top-cad' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                TOP CAD
              </button>
              <button
                type="button"
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`px-2 py-1 text-[10px] rounded-[2px] uppercase tracking-wider flex items-center gap-1 transition-colors ${isAutoRotate ? 'bg-white/15 text-white border border-white/20' : 'text-white/40 hover:text-white'}`}
                title="Toggle Turntable Rotation"
              >
                <RotateCw className="w-3 h-3" />
                360°
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Paint Color, Calipers, Dyno Throttle, Sound */}
      <div className="p-4 md:p-5 bg-[#0e0e0e] border-t border-white/5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 font-mono">
        {/* Paint Swatches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/40 uppercase tracking-wider mr-2">BODY SPEC:</span>
          {car.availableColors.map((col) => (
            <button
              key={col.hex}
              type="button"
              onClick={() => {
                onColorChange?.(col.hex);
                playShiftGear();
              }}
              className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                currentColor === col.hex
                  ? 'border-white scale-110 ring-2 ring-white/40'
                  : 'border-white/20 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: col.hex }}
              title={col.name}
            />
          ))}

          {/* Caliper Color Accent */}
          <div className="ml-4 flex items-center gap-2 pl-4 border-l border-white/10">
            <span className="text-xs text-white/40 uppercase tracking-wider">CALIPER:</span>
            {[
              { hex: '#ef4444', label: 'Brembo Red' },
              { hex: '#facc15', label: 'Acid Yellow' },
              { hex: '#10b981', label: 'Racing Green' },
              { hex: '#06b6d4', label: 'Petronas Cyan' },
            ].map((cal) => (
              <button
                key={cal.hex}
                type="button"
                onClick={() => setCaliperColor(cal.hex)}
                className={`w-4 h-4 rounded-[2px] border ${
                  caliperColor === cal.hex ? 'border-white scale-110' : 'border-white/20'
                }`}
                style={{ backgroundColor: cal.hex }}
                title={cal.label}
              />
            ))}
          </div>
        </div>

        {/* Dyno Simulator & Engine Audio */}
        <div className="flex items-center gap-3">
          {/* Audio Engine Button */}
          <button
            type="button"
            onClick={toggleSound}
            className={`px-3 py-2 rounded-[2px] border text-xs flex items-center gap-1.5 uppercase tracking-wider transition-colors ${
              soundEnabled
                ? 'bg-white text-black font-bold border-white'
                : 'bg-[#080808] border-white/10 text-white/40 hover:text-white'
            }`}
            title="Real-time Web Audio API Engine Synthesizer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>ENGINE SOUND</span>
          </button>

          {/* Dyno Test Switch */}
          <button
            type="button"
            onClick={toggleDyno}
            className={`px-4 py-2 rounded-[2px] border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              isDynoRunning
                ? 'bg-white text-black border-white shadow-lg shadow-white/5'
                : 'bg-[#080808] border-white/20 text-white/80 hover:bg-white hover:text-black'
            }`}
          >
            <Gauge className={`w-3.5 h-3.5 ${isDynoRunning ? 'animate-spin' : ''}`} />
            <span>{isDynoRunning ? 'DYNO ACTIVE' : 'IGNITION / DYNO'}</span>
          </button>

          {/* RPM Slider (when Dyno is active) */}
          {isDynoRunning && (
            <div className="flex items-center gap-2 bg-[#080808] px-3 py-1.5 rounded-[2px] border border-white/10">
              <label htmlFor={rpmSliderId} className="text-[10px] text-white font-bold min-w-[55px] cursor-pointer">
                {dynoRpm} RPM
              </label>
              <input
                id={rpmSliderId}
                type="range"
                min="1000"
                max="9000"
                step="200"
                value={dynoRpm}
                onChange={(e) => handleRpmChange(Number(e.target.value))}
                className="w-24 accent-white h-1.5 bg-zinc-800 rounded-none appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
