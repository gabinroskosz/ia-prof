
import React from 'react';
import { Subject, User } from '../types.ts';
import MethodologyBlock from './MethodologyBlock.tsx';
import ChatInterface from './ChatInterface.tsx';

interface SubjectPageProps {
  subject: Subject;
  user: User;
  onBack: () => void;
}

const SubjectPage: React.FC<SubjectPageProps> = ({ subject, user, onBack }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-start">
        <button 
          onClick={onBack}
          className="apple-btn flex items-center gap-2 px-6 py-3 bg-white/70 dark:bg-slate-800/70 rounded-full text-slate-900 dark:text-white transition-all shadow-2xl font-black uppercase text-[11px] tracking-[0.15em] hover:scale-110 active:scale-95 group backdrop-blur-xl"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform leading-none">←</span> 
          Retour aux disciplines
        </button>
      </div>

      <MethodologyBlock subject={subject} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Assistant de Travail</h2>
          <div className="flex gap-2">
             <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border-2 border-emerald-300/50 dark:border-emerald-700/50">Système Adaptatif</span>
             <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border-2 border-blue-300/50 dark:border-blue-700/50">Gemini 3 Pro</span>
          </div>
        </div>
        <ChatInterface subject={subject} user={user} />
      </div>
    </div>
  );
};

export default SubjectPage;
