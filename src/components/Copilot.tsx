import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, X, Compass, ArrowRight, HelpCircle } from "lucide-react";
import { useScrollHighlight } from "../hooks/useScrollHighlight";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function Copilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "您好！我是綠築再生科技的 **AI 智能導航助理**。您可以問我任何關於荷蘭 Basilisk 自癒混凝土、裂縫修復原理、各項產品配置特性，或請我導航到新落成的 **「自癒互動實驗室」** 親手體驗 3D 體感裂縫晶體合龍！\n\n試問我以下工程與技術：\n* **「帶我去玩 3D 體感粒子自癒實驗室」**\n* **「自癒添加劑 ER7 的特點是什麼？」**\n* **「如何削減 25% 建築物碳足跡？」**"
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { triggerScroll } = useScrollHighlight();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSuggestedPrompt = (prompt: string) => {
    setInputMsg(prompt);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputMsg.trim();
    if (!prompt || isTyping) return;

    setInputMsg("");
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          currentPath: location.pathname,
          history: messages.slice(-8) // Send recent context
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
        
        // Handle navigational action!
        if (data.navigation && data.navigation.path) {
          const { path, scrollId } = data.navigation;
          
          // Execute dynamic cross-route smooth scrolling & spotlight animation
          triggerScroll(path, scrollId);
          navigate(path);
          
          // Push a system message letting the user know we steered them
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                role: "model",
                content: `✨ _已為您智能導航到 **${path === "/" ? "首頁" : 
                           path === "/technology" ? "技術原理" : 
                           path === "/products" ? "產品介紹" : 
                           path === "/projects" ? "工程實績" : 
                           path === "/lab" ? "自癒互動實驗室" : 
                           path === "/faq" ? "常見問題" : "指定網頁"}**，並聚焦至對應區塊！_`
              }
            ]);
          }, 800);
        }
      } else {
        setMessages((prev) => [...prev, { role: "model", content: "抱歉，伺服器訊號微弱，請您稍候再試問。" }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", content: "連線失敗，請檢查網頁網路連接。" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestionPills = [
    "ER7自癒添加劑優點",
    "自動修復最大公釐",
    "我想看建築評論",
    "關於綠築台夫特故事"
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="co-pilot-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-4 rounded-full shadow-2xl text-[#0d110d] font-bold transition-all duration-300 transform select-none cursor-pointer ${
            isOpen ? "bg-emerald-500 hover:bg-emerald-400" : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 animate-pulse"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X className="w-6 h-6 text-[#0d110d]" /> : <Bot className="w-6 h-6 text-[#0d110d]" />}
          {!isOpen && (
            <span className="hidden md:inline-block pr-2 text-xs tracking-wider font-extrabold uppercase font-display text-[#0d110d]">
              AI 智能導航助理
            </span>
          )}
        </motion.button>
      </div>

      {/* Main Chat Portal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="co-pilot-card"
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[400px] h-[580px] bg-[#151a15] border border-emerald-500/20 rounded-3xl shadow-3xl flex flex-col overflow-hidden z-50"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#090b09] border-b border-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-semibold text-[#e0e7e0] flex items-center gap-1.5 text-xs">
                    GreenBuilt 雙向引路員 <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  </h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                    Basilisk Expert Knowledge Hub
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#e0e7e0]/60 hover:text-[#e0e7e0] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions / Tip Ribbon */}
            <div className="px-4 py-2 bg-[#090b09]/50 border-b border-emerald-500/10 text-[10px] text-[#e0e7e0]/60 flex items-center gap-1.5 select-none font-mono">
              <Compass className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>智能引路：提問可自動為網頁切換並高亮對應施工案或試配！</span>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d110d]/50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed text-justify whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-[#0d110d] font-bold rounded-tr-none shadow-lg"
                        : "bg-[#151a15] text-[#e0e7e0] border border-emerald-500/10 rounded-tl-none font-light leading-relaxed"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#151a15] text-[#e0e7e0]/60 rounded-2xl rounded-tl-none px-4 py-3.5 border border-emerald-500/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Container */}
            <div className="px-3 pt-2 pb-1.5 overflow-x-auto flex gap-1.5 scrollbar-none bg-[#090b09]/40 shrink-0 border-t border-emerald-500/10">
              {suggestionPills.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedPrompt(pill)}
                  className="text-[10px] font-mono bg-[#151a15] hover:bg-emerald-500/10 text-[#e0e7e0]/80 border border-emerald-500/10 hover:border-emerald-500/20 rounded-full px-2.5 py-1 whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-[#090b09] border-t border-emerald-500/10 flex items-center gap-2">
              <input
                type="text"
                placeholder="與 AI 助理技術對談並導航..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-[#151a15] text-[#e0e7e0] rounded-xl px-3.5 py-2.5 text-xs outline-none border border-emerald-500/10 focus:border-emerald-500/40"
              />
              <button
                type="submit"
                className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[#0d110d] font-bold rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
