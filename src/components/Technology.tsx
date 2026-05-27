import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Snowflake, RefreshCw, Award, Landmark, Check, FlameKindling, Info, ArrowRight, Droplets, Activity, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function Technology() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = [
    {
      num: "01",
      title: "裂縫產生與水分入侵",
      desc: "混凝土結構因地震、地基細微沉降或乾縮產生物理裂縫。外界的水分、鹽分、氧氣通過微裂通道切入結構內部。"
    },
    {
      num: "02",
      title: "微生物生化激活",
      desc: "原本處於完全休眠狀態的 Basilisk 專利芽孢桿菌，在接觸到外部侵入的水分與大氣氧氣後，於 20 分鐘內甦醒並開始進行呼吸增殖。"
    },
    {
      num: "03",
      title: "碳酸鈣 (石灰石) 生成",
      desc: "活性細菌吸收添加劑中的乳酸鈣營養基質（Lactate），在代謝呼吸中與二氧化碳結合，生成高密度、不溶於水的碳酸鈣 (CaCO3) 結晶。"
    },
    {
      num: "04",
      title: "裂縫完全縫合防漏",
      desc: "新生成的晶體不斷在微通道中累積堆疊。直到微型孔隙、微觀管道與開裂處被 CaCO3 晶體完全填補，混凝土天然地重新密合，防滲防漏。"
    }
  ];

  const credentials = [
    {
      title: "歐盟 CE 認證與標準",
      org: "歐盟認證 NEN-EN 1504-2:2004",
      desc: "完全符合歐盟安全、健康，以及混凝土結構保護與長期自修復功能的國際標準認證規範。"
    },
    {
      title: "2015年 歐洲發明獎入圍",
      org: "European Patent Office (EPO)",
      desc: "台夫特理工大學團隊以該自癒添加劑專利技術，在全歐洲數千件新發明中脫穎而出，晉級年度發明大獎決賽。"
    },
    {
      title: "日本 NETIS 新技術情報登載",
      org: "日本國土交通省 (2022年登載)",
      desc: "憑藉卓越的抗老化與海事基礎建設防水防滲數據，獲得日本最高公路和基礎建設新技術情報資料庫效能登載認證。"
    }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 bg-[#0d110d] text-[#e0e7e0]">
      
      {/* Page Header */}
      <div className="text-center space-y-6 pt-12">
        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
          CORE BIOTECHNOLOGY // BASILISK SYSTEM
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#e0e7e0] tracking-tight leading-none">
          生化混凝土自癒技術原理
        </h1>
        <p className="max-w-2xl mx-auto text-[#e0e7e0]/70 text-xs md:text-sm leading-relaxed font-light">
          了解 Basilisk 的革命性生化自修復作用，我們透過頂尖微生物礦化沉澱技術，為鋼筋混凝土賦予如同人體皮膚般的「終身自主修復功能」。
        </p>
      </div>

      {/* 1. Science & Reaction Principle Block */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side (Lg-span 6) */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-emerald-400 font-mono text-[11px] tracking-widest block uppercase">THE FOUNDATION</span>
          <h2 className="text-3xl font-display font-bold text-[#e0e7e0] tracking-tight">
            被譽為「歐洲 MIT」的荷蘭台夫特理工大學十年研發
          </h2>
          <p className="text-xs sm:text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">
            混凝土自癒技術並非憑空想像，而是源自於荷蘭台夫特理工大學（TU Delft）長達十載的頂尖生化與材料科學跨界專案。研發團隊克服重重困難，成功選育出能在高難度強鹼環境（pH值高達 12 至 13）之混凝土內部存活並常年休眠的芽孢桿菌（Bacillus）。
          </p>
          <p className="text-xs sm:text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">
            綠築（GreenBuilt Taiwan）引進此項專利。混凝土固化後，細菌孢子會隨材料在乾涸結構中靜靜等待。外界水分一旦從微裂縫滲透侵入，即觸發微生態重置激活，開啟自癒循環。
          </p>

          <div className="bg-[#151a15] border border-emerald-500/15 p-5 rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] sm:text-xs text-[#e0e7e0]/80 space-y-1.5 font-light">
              <span className="font-semibold text-[#e0e7e0] font-display">生物化學硬化及修補代謝公式：</span>
              <p className="font-mono bg-[#090b09] px-2.5 py-1.5 rounded text-emerald-400 text-[10px] w-fit">
                Lactate + 6O₂ ➡️ 2CaCO₃ + CO₂ + H₂O
              </p>
              <p className="leading-relaxed">生成的碳酸鈣與基體中的游離石灰融合，新結晶體與周邊砂石緊密咬合，強度重回高標安全曲線。</p>
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Reaction Box (Lg-span 6) */}
        <div id="healing-process" className="lg:col-span-6 bg-[#151a15] p-6 rounded-2xl border border-emerald-500/15 relative space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
            <span className="text-[10px] font-mono text-emerald-400">MICRO-BIOLOGY REACTION CYCLE</span>
            <span className="text-[10px] text-[#e0e7e0]/50 font-mono">STAGE: ACTIVATION</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#090b09] p-4 rounded-xl border border-emerald-500/10 text-center space-y-2">
              <span className="text-2xl font-bold font-display text-emerald-400">pH 12+</span>
              <p className="text-xs font-semibold text-[#e0e7e0]">特種超強嗜鹼芽孢桿菌</p>
              <p className="text-[10px] text-[#e0e7e0]/50 font-light leading-relaxed">能在高度鹼性的化學環境中安穩休眠，存活與追溯期高達 200 年。</p>
            </div>

            <div className="bg-[#090b09] p-4 rounded-xl border border-emerald-500/10 text-center space-y-2">
              <span className="text-2xl font-bold font-display text-teal-400">1.0 mm</span>
              <p className="text-xs font-semibold text-[#e0e7e0]">自癒最大裂縫跨距</p>
              <p className="text-[10px] text-[#e0e7e0]/50 font-light leading-relaxed">在潮濕多水環境下，24 小時至數周內結晶填補多數主要滲漏孔隙。</p>
            </div>
          </div>

          <div className="p-4 bg-[#090b09] rounded-xl border border-emerald-500/10 space-y-2">
            <span className="text-xs font-semibold text-emerald-400 font-display">為什麼它能超越傳統化學防水補縫劑？</span>
            <ul className="text-xs text-[#e0e7e0]/70 space-y-2 pl-4 list-disc font-light">
              <li>
                <span className="font-semibold text-[#e0e7e0]">百分之百無毒，低碳環保</span>：純生物礦化沉澱，無氯化物或揮發性 VOC 有毒化工成分。
              </li>
              <li>
                <span className="font-semibold text-[#e0e7e0]">與既有混凝土永久相融</span>：生成碳酸鈣結晶與水泥結構本質化合，不脫落、不怕紫外線照射。
              </li>
              <li>
                <span className="font-semibold text-[#e0e7e0]">長效多週期動態觸發</span>：只要結構再度發生形變與開裂，微量孢子隨時就地再次甦醒自修。
              </li>
            </ul>
          </div>
        </div>

      </section>

      {/* 2. Step-by-Step Healing Process Timeline */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">STEPS OF SELF-HEALING</span>
          <h2 className="text-3xl font-display font-extrabold text-[#e0e7e0]">
            自癒結晶的四個關鍵微觀步驟
          </h2>
          <p className="text-xs text-[#e0e7e0]/70 max-w-lg mx-auto font-light">
            觀看微觀狀態下，細菌如何與水活性觸發、進行礦物化鈣沉澱並填補結構。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Vertical selectors on Left (Lg-span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start gap-4 cursor-pointer outline-none ${
                    isActive
                      ? "bg-[#151a15] border-emerald-500/30 shadow-lg"
                      : "bg-[#0d110d] border-zinc-800/40 hover:border-zinc-700/60"
                  }`}
                >
                  {/* Left slim indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="timeline-bar"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-r-md"
                    />
                  )}
                  
                  <span className={`text-xl font-display font-black tracking-tight ${isActive ? "text-emerald-400" : "text-zinc-650"}`}>
                    {step.num}
                  </span>

                  <div className="space-y-1.5 flex-1">
                    <h3 className={`text-sm font-semibold font-display tracking-wide ${isActive ? "text-white" : "text-zinc-450"}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light text-justify">
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Micro Visualizer Sandbox on Right (Lg-span 7) */}
          <div className="lg:col-span-7 bg-zinc-900/10 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden h-[380px] sm:h-[420px] lg:h-auto shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Context label header */}
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
              <span className="text-[10px] font-mono text-emerald-400 font-extrabold tracking-widest uppercase">
                TU-DELFT LAB SCANNER // STAGE {steps[activeStep].num}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                ACTIVE STATUS: RUNNING
              </span>
            </div>

            {/* Simulated Graphic display */}
            <div className="flex-1 flex items-center justify-center relative my-6">
              
              {/* Dynamic render depending on activeStep */}
              {activeStep === 0 && (
                <div className="text-center space-y-6 animate-fade-in">
                  {/* Water dropping animation */}
                  <div className="flex justify-center gap-4 relative">
                    <Droplets className="w-12 h-12 text-sky-400 animate-bounce" />
                    <span className="absolute -top-1 px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-450/20 text-sky-400 text-[9px] font-mono animate-pulse">
                      H₂O INGRESS
                    </span>
                  </div>
                  <div className="max-w-xs mx-auto space-y-2">
                    <h4 className="text-sm font-bold font-display text-white">外界水分與有害離子侵入</h4>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                      當結構發生 0.1 ~ 1.0mm 裂口，水分隨重力與毛細力滲入，帶來大氣氧氣，這是啟動生命結晶反應的第一要素。
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="flex justify-center gap-1.5 items-center relative">
                    <Activity className="w-12 h-12 text-emerald-400 animate-pulse" />
                    <span className="absolute -top-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-450/20 text-emerald-400 text-[9px] font-mono animate-pulse">
                      SPORE WAKE-UP
                    </span>
                  </div>
                  <div className="max-w-xs mx-auto space-y-2">
                    <h4 className="text-sm font-bold font-display text-white">細菌在 20 分鐘之內甦醒</h4>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                      原本在鹼性基質中安穩休眠的芽孢桿菌，感知到水分與氧氣。厚實細胞壁被喚起，迅速展開繁衍與活性代謝。
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="flex justify-center gap-1.5 items-center relative">
                    <Sparkles className="w-12 h-12 text-teal-300 animate-pulse" />
                    <span className="absolute -top-1 px-2.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-450/20 text-teal-400 text-[9px] font-mono animate-pulse">
                      CaCO₃ CRYSTALS
                    </span>
                  </div>
                  <div className="max-w-xs mx-auto space-y-2">
                    <h4 className="text-sm font-bold font-display text-white">乳酸鈣基質代謝並生成石灰石</h4>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                      細菌呼吸時，消耗基底中的乳酸鈣營養素。二價鈣離子與呼吸排出的二氧化碳快速化合，生成不溶於水的高硬度晶螢碳酸鈣。
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="flex justify-center gap-1.5 items-center relative">
                    <Check className="w-12 h-12 text-emerald-400 bg-emerald-500/15 p-2 rounded-full border border-emerald-500/30 shadow-lg animate-bounce" />
                    <span className="absolute -top-1 px-2.5 py-0.5 rounded-md bg-emerald-550/15 border border-emerald-500/25 text-emerald-400 text-[9px] font-mono font-bold tracking-wider">
                      STRUCTURE SECURE
                    </span>
                  </div>
                  <div className="max-w-xs mx-auto space-y-2">
                    <h4 className="text-sm font-bold font-display text-white">晶體累計，物理裂隙完全合口</h4>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                      碳酸鈣晶體從內部充盈整個開裂處。微細漏水與有害氯離子通路全被堵死，混凝土恢復抗滲性，進入無限循環防護期。
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom mini-control specs */}
            <div className="pt-4 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                自動化安全測試合格 (SOP-93)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 3))}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded cursor-pointer transition hover:text-emerald-400"
                >
                  ◀
                </button>
                <button
                  onClick={() => setActiveStep((prev) => (prev < 3 ? prev + 1 : 0))}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded cursor-pointer transition hover:text-emerald-400"
                >
                  ▶
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Patents & Credentials Block */}
      <section id="patents" className="space-y-8 bg-[#151a15] border border-emerald-500/15 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-emerald-500/10 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">
              INTERNATIONAL CREDENTIALS & STANDARDS
            </span>
            <h2 className="text-2xl font-display font-bold text-[#e0e7e0]">
              全球領先的專利證書與國家級效能登載
            </h2>
          </div>
          <Award className="w-8 h-8 text-yellow-500 shrink-0 mt-3 md:mt-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {credentials.map((cred, idx) => (
            <div key={idx} className="bg-[#090b09] p-5 rounded-2xl border border-emerald-500/10 space-y-3">
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold inline-block">
                {cred.org}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#e0e7e0] font-display">
                {cred.title}
              </h3>
              <p className="text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">
                {cred.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[#0d110d] font-black px-6 py-4 rounded-xl text-xs tracking-wider uppercase transition shadow-lg shrink-0 transform hover:scale-[1.02] duration-200"
        >
          查看自癒混凝土核心產品家族
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
