
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

const ModelBadge: React.FC<{ modelName?: string }> = ({ modelName }) => {
  if (!modelName || modelName === 'error') return null;
  
  let label = "V3";
  let colorClass = "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400";
  
  if (modelName.includes("2.5")) {
    label = "V2.5";
    colorClass = "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400";
  } else if (modelName.includes("lite")) {
    label = "Lite";
    colorClass = "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500";
  }

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${colorClass} ml-2 align-middle border border-current/10`}>
      {label}
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent, forceInput?: string, forceMode?: ChatMode) => {
    e?.preventDefault();
    const targetMode = forceMode || activeMode;
    const finalInput = forceInput || inputValue;
    
    const isProactiveMode = ['exam', 'exercise', 'clear', 'advanced'].includes(targetMode) && !forceInput && messages.length > 0;
    
    if (!finalInput.trim() && selectedImages.length === 0 && !isProactiveMode && targetMode !== 'exam' && targetMode !== 'exercise') return;

    const currentInput = finalInput;
    const currentImages = [...selectedImages];

    let userDisplayText = currentInput;
    if (!currentInput && targetMode === 'exam') userDisplayText = "Prépare ma fiche de révision flash adaptée à mon niveau.";
    if (!currentInput && targetMode === 'exercise') userDisplayText = "Je suis prêt pour les 10 exercices progressifs (flash d'abord, problèmes ensuite).";
    if (!currentInput && targetMode === 'clear') userDisplayText = "Explique-moi ce concept simplement avec une analogie concrète.";
    if (!currentInput && targetMode === 'advanced') userDisplayText = "Je veux l'analyse experte complète du concept.";

    const userMessage: Message = {
      role: 'user',
      text: userDisplayText,
      images: currentImages.length > 0 ? currentImages : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedImages([]);
    setIsTyping(true);

    try {
      const result = await generateSubjectResponse(
        subject.systemInstruction,
        [...messages, userMessage],
        userDisplayText,
        targetMode,
        selectedLevel,
        currentImages.length > 0 ? currentImages : undefined
      );

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text,
        modelName: result.model
      }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = "Oups ! La connexion a échoué. Vérifie ton réseau et réessaie.";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg, modelName: 'error' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const triggerMode = (mode: ChatMode, prompt: string) => {
    setActiveMode(mode);
    if (messages.length > 0) {
      handleSendMessage(undefined, prompt, mode);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const r = new FileReader();
        r.onloadend = () => {
          setSelectedImages(prev => [...prev, r.result as string]);
        };
        r.readAsDataURL(file);
      });
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="glass flex flex-col h-[85vh] md:h-[780px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl fade-in chat-container relative border border-white/40 dark:border-slate-800 transition-all duration-300">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/20 dark:border-slate-800 bg-white/50 dark:bg-slate-900/90 flex items-center justify-between no-print backdrop-blur-xl z-10 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative">
            <div className={`w-3 h-3 md:w-4 md:h-4 ${isTyping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'} rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]`}></div>
            <div className={`absolute -inset-1 ${isTyping ? 'bg-amber-400' : 'bg-emerald-500'} rounded-full opacity-20 animate-ping`}></div>
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] md:text-[12px] tracking-[0.15em] md:tracking-[0.25em]">IA COACH : {subject.name}</h3>
            <p className="hidden md:block text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-widest mt-0.5">MOTEUR HYBRIDE GEMINI</p>
          </div>
        </div>
        <button 
          onClick={() => window.print()}
          className="px-3 md:px-5 py-2 md:py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[9px] md:text-[10px] font-black rounded-xl md:rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 uppercase tracking-widest flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          PDF
        </button>
      </div>

      {/* Level Selector */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/40 flex items-center gap-3 md:gap-4 overflow-x-auto no-scrollbar no-print shrink-0">
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest shrink-0">Cible :</span>
        {LEVELS.map(l => (
          <button
            key={l}
            onClick={() => setSelectedLevel(l)}
            className={`px-4 md:px-5 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black transition-all border shrink-0 ${
              selectedLevel === l 
                ? 'bg-blue-600 border-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)] scale-105' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 md:space-y-12 bg-slate-50/30 dark:bg-slate-950/40 print:bg-white print:p-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 md:p-12 no-print opacity-60">
            <div className="text-7xl md:text-9xl mb-8 md:mb-10 transform drop-shadow-[0_0_30px_rgba(0,0,0,0.1)]">{subject.icon}</div>
            <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Éveille ton potentiel.</h4>
            <p className="text-xs md:text-sm mt-4 md:mt-5 text-slate-500 dark:text-slate-400 max-w-md font-semibold leading-relaxed">Ton mentor en {subject.name} est prêt. Analyse ton cours, résous tes problèmes ou entraîne-toi intensément.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end no-print' : 'justify-start'} fade-in print:block print:mb-20`}>
              <div className={`max-w-[98%] md:max-w-[95%] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm print:max-w-none print:shadow-none print:p-0 relative group ${
                msg.role === 'user' 
                  ? 'bg-slate-900 dark:bg-blue-600/10 dark:border dark:border-blue-500/30 text-white' 
                  : 'bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
              }`}>
                {msg.images && msg.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-6 md:mb-8">
                    {msg.images.map((img, i) => (
                      <img key={i} src={img} alt="Scan" className="max-w-[150px] md:max-w-[250px] rounded-xl md:rounded-2xl shadow-xl border-2 md:border-4 border-white dark:border-slate-800" />
                    ))}
                  </div>
                )}
                
                <div className="markdown-content prose dark:prose-invert prose-slate max-w-none text-[15px] md:text-[17px] leading-relaxed print:text-black print:prose-xl prose-headings:font-black dark:prose-headings:text-white dark:prose-p:text-slate-200 prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-ul:list-disc prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:p-4 prose-td:p-4 prose-td:border-t prose-td:border-slate-200 dark:prose-td:border-slate-700">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>

                {msg.role === 'model' && (
                  <div className="absolute bottom-2 right-4 opacity-30 group-hover:opacity-100 transition-opacity no-print">
                    <ModelBadge modelName={msg.modelName} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start fade-in no-print">
            <div className="bg-white dark:bg-slate-800 rounded-[1.25rem] md:rounded-[1.5rem] px-5 md:px-8 py-3 md:py-5 border border-slate-200 dark:border-slate-800 flex gap-2 md:gap-2.5 shadow-xl">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Control Panel */}
      <div className="p-4 md:p-8 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 no-print backdrop-blur-2xl shrink-0">
        <div className="flex gap-3 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2 md:pb-4 no-scrollbar mode-selector">
          <button
            onClick={() => triggerMode('clear', "Explique-moi le cours simplement avec une analogie concrète.")}
            className={`flex-shrink-0 px-5 md:px-8 py-2.5 md:py-3.5 rounded-[1rem] md:rounded-[1.25rem] text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border ${activeMode === 'clear' ? 'bg-blue-600 border-blue-600 text-white shadow-2xl scale-105' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50'}`}
          >
            💡 Clair
          </button>
          <button
            onClick={() => triggerMode('advanced', "Donne-moi l'analyse experte détaillée.")}
            className={`flex-shrink-0 px-5 md:px-8 py-2.5 md:py-3.5 rounded-[1rem] md:rounded-[1.25rem] text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border ${activeMode === 'advanced' ? 'bg-purple-600 border-purple-600 text-white shadow-2xl scale-105' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50'}`}
          >
            🧠 Avancé
          </button>
          <button
            onClick={() => triggerMode('exercise', "Génère 10 exercices progressifs (flash, moyens, défis).")}
            className={`flex-shrink-0 px-5 md:px-8 py-2.5 md:py-3.5 rounded-[1rem] md:rounded-[1.25rem] text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border ${activeMode === 'exercise' ? 'bg-orange-600 border-orange-600 text-white shadow-2xl scale-105' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50'}`}
          >
            📝 10 Exos
          </button>
          <button
            onClick={() => triggerMode('exam', "Fais-moi une fiche de révision flash adaptée à mon niveau.")}
            className={`flex-shrink-0 px-5 md:px-8 py-2.5 md:py-3.5 rounded-[1rem] md:rounded-[1.25rem] text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border ${activeMode === 'exam' ? 'bg-red-600 border-red-600 text-white shadow-2xl scale-105' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100'}`}
          >
            🔥 Révision
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="flex gap-3 md:gap-4 items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 md:p-4 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
              title="Scanner un document"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Dis Bonjour ou pose ta question..."
              className="flex-1 px-5 md:px-8 py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.5rem] border-[3px] border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-all shadow-inner font-bold text-base md:text-lg"
            />
            <button 
              type="submit" 
              disabled={isTyping} 
              className="p-4 md:p-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl md:rounded-3xl shadow-2xl hover:scale-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center min-w-[56px] md:min-w-[68px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          {selectedImages.length > 0 && (
            <div className="flex flex-wrap gap-3 ml-16 md:ml-24 fade-in">
              {selectedImages.map((img, i) => (
                <div key={i} className="relative inline-block">
                  <img src={img} className="h-20 w-20 md:h-28 md:w-28 object-cover rounded-[1.25rem] md:rounded-[1.5rem] border-4 border-white dark:border-blue-600 shadow-2xl" alt="Thumbnail" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-red-600 text-white rounded-full p-1.5 md:p-2 shadow-2xl hover:scale-125 transition-transform border-2 md:border-3 border-white dark:border-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
