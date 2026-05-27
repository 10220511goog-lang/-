import React, { useState } from "react";
import { Hammer, Sparkles, Sliders, CheckCircle, Flame, Save, Shield, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Products() {
  const [concreteVolume, setConcreteVolume] = useState<number>(100); // cubic meters
  const [crackWidth, setCrackWidth] = useState<number>(0.5); // mm

  // ER7 usage: 5 kg per cubic meter of concrete, reduction of CO2 is roughly 25% (20kg carbon equivalent saved per m3)
  const er7Dosage = concreteVolume * 5;
  const co2Saved = concreteVolume * 22; // 22 kg CO2 equivalent saved per m3
  const maintenanceCostRatio = 40; // 40% savings over 20 years

  const productsList = [
    {
      id: "er7",
      name: "Basilisk ER7 自癒添加劑",
      sub: "預拌混凝土生化結晶自修復專用添加劑",
      dosage: "5 kg / m³ 混凝土",
      app: "地下室外牆、抗滲大底、蓄水池、海事防波堤、高難度隧道灌注",
      benefits: [
        "於拌合時直接加入混凝土中，無須改變原有的泵送施工工藝",
        "自動癒合高達 1.0mm 裂縫，永久防水、高抗滲透性能",
        "保護內部關鍵抗拉鋼筋不受氯離子、海水、大氣潮濕侵害，延長 30% 壽命"
      ],
      tags: ["預拌專用", "海事防波", "基礎連續壁"]
    },
    {
      id: "mr3",
      name: "Basilisk MR3 自癒修補砂漿",
      sub: "二次施工縫、預製壁版、舊屋裂痕修復專用砂漿",
      dosage: "1.8 kg / 每平米施作 1mm 厚度",
      app: "伸縮縫裂紋補修、高承重樑柱龜裂整治、露台漏水縫、地下室粉刷層",
      benefits: [
        "預混合活性生化修補劑，只需加水拌合即可直接塗抹刮抹",
        "極致的混凝土黏著強度，乾縮率低，防止二次開裂與脫落",
        "環境水汽滲入時自動產生結晶鎖死微透水通道"
      ],
      tags: ["舊屋整建", "裂縫粉刷", "二次縫補強"]
    },
    {
      id: "liquid",
      name: "Basilisk Liquid System (L1+L2)",
      sub: "預拌型深層雙液滲透自癒塗佈劑",
      dosage: "0.2 ~ 0.3 L / m² 表面積",
      app: "RC 牆面細微龜裂阻漏、鋪面微裂縫（<0.2mm）晶體封閉",
      benefits: [
        "利用液態深層滲透，使活性生化營養成份在裂痕毛細管中相遇",
        "施作於混凝土表面只需氣壓噴佈，工法簡單高效",
        "抗 UV 紫外線照射，抗溫差形變性，尤其適合住宅大樓的外露混凝土防漏"
      ],
      tags: ["液態滲透", "噴塗防護", "外露牆體阻水"]
    }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 bg-[#0d110d] text-[#e0e7e0]">
      
      {/* Header */}
      <div className="text-center space-y-6 pt-12">
        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
          BASILISK CERTIFIED PRODUCTS
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#e0e7e0] tracking-tight leading-none">
          生化自癒混凝土核心產品
        </h1>
        <p className="max-w-2xl mx-auto text-[#e0e7e0]/70 text-xs md:text-sm leading-relaxed font-light">
          針對全新構造物澆灌或既有結構開裂漏水整治，提供荷蘭 Basilisk 跨國授權之預拌添加劑、修補砂漿與表面滲透液。
        </p>
      </div>

      {/* Grid: 3 flagship products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {productsList.map((prod) => (
          <div
            key={prod.id}
            id={prod.id}
            className="bg-[#151a15] border border-emerald-500/10 rounded-2xl p-6 flex flex-col justify-between relative group hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
          >
            <div className="space-y-5">
              <div className="flex flex-wrap gap-1.5">
                {prod.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono bg-[#090b09] text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-display font-bold text-[#e0e7e0] group-hover:text-emerald-400 transition duration-300">
                  {prod.name}
                </h3>
                <p className="text-xs text-[#e0e7e0]/50 mt-1 font-light">{prod.sub}</p>
              </div>

              <div className="p-4 bg-[#090b09] rounded-xl border border-emerald-500/10 text-xs font-light space-y-2.5">
                <div>
                  <p className="text-[#e0e7e0]/40 font-mono tracking-tight text-[10px]">標準配置比例 // DOSAGE</p>
                  <p className="text-[#e0e7e0] font-semibold font-mono mt-0.5 text-[13px]">{prod.dosage}</p>
                </div>
                <div className="pt-2 border-t border-emerald-500/5">
                  <p className="text-[#e0e7e0]/40 font-mono tracking-tight text-[10px]">主要適用情境 // APPLICATIONS</p>
                  <p className="text-emerald-400 font-medium mt-0.5">{prod.app}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-[#e0e7e0]/90 font-display">產品核心功效特點：</p>
                {prod.benefits.map((b, idx) => (
                  <div key={idx} className="flex gap-2 text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-emerald-500/10">
              <button
                onClick={() => {
                  const el = document.getElementById("contact-form-focus");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  } else {
                    // Navigate to contact
                    window.location.hash = "/contact";
                  }
                }}
                className="w-full bg-[#090b09] hover:bg-emerald-600 hover:text-[#0d110d] text-[#e0e7e0]/80 hover:border-transparent border border-emerald-500/15 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer"
              >
                索取技術報價與規格樣品
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Formulation & Carbon Calculator Section */}
      <section className="bg-[#151a15] border border-emerald-500/15 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/10 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono font-semibold tracking-wider inline-block">
              BASILISK FORMULATION ASSESSOR
            </span>
            <h2 className="text-2xl font-display font-black text-[#e0e7e0] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              自癒混凝土生化配量與碳排計算器
            </h2>
          </div>
          <p className="text-xs text-[#e0e7e0]/60 max-w-xs text-left md:text-right font-light leading-relaxed">
            輸入您的預估混凝土體積，試算 Basilisk 獨特配方的總重需求量、與其相應節省的工程碳排。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          
          {/* Inputs (Lg-span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-[#e0e7e0]/90 font-semibold font-display">目標混凝土灌注量 (m³)</label>
                <span className="text-emerald-400 font-mono font-bold text-sm">{concreteVolume} 立方米</span>
              </div>
              <input
                type="range"
                min="10"
                max="3000"
                step="10"
                value={concreteVolume}
                onChange={(e) => setConcreteVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-[#090b09] rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] font-mono text-[#e0e7e0]/40">
                <span>10 m³ (小住宅大底)</span>
                <span>1500 m³</span>
                <span>3000 m³ (大型連續壁)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="text-[#e0e7e0]/90 font-semibold font-display">預估最嚴峻裂縫寬度 (mm)</label>
                <span className="text-teal-400 font-mono font-bold text-sm">{crackWidth} mm</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.1"
                value={crackWidth}
                onChange={(e) => setCrackWidth(Number(e.target.value))}
                className="w-full h-1.5 bg-[#090b09] rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-[#e0e7e0]/40">
                <span>0.1 mm (細微髮絲紋)</span>
                <span>0.8 mm (標準應力裂隙)</span>
                <span>1.5 mm (超出一般容差)</span>
              </div>
            </div>

            <div className="p-4 bg-[#090b09] rounded-xl border border-emerald-500/10">
              <h4 className="text-xs font-semibold text-[#e0e7e0] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                AI 智慧添加配置評估：
              </h4>
              <p className="text-xs text-[#e0e7e0]/70 mt-2 leading-relaxed font-light text-justify">
                {crackWidth <= 1.0 ? (
                  <span>
                    您的目標結構裂縫跨度在 <strong className="text-emerald-400">Basilisk 自癒最大能力範圍 (1.0mm)</strong> 內。建議直接在預拌漿體中添加 <strong className="text-emerald-400">ER7 添加劑</strong>，藉此長效賦予結構動態自主防滲漏能耐，省卻後續高額維修抓漏支出。
                  </span>
                ) : (
                  <span>
                    目前裂縫跨幅 ({crackWidth}mm) 超過單純預拌生化劑的自癒界限。推薦在混澆 ER7 新澆構造時，針對伸縮縫、二次縫、開裂敏感點，輔以搭配 <strong className="text-teal-400">Basilisk MR3 自癒砂漿</strong> 共同施作。
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Outputs / Results (Lg-span 7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-[#090b09] p-5 rounded-2xl border border-emerald-500/10 text-left space-y-2">
              <span className="text-[9px] text-[#e0e7e0]/40 font-mono tracking-widest">REQUIRED ER7 DOSAGE</span>
              <p className="text-3xl font-display font-black text-[#e0e7e0]">
                {er7Dosage.toLocaleString()} <span className="text-xs text-emerald-400 font-mono">KG</span>
              </p>
              <h4 className="text-xs font-semibold text-emerald-400">Basilisk ER7 自癒配料需求重</h4>
              <p className="text-[11px] text-[#e0e7e0]/50 font-light leading-relaxed">依據 5 kg / m³ 地下工程及高抗滲連續壁標準基數試算。</p>
            </div>

            <div className="bg-[#090b09] p-5 rounded-2xl border border-emerald-500/10 text-left space-y-2">
              <span className="text-[9px] text-emerald-400 font-mono tracking-widest">CARBON REDUCTION OFFSET</span>
              <p className="text-3xl font-display font-black text-emerald-400">
                {co2Saved.toLocaleString()} <span className="text-xs text-[#e0e7e0]/60 font-mono">KG CO₂e</span>
              </p>
              <h4 className="text-xs font-semibold text-[#e0e7e0]">節省結構維護工程碳路徑</h4>
              <p className="text-[11px] text-[#e0e7e0]/50 font-light leading-relaxed">有效減少因後期開裂，二次補修或高壓灌注環氧樹脂產生的生命週期碳足跡。</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/20 to-teal-950/20 p-6 rounded-2xl border border-emerald-500/15 text-left space-y-2 sm:col-span-2">
              <span className="text-[9px] text-teal-400 font-mono tracking-widest">PROJECT BENEFITS EVALUATION</span>
              <p className="text-xl md:text-2xl font-display font-bold text-[#e0e7e0] leading-tight">
                預估抵扣高達 {maintenanceCostRatio}% 的 30 年維修保固預算
              </p>
              <p className="text-xs text-[#e0e7e0]/70 leading-relaxed font-light text-justify pt-1">
                自癒混凝土在遇水活化的瞬間自癒縫合。不需傳統仰賴昂貴的「打鑿、灌注發泡、高壓化學補漏、反覆敲補塗刷」等勞民傷財的維修工程，是一勞永逸的終極綠色基建方案。
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
