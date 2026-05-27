import React, { useState } from "react";
import { Landmark, Navigation, MapPin, Quote, ShieldAlert, Star, HardHat } from "lucide-react";
import { motion } from "motion/react";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "全部案場 CASE STUDIES" },
    { id: "civil", name: "公共市政與鐵道隧道" },
    { id: "water", name: "蓄水池與住宅連續壁" },
    { id: "marine", name: "海事防波堤抗鹽害" }
  ];

  const projectsList = [
    {
      title: "荷蘭根特港 (North Sea Port) 碼頭防滲擋土牆",
      location: "荷蘭 Ghent Harbor",
      category: "marine",
      imgPlaceholder: "⚓",
      desc: "大體積海事碼頭擋土牆常年面臨強烈海水潮汐與極高鹽度氯離子侵蝕威脅。使用 Basilisk ER7 拌合添加劑後，極限封合表面收縮微型裂隙，常保內部骨架不易鏽蝕腐爛。",
      metrics: "鹽分防水阻斷率 98.5%"
    },
    {
      title: "大安生態住宅大樓地下室防漏大底",
      location: "台灣 台北市大安區",
      category: "water",
      imgPlaceholder: "🏢",
      desc: "基地座落在台北盆地高黏土層、高地下水位地帶。施澆於地下三層防水連續壁大底，從拌合打樁起賦活材料，永久免除傳統高壓發泡劑打針抓漏二期折損。",
      metrics: "維護總費用降減 42%"
    },
    {
      title: "八里海堤防鹽耐海水衝擊波外壁",
      location: "台灣 新北市八里區",
      category: "marine",
      imgPlaceholder: "🌊",
      desc: "飽受劇烈東北季風浪霧及大氣含鹽分拍擊磨損。將 Liquid System (L1+L2) 液態自癒生化面劑均勻噴塗表層，在常態性氣溫起伏、朝露水汽下持續進行裂痕固化修護。",
      metrics: "預期生命週期增長 35%"
    },
    {
      title: "新竹科學園區先進高純水貯存庫",
      location: "台灣 新竹科學園區",
      category: "water",
      imgPlaceholder: "🧪",
      desc: "廠務端對蓄水箱密封程度、化學溶出安全性有極苛刻的純度要求。藉由自癒配方，自動封裝微觀收縮縫隙，絕不產生任何有害揮發物，為環保高標準護航。",
      metrics: "自癒修補幅跨 0.8mm"
    },
    {
      title: "荷蘭國鐵 (NS) 鐵路穿越隧道頂拱防止漏水",
      location: "荷蘭 Utrecht",
      category: "civil",
      imgPlaceholder: "🚇",
      desc: "地底重型鐵路隧道頂拱長期飽受高頻火車重載劇震與土層涵水侵擾。採用 Basilisk MR3 防水自修砂漿縫補其二次施工面的縫隙，消解高應力震盪微裂漏水病徵。",
      metrics: "修護結晶時間 < 14天"
    },
    {
      title: "台中港多功能穀物儲運筒倉連續基礎",
      location: "台灣 台中港",
      category: "civil",
      imgPlaceholder: "🌾",
      desc: "大型不對稱筒倉群受不平均沉降、應力交剪乾縮。澆灌 Basilisk 生物配方低碳混凝土，除了防滲大底不易乾縮，更在初生期抵禦海風入侵，極致永續。",
      metrics: "合計節減 12.8 噸 CO₂ 排放"
    }
  ];

  const filteredProjects = activeCategory === "all"
    ? projectsList
    : projectsList.filter(p => p.category === activeCategory);

  const testimonials = [
    {
      quote: "當初對於『休眠細菌能自主生長碳酸鈣補住裂縫』深感不可思議。直到我們台北建案連續壁在地震釋壓後產生了微裂隙，在我們導入水分養護養置兩週內，裂口竟然以肉眼清晰可見的速度自我封閉、而且滴水不漏！這為日後剩餘工程免除了昂貴而反复的抓漏支出，效果令我們工程處全體萬分震撼！",
      author: "陳建國 總工程師",
      title: "科技營造集團 結構工務處資深處長",
      stars: 5
    },
    {
      quote: "海洋工程最核心的痛點是高濃度鹽分穿透防波擋土牆腐蝕主鋼筋。引進荷蘭台夫特大學 Basilisk 技術後，我們的港灣安全設計裕度大幅上升。自我修復生成的石灰石與原結構體一體化螯合，絕不怕潮汐反覆刮損沖刷，堪稱綠色基建的偉大突破。",
      author: "Robert van der Meer",
      title: "荷蘭皇家 Delta 港灣工程中心 首席技術顧問",
      stars: 5
    }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 bg-[#0d110d] text-[#e0e7e0]">
      
      {/* Header */}
      <div className="text-center space-y-6 pt-12">
        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
          BASILISK GLOBAL FOOTPRINT
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#e0e7e0] tracking-tight leading-none">
          海內外經典工程實績
        </h1>
        <p className="max-w-2xl mx-auto text-[#e0e7e0]/70 text-xs md:text-sm leading-relaxed font-light">
          探索綠築自癒科技在荷蘭、亞太、以及全台多處海事堤岸、高端軌道隧道和科技住宅大樓地下連續壁的施作案場與關鍵指針。
        </p>
      </div>

      {/* Category Select Toggles */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-6 border-b border-emerald-500/10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wide transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-[#0d110d] font-bold shadow-lg"
                : "bg-[#151a15] text-[#e0e7e0]/70 hover:text-[#e0e7e0] border border-emerald-500/10 hover:border-emerald-500/20"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Case Studies Grid */}
      <section id="projects-shelf" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p, idx) => (
          <div
            key={idx}
            className="group bg-[#151a15] border border-emerald-500/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
          >
            <div>
              {/* Cover Placeholder */}
              <div className="h-44 bg-[#090b09] flex items-center justify-center relative overflow-hidden text-5xl border-b border-emerald-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
                <span className="relative group-hover:scale-125 transition duration-500 transform select-none">
                  {p.imgPlaceholder}
                </span>
                <span className="absolute top-4 left-4 text-[9px] font-mono uppercase bg-[#151a15] border border-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full">
                  {p.category === "civil" ? "軌道市政" : p.category === "water" ? "蓄水連續壁" : "海事抗鹽"}
                </span>
              </div>

              <div className="p-5 space-y-3.5">
                <div className="flex items-center gap-1.5 text-[10px] text-[#e0e7e0]/40 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{p.location}</span>
                </div>
                
                <h3 className="font-display font-bold text-[#e0e7e0] group-hover:text-emerald-400 transition duration-300 text-sm md:text-base leading-tight">
                  {p.title}
                </h3>
                
                <p className="text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light line-clamp-4">
                  {p.desc}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-emerald-500/5 bg-[#090b09]/30 flex items-center justify-between text-xs font-light">
              <span className="text-[#e0e7e0]/40">評估技術指針：</span>
              <span className="text-emerald-400 font-mono font-semibold">{p.metrics}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Testimonials Segment */}
      <section id="testimonials" className="space-y-10 bg-[#151a15] rounded-3xl p-6 md:p-8 border border-emerald-500/15">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">TESTIMONIALS</span>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#e0e7e0] flex items-center justify-center gap-2">
            <Quote className="w-5 h-5 text-emerald-400" />
            營建合作夥伴與業界客戶心聲
          </h2>
          <p className="text-xs text-[#e0e7e0]/60 max-w-md mx-auto font-light">
            聆聽第一線土木工程師、結構專技工程師與公共工程承造組長對生化自癒混凝土的效益考評
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-[#090b09] p-6 rounded-2xl border border-emerald-500/10 flex flex-col justify-between relative space-y-6">
              <span className="absolute top-4 right-4 text-emerald-500/10 font-serif text-6xl pointer-events-none select-none">”</span>
              
              <div className="space-y-3.5">
                <div className="flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-xs text-[#e0e7e0]/80 leading-relaxed text-justify italic font-light">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#151a15]">
                <div className="w-9 h-9 rounded-full bg-[#151a15] flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                  <HardHat className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-[#e0e7e0]">{t.author}</h4>
                  <p className="text-[10px] text-[#e0e7e0]/40 font-mono">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
