import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Droplets,
  FlaskConical,
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
import { motion, AnimatePresence } from "motion/react";

type Stage = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  icon: any;
};

const stages: Stage[] = [
  {
    id: "intro",
    number: "i",
    label: "簡介",
    title: "MICP：生物學遇上土木工程",
    description: "歡迎來到 GreenBuilt 的 MICP 互動實驗室。微生物誘導碳酸鈣沉澱技術，讓混凝土中的休眠菌株在裂縫形成後被水分與氧氣喚醒，並以生化反應生成方解石晶體，逐步封閉裂縫。",
    icon: FlaskConical,
  },
  {
    id: "stress",
    number: "1",
    label: "應力",
    title: "載重造成內部應力集中",
    description: "結構載重、溫度變化與收縮效應會在混凝土內部產生應力集中，尤其是在骨材與水泥漿之間的界面過渡區。",
    icon: Activity,
  },
  {
    id: "crack",
    number: "2",
    label: "裂縫",
    title: "微裂縫從 ITZ 開始形成",
    description: "當局部應力超過材料承載能力，微裂縫會從界面過渡區啟動並向外延伸，形成水分與氣體進入結構的通道。",
    icon: Zap,
  },
  {
    id: "water",
    number: "3",
    label: "H₂O+O₂",
    title: "水分與氧氣滲入",
    description: "裂縫使水分、氧氣與溶解二氧化碳進入混凝土內部，局部環境因而具備啟動生物修復反應的條件。",
    icon: Droplets,
  },
  {
    id: "bacteria",
    number: "4",
    label: "細菌",
    title: "Bacillus 芽孢桿菌甦醒",
    description: "休眠中的 Bacillus 芽孢桿菌接觸水分後重新活化，代謝作用提高碳酸根離子濃度，為後續晶體成核準備反應物。",
    icon: Waves,
  },
  {
    id: "crystals",
    number: "5",
    label: "結晶",
    title: "CaCO₃ 方解石開始成核",
    description: "當離子積 IAP 超過方解石溶度積 Ksp，碳酸鈣會沿著裂縫壁面異質成核，並持續向裂縫中央生長。",
    icon: Sparkles,
  },
  {
    id: "sealed",
    number: "6",
    label: "封閉",
    title: "晶體生長使裂縫完全封閉",
    description: "持續生成的 CaCO₃ 晶體填滿裂縫空隙，降低水分滲透率，恢復混凝土的防水性與長期耐久性。",
    icon: ShieldCheck,
  },
];

