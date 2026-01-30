
import React from 'react';
import { SubjectId } from '../types';
import { SUBJECTS } from '../constants';

interface SubjectDashboardProps {
  onSelectSubject: (id: SubjectId) => void;
}

const SubjectDashboard: React.FC<SubjectDashboardProps> = ({ onSelectSubject }) => {
  return (
    <div className="fade-in px-4 sm:px-0">
      <div className="mb-20 text-center">
        <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Prêt pour <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 drop-shadow-sm">l'Excellence ?</span>
        </h2>
        <p className="text-slate-800 dark:text-slate-200 mt-6 text-xl font-bold max-w-2xl mx-auto drop-shadow-sm">
          Choisis ta bulle de savoir et progresse avec fluidité.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.id}
            onClick={() => onSelectSubject(subject.id)}
            className="group liquid-glass p-10 rounded-[3.5rem] text-left transition-all duration-700 bubble-element relative backdrop-blur-2xl"
          >
            {/* Specular Shine Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 pointer-events-none z-10"></div>
            
            <div className="flex justify-between items-start mb-10 relative z-20">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl bg-white/60 dark:bg-slate-800/60 border-2 border-white/80 dark:border-white/20 group-hover:rotate-[15deg] transition-transform duration-700 backdrop-blur-md">
                {subject.icon}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-6 group-hover:translate-x-0 duration-700">
                 <span className="bg-indigo-600 text-white font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest shadow-2xl border border-white/30">Explorer</span>
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter relative z-20">
              {subject.name}
            </h3>
            
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-semibold mb-10 relative z-20">
              Méthode exclusive <br/> <span className="text-indigo-700 dark:text-indigo-400 font-black">"{subject.method.title}"</span>.
            </p>
            
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 font-black text-[11px] uppercase tracking-[0.25em] transition-all relative z-20">
              C'est parti
              <div className="w-10 h-0.5 bg-slate-300 dark:bg-slate-700 group-hover:w-16 group-hover:bg-indigo-500 transition-all duration-700"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-3 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectDashboard;
