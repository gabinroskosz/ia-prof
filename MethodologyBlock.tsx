
import React from 'react';
import { Subject } from '../types';

interface MethodologyBlockProps {
  subject: Subject;
}

const MethodologyBlock: React.FC<MethodologyBlockProps> = ({ subject }) => {
  return (
    <div className="glass rounded-3xl overflow-hidden shadow-sm mb-8 fade-in dark:border-slate-800/60">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-900 dark:to-blue-900 p-6 text-white border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-3xl drop-shadow-md">{subject.icon}</span>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Focus Méthode : {subject.name}</h2>
            <p className="text-[10px] text-blue-200/70 font-bold uppercase tracking-widest mt-0.5">La clé de ton autonomie</p>
          </div>
        </div>
      </div>
      
      <div className="p-8 grid md:grid-cols-3 gap-8 bg-white/40 dark:bg-slate-900/60">
        {/* Material Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-black uppercase tracking-widest text-[10px]">Le Matériel Prêt</h3>
          </div>
          <ul className="space-y-3">
            {subject.material.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-200 text-xs font-semibold leading-snug">
                <span className="text-blue-500 font-black mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Universal Method Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-black uppercase tracking-widest text-[10px]">Action Immédiate</h3>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <h4 className="font-black text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-tight">{subject.method.title}</h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed whitespace-pre-line font-medium">
              {subject.method.description}
            </p>
          </div>
        </div>

        {/* Web Tips Section */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-black uppercase tracking-widest text-[10px]">Ressources Web</h3>
          </div>
          <ul className="space-y-3">
            {subject.webTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-xs italic font-medium leading-relaxed">
                <span className="text-emerald-500 font-black text-lg leading-none">“</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MethodologyBlock;
