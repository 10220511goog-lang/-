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

export default async (req: Request, context: Context) => {
  // Handle CORS preflight
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

    const { url } = body;
    if (!url) {
      return Response.json(
        { success: false, error: "請提供 URL 網址" },
        { status: 400 }
      );
    }

    // 1. Fetch URL raw HTML
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`無法擷取網頁 (HTTP ${response.status})`);
    }

    const html = await response.text();

    // 2. Simple clean-up of HTML structure to keep text size small for model tokens
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let rawText = bodyMatch ? bodyMatch[1] : html;
    
    rawText = rawText
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 15000); // Limit context size

    if (!rawText || rawText.length < 50) {
      throw new Error("網頁內容過少或受保護，請嘗試其他網址");
    }

    // 3. Ask Gemini to analyze the text and return structured JSON
    const geminiPrompt = `
    你是一個專精於綠色永續建築、低碳混凝土、Basilisk 自癒科技與科技工程的 AI 內容分析專家。
    請分析以下擷取自網頁的首要內容文字 (部分可能含有亂碼或雜訊，請理出頭緒)，將其提煉並翻譯成繁體中文 (Traditional Chinese)。
    
    請從中抽取出：
    1. 綠色/永續技術與核心要點 (Themes/Technologies)
    2. 與 Greenbuilt 或自癒混凝土技術可以整合的關鍵特點 (Potential Integration Points)
    3. 自癒/修復的相關數據或綠建築指標 (Metrics/Sustainability KPIs, if any)
    4. 重點關鍵詞、品牌服務與大綱。
    
    輸入文字：
    """
    ${rawText}
    """
    `;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiPrompt,
      config: {
        systemInstruction: "你必須僅以 JSON 格式回應，不包含額外的 markdown 加載 ```json 或其他文字包裹。格式必須符合下面定義的 responseSchema。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "擷取網頁的大致標題或主題" },
            summary: { type: Type.STRING, description: "對此擷取內容在綠築自癒科技應用的 150 字扼要繁體中文總結" },
            sustainabilityKPIs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "永續綠建築、減碳或科技優勢相關數據列表 (2-4條)"
            },
            integrationSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "綠築 (Greenbuilt) 混凝土技術與此網頁內容整合、互補之策略建議 (2-4條)"
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "分析出的關鍵詞 (如：低碳、防漏、修補膠、高強度)"
            }
          },
          required: ["title", "summary", "sustainabilityKPIs", "integrationSuggestions", "keywords"]
        }
      }
    });

    const resultText = geminiResponse.text?.trim();
    if (!resultText) {
      throw new Error("AI 無法產生回應，請稍候重試");
    }

    const structuredData = JSON.parse(resultText);
    
    return Response.json(
      { success: true, sourceUrl: url, data: structuredData },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );

  } catch (error: any) {
    console.error("Scraper serverless error:", error);
    return Response.json(
      { success: false, error: error.message || "網頁自動化擷取解析失敗" },
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
  path: "/api/scrape"
};
