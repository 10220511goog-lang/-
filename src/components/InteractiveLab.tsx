import React, { useState, useEffect, useRef } from "react";
import { Camera, RefreshCw, Sparkles, Activity, ShieldAlert, Sliders, Play, Maximize2, Minimize2, Video, VideoOff, Info, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Declare external MediaPipe namespaces in global window to satisfy TypeScript
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  ox: number; // original spot for grid snapping
  oy: number;
  oz: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export default function InteractiveLab() {
  // UI states
  const [activeModel, setActiveModel] = useState<string>("healing"); // spore, crystal, healing
  const [particleColor, setParticleColor] = useState<string>("#10b981"); // Emerald default
  const [particlesCount, setParticlesCount] = useState<number>(2000); // Dense & delicate
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const [gestureState, setGestureState] = useState<"OPEN" | "PINCH" | "OFFLINE">("OFFLINE");
  const [pinchStrength, setPinchStrength] = useState<number>(0.5); // 0 (closed fist) to 1 (fully open)
  const [manualControl, setManualControl] = useState<number>(0.5); // Fallback slider when camera is off
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackingCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animation and physics simulation values stored in refs for maximum performance (60 fps)
  const particlesRef = useRef<Particle3D[]>([]);
  const rotationAngleRef = useRef<{ x: number; y: number }>({ x: 0.1, y: 0.2 });
  const handPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPinchRef = useRef<number>(0.5);
  const currentPinchRef = useRef<number>(0.5);
  const animationFrameIdRef = useRef<number | null>(null);

  // Active tracking state references for cleanup / updates
  const activeCameraRef = useRef<any>(null);
  const activeHandsRef = useRef<any>(null);

  // Preset models config
  const models = [
    {
      id: "spore",
      name: "孢子生命活化 (Spore Biome)",
      desc: "模擬細菌孢子隨水分喚醒並進行擴散、游動分裂的懸浮生命狀態。張手使孢子快速分裂擴散，握拳則縮聚於生長核心。",
    },
    {
      id: "crystal",
      name: "碳酸鈣結晶重塑 (CaCO₃ Bond)",
      desc: "模擬生化石灰石分子結構的重組成型。張手時呈游離鈣離子雲，捏合拳頭時，分子立即對齊，拼合出微結構剛性骨架。",
    },
    {
      id: "healing",
      name: "超耐久裂縫合龍 (Pore Clogging)",
      desc: "模擬混凝土破裂面的自我修復過程。當檢測到手勢收緊時，白色結晶分子強力嵌入並密封橫跨 3D 灰色混凝土的破裂通道。",
    }
  ];

  // Load MediaPipe scripts on client-side mount
  useEffect(() => {
    let scriptLoaded = false;
    const loadMediaPipeScripts = async () => {
      try {
        if (!window.Hands) {
          const handsScript = document.createElement("script");
          handsScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
          handsScript.crossOrigin = "anonymous";
          handsScript.async = true;
          document.head.appendChild(handsScript);

          await new Promise((resolve) => {
            handsScript.onload = resolve;
          });
        }
        
        if (!window.Camera) {
          const cameraScript = document.createElement("script");
          cameraScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
          cameraScript.crossOrigin = "anonymous";
          cameraScript.async = true;
          document.head.appendChild(cameraScript);

          await new Promise((resolve) => {
            cameraScript.onload = resolve;
          });
        }
        scriptLoaded = true;
      } catch (err) {
        console.error("Failed to load MediaPipe from CDN:", err);
        setErrorMessage("無法讀取手勢感測模組，請使用手動拉桿操作。");
      }
    };

    loadMediaPipeScripts();

    // Init particles
    generateParticles(activeModel, particlesCount);

    return () => {
      cleanupCamera();
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  // Update particles count or model type
  useEffect(() => {
    generateParticles(activeModel, particlesCount);
  }, [activeModel, particlesCount]);

  // Set default color theme depending on current particleColor selection
  const getRGBA = (hex: string, alpha: number) => {
    // Parse hex
    let r = 16, g = 185, b = 129;
    if (hex.startsWith("#")) {
      const parsedHex = hex.replace("#", "");
      if (parsedHex.length === 3) {
        r = parseInt(parsedHex[0] + parsedHex[0], 16);
        g = parseInt(parsedHex[1] + parsedHex[1], 16);
        b = parseInt(parsedHex[2] + parsedHex[2], 16);
      } else if (parsedHex.length === 6) {
        r = parseInt(parsedHex.substring(0, 2), 16);
        g = parseInt(parsedHex.substring(2, 4), 16);
        b = parseInt(parsedHex.substring(4, 6), 16);
      }
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const generateParticles = (modelId: string, count: number) => {
    const list: Particle3D[] = [];
    const sizeRange = modelId === "spore" ? [1, 2.5] : modelId === "crystal" ? [1, 2] : [0.8, 1.8];

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;
      let ox = 0, oy = 0, oz = 0;

      if (modelId === "spore") {
        // Torus / sphere shape
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 100 + Math.random() * 80;
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      } else if (modelId === "crystal") {
        // Hexagonal grid structure layout
        const spacing = 35;
        const gridX = (i % 12) - 6;
        const gridY = (Math.floor(i / 12) % 12) - 6;
        const gridZ = (Math.floor(i / 144) % 12) - 6;

        ox = gridX * spacing + (Math.random() - 0.5) * 5;
        oy = gridY * spacing + (Math.random() - 0.5) * 5;
        oz = gridZ * spacing + (Math.random() - 0.5) * 5;

        // Spread initial raw coordinates randomly
        const spread = 280;
        x = (Math.random() - 0.5) * spread;
        y = (Math.random() - 0.5) * spread;
        z = (Math.random() - 0.5) * spread;
      } else {
        // Crack healing: alignment along a fracture line spanning X
        // Gray concrete block boundary representation
        const isCrackBoundary = Math.random() > 0.35;
        if (isCrackBoundary) {
          // Inside the dynamic narrow 3D slot representing the concrete crack
          // y = 0 will be the fracture gap line
          ox = (Math.random() - 0.5) * 400; // Left-Right width
          oy = (Math.random() - 0.5) * 20;  // Narrow joint gap
          oz = (Math.random() - 0.5) * 120; // In/Out depth
        } else {
          // Surrounding concrete block substrate points
          ox = (Math.random() - 0.5) * 400;
          oy = (Math.random() > 0.5 ? 40 : -40) + (Math.random() - 0.5) * 50;
          oz = (Math.random() - 0.5) * 120;
        }

        const angle = Math.random() * Math.PI * 2;
        const dist = 180 + Math.random() * 120;
        x = Math.cos(angle) * dist;
        y = Math.sin(angle) * dist;
        z = (Math.random() - 0.5) * 200;
      }

      list.push({
        x,
        y,
        z,
        ox,
        oy,
        oz,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        vz: (Math.random() - 0.5) * 1.5,
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        color: particleColor,
        alpha: Math.random() * 0.4 + 0.4,
        pulseSpeed: 0.02 + Math.random() * 0.04,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    particlesRef.current = list;
  };

  // Start gesture capture video
  const startCamera = async () => {
    if (!window.Hands || !window.Camera) {
      setErrorMessage("手勢辨識模組加載中，請待 1-2 秒後再次點擊啟動相機。");
      return;
    }

    setErrorMessage("");
    setCameraLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 365, facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize hands model
      const hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.52,
        minTrackingConfidence: 0.52
      });

      hands.onResults(onHandResults);

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 320,
        height: 240
      });

      await camera.start();

      activeCameraRef.current = camera;
      activeHandsRef.current = hands;
      setIsCameraActive(true);
      setCameraLoading(false);
      setGestureState("OPEN");
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setErrorMessage("偵測不到相機鏡頭，或者您的瀏覽器封鎖了相機權限。");
      setCameraLoading(false);
      setIsCameraActive(false);
    }
  };

  const cleanupCamera = () => {
    if (activeCameraRef.current) {
      activeCameraRef.current.stop();
      activeCameraRef.current = null;
    }
    if (activeHandsRef.current) {
      activeHandsRef.current.close?.();
      activeHandsRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setHandDetected(false);
    setGestureState("OFFLINE");
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      cleanupCamera();
    } else {
      startCamera();
    }
  };

  const onHandResults = (results: any) => {
    const canvas = trackingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      const landmarks = results.multiHandLandmarks[0];

      // Render hand skeletal tracking system on overlay
      if (showSkeleton) {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.85)"; // Emerald tracking line
        ctx.lineWidth = 2.5;

        // Connections diagram
        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4], // thumb
          [0, 5], [5, 6], [6, 7], [7, 8], // index
          [5, 9], [9, 10], [10, 11], [11, 12], // middle
          [9, 13], [13, 14], [14, 15], [15, 16], // ring
          [13, 17], [0, 17], [17, 18], [18, 19], [19, 20] // pinky
        ];

        // Draw skeletons lines
        for (const [p1, p2] of connections) {
          ctx.beginPath();
          ctx.moveTo(landmarks[p1].x * canvas.width, landmarks[p1].y * canvas.height);
          ctx.lineTo(landmarks[p2].x * canvas.width, landmarks[p2].y * canvas.height);
          ctx.stroke();
        }

        // Draw joint points
        for (let i = 0; i < landmarks.length; i++) {
          ctx.beginPath();
          ctx.arc(landmarks[i].x * canvas.width, landmarks[i].y * canvas.height, 4, 0, Math.PI * 2);
          ctx.fillStyle = i === 4 || i === 8 || i === 12 || i === 16 || i === 20 ? "#34d399" : "#ffffff";
          ctx.fill();
        }
      }

      // Compute hand center to rotate angle based on hand moving directions
      const indexKnuckle = landmarks[5];
      const wrist = landmarks[0];
      const normalizedX = (indexKnuckle.x - 0.5) * 2; // -1 to 1
      const normalizedY = (indexKnuckle.y - 0.5) * 2; // -1 to 1
      handPosRef.current = { x: normalizedX, y: normalizedY };

      // Multi-finger pinch calculation:
      // Euclidean distance of finger tips relative to wrist, normalized by hand scale (0 to 9 knuckle distance)
      const d0_9 = Math.hypot(landmarks[9].x - wrist.x, landmarks[9].y - wrist.y);
      const tips = [4, 8, 12, 16, 20];
      let sumDistancePoints = 0;
      for (const tip of tips) {
        sumDistancePoints += Math.hypot(landmarks[tip].x - wrist.x, landmarks[tip].y - wrist.y);
      }
      const rawRatio = sumDistancePoints / (5 * d0_9);

      // Map raw ratio to continuous pinch strength: 
      // Fully open returns around 1.8 -> pinchStrength ~ 1.0
      // Closed fists return around 0.95 -> pinchStrength ~ 0.0
      let normStrength = (rawRatio - 0.95) / (1.80 - 0.95);
      normStrength = Math.max(0, Math.min(1, normStrength));

      targetPinchRef.current = normStrength;
      setPinchStrength(normStrength);
      setGestureState(normStrength < 0.35 ? "PINCH" : "OPEN");
    } else {
      setHandDetected(false);
      setGestureState("OPEN");
    }
  };

  // Main 3D render thread
  useEffect(() => {
    let width = 800;
    let height = 550;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.width * 0.7 > 520 ? 520 : rect.width * 0.7;
        width = canvas.width;
        height = canvas.height;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Projection calculation: 3D coordinates -> 2D ortho with perspective depth
    const renderLoop = () => {
      // Clear background
      ctx.fillStyle = "rgba(9, 11, 9, 0.95)";
      ctx.fillRect(0, 0, width, height);

      // Ambient scan lines background effect
      ctx.strokeStyle = "rgba(16, 185, 129, 0.03)";
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Smooth interpolation of pinch power to prevent jerky frame jumps
      const speedTerm = isCameraActive && handDetected ? 0.08 : 0.12;
      const actualPinchRef = isCameraActive && handDetected ? targetPinchRef.current : manualControl;
      currentPinchRef.current += (actualPinchRef - currentPinchRef.current) * speedTerm;
      const currentPower = currentPinchRef.current; // 0: Closed fist, 1: Spread wide

      // Interactive auto-rotation vs mouse tracking
      if (autoRotate) {
        rotationAngleRef.current.y += 0.0035;
        if (isCameraActive && handDetected) {
          // Hand position offsets camera tilt
          rotationAngleRef.current.x += (handPosRef.current.y * 0.4 - rotationAngleRef.current.x) * 0.05;
          rotationAngleRef.current.y += (handPosRef.current.x * 0.45 - rotationAngleRef.current.y) * 0.015;
        }
      }

      const cosX = Math.cos(rotationAngleRef.current.x);
      const sinX = Math.sin(rotationAngleRef.current.x);
      const cosY = Math.cos(rotationAngleRef.current.y);
      const sinY = Math.sin(rotationAngleRef.current.y);

      // Depth parameters
      const fov = 350;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw active model specific auxiliary guides in background
      if (activeModel === "healing") {
        // Render 3D outline boundaries representing standard concrete blocks on sides of a crack
        ctx.strokeStyle = "rgba(110, 110, 110, 0.22)";
        ctx.lineWidth = 2.5;

        const leftBlock = [
          { x: -200, y: -40, z: -60 }, { x: -30, y: -40, z: -60 },
          { x: -30, y: -40, z: 60 }, { x: -200, y: -40, z: 60 },
          { x: -200, y: 40, z: -60 }, { x: -30, y: 40, z: -60 },
          { x: -30, y: 40, z: 60 }, { x: -200, y: 40, z: 60 }
        ];

        const rightBlock = [
          { x: 30, y: -40, z: -60 }, { x: 200, y: -40, z: -60 },
          { x: 200, y: -40, z: 60 }, { x: 30, y: -40, z: 60 },
          { x: 30, y: 40, z: -60 }, { x: 200, y: 40, z: -60 },
          { x: 200, y: 40, z: 60 }, { x: 30, y: 40, z: 60 }
        ];

        const renderWireframeBlock = (blockPoints: { x: number; y: number; z: number }[]) => {
          const proj: { x: number; y: number }[] = [];
          for (const p of blockPoints) {
            // Apply coordinates rotation
            const x1 = p.x * cosY - p.z * sinY;
            const z1 = p.z * cosY + p.x * sinY;
            const y2 = p.y * cosX - z1 * sinX;
            const z2 = z1 * cosX + p.y * sinX;

            const projSz = fov / (fov + z2);
            proj.push({
              x: centerX + x1 * projSz,
              y: centerY + y2 * projSz
            });
          }

          // Connections schema
          const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Top ring
            [4, 5], [5, 6], [6, 7], [7, 4], // Bottom ring
            [0, 4], [1, 5], [2, 6], [3, 7]  // Vertical bounds
          ];

          ctx.beginPath();
          for (const [u, v] of edges) {
            ctx.moveTo(proj[u].x, proj[u].y);
            ctx.lineTo(proj[v].x, proj[v].y);
          }
          ctx.stroke();
        };

        renderWireframeBlock(leftBlock);
        renderWireframeBlock(rightBlock);

        // Crack fracture visual label lines
        ctx.fillStyle = "rgba(224, 231, 224, 0.45)";
        ctx.font = "8px monospace";
        ctx.fillText("3D CONCRETE CRACK GAP: 1.0mm", centerX - 70, centerY - height * 0.42);
      } else if (activeModel === "spore") {
        // Draw orbital concentric rings in 3D representing biological growth
        ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
        ctx.lineWidth = 1;
        const drawRing = (radius: number) => {
          ctx.beginPath();
          for (let th = 0; th <= Math.PI * 2; th += 0.08) {
            const rx = Math.cos(th) * radius;
            const rz = Math.sin(th) * radius;
            const ry = 0;

            const x1 = rx * cosY - rz * sinY;
            const z1 = rz * cosY + rx * sinY;
            const y2 = ry * cosX - z1 * sinX;
            const z2 = z1 * cosX + ry * sinX;

            const dScale = fov / (fov + z2);
            const px = centerX + x1 * dScale;
            const py = centerY + y2 * dScale;

            if (th === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        };

        drawRing(110);
        drawRing(170);
      }

      // Process and render particles array
      const list = particlesRef.current;
      const projected: { x: number; y: number; scaleSize: number; original: Particle3D; alpha: number }[] = [];

      for (const p of list) {
        let tx = p.x;
        let ty = p.y;
        let tz = p.z;

        // Custom physics animations per models
        if (activeModel === "spore") {
          // Vortex flow: swirl orbiting speed depends heavily on hand pinch scale
          const orbitalRadius = Math.hypot(p.x, p.z);
          // Scale control: pinch contracts particles toward center nucleus, open expands widely
          const targetRad = (100 + Math.sin(p.pulsePhase) * 20) * (currentPower * 1.5 + 0.35);
          const correction = (targetRad - orbitalRadius) * 0.05;

          const angle = Math.atan2(p.z, p.x) + (0.015 + (1 - currentPower) * 0.035);
          p.x = Math.cos(angle) * (orbitalRadius + correction);
          p.z = Math.sin(angle) * (orbitalRadius + correction);
          
          // Hover wave oscillating height
          p.y += p.vy * (currentPower * 1.5 + 0.5);
          if (Math.abs(p.y) > 130) p.vy *= -1;

          tx = p.x;
          ty = p.y;
          tz = p.z;
        } else if (activeModel === "crystal") {
          // Rigid structural layout snap
          // 0 is fully compressed fist: snap 100% to crystalline lattice target points
          // 1 is wide open: wander and float around randomly with high kinetic speed
          const interpolationFactor = Math.pow(currentPower, 1.8); // exponential for responsive feel

          // Snap destination target based on base configuration state (ox, oy, oz)
          const desX = p.ox;
          const desY = p.oy;
          const desZ = p.oz;

          // Free float random offset
          p.pulsePhase += p.pulseSpeed;
          const noiseX = Math.sin(p.pulsePhase * 0.5) * 60;
          const noiseY = Math.cos(p.pulsePhase * 0.8) * 60;
          const noiseZ = Math.sin(p.pulsePhase * 1.1) * 60;

          // Interpolated spot
          tx = desX * (1 - interpolationFactor) + (desX + noiseX) * interpolationFactor;
          ty = desY * (1 - interpolationFactor) + (desY + noiseY) * interpolationFactor;
          tz = desZ * (1 - interpolationFactor) + (desZ + noiseZ) * interpolationFactor;
        } else {
          // Healing fracture process:
          // Pinching (power close to 0) acts as crystallization lock. Free floating elements get sucked into the crack slab!
          const forceFactor = 1 - currentPower; // 1 = strong attraction, 0 = free escape
          
          const targetX = p.ox;
          const targetY = p.oy;
          const targetZ = p.oz;

          // Active gravity pull logic
          const distToGrid = Math.hypot(p.x - targetX, p.y - targetY, p.z - targetZ);
          if (forceFactor > 0.03 && distToGrid > 1.5) {
            p.x += (targetX - p.x) * (0.02 + forceFactor * 0.06);
            p.y += (targetY - p.y) * (0.02 + forceFactor * 0.06);
            p.z += (targetZ - p.z) * (0.02 + forceFactor * 0.06);
          } else {
            // Natural drifting
            p.pulsePhase += p.pulseSpeed * 0.3;
            p.x += Math.sin(p.pulsePhase + p.y * 0.01) * 0.15;
            p.y += p.vy * 0.18;
            p.z += p.vz * 0.18;

            // Re-bound box limits
            if (Math.abs(p.x) > 280) p.vx *= -1;
            if (Math.abs(p.y) > 160) p.vy *= -1;
            if (Math.abs(p.z) > 160) p.vz *= -1;
          }

          tx = p.x;
          ty = p.y;
          tz = p.z;
        }

        // Apply 3D coordinate orbit rotation around centerpiece
        const x1 = tx * cosY - tz * sinY;
        const z1 = tz * cosY + tx * sinY;
        const y2 = ty * cosX - z1 * sinX;
        const z2 = z1 * cosX + ty * sinX;

        const projScale = fov / (fov + z2);
        const px = centerX + x1 * projScale;
        const py = centerY + y2 * projScale;

        // Depth fog value
        const zFactor = (250 - z2) / 500; // 0.1 to 1.2
        const finalAlpha = Math.max(0.12, Math.min(0.95, p.alpha * zFactor));

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          projected.push({
            x: px,
            y: py,
            scaleSize: Math.max(0.6, p.size * projScale * 1.2),
            original: p,
            alpha: finalAlpha
          });
        }
      }

      // Sort points dry-run by Z-index (painters algorithm) to ensure correct depth layered visuals
      projected.sort((a, b) => b.scaleSize - a.scaleSize);

      // Render connectors lines if within specific range (only for structural representation)
      if (activeModel === "crystal" && currentPower < 0.85) {
        // Find bonds of nearby crystal vertices
        ctx.strokeStyle = getRGBA(particleColor, Math.max(0.01, (1 - currentPower) * 0.15));
        ctx.lineWidth = 0.55;
        const maxLenSq = 22 * 22;

        for (let i = 0; i < projected.length; i += 4) { // sampling step for high performance
          const p1 = projected[i];
          if (p1.original.z > 80) continue; // skip too far-off elements
          
          for (let j = i + 1; j < Math.min(i + 22, projected.length); j++) {
            const p2 = projected[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxLenSq) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      } else if (activeModel === "healing" && currentPower < 0.9) {
        // High quality healing calcium bridge visualization
        ctx.strokeStyle = getRGBA("#ffffff", Math.max(0.0, (1 - currentPower) * 0.18));
        ctx.lineWidth = 0.65;
        const connectionRange = 16 * 16;
        for (let i = 0; i < projected.length; i += 6) {
          const p1 = projected[i];
          // Limit line drawers only inside the narrow central repair slot
          if (Math.abs(p1.original.y) > 18) continue;

          for (let j = i + 1; j < Math.min(i + 30, projected.length); j++) {
            const p2 = projected[j];
            if (Math.abs(p2.original.y) > 18) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < connectionRange) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Render actual circular points
      for (const p of projected) {
        ctx.fillStyle = getRGBA(particleColor, p.alpha);
        
        // Highlight active crystal vertices with bright white neon halo cores
        if (activeModel === "crystal" && currentPower < 0.28) {
          ctx.fillStyle = getRGBA("#ffffff", p.alpha * 1.2);
        } else if (activeModel === "healing" && Math.abs(p.original.y) < 20) {
          // Crystalline calcite highlights
          ctx.fillStyle = getRGBA("#ffffff", p.alpha * 1.15);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.scaleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Display HUD telemetry parameters in corners
      ctx.fillStyle = "rgba(16, 185, 129, 0.45)";
      ctx.font = "8px monospace";
      ctx.fillText(`FPS: 60`, 24, 30);
      ctx.fillText(`ACTIVE PARTICLES: ${projected.length}/${particlesCount}`, 24, 44);
      ctx.fillText(`SIMUL STATE: GESTURE = ${gestureState}`, 24, 58);
      ctx.fillText(`CRYSTALLIZATION DENSITY: ${Math.round((1 - currentPower) * 100)}%`, width - 210, 30);
      ctx.fillText(`3D COORD PITCH: ${rotationAngleRef.current.x.toFixed(3)} YAW: ${rotationAngleRef.current.y.toFixed(3)}`, width - 210, 44);

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [activeModel, particlesCount, particleColor, isCameraActive, handDetected, manualControl, autoRotate, showSkeleton]);

  // Fullscreen helper setup
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-emerald-500/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full uppercase">
              DELFT CORE BIOLAB
            </span>
            <span className="text-zinc-500 text-xs font-mono">• v4.1 STABLE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white">
            自癒結晶即時 <span className="text-emerald-400">3D 粒子力學系統</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-3xl leading-relaxed mt-2">
            本互動實驗室搭載電腦視覺手勢追蹤演算法。開啟攝像頭，張開雙手或合攏握拳，隨心所欲操控上千個微米級碳酸鈣結晶粒子，重塑混凝土與生物自癒裂縫合龍的微觀原子演變。
          </p>
        </div>
        
        {/* Fullscreen control block */}
        <button
          onClick={toggleFullscreen}
          className="self-start md:self-center flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-805 hover:bg-zinc-800 hover:text-emerald-400 text-white font-medium text-xs tracking-wider uppercase px-4 py-3.5 rounded-xl transition cursor-pointer"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 text-emerald-400" />
              退出全螢幕
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-emerald-400" />
              進入全螢幕控制
            </>
          )}
        </button>
      </div>

      {/* Main Grid Simulator Interface */}
      <div 
        ref={containerRef}
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch ${
          isFullscreen ? "bg-[#050605] p-8 w-full h-full overflow-y-auto" : ""
        }`}
      >
        
        {/* LEFT COMPONENT: Controls & Camera Setup (Col span 4) */}
        <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-8 shadow-md">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/50">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold font-display tracking-widest text-[#e0e7e0] uppercase">
                核心參數調整面板
              </h3>
            </div>

            {/* Model Selector Selector */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-wider text-zinc-400 block font-semibold uppercase">
                1. 選擇模擬演進模型 (ACTIVE MODEL)
              </label>
              <div className="flex flex-col gap-2">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModel(m.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-semibold cursor-pointer outline-none relative overflow-hidden ${
                      activeModel === m.id
                        ? "bg-emerald-950/20 border-emerald-500/45 text-emerald-400"
                        : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span>{m.name}</span>
                      {activeModel === m.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-light leading-relaxed">
                      {m.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Color Palette selection */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-mono tracking-wider text-zinc-400 block font-semibold uppercase">
                2. 選擇晶螢粒子顏色 (CRYSTAL COLOR)
              </label>
              <div className="flex items-center gap-3 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-900">
                <input
                  type="color"
                  value={particleColor}
                  onChange={(e) => setParticleColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-mono text-zinc-500 block">色彩調節器 HEX</span>
                  <span className="text-xs font-mono text-white uppercase font-bold">{particleColor}</span>
                </div>
                <div className="flex gap-1">
                  {["#10b981", "#38bdf8", "#fbbf24", "#f43f5e"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setParticleColor(c)}
                      className="w-5 h-5 rounded-full border border-zinc-700/60 cursor-pointer transition transform hover:scale-110"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Slider: Density Scale */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-zinc-400">3. 粒子細緻程度 (DENSITY LEVEL)</span>
                <span className="text-emerald-400 font-bold">{particlesCount} PPT</span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="250"
                value={particlesCount}
                onChange={(e) => setParticlesCount(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                <span>500 (低能耗偏高)</span>
                <span>3000 (極限高解析細微)</span>
              </div>
            </div>

            {/* Gesture System Settings & Switch */}
            <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800/60 space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  相機體感手勢感應
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                  isCameraActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {isCameraActive ? "已啟用 DIRECT" : "手動滑塊模擬"}
                </span>
              </div>
              
              <p className="text-[10px] text-zinc-400 leading-relaxed font-light">
                {isCameraActive 
                  ? "✓ 請將單手舉至鏡頭前，張開手指以「擴散 / 游離」粒子，緊閉五指或捏合以「聚集 / 結晶」修復混凝土！" 
                  : "當前使用手動滑塊。您也可以在下方點選「啟動攝像頭」體驗 real-time 深度視覺體感追蹤。"}
              </p>

              {/* Offline Manual Slider controls fallback */}
              {!isCameraActive ? (
                <div className="space-y-1.5 pt-1.5">
                  <div className="flex justify-between text-[10px] font-mono font-semibold">
                    <span className="text-zinc-500">自癒聚合強度比 (Manual Controller)</span>
                    <span className="text-emerald-400 font-bold">{( (1 - manualControl) * 100 ).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={manualControl}
                    onChange={(e) => setManualControl(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                    <span>游離散開 (Open)</span>
                    <span>結晶合龍 (Pinch)</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1 border-t border-zinc-850">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">手勢輪廓骨架 (Skeletal Wireframe)</span>
                    <button
                      onClick={() => setShowSkeleton(!showSkeleton)}
                      className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        showSkeleton ? "bg-emerald-500 text-black font-extrabold" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {showSkeleton ? "開啟 SHOW" : "關閉 HIDE"}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Action Trigger Block */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/40">
            {errorMessage && (
              <div className="p-3 bg-rose-950/20 border border-rose-900/40 text-rose-400 text-xs rounded-xl flex items-start gap-2 leading-relaxed font-light">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={toggleCamera}
                disabled={cameraLoading}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-lg outline-none ${
                  isCameraActive
                    ? "bg-rose-600 hover:bg-rose-500 text-white font-extrabold"
                    : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-extrabold"
                }`}
              >
                {cameraLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    相機感測啟動中...
                  </>
                ) : isCameraActive ? (
                  <>
                    <VideoOff className="w-4 h-4" />
                    關閉攝像頭感應
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 text-black fill-black animate-pulse" />
                    安全啟動攝像頭追蹤
                  </>
                )}
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`py-2 px-3 rounded-lg text-[10px] border font-mono font-bold tracking-wider uppercase transition cursor-pointer ${
                  autoRotate 
                    ? "bg-zinc-950 text-emerald-400 border-emerald-500/15" 
                    : "bg-zinc-900 text-zinc-500 border-zinc-800"
                }`}
              >
                自動旋轉 3D 相機角: {autoRotate ? "已開啟 ON" : "已關閉 OFF"}
              </button>
            </div>
            
            <p className="text-[9px] text-zinc-500 text-center font-mono leading-relaxed">
              * 系統符合資訊安全標準，視訊畫面僅於瀏覽器前端進行即時特徵點網脊解析，絕不會錄製或上傳任何影像。
            </p>
          </div>

        </div>

        {/* RIGHT COMPONENT: 3D Render Screen Canvas & Video Overlay (Col span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col justify-between relative shadow-2xl">
            
            {/* Visual Canvas Sandbox container */}
            <div className="relative w-full aspect-video md:min-h-[500px] bg-[#090b09] flex items-center justify-center select-none overflow-hidden">
              
              {/* Dynamic Canvas output */}
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" 
              />

              {/* Dynamic Camera webcam visual frame on floating side PIP panel */}
              <AnimatePresence>
                {isCameraActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-video rounded-2xl overflow-hidden border border-emerald-500/20 shadow-xl bg-black/60 backdrop-blur"
                  >
                    {/* Live Video hidden but streaming */}
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover -scale-x-100 opacity-60"
                      autoPlay
                      playsInline
                      muted
                    />

                    {/* Hand joint coordinates overlay sketch */}
                    <canvas
                      ref={trackingCanvasRef}
                      width={176}
                      height={132}
                      className="absolute inset-0 w-full h-full object-cover -scale-x-100 z-10"
                    />

                    <div className="absolute top-1.5 left-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-mono border border-emerald-500/20 text-emerald-400 uppercase font-bold tracking-widest leading-none">
                      LIVE FEED
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gesture HUD Status overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 text-[9px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  3D GEOMETRY ACCELERATION SYSTEM
                </span>
                <span>MODEL SCALE: 1.0 // SENSITIVITY: MEDIUM</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                {isCameraActive ? (
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 py-1 px-3 rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="text-[10px] font-mono font-extrabold text-emerald-300 tracking-wider">
                      {handDetected 
                        ? (gestureState === "PINCH" ? "✓ 偵測手勢：結晶中" : "✓ 偵測手勢：已張開") 
                        : "待命：請將手置於鏡頭前"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 py-1 px-3 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-400">
                      點選左側「啟動相機」即可啟用手勢控制
                    </span>
                  </div>
                )}
              </div>

              {/* Centered instruction if camera was recently enabled */}
              <AnimatePresence>
                {cameraLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md z-20"
                  >
                    <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
                    <span className="text-xs font-mono tracking-widest text-[#e0e7e0] uppercase font-bold text-center">
                      正在啟動體感攝像鏡頭
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1 max-w-xs text-center font-light leading-relaxed">
                      請在瀏覽器上方跳出權限提示時點選「允許」使用相機發送特徵點。
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Simulated Live Diagnostic Dashboard underneath */}
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-zinc-900/30 text-center relative z-10 border-t border-zinc-900 select-none">
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">抗滲耐磨保護</span>
                <span className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white flex items-center justify-center gap-1">
                  {Math.round(55 + (1 - (isCameraActive && handDetected ? currentPinchRef.current : manualControl)) * 43.5)}%
                </span>
                <span className="text-[9px] text-emerald-400/80 font-mono block">
                  CaCO₃ 晶體密度累進
                </span>
              </div>

              <div className="space-y-1 sm:border-l border-zinc-800/60 pb-1">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">自癒速度加權</span>
                <span className="text-2xl sm:text-4xl font-display font-black tracking-tight text-zinc-200">
                  {((1.2 - (isCameraActive && handDetected ? currentPinchRef.current : manualControl)) * 26).toFixed(1)} 倍
                </span>
                <span className="text-[9px] text-teal-400 font-mono block">
                  生化分子合攏效率
                </span>
              </div>

              <div className="space-y-1 sm:border-l border-zinc-800/60 pb-1">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">胞子活化程度</span>
                <span className="text-2xl sm:text-4xl font-display font-black tracking-tight text-emerald-400">
                  {isCameraActive && handDetected ? (gestureState === "PINCH" ? "HIGH" : "NORMAL") : "100%"}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono block">
                  芽孢桿菌微酸應變率
                </span>
              </div>

            </div>

          </div>

          {/* Interactive Tutorial block */}
          <div className="bg-zinc-900/10 border border-zinc-805/30 rounded-2xl p-4 flex gap-3 text-xs font-light text-zinc-400 leading-relaxed font-light">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#e0e7e0] block">快速體驗技巧 (How to Interact)</span>
              <span>
                - <strong>張開手掌 / 滑塊向左：</strong> 模擬水分與營養素滲流狀態，此時菌株呼吸運動活化、四處擴游。
                <br />
                - <strong>緊握拳頭 / 滑塊向右：</strong> 激發碳酸鈣晶體 (White CaCO₃) 合成沉澱反應，大量生成的微晶體將快速結合並密封裂縫。您可以在模擬看板中，隨時拖拽滑鼠自選觀看 3D 結構的各個視角！
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
