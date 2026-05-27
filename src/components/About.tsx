import { Landmark, Compass, Target, Sparkles, Award } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      title: "卓越品質與極致安全",
      desc: "堅持引進符合荷蘭與歐盟最高標準的 Basilisk 自癒材料配方，提供台灣營建同業一勞永逸的結構防滲漏保證。"
    },
    {
      icon: <Compass className="w-5 h-5 text-teal-400" />,
      title: "引領低碳建築浪潮",
      desc: "積極響應聯合國永續發展與 LEED 綠建築規範。透過智慧生化自癒，削減後期大批維護工程材料的浪費與能耗，低減 25% 碳排。"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-300" />,
      title: "台荷頂尖學術橋樑",
      desc: "我們不只是材料代理商，更是工程專案深度整合者。長年與荷蘭台夫特理工大學 (TU Delft) 進行深層技術底蘊的研究及雙向轉移。"
    }
  ];

  const times = [
    { year: "2015", event: "荷蘭 TU Delft 自癒技術在全歐數千項專利中脫穎而出，正式入圍晉級歐洲發明大獎決賽。" },
    { year: "2018", event: "綠築再生科技 (GreenBuilt Taiwan) 團隊成立，與荷蘭授權方簽訂亞太首波工程戰略技術交流合作協議。" },
    { year: "2020", event: "協助首例台北大安抗裂連續壁建案順利合龍浇築，其滴水不漏的大底性能成果榮獲名譽保固嘉獎。" },
    { year: "2022", event: "Basilisk 自癒混凝土新項目獲日本國土交通省 (NETIS) 大會認可，全面擴展在亞太深基坑建地、高速公路路面應力防裂技術庫。" },
    { year: "2024+", event: "整合全新 AI 土木智能諮詢系統，加速為全台老屋老舊基礎結構和港海巨型堤防，提供頂配生化修復配方支持。" }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 bg-[#0d110d] text-[#e0e7e0]">
      
      {/* Title */}
      <div className="text-center space-y-6 pt-12">
        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
          OUR MISSION & COOPERATION STORY
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#e0e7e0] tracking-tight leading-none">
          關於綠築再生科技
        </h1>
        <p className="max-w-2xl mx-auto text-[#e0e7e0]/70 text-xs md:text-sm leading-relaxed font-light">
          專注引進生物科技水泥混凝土應用，為環太平洋地震帶的台灣城市與自然邊界，構築歷久彌新的綠色骨幹。
        </p>
      </div>

      {/* Grid: Story & TU Delft Connection */}
      <section id="tu-delft-coop" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left (Lg-span 6) */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-emerald-400 font-mono text-[11px] tracking-widest block uppercase">THE FOUNDER'S VISION</span>
          <h2 className="text-3xl font-display font-bold text-[#e0e7e0] tracking-tight leading-tight">
            台夫特理工大學與綠築台灣的學術結緣
          </h2>
          <p className="text-xs sm:text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">
            荷蘭台夫特理工大學（Delft University of Technology）堪稱全球土木結構、水利防潮學術界的泰斗重鎮。自修復混凝土技術即由其資深微生物學家 Henk Jonkers 教授領銜開發。Jonkers 教授觀察到人體皮膚微裂後，血小板會自我增殖結痂、螯合傷口，因而孕育大膽發想：『能否在古板的水泥建材中融入一種類似的生物機體自我癒合神技能？』
          </p>
          <p className="text-xs sm:text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">
            在歷經數年、對數百種極致惡劣菌株進行高難度試壓測試後，他終於取得在高度鹼性混凝土中（pH 值 12~13）休眠長壽的嗜鹼芽孢桿菌。綠築正式將此項領先的生化技術引進台灣，並根據本土地理特性調整基質，給本土公共工程提供滴水不漏的智慧防線。
          </p>
        </div>

        {/* Right timeline or vision board (Lg-span 6) */}
        <div className="lg:col-span-6 bg-[#151a15] border border-emerald-500/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <h3 className="text-base font-bold text-[#e0e7e0] flex items-center gap-2 font-display">
            <Award className="w-5 h-5 text-emerald-400 animate-pulse" />
            綠築自主演進里程碑
          </h3>
          
          <div className="relative border-l border-emerald-500/20 ml-2 space-y-6">
            {times.map((t, idx) => (
              <div key={idx} className="relative pl-5 group">
                {/* Node icon highlight */}
                <span className="absolute -left-[5.5px] top-[7px] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#151a15] inline-block transition-all duration-300 group-hover:scale-125"></span>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider block">{t.year}</span>
                  <p className="text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Core Values Bento Banner */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">OUR VALUES</span>
          <h2 className="text-3xl font-display font-extrabold text-[#e0e7e0]">綠築的核心永續價值</h2>
          <p className="text-xs text-[#e0e7e0]/60 font-light">我們承載並守護著「低碳環境、安心百年」的責任</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="bg-[#151a15] border border-emerald-500/10 rounded-2xl p-6 space-y-4 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#090b09] border border-emerald-500/10 flex items-center justify-center text-emerald-400">
                {v.icon}
              </div>
              <h3 className="text-sm font-semibold text-[#e0e7e0] group-hover:text-emerald-400 font-display font-bold transition">
                {v.title}
              </h3>
              <p className="text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
