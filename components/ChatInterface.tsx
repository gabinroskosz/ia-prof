
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Subject, Message, User, ChatMode, ScolarityLevel } from '../types';
import { generateSubjectResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  subject: Subject;
  user: User;
}

const LEVELS: ScolarityLevel[] = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale', 'Post-Bac'];

const MODE_CONFIG: Record<ChatMode, { label: string, activeClass: string, inactiveClass: string, autoPrompt: string, submitColor: string }> = {
  clear: { 
    label: 'Claire', 
    activeClass: 'bg-indigo-500/80 text-white shadow-[0_12px_24px_-8px_rgba(79,70,229,0.5)]',
    inactiveClass: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
    autoPrompt: "Peux-tu m'expliquer clairement les points essentiels de ce sujet ?",
    submitColor: 'bg-indigo-600'
  },
  advanced: { 
    label: 'Approfondir', 
    activeClass: 'bg-rose-500/80 text-white shadow-[0_12px_24px_-8px_rgba(244,63,94,0.5)]',
    inactiveClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    autoPrompt: "Je souhaite approfondir ce sujet. Peux-tu m'expliquer les concepts plus complexes et les détails avancés ?",
    submitColor: 'bg-rose-600'
  },
  exercise: { 
    label: 'Exercices', 
    activeClass: 'bg-cyan-500/80 text-white shadow-[0_12px_24px_-8px_rgba(6,182,212,0.5)]',
    inactiveClass: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    autoPrompt: "Génère-moi une série d'exercices d'application progressifs sur ce thème.",
    submitColor: 'bg-cyan-500'
  },
  exam: { 
    label: 'Examen', 
    activeClass: 'bg-amber-500/80 text-white shadow-[0_12px_24px_-8px_rgba(245,158,11,0.5)]',
    inactiveClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    autoPrompt: "Peux-tu me préparer une fiche de révision complète et synthétique pour l'examen sur ce sujet ?",
    submitColor: 'bg-amber-500'
  }
};

