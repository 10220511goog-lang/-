import { useEffect, useMemo, useRef } from "react";
import referenceBody from "../reference/briananyona-body.html?raw";
import referenceCss from "../reference/briananyona.css?raw";
import referenceInteractions from "../reference/reference-interactions.js?raw";

const translations: Array<[string, string]> = [
  ["MICP Technology", "MICP 科技"],
  ["Crystal Growth of", "自癒混凝土中的"],
  ["in", "結晶生長"],
  ["Self-Healing Concrete", "自癒混凝土"],
  ["Exploring ", "探索「"],
  ["Microbiologically Induced Calcium Carbonate Precipitation", "微生物誘導碳酸鈣沉澱"],
  ["(MICP) — where ", "」（MICP）——"],
  [" bacteria trigger biochemical reactions that produce calcite crystals, autonomously sealing cracks and restoring structural integrity.", "芽孢桿菌觸發生化反應，生成方解石晶體，自主封閉裂縫並恢復結構完整性。」"],
  ["Bacillus Bacteria", "Bacillus 芽孢桿菌"],
  ["Calcite Crystals", "方解石結晶"],
  ["H₂O + O₂ Activation", "水分與氧氣活化"],
  ["Start Simulation", "開始模擬"],
  ["Reset", "重設"],
  ["Bacteria", "細菌"],
  ["Ca²⁺ Conc.", "Ca²⁺ 濃度"],
  ["CaCO₃ (Calcite)", "CaCO₃（方解石）"],
  ["nucleation → crystal growth", "成核反應 → 晶體生長"],
  ["CONCRETE MATRIX L", "混凝土基質 L"],
  ["CONCRETE MATRIX R", "混凝土基質 R"],
  ["CRACK WIDTH", "裂縫寬度"],
  ["LIVE", "即時"],
  ["Ready to Start", "準備開始"],
  ["Floating Tool Panel - Hidden on mobile", "浮動工具面板"],
  ["Floating Parameters Panel", "浮動參數面板"],
  ["Live Parameters", "即時參數"],
  ["pH Level", "pH 值"],
  ["Calcium Concentration", "鈣離子濃度"],
  ["Bacterial Activity", "細菌活性"],
  ["Supersaturation", "過飽和度"],
  ["S (IAP/Ksp)", "S（IAP/Ksp）"],
  ["Crystal Formation", "結晶形成"],
  ["Calcite", "方解石"],
  ["Legend - Hidden on very small screens", "圖例"],
  ["MICP Process", "MICP 過程"],
  ["The Self-Healing Mechanism", "自癒修復機制"],
  ["Watch how CaCO₃ crystals autonomously seal concrete cracks through microbiological precipitation.", "觀看 CaCO₃ 晶體如何透過微生物誘導沉澱，自主封閉混凝土裂縫。"],
  ["Stress", "應力"],
  ["Load causes internal stress concentration (Kt)", "載重造成內部應力集中（Kt）"],
  ["Crack", "裂縫"],
  ["Microcrack initiation at ITZ & propagation", "微裂縫從 ITZ 開始形成並延伸"],
  ["H₂O + O₂", "H₂O + O₂"],
  ["Moisture penetration & CO₂ dissolution", "水分滲入與 CO₂ 溶解"],
  ["Activation", "細菌活化"],
  ["Bacillus bacteria awaken & metabolize", "Bacillus 芽孢桿菌甦醒並開始代謝"],
  ["Nucleation", "結晶成核"],
  ["CaCO₃ heterogeneous nucleation (S>1)", "CaCO₃ 異質成核（S>1）"],
  ["Sealed", "裂縫封閉"],
  ["Crystal growth fills crack completely", "晶體生長並完全填補裂縫"],
  ["Interactive Guide", "互動導覽"],
  ["Understanding the MICP Process", "了解 MICP 過程"],
  ["Step through each stage of self-healing concrete with narration and detailed notes.", "透過旁白與詳細筆記，逐步了解自癒混凝土的每個階段。"],
  ["Intro", "簡介"],
  ["Crystals", "結晶"],
  ["INTRODUCTION", "介紹"],
  ["Welcome to MICP Technology", "歡迎來到 MICP 科技"],
  ["Self-healing concrete overview", "自癒混凝土概觀"],
  ["Welcome to this interactive guide on Microbiologically Induced Calcium Carbonate Precipitation, or MICP, in self-healing concrete. This revolutionary technology allows concrete structures to autonomously repair cracks using bacteria and biochemical reactions. Let's explore each stage of this fascinating process.", "歡迎來到微生物誘導碳酸鈣沉澱（MICP）自癒混凝土互動導覽。這項革命性技術利用細菌與生化反應，讓混凝土結構自主修復裂縫。讓我們一起探索這個迷人過程的每個階段。"],
  ["Scientific Notes", "科學筆記"],
  ["stands for Microbiologically Induced Calcium Carbonate Precipitation — a bio-based self-healing technology.", "代表「微生物誘導碳酸鈣沉澱」——一種以生物為基礎的自癒技術。"],
  ["are incorporated into the concrete mix, remaining dormant until cracks form.", "會被摻入混凝土配比中，在裂縫形成前保持休眠。"],
  ["When activated by moisture and oxygen, they produce", "受到水分與氧氣活化後，會生成"],
  ["crystals that seal cracks autonomously.", "晶體，自主封閉裂縫。"],
  ["Key Terms", "關鍵術語"],
  ["Narrate", "旁白播放"],
  ["Stop", "停止"],
  ["Auto", "自動播放"],
  ["Speed:", "速度："],
  ["Voice:", "語音："],
  ["Test", "測試"],
  ["Key Scientific Parameters", "關鍵科學參數"],
  ["Supersaturation Ratio", "過飽和比"],
  ["S > 1 → CaCO₃ precipitates", "S > 1 → CaCO₃ 開始沉澱"],
  ["Calcite Solubility Product (25°C)", "方解石溶度積（25°C）"],
  ["Threshold for precipitation", "沉澱反應閾值"],
  ["Optimal Concrete pH", "最佳混凝土 pH 值"],
  ["Stabilizes CO₃²⁻ ions", "穩定 CO₃²⁻ 離子"],
  ["Environmentally Friendly", "環境友善"],
  ["MICP uses natural biological processes, reducing synthetic repair materials and lowering carbon footprint.", "MICP 利用自然生物過程，減少合成修補材料並降低碳足跡。"],
  ["Cost Effective", "高成本效益"],
  ["Autonomous repair eliminates expensive manual interventions, reducing maintenance costs by up to 60%.", "自主修復可減少昂貴的人工維修，最高可降低 60% 的維護成本。"],
  ["Extended Lifespan", "延長使用壽命"],
  ["Self-healing extends concrete structure lifespan by 50+ years, improving infrastructure resilience.", "自癒能力可延長混凝土結構 50 年以上的使用壽命，提升基礎設施韌性。"],
  ["About", "關於研究"],
  ["This research project explores the fascinating intersection of", "本研究計畫探索"],
  ["microbiology", "微生物學"],
  ["civil engineering", "土木工程"],
  [", investigating how bacterial processes can be harnessed to create self-healing concrete structures.", "的交集，研究如何利用細菌過程創造具備自癒能力的混凝土結構。"],
  ["The study focuses on", "研究重點為"],
  ["Microbiologically Induced Calcium Carbonate Precipitation (MICP)", "微生物誘導碳酸鈣沉澱（MICP）"],
  ["— a sustainable approach to autonomous crack repair that could revolutionize infrastructure maintenance and extend the lifespan of concrete structures by decades.", "——一種永續的自主裂縫修復方法，有望革新基礎設施維護，並將混凝土結構壽命延長數十年。"],
  ["Materials Science", "材料科學"],
  ["Microbiology", "微生物學"],
  ["Crystal Growth", "結晶生長"],
  ["Sustainable Construction", "永續建築"],
  ["The Catholic University of America", "美國天主教大學"],
  ["Washington, D.C.", "華盛頓特區"],
  ["Contact", "聯絡方式"],
  ["Email", "電子郵件"],
  ["LinkedIn", "LinkedIn"],
  ["Brian Anyona", "Brian Anyona"],
  ["© 2025 Crystal Growth of CaCO₃ in Self-Healing Concrete | Research Project", "© 2025 自癒混凝土中的 CaCO₃ 結晶生長｜研究計畫"],
];

