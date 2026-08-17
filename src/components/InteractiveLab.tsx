import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Beaker,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Droplets,
  FlaskConical,
  Gauge,
  Info,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Stage = {
  id: string;
  short: string;
  label: string;
  title: string;
  description: string;
  icon: typeof Info;
  accent: string;
};

const stages: Stage[] = [
  {
    id: "intro",
    short: "i",
    label: "Intro",
    title: "自癒混凝土：生物學遇上土木工程",
    description:
      "MICP（微生物誘導碳酸鈣沉澱）讓混凝土內的休眠菌株，在裂縫形成並接觸水分與氧氣後重新活化，逐步生成方解石晶體，將滲水通道封閉。",
    icon: FlaskConical,
    accent: "#34d399",
  },
  {
    id: "stress",
    short: "1",
    label: "Stress",
    title: "應力集中",
    description: "載重與環境變化使混凝土內部產生應力集中，微裂縫在骨材與水泥漿界面開始累積。",
    icon: Activity,
    accent: "#fbbf24",
  },
  {
    id: "crack",
    short: "2",
    label: "Crack",
    title: "裂縫形成",
    description: "微裂縫從 ITZ（界面過渡區）啟動並逐漸延伸，成為水分與氧氣進入結構內部的通道。",
    icon: Zap,
    accent: "#fb7185",
  },
  {
    id: "activation",
    short: "3",
    label: "H₂O + O₂",
    title: "水分與氧氣啟動反應",
    description: "水分滲入裂縫後，氧氣與溶解二氧化碳共同改變局部化學環境，喚醒混凝土中的微生物機制。",
    icon: Droplets,
    accent: "#38bdf8",
  },
  {
    id: "bacteria",
    short: "4",
    label: "Bacteria",
    title: "Bacillus 菌株活化",
    description: "Bacillus 芽孢桿菌在適當的水分與鹼性環境中甦醒，代謝作用提高碳酸根離子濃度，促進沉澱。",
    icon: Waves,
    accent: "#a78bfa",
  },
  {
    id: "crystals",
    short: "5",
    label: "Crystals",
    title: "碳酸鈣晶體成核",
    description: "當離子積 IAP 超過方解石溶度積 Ksp，CaCO₃ 開始異質成核並沿著裂縫壁面生長。",
    icon: Sparkles,
    accent: "#f0abfc",
  },
  {
    id: "sealed",
    short: "6",
    label: "Sealed",
    title: "裂縫完成封閉",
    description: "持續的晶體生長填補裂縫空隙，降低滲透率並恢復結構的防水與耐久性能。",
    icon: ShieldCheck,
    accent: "#2dd4bf",
  },
];

