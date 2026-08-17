import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Camera, 
  RefreshCw, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Sliders, 
  Play, 
  Maximize2, 
  Minimize2, 
  Video, 
  VideoOff, 
  Info, 
  FlaskConical,
  Zap,
  Droplets,
  Waves,
  ShieldCheck,
  RotateCcw,
  Pause,
  ChevronLeft,
  ChevronRight,
  Mail,
  Linkedin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- 原始 3D 粒子系統宣告 ---
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
  ox: number;
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

// --- 參考網站階段數據 ---
const stages = [
  { id: "intro", number: "i", label: "簡介", title: "MICP：生物學遇上土木工程", description: "微生物誘導碳酸鈣沉澱技術，讓混凝土中的休眠菌株在裂縫形成後被水分與氧氣喚醒，並以生化反應生成方解石晶體，逐步封閉裂縫。", icon: FlaskConical },
  { id: "stress", number: "1", label: "應力", title: "載重造成內部應力集中", description: "結構載重、溫度變化與收縮效應會在混凝土內部產生應力集中，尤其是在骨材與水泥漿之間的界面過渡區。", icon: Activity },
  { id: "crack", number: "2", label: "裂縫", title: "微裂縫從 ITZ 開始形成", description: "當局部應力超過材料承載能力，微裂縫會從界面過渡區啟動並向外延伸，形成水分與氣體進入結構的通道。", icon: Zap },
  { id: "water", number: "3", label: "H₂O+O₂", title: "水分與氧氣滲入", description: "裂縫使水分、氧氣與溶解二氧化碳進入混凝土內部，局部環境因而具備啟動生物修復反應的條件。", icon: Droplets },
  { id: "bacteria", number: "4", label: "細菌", title: "Bacillus 芽孢桿菌甦醒", description: "休眠中的 Bacillus 芽孢桿菌接觸水分後重新活化，代謝作用提高碳酸根離子濃度，為後續晶體成核準備反應物。", icon: Waves },
  { id: "crystals", number: "5", label: "結晶", title: "CaCO₃ 方解石開始成核", description: "當離子積 IAP 超過方解石溶度積 Ksp，碳酸鈣會沿著裂縫壁面異質成核，並持續向裂縫中央生長。", icon: Sparkles },
  { id: "sealed", number: "6", label: "封閉", title: "晶體生長使裂縫完全封閉", description: "持續生成的 CaCO₃ 晶體填滿裂縫空隙，降低水分滲透率，恢復混凝土的防水性與長期耐久性。", icon: ShieldCheck },
];

