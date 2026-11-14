"use client";
import { useState, useRef } from 'react';
import { Send, Image as ImageIcon, Loader2, Zap, Eye } from 'lucide-react';

export default function OjoDelDiablo() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!input.trim() && !image) return;

    setLoading(true);
    setResponse("");

    try {
      const payload: any = {
        text: input,
        image: image,
        image_mime: imageFile?.type || "image/png"
      };

      // CORREÇÃO AQUI: Rota correta para bater com o backend
      const res = await fetch('/api/rubimind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.status === "success") {
        setResponse(data.response);
      } else {
        setResponse(`[ERRO]: ${data.message}`);
      }
    } catch (err) {
      setResponse("[FALHA DE CONEXÃO] O olho falhou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-mono selection:bg-red-900 selection:text-white">
      <header className="border-b border-zinc-900 p-4 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Eye className="w-6 h-6 text-red-600 animate-pulse" />
            <div className="absolute inset-0 w-6 h-6 bg-red-600/20 rounded-full blur-sm animate-ping"></div>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-zinc-100">
            OJO <span className="text-red-600">DEL</span> DIABLO
          </h1>
          <span className="hidden sm:inline-block text-xs border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
            UNCENSORED • BUSCA EM TEMPO REAL
          </span>
        </div>
        <div className="text-xs text-zinc-600 font-mono">
          {image ? "📷 VISÃO ATIVA" : "👁️ AGUARDANDO"}
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 flex flex-col gap-6">
        {response && (
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 text-sm leading-relaxed whitespace-pre-wrap text-zinc-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900 opacity-50"></div>
            <div className="text-red-500 mb-4 font-bold text-xs uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Zap size={12} /> Resposta do Ojo
            </div>
            <div className="prose prose-invert max-w-none">
              {response}
            </div>
          </div>
        )}

        <div className="mt-auto relative group">
          {image && (
            <div className="mb-4 relative inline-block">
              <img 
                src={image} 
                alt="Input" 
                className="max-h-48 rounded-lg border border-zinc-800 shadow-lg object-contain bg-zinc-900" 
              />
              <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg transition-transform hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          )}

          <div className="flex items-end gap-3 bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus-within:border-red-900/50 focus-within:ring-1 focus-within:ring-red-900/20 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-lg transition-all ${image ? 'bg-red-900/30 text-red-500' : 'hover:bg-zinc-900 text-zinc-500'}`}
            >
              <ImageIcon size={20} />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Digite sua ordem ou cole o contexto..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 text-zinc-100 placeholder-zinc-600 max-h-32 text-sm"
              rows={1}
            />

            <button 
              onClick={handleSubmit}
              disabled={loading || (!input.trim() && !image)}
              className={`p-3 rounded-lg transition-all ${
                loading 
                  ? 'bg-zinc-900 text-zinc-600 cursor-wait' 
                  : 'bg-red-700 hover:bg-red-600 text-black shadow-[0_0_10px_rgba(185,28,28,0.4)]'
              } disabled:opacity-50`}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          
          <div className="text-center mt-3 text-[10px] text-zinc-700 uppercase tracking-widest">
            Powered by Ojo del Diablo • Busca Serper + Visão GPT-4o
          </div>
        </div>
      </main>
    </div>
  );
}
