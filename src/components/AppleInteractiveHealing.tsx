import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, AlertCircle, CheckCircle2, ShieldAlert, Droplets, ThermometerSun, Sparkles, Activity, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AppleInteractiveHealing() {
  // Simulator States
  const [crackWidth, setCrackWidth] = useState<number>(0.6); // 0.1mm - 1.2mm
  const [moisture, setMoisture] = useState<number>(80); // 0% - 100%
  const [temp, setTemp] = useState<number>(25); // 5°C - 45°C
  const [days, setDays] = useState<number>(0); // Day 0 to Day 14
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<string>("basement");

  // Telemetry Calculations
  const bacteriaActivity = moisture < 20 ? 0 : Math.round((moisture / 100) * (temp > 15 && temp < 38 ? 98 : 65));
  const isHealingFeasible = crackWidth <= 1.0;
  
  // Calculate Healing Rate based on states: higher moisture & reasonable temp & small crack = faster healing
  const healingProgress = Math.min(
    100,
    Math.round(
      days * 
      (bacteriaActivity / 100) * 
      (isHealingFeasible ? 7.5 : 2.5) * 
      (1.2 - crackWidth * 0.4)
    )
  );

  const structuralIntegrity = Math.round(60 + (healingProgress * 0.39));
  const infiltrationRate = Math.round(Math.max(0, 100 - healingProgress * 1.2) * (moisture / 100));

  // Scenarios presets to match Apple specification selectors
  const scenarios = [
    {
      id: "basement",
      name: "深基坑連續壁 (Tech Basement)",
      location: "新竹科學園區",
      desc: "地下水位極高，側向應力大，產生 0.6mm 常規剪力收縮縫。",
      crack: 0.60,
      moisture: 90,
      temp: 24,
    },
    {
      id: "harbor",
      name: "碼頭防波堤 (Harbor Seawall)",
      location: "台中港",
      desc: "常年受潮汐起伏和高鹹度氯離子侵蝕，存在 0.4mm 微裂縫。",
      crack: 0.40,
      moisture: 100,
      temp: 28,
    },
    {
      id: "tunnel",
      name: "鐵道隧道頂拱 ( NS Tunnel )",
      location: "荷蘭 Utrecht",
      desc: "高震動、溫差低，施工接縫產生 0.8mm 物理穿透漏水裂隙。",
      crack: 0.85,
      moisture: 75,
      temp: 14,
    }
  ];

  const handleScenarioChange = (id: string) => {
    const s = scenarios.find(item => item.id === id);
    if (s) {
      setActiveScenario(id);
      setCrackWidth(s.crack);
      setMoisture(s.moisture);
      setTemp(s.temp);
      setDays(0);
      setIsPlaying(false);
    }
  };

  // Simulating time passage
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setDays((prev) => {
          if (prev >= 14) {
            setIsPlaying(false);
            return 14;
          }
          return prev + 1;
        });
      }, 700); // 1 day every 700ms
    } else {
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const resetSimulator = () => {
    setDays(0);
    setIsPlaying(false);
  };

  return (
    <section id="interactive-simulator" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background gradients aligned with Apple's dark slate palette */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Apple-style intro header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            Apple Interactive Lab
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-tight">
            Basilisk 模擬重力實驗室
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            親自動手操控！調整環境水分、裂隙跨距、以及熟化時間，探究菌株如何喚醒在幾何級侵蝕介質中進行石灰石結晶重塑與剛性嵌合。
          </p>
        </div>

        {/* Model/Case Selector pill bar */}
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-805/30">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc.id)}
              className={`px-3 py-2 rounded-xl text-[10px] sm:text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeScenario === sc.id
                  ? "bg-zinc-800 text-emerald-400 shadow-md"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {sc.id === "basement" ? "竹科地下壁" : sc.id === "harbor" ? "台中防波堤" : "軌道隧道"}
            </button>
          ))}
        </div>

        {/* Major Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT PANEL: Interactive Sliders (Span 5) */}
          <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl p-8 rounded-3xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="border-b border-zinc-800/60 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-display tracking-wide text-zinc-200">
                    {scenarios.find(s => s.id === activeScenario)?.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500">
                    測試場域：{scenarios.find(s => s.id === activeScenario)?.location}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-zinc-800 px-2.5 py-1 rounded text-zinc-400 uppercase border border-zinc-700/50">
                  SOP-CONFIG
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {scenarios.find(s => s.id === activeScenario)?.desc}
              </p>

              {/* Slider 1: Crack width */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-zinc-400">混凝土裂隙跨距 (Crack Width)</span>
                  <span className={crackWidth > 1.0 ? "text-orange-400 font-bold" : "text-emerald-400"}>
                    {crackWidth.toFixed(2)} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.2"
                  step="0.05"
                  value={crackWidth}
                  disabled={isPlaying}
                  onChange={(e) => {
                    setCrackWidth(parseFloat(e.target.value));
                    setDays(0);
                  }}
                  className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>0.10mm (細緻裂紋)</span>
                  <span>1.00mm (極限安全界)</span>
                </div>
              </div>

              {/* Slider 2: Moisture */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-zinc-400">裂隙水合飽和度 (Moisture Level)</span>
                  <span className="text-teal-400 font-bold">{moisture}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={moisture}
                  disabled={isPlaying}
                  onChange={(e) => {
                    setMoisture(parseInt(e.target.value));
                    setDays(0);
                  }}
                  className="w-full accent-teal-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>0% (全乾燥缺水)</span>
                  <span>100% (地下常態飽和)</span>
                </div>
              </div>

              {/* Slider 3: Days */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono font-semibold">
                  <span className="text-zinc-400">水分滲析歷時 (Healing Duration)</span>
                  <span className="text-yellow-400 font-bold">第 {days} 天 (14天為最長觀察期)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="1"
                  value={days}
                  disabled={isPlaying}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full accent-yellow-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>Day 0 (開裂瞬間)</span>
                  <span>Day 14 (二次合龍期)</span>
                </div>
              </div>
            </div>

            {/* Simulated environment controllers / Actions */}
            <div className="space-y-4 pt-4 border-t border-zinc-800/40">
              <div className="flex gap-2">
                {!isPlaying ? (
                  <button
                    onClick={() => {
                      if (days >= 14) setDays(0);
                      setIsPlaying(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-extrabold py-3.5 px-4 rounded-xl text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    開始自主裂縫癒合 (AUTO)
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs tracking-wider uppercase transition border border-zinc-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    暫停結晶觀察
                  </button>
                )}
                <button
                  onClick={resetSimulator}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white p-3.5 rounded-xl transition cursor-pointer"
                  title="重設模擬器狀態"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {crackWidth > 1.0 && (
                <div className="p-3 bg-orange-950/20 border border-orange-900/40 text-orange-400 text-[10px] sm:text-xs rounded-xl flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>警告說明：</strong> 裂隙寬度 ({crackWidth.toFixed(2)}mm) 已超限 1.0mm 歐盟安全自癒臨界。芽孢桿菌仍能填補其主支點漏水縫，但必須搭配 <strong>MR3 修復砂漿</strong> 作二次壓漿，方能重構原始結構安全！
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: High-fidelity Visual Healing Box (Span 7) */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col justify-between relative shadow-2xl">
            
            {/* Visual Canvas Sandbox */}
            <div className="relative h-64 md:h-80 bg-zinc-900/40 flex items-center justify-center overflow-hidden border-b border-zinc-900 px-4 select-none">
              <div className="absolute inset-0 bg-gradient-to-b from-[#090b09]/20 via-transparent to-[#0d110d]/50 pointer-events-none" />
              
              {/* Dynamic cross section graphic of concrete joint */}
              <div className="relative w-full max-w-md h-40 bg-zinc-800/30 rounded-2xl border border-zinc-700/20 overflow-hidden flex items-center justify-center">
                
                {/* Microscopic concrete texture patterns */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Left Concrete Matrix Block */}
                <div className="absolute left-0 top-0 bottom-0 w-[45%] bg-gradient-to-r from-zinc-700 to-zinc-650 flex flex-col justify-between p-3 border-r border-zinc-600/10">
                  <span className="text-[9px] font-mono text-zinc-400/60 font-semibold tracking-wide">CONCRETE MATRIX L</span>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="w-2.5 h-2 rounded bg-zinc-800 border border-zinc-700" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <span className="w-3 h-2 rounded bg-zinc-800/70" />
                  </div>
                </div>

                {/* Right Concrete Matrix Block */}
                <div className="absolute right-0 top-0 bottom-0 w-[45%] bg-gradient-to-l from-zinc-700 to-zinc-650 flex flex-col justify-between p-3 border-l border-zinc-600/10 text-right">
                  <span className="text-[9px] font-mono text-zinc-400/60 font-semibold tracking-wide">CONCRETE MATRIX R</span>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <span className="w-2.5 h-2 rounded bg-zinc-800 border border-zinc-700" />
                    <span className="w-3 h-2 rounded bg-zinc-800/70" />
                  </div>
                </div>

                {/* THE FRAGILE CRACK LINE CHANNEL in the middle */}
                <div 
                  className="absolute top-0 bottom-0 bg-[#070907] border-l border-r border-[#10b981]/10 flex items-center justify-center transition-all duration-300"
                  style={{
                    width: `${Math.max(10, crackWidth * 42)}px`,
                  }}
                >
                  {/* Moisture visualization (flowing dripping blue dots inside) */}
                  {moisture > 10 && (
                    <motion.div 
                      className="absolute inset-x-0 top-0 bottom-0 bg-blue-500/15 backdrop-blur-[0.5px]"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* CaCO3 Crystallization Healing overlay */}
                  <div 
                    className="absolute bottom-0 top-0 left-0 right-0 bg-gradient-to-b from-zinc-100 to-zinc-300 opacity-95 flex flex-col justify-center items-center overflow-hidden transition-all duration-300 shadow-inner"
                    style={{
                      height: `${healingProgress}%`,
                      borderLeft: '2px border-solid border-[#a7f3d0]/30',
                      borderRight: '2px border-solid border-[#a7f3d0]/30',
                    }}
                  >
                    {/* Shiny sparkling calcium carbonate lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:250px_250px] animate-shimmer pointer-events-none" />
                    {healingProgress > 10 && (
                      <span className="text-[7px] font-mono text-emerald-950 font-black rotation-90 tracking-tighter opacity-80 select-none">
                        CaCO3 SOLID
                      </span>
                    )}
                  </div>

                  {/* Highlight flashing laser crack border if water inflowing */}
                  {moisture > 50 && healingProgress < 95 && (
                    <div className="absolute left-0 right-0 h-[2px] bg-sky-400 shadow-xl opacity-80 animate-bounce" />
                  )}
                </div>

                {/* Animated bacteria spore dots floating if moisture triggered */}
                {moisture > 15 && healingProgress < 95 && (
                  <div className="absolute inset-x-12 inset-y-6 pointer-events-none">
                    <div className="relative w-full h-full">
                      {/* Spore 1 */}
                      <span 
                        className={`absolute w-1.5 h-1.5 rounded-full blur-[0.5px] top-4 left-[35%] animate-ping ${
                          days > 0 ? "bg-[#10b981]" : "bg-zinc-500"
                        }`}
                      />
                      {/* Spore 2 */}
                      <span 
                        className={`absolute w-2 h-2 rounded-full blur-[0.5px] bottom-10 right-[30%] animate-pulse ${
                          days > 1 ? "bg-emerald-400" : "bg-zinc-500"
                        }`}
                      />
                      {/* Spore 3 */}
                      <span 
                        className={`absolute w-1.5 h-1.5 rounded-full blur-[0.5px] top-12 right-[40%] animate-bounce [animation-delay:0.3s] ${
                          days > 2 ? "bg-teal-300" : "bg-zinc-500"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lab overlay visual details */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 text-[9px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                  CAMERA ACCEL: TU-DELFT SCAN
                </span>
                <span>TARGET: BIO-SENSORS (x8321)</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${days > 0 ? "bg-emerald-400 animate-ping" : "bg-zinc-650"}`} />
                <span className="text-[10px] font-mono font-extrabold text-zinc-300 tracking-wider">
                  {days > 0 ? "晶簇增殖作用中" : "孢子靜止休眠中"}
                </span>
              </div>

              {/* Mini telemetry stats on overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between bg-black/70 backdrop-blur-md border border-zinc-800/40 p-3 rounded-xl text-[10px] font-mono text-zinc-400">
                <div>
                  結晶生成的熟化比重: <span className="text-zinc-100 font-bold">{healingProgress}%</span>
                </div>
                <div>
                  環境溫濕指標: <span className="text-teal-400 font-bold">常效優化 (pH 12.3)</span>
                </div>
              </div>
            </div>

            {/* Apple dashboard stats below */}
            <div className="p-8 grid grid-cols-3 gap-6 bg-zinc-900/30 text-center relative z-10 select-none">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-[#e0e7e0]/40 uppercase block">結構承載強度</span>
                <span className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white flex items-center justify-center gap-1">
                  {structuralIntegrity}%
                </span>
                <span className="text-[9px] text-emerald-400/80 font-mono block">
                  {structuralIntegrity >= 95 ? "✓ 安全恢復高點" : "抗震抗折恢復中"}
                </span>
              </div>

              <div className="space-y-1 border-l border-zinc-800/60 pb-1">
                <span className="text-[10px] font-mono tracking-widest text-[#e0e7e0]/40 uppercase block">滲漏與返砂率</span>
                <span className="text-2xl sm:text-4xl font-display font-black tracking-tight text-zinc-200">
                  {infiltrationRate.toFixed(1)}%
                </span>
                <span className="text-[9px] text-teal-400 font-mono block">
                  {infiltrationRate === 0 ? "無損防漏達成" : "水流滲透阻斷中"}
                </span>
              </div>

              <div className="space-y-1 border-l border-zinc-800/60 pb-1">
                <span className="text-[10px] font-mono tracking-widest text-[#e0e7e0]/40 uppercase block">細菌孢子存活度</span>
                <span className="text-2xl sm:text-4xl font-display font-black tracking-tight text-emerald-400">
                  100%
                </span>
                <span className="text-[9px] text-zinc-500 font-mono block">理論壽命 &gt; 200年</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
