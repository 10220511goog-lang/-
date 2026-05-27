import React, { useState } from "react";
import { Plus, Minus, HelpCircle, FileQuestion, BadgeHelp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      q: "自癒混凝土中內置的生化細菌，對人體、週邊環境或地下水源安全無害嗎？",
      a: "完全無害且絕對安全。Basilisk 產品核心選用的是特別選育出的『芽孢桿菌（Bacillus）』孢子，其屬於自然界普遍存在的、無病原性的純自然菌屬（屬於歐盟一級安全菌，絕不涉及任何基因改造或危險毒物合成）。該細菌沒有任何感染性，在強鹼環境下不生長、無毒理。該添加劑已通過世界多項水源安全性測試規範，甚至可安心應用於極高健康標準的『公共飲水蓄水箱』防漏工程中。"
    },
    {
      q: "混凝土內部的芽孢桿菌孢子，究竟可以存活和休眠多久？",
      a: "根據台夫特理工大學（TU Delft）材料研究院的多維加速老化試驗與微型斷層掃描：在乾燥缺水缺氧的固體混凝土內部微觀環境中，這些具備厚實細胞壁屏障保護的休眠芽孢，在學術與應用理論上可以存活並常態保持『長達 200 年』的甦醒潛能。只要結構發生龜裂並有水分再次入侵，孢子便會在 20 分鐘之內自我喚醒，開啟結晶反應。"
    },
    {
      q: "自癒混凝土能自動修補填平的最大物理裂縫寬度是多少？",
      a: "標準 Basilisk ER7 預拌自癒添加劑在水分子充裕的自然環境中，可自發修補『最大寬度（開裂跨距）達 1.0mm (公釐)』的物理性收縮與拉伸裂縫。這遠遠高於一般混凝土規範容合標準以及 0.1 ~ 0.3mm 的漏水細黏土空隙，是目前已知少數能有效對付高應力連續壁拉扯位移防漏的革新技術。"
    },
    {
      q: "這種生化修補配方是否可以用於既有的老舊房屋或已漏水牆面？",
      a: "完全適用。針對既有開裂建物、老舊牆面、水槽縫縫、露天露台或伸縮施工縫，可使用我們專門配置的 **Basilisk MR3 自癒修補砂漿** 與 **Liquid System 深層液體表面自癒劑**。砂漿可直接做表面批土刮平，液態滲透劑則可以氣噴方式均勻噴佈表面，利用毛細滲析重力往裂口深處滲入浸潤，遇濕引導晶簇生成。"
    },
    {
      q: "自癒配方對混凝土原本的抗壓、抗折等物理強度會有不良影響嗎？",
      a: "完全不會有負面影響，甚至能微幅提升。由於生化結晶生成的碳酸鈣 (CaCO3) 與原基體本質都同屬無機天然石灰石，不僅與骨材具備優異螯合度、不影響混凝土初生 28天設計抗壓強度的常態發展，更能填滿多餘的海綿空隙，有效抵禦外部侵蝕因子，整體提高鋼筋抗震防鏽安全性。"
    }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-20 bg-[#0d110d] text-[#e0e7e0]">
      
      {/* Title */}
      <div className="text-center space-y-6 pt-12">
        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
          BASILISK KNOWLEDGE BASE
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#e0e7e0] tracking-tight leading-none animate-fade-in">
          常見技術疑難解答
        </h1>
        <p className="max-w-xl mx-auto text-[#e0e7e0]/70 text-xs md:text-sm leading-relaxed font-light">
          如您在工程實務、材料配比上有更深入的疑慮，隨時可以點擊右下方 **「AI 智能助教」** 開啟全屏對話，為您提供無國界專業解讀。
        </p>
      </div>

      {/* Accordion Wrapper */}
      <section id="faq-accordion" className="space-y-4">
        {faqData.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#151a15] border border-emerald-500/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/20"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-display font-semibold text-[#e0e7e0] hover:text-emerald-400 transition-all duration-200 cursor-pointer text-sm md:text-base leading-normal"
              >
                <span>{item.q}</span>
                <span className="shrink-0 p-1.5 bg-[#090b09] text-emerald-400 rounded-xl border border-emerald-500/10">
                  {isOpen ? <Minus className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-6 pt-1 text-xs md:text-xs text-[#e0e7e0]/70 leading-relaxed border-t border-emerald-500/5 text-justify whitespace-pre-line font-light">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>

      {/* Direct Contact help block */}
      <div className="bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-emerald-500/15 rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-base sm:text-lg font-bold text-[#e0e7e0] font-display">
          需要客製化的混凝土配比或是抗壓強度試水測試嗎？
        </h3>
        <p className="text-xs text-[#e0e7e0]/70 max-w-md mx-auto font-light leading-relaxed">
          我們提供全台預拌混凝土廠、營造廠在生化自癒劑導入、試壓、以及配合預配廠拌合施築方面的專職工程技術指導與專人現場配合服務。
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              const el = document.getElementById("contact-form-focus");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              } else {
                window.location.hash = "/contact";
              }
            }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[#0d110d] font-bold px-6 py-3.5 rounded-xl text-xs tracking-wider uppercase shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            聯絡綠築專業技術顧問
          </button>
        </div>
      </div>

    </div>
  );
}