export default function InteractiveLab() {
  // --- UI 狀態 (整合自 briananyona) ---
  const [activeStage, setActiveStage] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [activeModel, setActiveModel] = useState<string>("healing"); 
  
  // --- 原始 3D 模擬器狀態 ---
  const [particleColor, setParticleColor] = useState<string>("#10b981");
  const [particlesCount, setParticlesCount] = useState<number>(2000);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const [gestureState, setGestureState] = useState<"OPEN" | "PINCH" | "OFFLINE">("OFFLINE");
  const [pinchStrength, setPinchStrength] = useState<number>(0.5);
  const [manualControl, setManualControl] = useState<number>(0.5);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackingCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle3D[]>([]);
  const rotationAngleRef = useRef<{ x: number; y: number }>({ x: 0.1, y: 0.2 });
  const handPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPinchRef = useRef<number>(0.5);
  const currentPinchRef = useRef<number>(0.5);
  const animationFrameIdRef = useRef<number | null>(null);
  const activeCameraRef = useRef<any>(null);
  const activeHandsRef = useRef<any>(null);

  // --- 核心邏輯：粒子生成與動畫 ---
  const generateParticles = (modelId: string, count: number) => {
    const list: Particle3D[] = [];
    const sizeRange = modelId === "spore" ? [1, 2.5] : modelId === "crystal" ? [1, 2] : [0.8, 1.8];
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0, ox = 0, oy = 0, oz = 0;
      if (modelId === "spore") {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 100 + Math.random() * 80;
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      } else if (modelId === "crystal") {
        const spacing = 35;
        const gridX = (i % 12) - 6;
        const gridY = (Math.floor(i / 12) % 12) - 6;
        const gridZ = (Math.floor(i / 144) % 12) - 6;
        ox = gridX * spacing + (Math.random() - 0.5) * 5;
        oy = gridY * spacing + (Math.random() - 0.5) * 5;
        oz = gridZ * spacing + (Math.random() - 0.5) * 5;
        const spread = 280;
        x = (Math.random() - 0.5) * spread;
        y = (Math.random() - 0.5) * spread;
        z = (Math.random() - 0.5) * spread;
      } else {
        const isCrackBoundary = Math.random() > 0.35;
        if (isCrackBoundary) {
          ox = (Math.random() - 0.5) * 400;
          oy = (Math.random() - 0.5) * 20;
          oz = (Math.random() - 0.5) * 120;
        } else {
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
        x, y, z, ox, oy, oz,
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

  useEffect(() => {
    generateParticles(activeModel, particlesCount);
  }, [activeModel, particlesCount, particleColor]);

  // --- 相機與手勢辨識 (原始邏輯) ---
  const startCamera = async () => {
    setErrorMessage(""); setCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 365, facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      const hands = new (window as any).Hands({ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.52, minTrackingConfidence: 0.52 });
      hands.onResults(onHandResults);
      const camera = new (window as any).Camera(videoRef.current, {
        onFrame: async () => { if (videoRef.current) await hands.send({ image: videoRef.current }); },
        width: 320, height: 240
      });
      await camera.start();
      activeCameraRef.current = camera; activeHandsRef.current = hands;
      setIsCameraActive(true); setCameraLoading(false); setGestureState("OPEN");
    } catch (err: any) {
      setErrorMessage("無法存取相機，請檢查權限設定。");
      setCameraLoading(false); setIsCameraActive(false);
    }
  };

  const cleanupCamera = () => {
    if (activeCameraRef.current) activeCameraRef.current.stop();
    if (activeHandsRef.current) activeHandsRef.current.close?.();
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    setIsCameraActive(false); setHandDetected(false); setGestureState("OFFLINE");
  };

  const onHandResults = (results: any) => {
    const canvas = trackingCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      const landmarks = results.multiHandLandmarks[0];
      const wrist = landmarks[0];
      const d0_9 = Math.hypot(landmarks[9].x - wrist.x, landmarks[9].y - wrist.y);
      const tips = [4, 8, 12, 16, 20];
      let sumDist = 0; for (const tip of tips) sumDist += Math.hypot(landmarks[tip].x - wrist.x, landmarks[tip].y - wrist.y);
      const rawRatio = sumDist / (5 * d0_9);
      let normStrength = (rawRatio - 0.95) / (1.80 - 0.95);
      normStrength = Math.max(0, Math.min(1, normStrength));
      targetPinchRef.current = normStrength;
      setPinchStrength(normStrength);
      setGestureState(normStrength < 0.35 ? "PINCH" : "OPEN");
    } else {
      setHandDetected(false); setGestureState("OPEN");
    }
  };

  // --- 3D 渲染循環 ---
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const render = () => {
      ctx.fillStyle = "#050706"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const pinch = isCameraActive ? targetPinchRef.current : manualControl;
      currentPinchRef.current += (pinch - currentPinchRef.current) * 0.1;
      
      const time = Date.now() * 0.001;
      if (autoRotate) {
        rotationAngleRef.current.y += 0.005;
        rotationAngleRef.current.x = Math.sin(time * 0.5) * 0.2;
      }

      particlesRef.current.forEach(p => {
        let tx = p.ox, ty = p.oy, tz = p.oz;
        if (activeModel === "spore") {
          const factor = 1 + (1 - currentPinchRef.current) * 1.5;
          tx *= factor; ty *= factor; tz *= factor;
        } else {
          tx = p.ox + (p.x - p.ox) * currentPinchRef.current;
          ty = p.oy + (p.y - p.oy) * currentPinchRef.current;
          tz = p.oz + (p.z - p.oz) * currentPinchRef.current;
        }

        // 3D 旋轉
        let rx = tx, ry = ty, rz = tz;
        let tempY = ry * Math.cos(rotationAngleRef.current.x) - rz * Math.sin(rotationAngleRef.current.x);
        let tempZ = ry * Math.sin(rotationAngleRef.current.x) + rz * Math.cos(rotationAngleRef.current.x);
        ry = tempY; rz = tempZ;
        let tempX = rx * Math.cos(rotationAngleRef.current.y) + rz * Math.sin(rotationAngleRef.current.y);
        tempZ = -rx * Math.sin(rotationAngleRef.current.y) + rz * Math.cos(rotationAngleRef.current.y);
        rx = tempX; rz = tempZ;

        const perspective = 600 / (600 + rz);
        const sx = canvas.width / 2 + rx * perspective;
        const sy = canvas.height / 2 + ry * perspective;
        
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * perspective, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * perspective;
        ctx.fill();
      });
      animationFrameIdRef.current = requestAnimationFrame(render);
    };
    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) { canvas.width = rect.width; canvas.height = rect.height; }
    };
    window.addEventListener("resize", handleResize); handleResize();
    render();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [activeModel, isCameraActive, manualControl, autoRotate]);

  // --- 輔助計算 ---
  const calcite = Math.round((1 - currentPinchRef.current) * 100);
  const healingEfficiency = (18.2 * (1 - currentPinchRef.current)).toFixed(1);

  return (
    <div className="min-h-screen bg-black text-neutral-100 selection:bg-emerald-400 selection:text-black font-sans">
      
      {/* 1. 第一項功能：手勢辨識 3D 模擬器 (參考 briananyona 佈局) */}
      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1600px] grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_68%_42%,rgba(16,185,129,0.1),transparent_38%),radial-gradient(ellipse_at_20%_40%,rgba(6,182,212,0.05),transparent_32%)]" />
        
        {/* 左側：標題與控制 */}
        <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            GreenBuilt 體感實驗室
          </div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">
            自癒結晶即時 <br />
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">3D 粒子力學</span> 系統
          </h1>
          <p className="max-w-lg text-sm font-light leading-relaxed text-neutral-400 sm:text-base">
            開啟攝像頭，張開雙手或合攏握拳，隨心所欲操控上千個微米級碳酸鈣結晶粒子，重塑混凝土與生物自癒裂縫合龍的微觀原子演變。
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "healing", name: "超耐久裂縫合龍 (Pore Clogging)", desc: "模擬混凝土破裂面的自我修復過程。" },
                { id: "crystal", name: "碳酸鈣結晶重塑 (CaCO₃ Bond)", desc: "模擬生化石灰石分子結構的重組成型。" },
                { id: "spore", name: "孢子生命活化 (Spore Biome)", desc: "模擬細菌孢子隨水分喚醒的懸浮狀態。" }
              ].map(m => (
                <button key={m.id} onClick={() => setActiveModel(m.id)} className={`text-left p-3 rounded-xl border transition ${activeModel === m.id ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"}`}>
                  <div className="text-xs font-bold">{m.name}</div>
                  <div className="text-[10px] opacity-60">{m.desc}</div>
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={isCameraActive ? cleanupCamera : startCamera} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-medium tracking-widest text-white transition ${isCameraActive ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"}`}>
                {cameraLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : isCameraActive ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                {cameraLoading ? "啟動中..." : isCameraActive ? "關閉相機" : "啟動體感追蹤"}
              </button>
              {!isCameraActive && (
                <div className="flex-1 min-w-[150px]">
                  <input type="range" min="0" max="1" step="0.01" value={manualControl} onChange={e => setManualControl(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-[9px] text-neutral-500 font-mono"><span>游離 (OPEN)</span><span>結晶 (PINCH)</span></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右側：3D 模擬視窗 */}
        <div className="relative mx-auto h-[380px] w-full max-w-3xl sm:h-[500px] lg:col-span-7 lg:h-[580px]">
          <div className="absolute -inset-6 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b100e]/90 shadow-2xl [transform:perspective(1200px)_rotateY(-4deg)]">
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/10 bg-white/5 px-4">
              <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500/60" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" /><span className="h-2.5 w-2.5 rounded-full bg-green-500/60" /></div>
              <div className="mx-auto font-mono text-[10px] text-neutral-500">micp-simulation.lab</div>
            </div>
            <div className="relative flex-1 bg-black">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
              
              {/* 子母畫面 (相機) */}
              <AnimatePresence>
                {isCameraActive && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute bottom-4 right-4 w-32 aspect-video rounded-lg overflow-hidden border border-emerald-500/30 bg-black/60 backdrop-blur">
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover -scale-x-100 opacity-40" autoPlay playsInline muted />
                    <canvas ref={trackingCanvasRef} width={128} height={72} className="absolute inset-0 w-full h-full -scale-x-100" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 數據疊加層 */}
              <div className="absolute top-4 left-4 space-y-1 font-mono text-[9px] text-cyan-400/60">
                <div>MODEL: {activeModel.toUpperCase()}</div>
                <div>STATUS: {gestureState}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 bg-black/20 px-4 py-4 font-mono text-[9px]">
              <div><span className="block text-neutral-600 uppercase">抗滲保護</span><span className="text-emerald-300">{70 + calcite * 0.2}%</span></div>
              <div><span className="block text-neutral-600 uppercase">自癒效率</span><span className="text-cyan-300">{healingEfficiency}x</span></div>
              <div><span className="block text-neutral-600 uppercase">結晶密度</span><span className="text-fuchsia-300">{calcite}%</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 接下來是與 briananyona 一致的其餘內容 */}
      <section className="mx-auto w-full max-w-[1600px] border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20">
        <div className="mb-8 space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">MICP 過程</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">自癒修復機制</h2>
          <p className="max-w-2xl text-sm text-neutral-400">觀看 CaCO₃ 晶體如何透過微生物誘導沉澱，自主封閉混凝土裂縫。</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {stages.map((item, index) => {
            const Icon = item.icon;
            const active = index === activeStage;
            return (
              <button key={item.id} onClick={() => setActiveStage(index)} className={`relative flex min-h-[105px] flex-col justify-between rounded-xl border p-4 text-left transition ${active ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10 bg-white/[0.02] hover:border-emerald-400/30 hover:bg-white/5"}`}>
                <div className="flex items-center justify-between"><Icon className={`h-4 w-4 ${active ? "text-emerald-300" : "text-neutral-500"}`} /><span className="font-mono text-[10px] text-zinc-600">{item.number}</span></div>
                <span className={`font-mono text-[10px] ${active ? "text-emerald-300" : "text-neutral-500"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1600px] gap-8 border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3"><FlaskConical className="h-5 w-5 text-emerald-300" /></div>
            <div><h3 className="text-xl font-bold">{stages[activeStage].title}</h3><p className="mt-2 text-sm text-neutral-400 leading-relaxed">{stages[activeStage].description}</p></div>
          </div>
          <div className="flex gap-2"><button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} className="p-2 rounded-lg border border-white/10 text-neutral-500 hover:text-white"><ChevronLeft /></button><button onClick={() => setActiveStage(Math.min(stages.length-1, activeStage + 1))} className="p-2 rounded-lg border border-white/10 text-neutral-500 hover:text-white"><ChevronRight /></button></div>
        </div>
        
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">科學筆記</div><h3 className="mt-1 text-xl font-bold">研究參數</h3></div><Info className="h-5 w-5 text-neutral-600" /></div>
          <div className="space-y-4 text-xs text-neutral-400 leading-relaxed">
            <p><strong className="text-emerald-400">MICP</strong> 代表「微生物誘導碳酸鈣沉澱」，是一種以自然礦物化作用為靈感的自癒技術。</p>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div><span className="block text-neutral-600 font-mono text-[10px]">SOLUBILITY PRODUCT</span><span>Ksp ≈ 3.3 × 10⁻⁹</span></div>
              <div><span className="block text-neutral-600 font-mono text-[10px]">OPTIMAL pH</span><span>12.5 – 13.5</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">關於研究 (About Project)</div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">微生物學與土木工程的融合</h2>
            <p className="text-sm leading-8 text-neutral-400">這項研究探索了如何利用細菌過程來創造具備「自癒能力」的混凝土結構。研究重點在於 MICP 技術 —— 這是一種永續的自主裂縫修復方法，有望徹底改變基礎設施維護。</p>
            <div className="flex gap-4"><a href="mailto:anyona274@gmail.com" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-emerald-400"><Mail className="h-4 w-4" /> 電子郵件</a><a href="https://linkedin.com/in/brian-anyona" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-emerald-400"><Linkedin className="h-4 w-4" /> LinkedIn</a></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 text-center"><div className="text-2xl font-bold text-emerald-400">60%</div><div className="text-[10px] text-neutral-500 uppercase mt-1">維護成本降低</div></div>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 text-center"><div className="text-2xl font-bold text-cyan-400">50+ 年</div><div className="text-[10px] text-neutral-500 uppercase mt-1">結構壽命延長</div></div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-white/5">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400 mb-2">Sustainable Construction · GreenBuilt Taiwan</div>
        <p className="text-[10px] text-neutral-600">© 2026 Crystal Growth of CaCO₃ in Self-Healing Concrete | Research Project</p>
      </footer>
    </div>
  );
}
