
import React from 'react';
import { Subject } from '../types';

interface MethodologyBlockProps {
  subject: Subject;
}

const MethodologyBlock: React.FC<MethodologyBlockProps> = ({ subject }) => {
  return (
    <div className="liquid-glass rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 fade-in">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-indigo-950 p-7 text-white border-b-2 border-white/20 relative overflow-hidden">
        {/* Shine reflect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <span className="text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">{subject.icon}</span>
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Focus Méthode : {subject.name}</h2>
            <p className="text-[11px] text-indigo-300 font-black uppercase tracking-widest mt-0.5">La clé de ton autonomie</p>
          </div>
        </div>
      </div>
      
      <div className="p-8 md:p-10 grid md:grid-cols-3 gap-10 bg-white/40 dark:bg-slate-950/30 backdrop-blur-3xl">
        {/* Material Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl border-2 border-indigo-300/50 dark:border-indigo-700/50 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-black uppercase tracking-[0.2em] text-[11px]">Le Matériel Prêt</h3>
          </div>
          <ul className="space-y-4">
            {subject.material.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-900 dark:text-slate-100 text-[13px] font-bold leading-snug">
                <span className="text-indigo-600 font-black mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Universal Method Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 rounded-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-black uppercase tracking-[0.2em] text-[11px]">Action Immédiate</h3>
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-3xl border-2 border-white/80 dark:border-white/10 shadow-inner">
            <h4 className="font-black text-slate-950 dark:text-white mb-3 text-xs uppercase tracking-tight">{subject.method.title}</h4>
            <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed whitespace-pre-line font-bold">
              {subject.method.description}
            </p>
          </div>
        </div>

        {/* Web Tips Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl border-2 border-emerald-300/50 dark:border-emerald-700/50 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-black uppercase tracking-[0.2em] text-[11px]">Ressources Web</h3>
          </div>
          <ul className="space-y-4">
            {subject.webTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-4 text-slate-800 dark:text-slate-200 text-[13px] italic font-black leading-relaxed">
                <span className="text-emerald-600 font-black text-2xl leading-none">“</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MethodologyBlock;
