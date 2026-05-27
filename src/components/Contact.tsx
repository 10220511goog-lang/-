import React, { useState } from "react";
import { Mail, Phone, MapPin, Building, Calendar, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    phone: "",
    email: "",
    applicationType: "地下連續壁/大底防水",
    desc: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 bg-[#0d110d] text-[#e0e7e0]">
      
      {/* Header */}
      <div className="text-center space-y-6 pt-12">
        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
          ENGINEERING INQUIRY & DESIGN REVIEW
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-[#e0e7e0] tracking-tight leading-none">
          技術引水與設計諮詢
        </h1>
        <p className="max-w-2xl mx-auto text-[#e0e7e0]/70 text-xs md:text-sm leading-relaxed font-light">
          不論是大尺寸連續壁基底阻漏試配，或有特殊伸縮縫裂縫整建防漏。預約綠築專業土木技師諮詢，獲得詳密方案評估。
        </p>
      </div>

      {/* Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in">
        
        {/* Contact Info (Lg-span 5) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <span className="text-emerald-400 font-mono text-[11px] tracking-widest block uppercase">GREENBUILT HDQ</span>
          <h2 className="text-3xl font-display font-bold text-[#e0e7e0] tracking-tight leading-tight">
            聯絡綠築台北專業諮詢小組
          </h2>
          <p className="text-xs text-[#e0e7e0]/70 leading-relaxed text-justify font-light">
            若您正在規劃全新建案連續大底大灌注，或現有商空、大樓地下連續壁遭受地盤沉降產生反覆滲水。留下您的需求資訊，我們將在 24 小時之內指派專任材料技師與您會商，提供完備配量算計報告。
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-[#151a15] border border-emerald-500/12 rounded-2xl shadow-lg">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-[#e0e7e0]">24H 技術諮詢專線</h4>
                <p className="text-xs text-emerald-400 font-mono font-bold">+886 (02) 2382-1234</p>
                <p className="text-[10px] text-[#e0e7e0]/40 font-light">週一至週五 09:00 - 18:00 (台北諮詢顧問親自駐守)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#151a15] border border-emerald-500/12 rounded-2xl shadow-lg">
              <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-[#e0e7e0]">大師配合電子郵件</h4>
                <p className="text-xs text-emerald-400 font-mono font-bold">support@greenbuilt.org.tw</p>
                <p className="text-[10px] text-[#e0e7e0]/40 font-light">營造招標對接、混凝土配比、學術研討專窗</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#151a15] border border-emerald-500/12 rounded-2xl shadow-lg">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-[#e0e7e0]">台北技術展示大廳</h4>
                <p className="text-xs text-[#e0e7e0]/80 font-light">台灣台北市大安區信義路三段 100 號</p>
                <p className="text-[10px] text-[#e0e7e0]/40 font-light">店內設有 Basilisk 生物自癒混凝土、自修砂漿動態晶簇展示專台</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consulting Form Card (Lg-span 7) */}
        <section id="contact-form-focus" className="lg:col-span-12 xl:col-span-7 bg-[#151a15] border border-emerald-500/15 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                id="contact-form"
                onSubmit={handleSubmit}
                className="space-y-5 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-base sm:text-lg font-display font-bold text-[#e0e7e0] border-b border-emerald-500/10 pb-3">
                  預約 Basilisk 生化自癒可行性評估與試拌配合
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#e0e7e0]/80 font-semibold block font-display">諮詢聯絡人姓名</label>
                    <input
                      type="text"
                      required
                      placeholder="先生 / 女士"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#090b09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl px-3.5 py-3 text-xs text-[#e0e7e0] outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#e0e7e0]/80 font-semibold block font-display">營造公司 / 業主院所</label>
                    <input
                      type="text"
                      required
                      placeholder="例如：永續營造、個人業主、某某技術院"
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      className="w-full bg-[#090b09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl px-3.5 py-3 text-xs text-[#e0e7e0] outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#e0e7e0]/80 font-semibold block font-display">行動電話 / 公司座機</label>
                    <input
                      type="tel"
                      required
                      placeholder="0911-345-678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#090b09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl px-3.5 py-3 text-xs text-[#e0e7e0] outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#e0e7e0]/80 font-semibold block font-display">電子信箱 Email</label>
                    <input
                      type="email"
                      required
                      placeholder="example@yourdomain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#090b09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl px-3.5 py-3 text-xs text-[#e0e7e0] outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#e0e7e0]/80 font-semibold block font-display">目標施築材料之工序預備類型</label>
                  <select
                    value={formData.applicationType}
                    onChange={(e) => setFormData({ ...formData, applicationType: e.target.value })}
                    className="w-full bg-[#090b09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl px-3 py-3 text-xs text-[#e0e7e0]/80 outline-none transition"
                  >
                    <option>地下連續壁/主外牆預拌自癒防滲配比 (ER7)</option>
                    <option>二次施作縫/伸縮接合維修補強固砂 (MR3)</option>
                    <option>老屋或結構多點開裂刮平粉刷 (MR3)</option>
                    <option>大面積髮絲細縫液面高壓氣噴滲透 (Liquid System)</option>
                    <option>巨型海港防波外堤大抵試配諮詢</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#e0e7e0]/80 font-semibold block font-display">專案案體規模及漏水漏沙現狀詳擬</label>
                  <textarea
                    rows={4}
                    placeholder="請簡介或條列您的施工標的位置、估灌立方米、裂縫跨距深度，以便技術顧問為您開展二次可行性檢算..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full bg-[#090b09] border border-emerald-500/15 focus:border-emerald-500/40 rounded-xl px-3.5 py-3 text-xs text-[#e0e7e0] outline-none transition leading-relaxed font-light"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[#0d110d] font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-[1.01]"
                  >
                    提交技術請求單並開始排程
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                className="py-12 text-center space-y-6 relative z-10"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl animate-pulse">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold text-[#e0e7e0]">
                    技術需求與諮詢案已正式排妥進度
                  </h3>
                  <p className="text-xs text-[#e0e7e0]/70 max-w-sm mx-auto leading-relaxed font-light">
                    感謝 <strong>{formData.name}</strong> 專家 ({formData.org})！我們已將您的計畫工序項目《{formData.applicationType}》登載進數據流。
                    綠築材料技術審查小組將在 24 小時之內派專技技師與您聯繫，免費呈遞預配工程算料概估書。
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-[#e0e7e0]/50 bg-[#090b09] border border-emerald-500/10 px-4 py-2.5 rounded-xl font-mono">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                  <span>預定初核技師接軌時間：工作日 AM 10:00 前</span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    ⬅️ 重新撰寫或遞交另一張配合單
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </div>
  );
}
