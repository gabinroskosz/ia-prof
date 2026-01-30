
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  onHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onHome }) => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 transition-colors duration-300">
      <nav className="liquid-glass mb-10 p-5 rounded-[2rem] flex justify-between items-center shadow-2xl border-white/80 dark:border-white/20 no-print">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onHome}
        >
          <div className="bg-slate-900 dark:bg-blue-600 p-2.5 rounded-xl text-white font-black group-hover:scale-110 transition-transform shadow-lg">
            IA
          </div>
          <div>
            <h1 className="font-black text-slate-900 dark:text-white text-xl leading-none">Prof : La Méthode</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black mt-1">Excellence Académique</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button 
            onClick={toggleDarkMode}
            className="apple-btn p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-amber-400 hover:scale-110 transition-all border border-white/60 dark:border-white/10 shadow-md"
            title="Changer le thème"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-slate-100">{user.displayName}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-tight">Apprenti Expert</p>
          </div>
        </div>
      </nav>
      
      <main className="min-h-[70vh]">
        {children}
      </main>

      <footer className="mt-16 pb-8 text-center text-slate-400 dark:text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800 pt-8 no-print">
        <p className="font-bold">&copy; 2026 IA Prof : La Méthode - Forge ton destin.</p>
        <p className="mt-1 opacity-70">Propulsé par Gemini 3 Flash • Design par Maître Prof</p>
      </footer>
    </div>
  );
};

export default Layout;