const ModelBadge: React.FC<{ modelName?: string }> = ({ modelName }) => {
  if (!modelName || modelName === 'error') return null;
  const isPro = modelName.includes('pro');
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ml-2 align-middle border backdrop-blur-sm ${
      isPro 
        ? 'bg-amber-500/20 text-amber-600 border-amber-500/30' 
        : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
    }`}>
      {isPro ? 'PRO' : 'FLASH'}
    </span>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ subject, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeMode, setActiveMode] = useState<ChatMode>('clear');
  const [selectedLevel, setSelectedLevel] = useState<ScolarityLevel>('3ème');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent, forceInput?: string, forceMode?: ChatMode) => {
    e?.preventDefault();
    const targetMode = forceMode || activeMode;
    const finalInput = forceInput || inputValue;
    
    if (!finalInput.trim() && selectedImages.length === 0) return;

    const currentImages = [...selectedImages];
    const userMessage: Message = {
      role: 'user',
      text: finalInput,
      images: currentImages.length > 0 ? currentImages : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedImages([]);
    setIsTyping(true);

    try {
      const result = await generateSubjectResponse(
        subject.id,
        subject.name,
        [...messages, userMessage],
        finalInput,
        targetMode,
        selectedLevel,
        currentImages
      );

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text,
        modelName: result.model
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: "Service temporairement saturé. Veuillez réessayer dans quelques instants.", modelName: 'error' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const removeImage = (idx: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="liquid-glass flex flex-col h-[650px] md:h-[750px] rounded-[3rem] overflow-hidden shadow-2xl relative">
      {/* HEADER */}
      <div className="p-5 border-b border-white/20 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl flex items-center justify-between no-print shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 ${isTyping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'} rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]`}></div>
          <h3 className="font-black text-slate-900 dark:text-white uppercase text-[11px] tracking-[0.2em]">{subject.name}</h3>
        </div>
        <div className="flex gap-2">
           <button onClick={() => window.print()} className="apple-btn px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg">Exporter PDF</button>
        </div>
      </div>

      {/* NIVEAUX */}
      <div className="px-5 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 bg-white/10 dark:bg-black/10 border-b border-white/10">
        {LEVELS.map(l => (
          <button 
            key={l} 
            onClick={() => setSelectedLevel(l)} 
            className={`px-4 py-2 rounded-full text-[10px] font-black border transition-all apple-btn whitespace-nowrap ${
              selectedLevel === l 
                ? 'bg-indigo-600/90 text-white border-transparent shadow-lg scale-105' 
                : 'bg-white/40 dark:bg-slate-800/40 border-white/30 text-slate-600 dark:text-slate-300'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* MESSAGES */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-5 md:p-8 space-y-8 custom-scrollbar bg-white/5"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 animate-pulse">
            <div className="text-7xl mb-6 grayscale">{subject.icon}</div>
            <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Pose ta question maintenant</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Prêt pour l'excellence</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`relative max-w-[90%] md:max-w-[85%] rounded-[2rem] p-5 md:p-7 transition-all duration-700 ${
                msg.role === 'user' 
                  ? 'bg-slate-900 dark:bg-indigo-600/50 text-white shadow-2xl' 
                  : 'bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 border border-white/40 dark:border-white/5 shadow-lg backdrop-blur-md'
              }`}>
                {/* Specular Highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[2rem] pointer-events-none"></div>
                
                {msg.images && (
                  <div className="flex gap-3 mb-5 overflow-x-auto pb-2 no-scrollbar">
                    {msg.images.map((img, i) => <img key={i} src={img} className="h-36 md:h-52 rounded-3xl shadow-2xl object-cover border-2 border-white/30" />)}
                  </div>
                )}
                <div className="markdown-content prose dark:prose-invert max-w-none text-[15px] md:text-[16px] leading-relaxed font-medium">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>{msg.text}</ReactMarkdown>
                </div>
                {msg.role === 'model' && (
                  <div className="mt-4 flex justify-end items-center opacity-60">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Généré par</span>
                    <ModelBadge modelName={msg.modelName} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex gap-2 p-4 bg-white/60 dark:bg-slate-800/60 rounded-full w-max shadow-xl backdrop-blur-2xl border border-white/30">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>

      {/* INPUT FOOTER */}
      <div className="p-5 md:p-8 bg-white/40 dark:bg-slate-900/40 border-t border-white/20 no-print shrink-0 backdrop-blur-2xl">
        
        {/* BOUTON "BASES" */}
        {activeMode === 'advanced' && messages.length > 0 && !isTyping && (
          <div className="flex justify-start mb-4">
            <button 
              onClick={() => handleSendMessage(undefined, "Reprenons par les bases fondamentales.", 'advanced')}
              className="px-4 py-2 bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/40 apple-btn shadow-sm flex items-center gap-2"
            >
              <span className="text-base">💡</span> Les Bases d'abord
            </button>
          </div>
        )}

        {/* APERCU IMAGES AVEC CROIX ANIMEE */}
        {selectedImages.length > 0 && (
          <div className="flex gap-4 mb-5 overflow-x-auto pb-2 no-scrollbar animate-fade-in">
            {selectedImages.map((img, i) => (
              <div key={i} className="relative group shrink-0">
                <img src={img} className="h-20 w-20 rounded-[1.5rem] object-cover border-4 border-white shadow-2xl transition-transform duration-500 group-hover:rotate-3" />
                <button 
                  onClick={() => removeImage(i)} 
                  className="img-remove-btn absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-xl z-20 border-2 border-white flex items-center justify-center"
                  title="Supprimer l'image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* MODES STYLE BULLES APPLE */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {(Object.entries(MODE_CONFIG) as [ChatMode, typeof MODE_CONFIG.clear][]).map(([m, config]) => (
            <button 
              key={m} 
              onClick={() => setActiveMode(m)} 
              className={`px-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 apple-btn border border-white/20 text-center ${
                activeMode === m ? config.activeClass : config.inactiveClass + ' bg-white/30 backdrop-blur-lg'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSendMessage} className="flex gap-4 items-center">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            className="p-5 bg-white/60 dark:bg-slate-800/60 rounded-2xl text-slate-600 dark:text-slate-300 apple-btn border border-white/40 shadow-sm"
            title="Ajouter des images"
          >
            <span className="text-2xl">📸</span>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={(e) => {
            const files = e.target.files;
            if (files) Array.from(files).forEach(file => {
              const r = new FileReader();
              r.onloadend = () => setSelectedImages(p => [...p, r.result as string]);
              r.readAsDataURL(file);
            });
            e.target.value = '';
          }} />
          
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Écris ton message ici..." 
              className="w-full px-6 py-5 rounded-2xl border border-white/50 bg-white/40 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 font-bold text-base outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner backdrop-blur-md" 
            />
          </div>

          <button 
            type="submit" 
            className={`p-5 text-white rounded-2xl shadow-2xl apple-btn ${MODE_CONFIG[activeMode].submitColor}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>

        <div className="mt-6 pt-3 text-center border-t border-white/10 opacity-50">
          <p className="text-[8px] uppercase tracking-[0.3em] font-bold leading-tight text-slate-500 dark:text-slate-400">
            Gemini Prof Advanced Engine • Liquid Glass v2 • Design by IA Master
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
