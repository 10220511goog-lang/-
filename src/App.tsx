import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Technology from "./components/Technology";
import Products from "./components/Products";
import Projects from "./components/Projects";
import FAQ from "./components/FAQ";
import About from "./components/About";
import Downloads from "./components/Downloads";
import Contact from "./components/Contact";
import Copilot from "./components/Copilot";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
        
        {/* Transparent global glassmorphism navbar */}
        <Navbar />

        {/* Global Page Content Container with margin top to prevent Navbar overlap */}
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/products" element={<Products />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Interactive Floating AI Co-pilot assistant */}
        <Copilot />

        {/* High-quality styled footer */}
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}
