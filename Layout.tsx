
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
      <nav className="glass mb-8 p-4 rounded-2xl flex justify-between items-center shadow-sm no-print">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onHome}
        >
          <div className="bg-slate-900 dark:bg-blue-600 p-2 rounded-lg text-white font-bold group-hover:scale-110 transition-transform">
            IA
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-white text-lg leading-none">Prof : La Méthode</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-1">Excellence Académique</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:scale-110 transition-all border border-transparent dark:border-slate-700"
            title="Changer le thème"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.displayName}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tight">Apprenti Expert</p>
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
