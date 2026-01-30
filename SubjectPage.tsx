
import React from 'react';
import { Subject, User } from '../types';
import MethodologyBlock from './MethodologyBlock';
import ChatInterface from './ChatInterface';

interface SubjectPageProps {
  subject: Subject;
  user: User;
  onBack: () => void;
}

const SubjectPage: React.FC<SubjectPageProps> = ({ subject, user, onBack }) => {
  return (
    <div className="space-y-8 pb-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour
      </button>

      <MethodologyBlock subject={subject} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mentorat Intelligent</h2>
          <div className="flex gap-2">
             <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">Système Adaptatif</span>
             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-blue-200 dark:border-blue-800">Multi-Modèles</span>
          </div>
        </div>
        <ChatInterface subject={subject} user={user} />
      </div>
    </div>
  );
};

export default SubjectPage;