const parameterDefaults = {
  pH: 12.8,
  moisture: 72,
  calcium: 64,
  bacteria: 78,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function InteractiveLab() {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [parameters, setParameters] = useState(parameterDefaults);
  const [speed, setSpeed] = useState(1);

  const stage = stages[activeStage];

  const supersaturation = useMemo(() => {
    const chemical = ((parameters.pH - 7) / 7) * 0.42;
    const environment = parameters.moisture / 100 * 0.23;
    const material = (parameters.calcium + parameters.bacteria) / 200 * 0.55;
    return Number((0.62 + chemical + environment + material).toFixed(1));
  }, [parameters]);

  const healing = useMemo(() => {
    const stageFactor = activeStage === 0 ? 0.08 : activeStage / 6;
    return clamp(Math.round((stageFactor * 62 + progress * 0.38) * (supersaturation > 1 ? 1 : 0.72)), 0, 100);
  }, [activeStage, progress, supersaturation]);

  const calcite = clamp(Math.round(healing * 0.96), 0, 100);
  const crackWidth = Math.max(0.6, 4.8 - healing * 0.042);
  const bacteriaActivity = clamp(Math.round(parameters.bacteria * (parameters.moisture / 100) * 1.06), 0, 100);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = current + 2 * speed;
        if (next >= 100) {
          if (activeStage >= stages.length - 1) {
            setIsPlaying(false);
            return 100;
          }
          if (autoPlay) {
            setActiveStage((stageIndex) => stageIndex + 1);
            return 0;
          }
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
    }, 90);

    return () => window.clearInterval(interval);
  }, [activeStage, autoPlay, isPlaying, speed]);

  const selectStage = (index: number) => {
    setActiveStage(index);
    setProgress(index === stages.length - 1 ? 100 : 0);
    setIsPlaying(false);
  };

  const reset = () => {
    setActiveStage(0);
    setProgress(0);
    setIsPlaying(false);
    setParameters(parameterDefaults);
  };

  const goPrevious = () => selectStage(Math.max(0, activeStage - 1));
  const goNext = () => selectStage(Math.min(stages.length - 1, activeStage + 1));
  const StageIcon = stage.icon;

  return (
    <div className="min-h-screen bg-[#050706] text-zinc-100 selection:bg-emerald-400 selection:text-black">
      <section className="relative overflow-hidden border-b border-emerald-400/10 bg-[radial-gradient(circle_at_72%_18%,rgba(16,185,129,0.11),transparent_32%),linear-gradient(180deg,#050706_0%,#090d0b_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(52,211,153,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.08)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                MICP TECHNOLOGY · GREENBUILT LAB
              </div>
              <div className="space-y-5">
                <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-zinc-100 sm:text-6xl lg:text-7xl">
                  Crystal growth of <span className="text-emerald-400">CaCO₃</span> in self-healing concrete
                </h1>
                <p className="max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                  探索微生物如何在混凝土裂縫中誘導方解石結晶，從應力集中、菌株活化，到裂縫封閉的完整自癒機制。
                </p>
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wide text-zinc-400">
                <span className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2">Bacillus bacteria</span>
                <span className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2">Calcite crystals</span>
                <span className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2">H₂O + O₂ activation</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsPlaying((playing) => !playing)}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-emerald-300"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                  {isPlaying ? "Pause simulation" : "Start simulation"}
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/60 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 transition hover:border-emerald-400/50 hover:text-emerald-300"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
              <div className="font-mono text-[11px] text-emerald-400/60">Bacteria + Ca²⁺ + CO₃²⁻ → CaCO₃ ↓</div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl">
              <div className="absolute -inset-8 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-emerald-300/20 bg-[#080c0a] shadow-[0_0_80px_rgba(16,185,129,0.1)]">
                <div className="flex items-center justify-between border-b border-emerald-400/10 px-4 py-3 font-mono text-[10px] text-zinc-500">
                  <span>micp-simulation.lab</span>
                  <span className="text-emerald-400">LIVE · {String(Math.round(progress)).padStart(2, "0")}%</span>
                </div>
                <div className="relative h-[300px] overflow-hidden sm:h-[370px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12),transparent_40%)]" />
                  <div className="absolute left-1/2 top-1/2 h-40 w-[82%] -translate-x-1/2 -translate-y-1/2 sm:h-52">
                    <motion.div
                      animate={{ x: -healing * 0.35, opacity: 0.92 }}
                      className="absolute left-0 top-0 h-full w-[47%] rounded-l-xl border border-zinc-600/50 bg-gradient-to-br from-zinc-700/90 via-zinc-800 to-zinc-950"
                    >
                      <span className="absolute left-3 top-3 font-mono text-[9px] text-zinc-500">CONCRETE MATRIX L</span>
                      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:14px_14px]" />
                    </motion.div>
                    <motion.div
                      animate={{ x: healing * 0.35, opacity: 0.92 }}
                      className="absolute right-0 top-0 h-full w-[47%] rounded-r-xl border border-zinc-600/50 bg-gradient-to-bl from-zinc-700/90 via-zinc-800 to-zinc-950"
                    >
                      <span className="absolute right-3 top-3 font-mono text-[9px] text-zinc-500">CONCRETE MATRIX R</span>
                      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:14px_14px]" />
                    </motion.div>
                    <motion.div
                      animate={{ opacity: Math.max(0.08, 1 - healing / 110), scaleX: Math.max(0.15, 1 - healing / 120) }}
                      className="absolute left-1/2 top-1/2 h-[76%] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/80 shadow-[0_0_20px_rgba(251,113,133,0.7)]"
                    />
                    {Array.from({ length: 28 }).map((_, index) => {
                      const left = 15 + ((index * 37) % 70);
                      const top = 22 + ((index * 53) % 55);
                      const isCrystal = index < Math.round((healing / 100) * 28);
                      return (
                        <motion.span
                          key={index}
                          animate={{
                            x: isCrystal ? 50 - left : [0, index % 2 ? 10 : -10, 0],
                            y: isCrystal ? 50 - top : [0, -8, 0],
                            opacity: isCrystal ? 0.92 : 0.45,
                            scale: isCrystal ? 1.4 : 1,
                          }}
                          transition={{ duration: isCrystal ? 1.2 : 2.4 + (index % 4) * 0.35, repeat: isCrystal ? 0 : Infinity, ease: "easeInOut" }}
                          className={`absolute z-10 h-1.5 w-1.5 rounded-full ${isCrystal ? "bg-fuchsia-200 shadow-[0_0_10px_rgba(240,171,252,0.9)]" : "bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.7)]"}`}
                          style={{ left: `${left}%`, top: `${top}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono text-[10px] text-zinc-500">
                    <div className="space-y-1"><div className="text-emerald-400">CaCO₃ (Calcite)</div><div>nucleation → crystal growth</div></div>
                    <div className="text-right"><div className="text-zinc-300">CRACK WIDTH</div><div className="text-rose-300">{crackWidth.toFixed(2)} mm</div></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-emerald-400/10 border-t border-emerald-400/10 bg-black/20 px-2 py-3 text-center font-mono text-[10px]">
                  <div><span className="block text-zinc-500">pH LEVEL</span><span className="text-emerald-300">{parameters.pH.toFixed(1)}</span></div>
                  <div><span className="block text-zinc-500">BACTERIA</span><span className="text-violet-300">{bacteriaActivity}%</span></div>
                  <div><span className="block text-zinc-500">S (IAP/Ksp)</span><span className={supersaturation > 1 ? "text-amber-300" : "text-zinc-400"}>{supersaturation.toFixed(1)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <section className="space-y-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">MICP PROCESS</div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-100 sm:text-4xl">The self-healing mechanism</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">觀看 CaCO₃ 晶體如何沿著混凝土裂縫自主生長，並逐步恢復結構完整性。</p>
            </div>
            <div className="font-mono text-[11px] text-zinc-600">STAGE {activeStage + 1} / {stages.length}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {stages.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeStage;
              return (
                <button
                  key={item.id}
                  onClick={() => selectStage(index)}
                  className={`group relative flex min-h-[92px] flex-col items-start justify-between rounded-xl border p-3 text-left transition ${active ? "border-emerald-400/50 bg-emerald-400/10" : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-600"}`}
                >
                  <div className="flex w-full items-center justify-between"><Icon className="h-4 w-4" style={{ color: active ? item.accent : "#71717a" }} /><span className="font-mono text-[10px] text-zinc-600">{item.short}</span></div>
                  <span className={`font-mono text-[10px] tracking-wide ${active ? "text-emerald-300" : "text-zinc-500"}`}>{item.label}</span>
                  {active && <span className="absolute bottom-0 left-3 right-3 h-px bg-emerald-400" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-zinc-800 bg-[#090d0b] p-6 sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-start gap-4"><div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3"><StageIcon className="h-5 w-5 text-emerald-300" /></div><div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">CURRENT STAGE</div><h3 className="mt-1 text-xl font-bold text-zinc-100 sm:text-2xl">{stage.title}</h3></div></div>
              <div className="hidden text-right font-mono text-[10px] text-zinc-600 sm:block"><div>OBSERVATION</div><div className="mt-1 text-emerald-300">{String(activeStage + 1).padStart(2, "0")} / 07</div></div>
            </div>
            <AnimatePresence mode="wait"><motion.p key={stage.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="min-h-[72px] text-sm leading-7 text-zinc-400">{stage.description}</motion.p></AnimatePresence>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-5">
              <div className="flex gap-2"><button onClick={goPrevious} disabled={activeStage === 0} className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition hover:border-emerald-400/40 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-30" aria-label="上一階段"><ChevronLeft className="h-4 w-4" /></button><button onClick={goNext} disabled={activeStage === stages.length - 1} className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition hover:border-emerald-400/40 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-30" aria-label="下一階段"><ChevronRight className="h-4 w-4" /></button></div>
              <div className="flex items-center gap-3"><label className="flex items-center gap-2 font-mono text-[10px] text-zinc-500"><input type="checkbox" checked={autoPlay} onChange={(event) => setAutoPlay(event.target.checked)} className="accent-emerald-400" /> Auto</label><select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 font-mono text-[10px] text-zinc-400"><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={1.5}>1.5x</option><option value={2}>2x</option></select><button onClick={() => setIsPlaying((playing) => !playing)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-mono text-[10px] font-bold uppercase text-emerald-300 transition hover:bg-emerald-400/20">{isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}{isPlaying ? "Pause" : "Play"}</button></div>
            </div>
            <div className="mt-5"><div className="mb-2 flex justify-between font-mono text-[10px] text-zinc-600"><span>PROCESS PROGRESS</span><span className="text-emerald-300">{Math.round(progress)}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-zinc-800"><motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300" /></div></div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#090d0b] p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">LIVE PARAMETERS</div><h3 className="mt-1 text-xl font-bold text-zinc-100">環境與反應條件</h3></div><Gauge className="h-5 w-5 text-zinc-600" /></div>
            <div className="space-y-6">
              <Parameter label="pH level" value={parameters.pH} min={7} max={14} step={0.1} display={parameters.pH.toFixed(1)} onChange={(value) => setParameters((current) => ({ ...current, pH: value }))} color="#34d399" />
              <Parameter label="Moisture" value={parameters.moisture} min={0} max={100} step={1} display={`${parameters.moisture}%`} onChange={(value) => setParameters((current) => ({ ...current, moisture: value }))} color="#38bdf8" />
              <Parameter label="Ca²⁺ concentration" value={parameters.calcium} min={0} max={100} step={1} display={`${parameters.calcium}%`} onChange={(value) => setParameters((current) => ({ ...current, calcium: value }))} color="#f0abfc" />
              <Parameter label="Bacteria activity" value={parameters.bacteria} min={0} max={100} step={1} display={`${bacteriaActivity}%`} onChange={(value) => setParameters((current) => ({ ...current, bacteria: value }))} color="#a78bfa" />
            </div>
            <div className={`mt-7 rounded-xl border p-4 ${supersaturation > 1 ? "border-emerald-400/20 bg-emerald-400/5" : "border-amber-400/20 bg-amber-400/5"}`}><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400"><Activity className="h-3.5 w-3.5" /> Supersaturation ratio</div><div className="mt-2 flex items-end justify-between"><span className={`text-3xl font-black ${supersaturation > 1 ? "text-emerald-300" : "text-amber-300"}`}>{supersaturation.toFixed(1)}</span><span className="font-mono text-[10px] text-zinc-500">{supersaturation > 1 ? "S > 1 · precipitation active" : "S ≤ 1 · waiting for activation"}</span></div></div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-zinc-800 bg-[#090d0b] p-6 sm:p-8">
            <button onClick={() => setShowNotes((visible) => !visible)} className="flex w-full items-center justify-between text-left"><div className="flex items-center gap-3"><Info className="h-4 w-4 text-emerald-300" /><span className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-300">Scientific notes</span></div><span className="font-mono text-[10px] text-zinc-600">{showNotes ? "HIDE" : "SHOW"}</span></button>
            <AnimatePresence initial={false}>{showNotes && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="space-y-4 pt-6 text-xs leading-6 text-zinc-500"><p><strong className="text-zinc-300">MICP</strong> 代表 Microbiologically Induced Calcium Carbonate Precipitation，是一種以生物機制促進礦物沉澱的自癒技術。</p><p>當 <span className="text-emerald-300">S = IAP / Ksp &gt; 1</span> 時，溶液達到過飽和，CaCO₃ 方解石便能在裂縫壁面成核。</p><div className="grid grid-cols-2 gap-3 border-t border-zinc-800 pt-4 font-mono text-[10px]"><div><span className="block text-zinc-600">Ksp</span><span className="text-zinc-300">≈ 3.3 × 10⁻⁹</span></div><div><span className="block text-zinc-600">OPTIMAL pH</span><span className="text-zinc-300">12.5 – 13.5</span></div></div></div></motion.div>}</AnimatePresence>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard icon={ShieldCheck} label="STRUCTURAL INTEGRITY" value={`${Math.max(60, healing)}%`} detail="自癒後結構完整度" color="text-emerald-300" />
            <MetricCard icon={Droplets} label="INFILTRATION RATE" value={`${Math.max(0, 100 - healing)}%`} detail="裂縫水分滲透指數" color="text-sky-300" />
            <MetricCard icon={Sparkles} label="CALCITE GROWTH" value={`${calcite}%`} detail="CaCO₃ 晶體成長度" color="text-fuchsia-300" />
          </div>
        </section>

        <section className="border-t border-zinc-800 pt-10 text-center">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">SUSTAINABLE CONSTRUCTION · GREENBUILT TAIWAN</div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-100 sm:text-3xl">讓材料在裂縫發生後，仍然持續工作。</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-500">本實驗室為教育性互動模擬，實際工程應依材料配比、環境條件與專業檢測結果進行設計。</p>
        </section>
      </main>
    </div>
  );
}

function Parameter({ label, value, min, max, step, display, color, onChange }: { label: string; value: number; min: number; max: number; step: number; display: string; color: string; onChange: (value: number) => void }) {
  return (
    <label className="block space-y-2"><span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500"><span>{label}</span><span style={{ color }}>{display}</span></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800" style={{ accentColor: color }} /></label>
  );
}

function MetricCard({ icon: Icon, label, value, detail, color }: { icon: typeof Info; label: string; value: string; detail: string; color: string }) {
  return <div className="rounded-2xl border border-zinc-800 bg-[#090d0b] p-5"><Icon className={`h-4 w-4 ${color}`} /><div className="mt-5 font-mono text-[9px] tracking-wider text-zinc-600">{label}</div><div className={`mt-1 text-3xl font-black ${color}`}>{value}</div><div className="mt-1 text-[10px] text-zinc-600">{detail}</div></div>;
}

void Beaker;
void CircleHelp;
void Wind;
