import React, { useState } from "react";
import { Download, Globe, Terminal, Sparkles, CheckCircle2, ChevronRight, AlertCircle, ArrowUpRight } from "lucide-react";
import { useScrollHighlight } from "../hooks/useScrollHighlight";
import { motion, AnimatePresence } from "motion/react";

interface ScrapedResult {
  title: string;
  summary: string;
  sustainabilityKPIs: string[];
  integrationSuggestions: string[];
  keywords: string[];
}

export default function Downloads() {
  const [crawlUrl, setCrawlUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLogs, setStatusLogs] = useState<string[]>([]);
  const [result, setResult] = useState<ScrapedResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStartCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = crawlUrl.trim();
    if (!url) return;

    setLoading(true);
    setErrorMsg("");
    setResult(null);
    setStatusLogs([
      "📡 正在與伺服器建立分析連接...",
      "🔍 解析目標 URL 虛擬主機網址結構...",
      "📥 正在讀取外部網頁內容原始字元流 (DOM 數據)...",
    ]);

    // Slow trickle simulation for the log visual effect
    const addLogDelayed = (msg: string, delay: number) => {
      setTimeout(() => {
        setStatusLogs((prev) => [...prev, msg]);
      }, delay);
    };

    addLogDelayed("⚡ 抽取 HTML Body 並過濾冗餘 script 及 style 載荷...", 800);
    addLogDelayed("🧠 呼叫伺服器端內置 Gemini 3.5-Flash 模型進行綠色建材 KPI 強制提煉...", 1800);
    addLogDelayed("🧩 動態解析 JSON Schema 階層數據...", 2800);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "自動化網頁擷取分析解碼失敗");
      }

      setTimeout(() => {
        setStatusLogs((prev) => [...prev, "🎉 擷取完成！生化水泥相容數據與提煉成果解密成功。"]);
        setResult(data.data);
        setLoading(false);
      }, 3200);

    } catch (err: any) {
      console.error(err);
      setTimeout(() => {
        setErrorMsg(err.message || "擷取失敗，外部目標網站可能有嚴格的反爬與安全封牆阻隔，請更換其他 URL 網址重試。");
        setLoading(false);
      }, 3200);
    }
  };

  const sampleUrls = [
    { name: "台灣綠建築發展協會", url: "http://www.taiwangbc.org.tw" },
    { name: "荷蘭 Basilisk 官方技術誌", url: "https://www.basiliskconcrete.com" }
  ];

  const files = [
    {
      title: "自癒混凝土 ER7 核心白皮書",
      filename: "GreenBuilt_Basilisk_ER7_SOP.pdf",
      size: "4.2 MB",
      desc: "包含完整細菌鈣化沉澱化學公式、NEN-EN 1504-2 國際安全與承載結構保固與抗裂係數手冊。"
    },
    {
      title: "自癒修補砂漿 MR3 現場施工手冊",
      filename: "Basilisk_MR3_Installation_Guide.pdf",
      size: "2.8 MB",
      desc: "說明二次灌漿、常溫開裂敏感點等補漏施工規範，刮槽、刮灰厚度 5mm 最高效防護指南。"
    },
    {
      title: "生命週期永續性評估 (LCA) 報告",
      filename: "Basilisk_LCA_Sustainability.pdf",
      size: "1.9 MB",
      desc: "詳解減少 25% 初始固體碳足跡，並如何靠 200 年自主免修復能耐削減 40% 的全壽期維修能耗。"
    }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 bg-[#0d110d] text-[#e0e7e0]">
      {/* Page Title */}
      <div className="text-center space-y-6 pt-12">
        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
          AI AGENT INTEGRATION TERMINAL
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#e0e7e0] tracking-tight leading-none">
          技術型錄與 AI 分析工具
        </h1>
        <p className="max-w-2xl mx-auto text-[#e0e7e0]/70 text-xs md:text-sm leading-relaxed font-light">
          透過我們內置的 AI 擷取提煉工具，直接輸入綠建築或永續新聞 URL。或者直接下載我們的原廠技術手冊與數據型錄。
        </p>
      </div>

      {/* Grid: Left: Crawler Tool, Right: Static Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
        
        {/* Crawler Section (Lg-span 7) */}
        <section id="crawler-tool" className="lg:col-span-12 xl:col-span-7 bg-[#151a15] border border-emerald-500/15 rounded-3xl p-6 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[#0d110d] font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-[#e0e7e0]">
                AI 綠色資訊網頁擷取分析器
              </h2>
              <p className="text-xs text-[#e0e7e0]/60 font-light">
                輸入任何綠建築規範或環境科學網址，AI 會自動提煉減碳指標並產出最合適的自癒混凝土整合互補建議。
              </p>
            </div>
          </div>

          <form onSubmit={handleStartCrawl} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                required
                placeholder="貼入環保政策、綠色認證或相關新聞 URL (例如 https://...)"
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
                className="flex-1 bg-[#090b09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl px-4 py-3.5 text-xs text-[#e0e7e0] outline-none transition-all duration-200"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:bg-[#151a15] disabled:text-[#e0e7e0]/30 text-[#0d110d] font-bold px-6 py-3.5 rounded-xl transition duration-300 shadow-lg text-xs tracking-wider uppercase shrink-0 flex items-center justify-center gap-1 cursor-pointer"
              >
                {loading ? "擷取分析中..." : "開始擷取 & 提煉"}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-[#e0e7e0]/40 font-mono select-none">快速試用推薦：</span>
              {sampleUrls.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCrawlUrl(s.url)}
                  className="text-[10px] font-mono bg-[#090b09] hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 hover:border-emerald-500/20 px-3 py-1 rounded-full transition duration-200 cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </form>

          {/* Logs Terminal */}
          {(loading || statusLogs.length > 0) && (
            <div className="bg-[#090b09] rounded-xl p-4 border border-emerald-500/10 font-mono text-[11px] text-[#e0e7e0]/80 space-y-2 h-36 overflow-y-auto">
              <div className="flex items-center gap-1.5 border-b border-emerald-500/5 pb-2 text-[9px] text-[#e0e7e0]/40 select-none font-bold">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>SERVER CRAWLER METRICS LOG</span>
              </div>
              {statusLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-emerald-500/50">[{idx + 1}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}

          {/* Scrape Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Scraped Result Detail Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="p-5 bg-[#090b09] border border-emerald-500/15 rounded-2xl space-y-5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between border-b border-emerald-500/10 pb-3">
                  <div>
                    <span className="text-[9px] text-emerald-400 font-mono tracking-widest font-bold">
                      GEMINI CRAWLER SPECS SYNTHESIS
                    </span>
                    <h3 className="text-base font-bold text-[#e0e7e0] font-display mt-1">
                      {result.title}
                    </h3>
                  </div>
                  <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-mono font-semibold text-[#e0e7e0]/40">科學內容精煉摘要</h4>
                  <p className="text-xs text-[#e0e7e0]/80 leading-relaxed bg-[#151a15]/50 p-4 rounded-xl border border-emerald-500/5 text-justify font-light">
                    {result.summary}
                  </p>
                </div>

                {/* Grid of details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#e0e7e0] font-display flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      提煉出永續減碳指標 KPI
                    </h4>
                    <ul className="text-xs space-y-2 text-[#e0e7e0]/70 pl-1">
                      {result.sustainabilityKPIs.map((kpi, idx) => (
                        <li key={idx} className="flex gap-2 font-light">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{kpi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#e0e7e0] font-display flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      生化自癒技術整合互補建議
                    </h4>
                    <ul className="text-xs space-y-2 text-[#e0e7e0]/70 pl-1">
                      {result.integrationSuggestions.map((sug, idx) => (
                        <li key={idx} className="flex gap-2 font-light">
                          <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Keywords */}
                <div className="pt-3 border-t border-emerald-500/5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-[#e0e7e0]/40 font-mono">特徵分析點：</span>
                  {result.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono bg-[#151a15] text-emerald-400 border border-emerald-500/10 px-2.5 py-0.5 rounded-md font-semibold"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Static Downloads Section (Lg-span 5) */}
        <section className="lg:col-span-12 xl:col-span-5 bg-[#151a15] border border-emerald-500/15 rounded-3xl p-6 space-y-6 shadow-2xl">
          <h2 className="text-xl font-display font-bold text-[#e0e7e0] flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400 animate-pulse" />
            綠築原廠技術研究下載
          </h2>
          <p className="text-xs text-[#e0e7e0]/60 font-light leading-relaxed">
            荷蘭 Basilisk 官方驗證數據型錄與國家級施作規範基準。檔案為高精度 PDF，符合永續建築審核標準。
          </p>

          <div className="space-y-4">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="group bg-[#090b09] hover:bg-[#090b09]/80 p-4 rounded-xl border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[#e0e7e0] text-sm group-hover:text-emerald-400 transition duration-200">
                      {file.title}
                    </h3>
                    <p className="text-[10px] font-mono text-[#e0e7e0]/40">{file.filename}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-[#151a15] text-[#e0e7e0]/60 px-2 py-1 rounded border border-emerald-500/10 select-none">
                    {file.size}
                  </span>
                </div>
                <p className="text-xs text-[#e0e7e0]/60 mt-2.5 line-clamp-2 font-light leading-relaxed">
                  {file.desc}
                </p>
                <div className="mt-3.5 flex justify-end">
                  <button className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">
                    下載 PDF 規範
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
