
import React from 'react';
import { SubjectId } from '../types';
import { SUBJECTS } from '../constants';

interface SubjectDashboardProps {
  onSelectSubject: (id: SubjectId) => void;
}

const SubjectDashboard: React.FC<SubjectDashboardProps> = ({ onSelectSubject }) => {
  return (
    <div className="fade-in px-2 sm:px-0">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Prêt pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-cyan-400">l'Excellence ?</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-5 text-lg font-semibold max-w-2xl mx-auto">
          Choisis ta discipline et profite d'un accompagnement sur-mesure propulsé par l'IA la plus avancée.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.id}
            onClick={() => onSelectSubject(subject.id)}
            className="group relative p-8 rounded-[2.5rem] text-left transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_30px_60px_-15px_rgba(30,58,138,0.3)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Hover Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-${subject.color}-500 transition-all duration-700`}></div>
            
            <div className="flex justify-between items-start mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                {subject.icon}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                 <span className={`text-${subject.color}-500 font-black text-xs uppercase tracking-tighter`}>Active</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              {subject.name}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-8">
              Apprends avec la méthode <span className="text-slate-800 dark:text-slate-200 font-bold">"{subject.method.title}"</span>. Analyse, pratique et progresse.
            </p>
            
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] transition-all">
              Démarrer la session
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
