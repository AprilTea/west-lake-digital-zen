import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Shared Gemini client setup
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not set. AI oracle generation will fallback to mock or error.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Poetic Oracle generator using Gemini API
  app.post("/api/oracle", async (req, res) => {
    const { purpose, customQuestion, spot, season, weather, styleMode } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not set. Please add it via Settings > Secrets.",
      });
    }

    try {
      const ai = getGeminiClient();

      const prompt = `你是一位精通江南古典风雅、西湖诗词和现代科技哲学的设计大师、占卜师与文学家。
当前用户正在探索杭州西湖“西湖数智幻影”（West Lake Digital Zen）数字沙盘，其所选参数如下：
- 当前选择的西湖/数智景点: ${spot}
- 当前季节: ${season}
- 当前天气: ${weather}
- 当前界面风格: ${styleMode} (artistic：水墨意境, geometric：数智流线/数字孪生)
- 占卜求签目的: ${purpose || "随缘启示"}
- 用户心中所问: ${customQuestion || "未提供特定问题，请给出一份对今日生活的诗意启示"}

请结合上述参数，为用户量身定制一份富有“西湖诗意”与“数字禅意”的专属卦签（Oracle Card）。
要求：
1. 包含一个极具中国传统风雅和数智美学融合的四至八字【签头/标题】（title）。如果是artistic风格，偏向经典诗意；如果是geometric风格，偏向赛博数字哲学。
2. 包含一句定制的【七言绝句诗词】（poem，即4行，每行7个字），这首诗应当同时描写当前的景点、季节、天气以及所求目的，将古典意境与数智科技精妙融为一体（例如在写西湖美景中穿插“光影”、“数码”、“孪生”、“网”、“智”、“流”等概念，或纯古典风格但寓意科学平衡）。
3. 包含一份充满启发性、文笔优美的【解签内容】（content，2-3句话），融合自然和科技的平衡智慧，解答用户的心中所问。
4. 包含一条【灵气指引】（advice），格式必须为：“宜：[两个相关的行动词]、[另外两个相关的词]。忌：[一个需要避免的行为]。”

请严格按以下JSON格式返回，不要有任何其他字符。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert Chinese classical poet and technology philosopher. Always output valid JSON strictly matching the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING, 
                description: "4 to 8 characters elegant title fusing Jiangnan charm and digital zen." 
              },
              poem: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A 4-line classical Chinese poem with 7 characters per line (七言绝句)."
              },
              content: { 
                type: Type.STRING, 
                description: "2-3 sentences of inspiring and comforting interpretation answering the user's question with wisdom." 
              },
              spot: { 
                type: Type.STRING, 
                description: "The name of the scenic spot." 
              },
              advice: { 
                type: Type.STRING, 
                description: "Guidelines formatted as: '宜：行动1、行动2。忌：行为3。'" 
              },
            },
            required: ["title", "poem", "content", "spot", "advice"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const oracleData = JSON.parse(text);
      res.json(oracleData);
    } catch (error: any) {
      console.error("Gemini API Error in /api/oracle:", error);
      res.status(500).json({
        error: "生成专属灵签失败: " + (error.message || "未知错误"),
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
