import type { Config, Context } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const GREENBUILT_KNOWLEDGE = `
綠築再生科技有限公司 (GreenBuilt Taiwan) 
- 簡稱：綠築再生科技 或 GreenBuilt Taiwan。
- 核心技術：荷蘭 Basilisk 自癒混凝土 (生物型型自行修復水泥)。
- 母技術發源：荷蘭台夫特理工大學 (TU Delft) 經歷 2006-2014 年創新研發，擁有四項國際專利。入圍 2015 年歐洲發明獎決賽，日本 NETIS 2022 效能認可。
- 技術原理：利用孢子微生物（細菌）與菌類。在混凝土硬化後，一旦裂縫遭遇水分，休眠孢子會被水分激活大量繁殖，呼吸並消耗水和基質，藉由生化結晶反應產生不溶於水的碳酸鈣（石灰石結晶）。裂縫會被自我生成的石灰石完全密合，阻止水分、氧氣與有害鹽分進一步入侵，全面防止內部鋼筋鏽蝕、漏水或老化。
- 永續績效：可自動修復最高達 1mm 大小的裂縫，減少 25% 的二氧化碳排放量（大幅降低傳統補強的維修碳排放），延長混凝土結構使用壽命超過 30%，並降低多達 40% 的結構維護費用與工期停滯時間。
- 台灣使命：針對台灣環太平洋地震帶頻繁震損，海島熱帶多濕漏水與老舊房屋（全台30年以上老屋達50%）的嚴苛條件，提供完整的自修復、阻漏與永續加固方案。
- 核心產品線：
  1. Basilisk ER7 添加劑：混凝土預拌型生物自癒添加劑，適用於地下室防漏、蓄水池、隧道與海事防波堤。
  2. Basilisk MR3 自癒修補砂漿：預拌自修復防水砂漿膠，專為既有牆體結構或二次施工縫的裂痕補修設計。
  3. Basilisk Liquid System (L1+L2)：液態表面自癒劑。雙液型深層滲透自癒塗佈劑，專用於裂縫滲透封閉，隨時在濕潤狀態下自行修補 0.2mm 以下細微通道。
- 專利與認證：符合歐盟 NEN-EN 1504-2:2004 混凝土修復保護強制標準，獲日本國土交通省 (NETIS) 新技術情報登載。
- 實績方向：住宅地下大底防水防止漏水、公共交通工程、儲水槽灌注安全、港灣碼頭等高難度耐鹽抗潮工程。
`;

export default async (req: Request, context: Context) => {
  // CORS Preflight handles
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    });
  }

  if (req.method !== "POST") {
    return Response.json(
      { success: false, error: "Only POST requests are allowed" },
      { status: 405 }
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return Response.json(
        { success: false, error: "無效的 JSON 請求體" },
        { status: 400 }
      );
    }

    const { message, history, currentPath } = body;
    if (!message) {
      return Response.json(
        { success: false, error: "請輸入對話訊息" },
        { status: 450 }
      );
    }

    // Structure chat context
    const chatPrompt = `
    你是綠築再生科技 (GreenBuilt Taiwan) 的智能導航助教暨自癒混凝土科技專家。
    你對以下綠築科技知識非常熟悉：
    ${GREENBUILT_KNOWLEDGE}
    
    使用者目前的網網頁位置為：${currentPath || "/"}
    當前時間為：${new Date().toISOString()}

    你的職責：
    1. 用溫和且專業、積極和藹的繁體中文回答使用者的問題。
    2. 主動評估使用者的提問意圖是否與網站導航、特定產品或特定科技主題有關。
    3. 如果適合，你可以在回覆中附帶一個 "navigate" (路徑) 及 "scrollId" (滾動目標 id)，導引系統自動幫使用者「飛行切換」到指定頁面或滾動至該技術卡片。
    
    可導航的路徑與 ID 對應範圍如下：
    - 首頁 / : 
       - LGS 技術優勢: scrollId = "lgs-highlight"
       - 混凝土漏水與台灣房市現狀: scrollId = "taiwan-future"
    - 技術原理 /technology : 
       - 自癒結晶反應過程: scrollId = "healing-process"
       - 國際認證與台夫特專利: scrollId = "patents"
    - 產品介紹 /products : 
       - Basilisk ER7 混凝土添加劑: scrollId = "er7"
       - Basilisk MR3 防水修補砂漿: scrollId = "mr3"
       - Basilisk Liquid System 液態表面自癒劑: scrollId = "liquid"
    - 工程實績 /projects : 
       - 專案展示區: scrollId = "projects-shelf"
       - 客戶心聲與見證評論: scrollId = "testimonials"
    - 常見問題 /faq : 
       - 常見疑難解答: scrollId = "faq-accordion"
    - 關於綠築 /about : 
       - 合作歷史: scrollId = "tu-delft-coop"
    - 自癒互動實驗室 /lab :
       - 核心骨架、3D 粒子結晶系統或手勢追蹤: scrollId = "interactive-lab"
    - 聯絡諮詢 /contact : 
       - 諮詢表單: scrollId = "contact-form"
    - 自動化擷取工具 /downloads : (在導航中為 /downloads 提供智能擷取)
       - 網頁自動擷取爬蟲: scrollId = "crawler-tool"

    請仔細分析對話。如果使用者詢問了特定技術細節、某產品、實績，你"必須"在其 JSON 回應的 "navigation" 欄位指出應切換至哪個路徑及對應的 scrollId。若無明確導引意圖，則 navigation 部分為 null。

    請一定要使用以下 JSON 格式回覆，不含任何額外的 markdown 裝飾：
    `;

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    }));

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { text: chatPrompt + `\n使用者新提問："${message}"\n請產生 JSON 格式回應。` }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "你的親切技術回答 (繁體中文)，可以使用分段或 markdown 微格式加強易讀性" },
            navigation: {
              type: Type.OBJECT,
              description: "可選的自動導航導引參數。若無此需要，欄位填充為 null",
              properties: {
                path: { type: Type.STRING, description: "目標路徑，例如 /technology" },
                scrollId: { type: Type.STRING, description: "對應的元素 HTML id，例如 mr3" }
              },
              required: ["path", "scrollId"]
            }
          },
          required: ["reply"]
        }
      }
    });

    const replyText = geminiResponse.text?.trim() || "{}";
    const replyData = JSON.parse(replyText);
    
    return Response.json(
      { success: true, ...replyData },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );

  } catch (error: any) {
    console.error("AI Assistant Serverless Endpoint error:", error);
    return Response.json(
      { success: false, error: "AI 智能助教暫時無法連線" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );
  }
};

export const config: Config = {
  path: "/api/chat"
};
