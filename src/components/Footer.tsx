import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer() {
  const links = [
    { name: "首頁 關鍵引導", path: "/" },
    { name: "技術 自癒原理", path: "/technology" },
    { name: "產品 生物型配方", path: "/products" },
    { name: "實績 經典案場", path: "/projects" },
    { name: "問答 疑難解析", path: "/faq" },
    { name: "故事 學術結緣", path: "/about" },
    { name: "分析 AI 擷取器", path: "/downloads" },
    { name: "諮詢 線上工序", path: "/contact" }
  ];

  return (
    <footer className="bg-[#090b09] border-t border-emerald-500/10 pt-16 pb-12 relative overflow-hidden text-[#e0e7e0]">
      {/* Decorative ambient spots */}
      <div className="absolute bottom-0 left-12 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Brand (Span 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-display font-bold text-[#e0e7e0] tracking-wider text-base">
                GreenBuilt <span className="text-emerald-400 font-extrabold">Taiwan</span>
              </span>
            </div>
            
            <p className="text-xs text-[#e0e7e0]/60 leading-relaxed max-w-sm font-light text-justify">
              綠築再生科技有限公司是台灣領先的綠色生化自癒建築科技拓荒者。專注引進荷蘭台夫特理工大學原創研發的 Basilisk 生物自復修水泥，給予高震度且潮濕多鹽的海島基建永存保障。
            </p>

            <div className="flex items-center gap-2 text-xs text-[#e0e7e0]/50 font-light">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>荷蘭 Basilisk 官方唯一授權大中華及台灣合作夥伴</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-display font-semibold text-[#e0e7e0] tracking-widest uppercase">
              網站系統導覽
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-light">
              {links.map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  className="text-[#e0e7e0]/60 hover:text-emerald-400 transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Contact & Info (Span 4) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-display font-semibold text-[#e0e7e0] tracking-widest uppercase">
              綠築諮詢與服務對接
            </h4>
            
            <ul className="space-y-3 text-xs text-[#e0e7e0]/60 font-light">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>+886 (02) 2382-1234 (台北技術審查小組)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-mono">support@greenbuilt.org.tw</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>台灣台北市大安區信義路三段 100 號 (綠築科技總部)</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="https://www.basiliskconcrete.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline"
              >
                探索荷蘭原廠全球官方技術網站 <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Separator / Copy */}
        <div className="pt-8 border-t border-emerald-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#e0e7e0]/40 font-light font-mono select-none">
          <span>&copy; {new Date().getFullYear()} 綠築再生科技有限公司 GreenBuilt Taiwan. All Rights Reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#e0e7e0]/80 transition">隱私權條例</a>
            <span>|</span>
            <a href="#" className="hover:text-[#e0e7e0]/80 transition">材料免責公告</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