const initialParameters = { pH: 7, calcium: 0, bacteria: 0, saturation: 1 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function InteractiveLab() {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [parameters, setParameters] = useState(initialParameters);
  const [showNotes, setShowNotes] = useState(true);
  const [speed, setSpeed] = useState(1);

  const stage = stages[activeStage];
  const StageIcon = stage.icon;

  const liveParameters = useMemo(() => {
    const stageProgress = activeStage === 0 ? 0 : activeStage / 6;
    const moisture = clamp(Math.round((activeStage >= 3 ? 36 : activeStage * 7) + progress * 0.5), 0, 100);
    const bacteria = clamp(Math.round((activeStage >= 4 ? 38 : activeStage * 8) + progress * 0.52), 0, 100);
    const calcium = clamp(Math.round((activeStage >= 5 ? 44 : activeStage * 6) + progress * 0.48), 0, 100);
    const pH = Number((7 + stageProgress * 5.8 + progress * 0.01).toFixed(1));
    const saturation = Number((1 + stageProgress * 0.42 + progress * 0.006).toFixed(1));
    return { moisture, bacteria, calcium, pH, saturation };
  }, [activeStage, progress]);

  const calcite = clamp(Math.round(activeStage * 13 + progress * 0.45), 0, 100);
  const healing = clamp(Math.round(activeStage * 12 + progress * 0.42), 0, 100);
  const crackWidth = Math.max(0.05, 0.8 - healing * 0.0075);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + speed * 1.5;
        if (next < 100) return next;
        if (activeStage < stages.length - 1 && autoPlay) {
          setActiveStage((index) => index + 1);
          return 0;
        }
        setIsPlaying(false);
        return 100;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [activeStage, autoPlay, isPlaying, speed]);

  const selectStage = (index: number) => {
    setActiveStage(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const resetSimulation = () => {
    setActiveStage(0);
    setProgress(0);
    setIsPlaying(false);
    setParameters(initialParameters);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black text-neutral-100 selection:bg-emerald-400 selection:text-black">
      {/* 第一項功能：與參考網站一致的 MICP 模擬器首頁區塊 */}
      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1600px] grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_68%_42%,rgba(16,185,129,0.1),transparent_38%),radial-gradient(ellipse_at_20%_40%,rgba(6,182,212,0.05),transparent_32%)]" />
        <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            MICP 科技
          </div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">
            自癒混凝土中的<br />
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">CaCO₃</span> 結晶生長
          </h1>
          <p className="max-w-lg text-sm font-light leading-relaxed text-neutral-400 sm:text-base">
            探索「微生物誘導碳酸鈣沉澱」（MICP）——Bacillus 芽孢桿菌觸發生化反應，生成方解石晶體，自主封閉裂縫並恢復混凝土結構完整性。
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] sm:gap-3 sm:text-xs">
            <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-neutral-400"><span className="text-emerald-400">🦠</span> Bacillus 芽孢桿菌</span>
            <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-neutral-400"><span className="text-cyan-400">💎</span> 方解石結晶</span>
            <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-neutral-400"><span className="text-blue-400">💧</span> 水分與氧氣活化</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setIsPlaying((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-xs font-medium tracking-widest text-white transition hover:scale-[1.02] hover:bg-emerald-400 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.8)]">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              {isPlaying ? "暫停模擬" : "開始模擬"}
            </button>
            <button onClick={resetSimulation} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs text-neutral-300 transition hover:bg-white/10 hover:text-white">
              <RotateCcw className="h-4 w-4" /> 重設
            </button>
          </div>
          <div className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 font-mono text-[10px] text-neutral-500">
            <span className="text-emerald-400">細菌</span> + <span className="text-cyan-400">Ca²⁺</span> + <span className="text-blue-400">CO₃²⁻</span> → <span className="font-semibold text-amber-400">CaCO₃</span> ↓
          </div>
        </div>

        <SimulationWindow progress={progress} liveParameters={liveParameters} crackWidth={crackWidth} calcite={calcite} healing={healing} />
      </section>

      {/* 第二項功能：六階段 MICP 過程 */}
      <section className="mx-auto w-full max-w-[1600px] border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20">
        <div className="mb-8 space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">MICP 過程</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">自癒修復機制</h2>
          <p className="max-w-2xl text-sm text-neutral-400">觀看 CaCO₃ 晶體如何透過微生物誘導沉澱，自主封閉混凝土裂縫。</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {stages.slice(1).map((item, index) => {
            const actualIndex = index + 1;
            const Icon = item.icon;
            const active = actualIndex === activeStage;
            return (
              <button key={item.id} onClick={() => selectStage(actualIndex)} className={`relative flex min-h-[105px] flex-col justify-between rounded-xl border p-4 text-left transition ${active ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10 bg-white/[0.02] hover:border-emerald-400/30 hover:bg-white/5"}`}>
                <div className="flex items-center justify-between"><Icon className={`h-4 w-4 ${active ? "text-emerald-300" : "text-neutral-500"}`} /><span className="font-mono text-[10px] text-neutral-600">{item.number}</span></div>
                <span className={`font-mono text-[10px] ${active ? "text-emerald-300" : "text-neutral-500"}`}>{item.label}</span>
                {active && <span className="absolute bottom-0 left-4 right-4 h-px bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 第三項功能：互動導覽與即時參數 */}
      <section className="mx-auto grid w-full max-w-[1600px] gap-8 border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3"><StageIcon className="h-5 w-5 text-emerald-300" /></div>
              <div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">互動導覽 · 第 {activeStage + 1} / 7 階段</div><h3 className="mt-1 text-xl font-bold sm:text-2xl">{stage.title}</h3></div>
            </div>
            <span className="hidden font-mono text-[10px] text-neutral-600 sm:block">{String(activeStage + 1).padStart(2, "0")} / 07</span>
          </div>
          <AnimatePresence mode="wait"><motion.p key={stage.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="min-h-[96px] text-sm leading-7 text-neutral-400">{stage.description}</motion.p></AnimatePresence>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <div className="flex gap-2"><button onClick={() => selectStage(Math.max(0, activeStage - 1))} disabled={activeStage === 0} className="rounded-lg border border-white/10 p-2 text-neutral-400 hover:border-emerald-400/40 hover:text-emerald-300 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button><button onClick={() => selectStage(Math.min(stages.length - 1, activeStage + 1))} disabled={activeStage === stages.length - 1} className="rounded-lg border border-white/10 p-2 text-neutral-400 hover:border-emerald-400/40 hover:text-emerald-300 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button></div>
            <div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 font-mono text-[10px] text-neutral-500"><input type="checkbox" checked={autoPlay} onChange={(event) => setAutoPlay(event.target.checked)} className="accent-emerald-400" /> 自動播放</label><select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="rounded-md border border-white/10 bg-black px-2 py-1.5 font-mono text-[10px] text-neutral-400"><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={1.5}>1.5x</option><option value={2}>2x</option></select><button onClick={() => setIsPlaying((value) => !value)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 font-mono text-[10px] uppercase text-emerald-300">{isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}{isPlaying ? "暫停" : "播放"}</button></div>
          </div>
          <div className="mt-6"><div className="mb-2 flex justify-between font-mono text-[10px] text-neutral-600"><span>進程進度</span><span className="text-emerald-300">{Math.round(progress)}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400" /></div></div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <div className="mb-7 flex items-center justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">即時參數</div><h3 className="mt-1 text-xl font-bold">反應條件監測</h3></div><Activity className="h-5 w-5 text-neutral-600" /></div>
          <div className="space-y-6">
            <Parameter label="pH 值" value={parameters.pH} min={7} max={14} step={0.1} display={parameters.pH.toFixed(1)} color="#34d399" onChange={(value) => setParameters((current) => ({ ...current, pH: value }))} />
            <Parameter label="Ca²⁺ 鈣離子濃度" value={parameters.calcium} min={0} max={100} step={1} display={`${parameters.calcium}%`} color="#f0abfc" onChange={(value) => setParameters((current) => ({ ...current, calcium: value }))} />
            <Parameter label="細菌活性" value={parameters.bacteria} min={0} max={100} step={1} display={`${parameters.bacteria}%`} color="#a78bfa" onChange={(value) => setParameters((current) => ({ ...current, bacteria: value }))} />
            <Parameter label="過飽和度 S (IAP/Ksp)" value={parameters.saturation} min={1} max={2} step={0.1} display={parameters.saturation.toFixed(1)} color="#fbbf24" onChange={(value) => setParameters((current) => ({ ...current, saturation: value }))} />
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 font-mono text-[10px]"><div><span className="block text-neutral-600">水分活化</span><span className="text-cyan-300">{liveParameters.moisture}%</span></div><div><span className="block text-neutral-600">CaCO₃ 結晶</span><span className="text-fuchsia-300">{calcite}%</span></div></div>
        </div>
      </section>

      {/* 第四項功能：科學筆記與研究資訊 */}
      <section className="mx-auto w-full max-w-[1600px] border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <button onClick={() => setShowNotes((value) => !value)} className="flex w-full items-center justify-between text-left"><span className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-neutral-300"><Info className="h-4 w-4 text-emerald-300" /> 科學筆記</span><span className="font-mono text-[10px] text-neutral-600">{showNotes ? "隱藏" : "顯示"}</span></button>
            <AnimatePresence initial={false}>{showNotes && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="space-y-5 pt-6 text-xs leading-6 text-neutral-400"><p><strong className="text-neutral-200">MICP</strong> 代表「微生物誘導碳酸鈣沉澱」，是一種以自然礦物化作用為靈感的自癒混凝土技術。</p><p>當 <span className="text-emerald-300">S = IAP / Ksp &gt; 1</span> 時，溶液達到過飽和，CaCO₃ 方解石便會開始沉澱。</p><div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 font-mono text-[10px]"><div><span className="block text-neutral-600">Ksp</span><span>約 3.3 × 10⁻⁹</span></div><div><span className="block text-neutral-600">最佳混凝土 pH</span><span>12.5 – 13.5</span></div></div></div></motion.div>}</AnimatePresence>
          </div>
          <div className="grid gap-4 sm:grid-cols-3"><BenefitCard title="環境友善" description="利用自然生物過程，減少合成修補材料與額外施工造成的碳足跡。" icon={Wind} color="text-emerald-300" /><BenefitCard title="高成本效益" description="自主修復可減少人工維修與停工時間，降低長期結構維護成本。" icon={Activity} color="text-cyan-300" /><BenefitCard title="延長使用壽命" description="持續封閉裂縫與阻隔水分，提升基礎設施的耐久性與韌性。" icon={ShieldCheck} color="text-fuchsia-300" /></div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] border-t border-white/5 px-4 py-12 text-center sm:px-6 md:px-8 md:py-20"><div className="mx-auto max-w-3xl space-y-5"><div className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">GreenBuilt Taiwan · 綠築再生科技</div><h2 className="text-3xl font-bold sm:text-4xl">讓材料在裂縫發生後，仍然持續工作。</h2><p className="text-sm leading-7 text-neutral-400">本實驗室為教育性互動模擬。實際工程應依材料配比、環境條件與專業檢測結果進行設計。</p></div></section>
    </div>
  );
}

function SimulationWindow({ progress, liveParameters, crackWidth, calcite, healing }: { progress: number; liveParameters: { pH: number; bacteria: number; saturation: number }; crackWidth: number; calcite: number; healing: number }) {
  return (
    <div className="relative mx-auto h-[380px] w-full max-w-3xl sm:h-[500px] lg:col-span-7 lg:h-[580px]">
      <div className="absolute -inset-6 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b100e]/90 shadow-2xl shadow-emerald-500/5 [transform:perspective(1200px)_rotateY(-4deg)_rotateX(1deg)]">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/10 bg-white/5 px-4 backdrop-blur-md"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500/60" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" /><span className="h-2.5 w-2.5 rounded-full bg-green-500/60" /></div><div className="mx-auto flex items-center gap-2 font-mono text-[10px] text-neutral-500"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> micp-simulation.lab</div><span className="font-mono text-[10px] text-neutral-600">{String(Math.round(progress / 100 * 60)).padStart(2, "0")}:00</span></div>
        <div className="relative flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.11),transparent_55%),linear-gradient(135deg,#0c1110,#06100d)]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(52,211,153,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,.12)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="absolute left-1/2 top-1/2 h-40 w-[75%] -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-[68%]">
            <motion.div animate={{ x: -healing * 0.22 }} className="absolute left-0 top-0 h-full w-[48%] overflow-hidden rounded-l-lg border border-zinc-600/70 bg-gradient-to-br from-zinc-500/80 via-zinc-700/70 to-zinc-900"><div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(255,255,255,.1)_9px)]" /><span className="absolute left-3 top-3 font-mono text-[9px] text-zinc-300/60">混凝土基質 L</span></motion.div>
            <motion.div animate={{ x: healing * 0.22 }} className="absolute right-0 top-0 h-full w-[48%] overflow-hidden rounded-r-lg border border-zinc-600/70 bg-gradient-to-bl from-zinc-500/80 via-zinc-700/70 to-zinc-900"><div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(255,255,255,.1)_9px)]" /><span className="absolute right-3 top-3 font-mono text-[9px] text-zinc-300/60">混凝土基質 R</span></motion.div>
            <motion.div animate={{ opacity: Math.max(0.08, 1 - healing / 100), scaleY: Math.max(0.18, 1 - healing / 100) }} className="absolute left-1/2 top-1/2 h-[76%] w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,.8)]" />
            <motion.div animate={{ opacity: calcite / 100, scaleX: Math.max(.1, calcite / 100) }} className="absolute left-1/2 top-1/2 h-3 w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 blur-[1px] shadow-[0_0_25px_rgba(52,211,153,.9)]" />
            {Array.from({ length: 34 }).map((_, index) => {
              const left = 5 + ((index * 29) % 90);
              const top = 10 + ((index * 47) % 80);
              const crystallized = index < Math.round(calcite / 100 * 34);
              return <motion.span key={index} animate={{ x: crystallized ? 50 - left : [0, (index % 2 ? 8 : -8), 0], y: crystallized ? 50 - top : [0, -6, 0], opacity: crystallized ? 1 : .45, scale: crystallized ? 1.5 : 1 }} transition={{ duration: crystallized ? 1 : 2 + (index % 3), repeat: crystallized ? 0 : Infinity, ease: "easeInOut" }} className={`absolute h-1.5 w-1.5 rounded-full ${crystallized ? "bg-cyan-100 shadow-[0_0_9px_rgba(165,243,252,.95)]" : "bg-emerald-300 shadow-[0_0_9px_rgba(52,211,153,.8)]"}`} style={{ left: `${left}%`, top: `${top}%` }} />;
            })}
          </div>
          <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[9px] text-cyan-300/60"><span className="h-2 w-2 rotate-45 border border-cyan-300/60 bg-cyan-400/20" /> CaCO₃（方解石）</div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 py-2 font-mono text-[9px] text-neutral-300 backdrop-blur-xl"><span className={`h-2 w-2 rounded-full ${progress > 0 ? "bg-emerald-400" : "bg-neutral-500"}`} />{progress > 0 ? "模擬進行中" : "準備開始"}<span className="h-3 w-px bg-white/10" /><span className="text-neutral-500">{Math.round(progress)}%</span></div>
        </div>
        <div className="grid grid-cols-4 gap-2 border-t border-white/10 bg-black/20 px-4 py-4 font-mono text-[9px]"><div><span className="block text-neutral-600">pH 值</span><span className="text-emerald-300">{liveParameters.pH.toFixed(1)}</span></div><div><span className="block text-neutral-600">Ca²⁺ 濃度</span><span className="text-fuchsia-300">{calcite}%</span></div><div><span className="block text-neutral-600">細菌活性</span><span className="text-violet-300">{liveParameters.bacteria}%</span></div><div><span className="block text-neutral-600">S (IAP/Ksp)</span><span className="text-amber-300">{liveParameters.saturation.toFixed(1)}</span></div></div>
      </div>
      <div className="absolute -right-2 top-16 hidden w-24 space-y-3 rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-[9px] backdrop-blur-md sm:block"><div className="text-neutral-500">裂縫寬度</div><div className="text-red-300">{crackWidth.toFixed(2)} mm</div><div className="mt-3 text-neutral-500">CaCO₃</div><div className="text-emerald-300">{calcite}%</div></div>
    </div>
  );
}

function Parameter({ label, value, min, max, step, display, color, onChange }: { label: string; value: number; min: number; max: number; step: number; display: string; color: string; onChange: (value: number) => void }) {
  return <label className="block space-y-2"><span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-neutral-500"><span>{label}</span><span style={{ color }}>{display}</span></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10" style={{ accentColor: color }} /></label>;
}

function BenefitCard({ title, description, icon: Icon, color }: { title: string; description: string; icon: any; color: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><Icon className={`h-5 w-5 ${color}`} /><h3 className="mt-6 text-base font-semibold">{title}</h3><p className="mt-3 text-xs leading-6 text-neutral-500">{description}</p></div>;
}

void initialParameters;
void Info;
void Wind;