function translateTextNodes(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current: Node | null = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  nodes.forEach((node) => {
    const original = node.nodeValue ?? "";
    let value = original;
    translations.forEach(([from, to]) => {
      if (from === "in") {
        value = value.replace(/\bin\b/g, to);
      } else {
        value = value.split(from).join(to);
      }
    });
    // 關鍵：文字未改變時不要寫回 nodeValue，避免觸發 MutationObserver 無限循環。
    if (value !== original) node.nodeValue = value;
  });
}

export default function InteractiveLab() {
  const rootRef = useRef<HTMLDivElement>(null);
  const html = useMemo(() => referenceBody, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => translateTextNodes(node));
      });
    });
    observer.observe(root, { subtree: true, childList: true });

    // 將原始腳本封裝成可呼叫 API，避免 innerHTML 的 inline handler 在 React 模組作用域中失效。
    type InteractionApi = Record<string, (...args: number[]) => void>;
    let interactionApi: InteractionApi = {};
    try {
      interactionApi = new Function(`${referenceInteractions}\nreturn { startSimulation, resetSimulation, goToSlide, nextSlide, prevSlide, toggleNarration, toggleAutoPlay, updateSpeechRate, updateSelectedVoice, testVoice };`)() as InteractionApi;
    } catch (error) {
      console.error("GreenBuilt Lab interaction initialization failed", error);
    }
    translateTextNodes(root);
    const invoke = (functionName: string, ...args: number[]) => {
      const handler = interactionApi[functionName];
      if (typeof handler !== "function") {
        console.warn(`GreenBuilt Lab handler unavailable: ${functionName}`);
        return;
      }
      try {
        handler(...args);
      } catch (error) {
        console.error(`GreenBuilt Lab handler failed: ${functionName}`, error);
      }
    };

    // 移除原始 inline handler，改由 React 容器統一委派，避免 onclick 在 innerHTML 中失效。
    root.querySelectorAll<HTMLElement>("[onclick], [onchange]").forEach((element) => {
      element.removeAttribute("onclick");
      element.removeAttribute("onchange");
    });

    const clickHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLElement>("button, .slide-tab");
      if (!button || !root.contains(button)) return;

      if (button.id === "startBtn" || button.title === "Play") {
        event.preventDefault();
        invoke("startSimulation");
      } else if (button.id === "nextBtn") {
        event.preventDefault();
        invoke("nextSlide");
      } else if (button.id === "prevBtn") {
        event.preventDefault();
        invoke("prevSlide");
      } else if (button.id === "narrateBtn") {
        event.preventDefault();
        invoke("toggleNarration");
      } else if (button.id === "testVoice" || button.textContent?.trim() === "測試" || button.textContent?.trim() === "Test") {
        event.preventDefault();
        invoke("testVoice");
      } else if (button.title === "Reset" || button.textContent?.trim() === "重設" || button.textContent?.trim() === "Reset") {
        event.preventDefault();
        invoke("resetSimulation");
      } else if (button.classList.contains("slide-tab")) {
        const tabs = Array.from(root.querySelectorAll(".slide-tab"));
        const index = tabs.indexOf(button);
        if (index >= 0) {
          event.preventDefault();
          invoke("goToSlide", index);
        }
      }
    };
    root.addEventListener("click", clickHandler);

    const changeHandler = (event: Event) => {
      const target = event.target as HTMLSelectElement | HTMLInputElement | null;
      if (!target || !root.contains(target)) return;
      if (target.id === "autoPlayCheck") invoke("toggleAutoPlay");
      if (target.id === "speechRate") invoke("updateSpeechRate");
      if (target.id === "voiceSelect") invoke("updateSelectedVoice");
    };
    root.addEventListener("change", changeHandler);

    const start = window.setTimeout(() => {
      root.querySelectorAll<HTMLElement>(".animate-on-scroll").forEach((element) => {
        element.style.animationPlayState = "running";
      });
    }, 20);

    return () => {
      window.clearTimeout(start);
      observer.disconnect();
      root.removeEventListener("click", clickHandler);
      root.removeEventListener("change", changeHandler);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      const canvas = root.querySelector<HTMLCanvasElement>("#simulationCanvas");
      const context = canvas?.getContext("2d");
      if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: referenceCss }} />
      <div ref={rootRef} className="reference-lab-root bg-black text-white overflow-x-hidden noise-overlay" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
