import React from "react";
import { Sun, Moon, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="bg-[#373B53] dark:bg-dark-card w-full lg:w-[103px] lg:h-screen lg:fixed lg:top-0 lg:left-0 flex lg:flex-col justify-between items-center z-50 lg:rounded-r-[20px] transition-all overflow-hidden">
      <div className="bg-primary w-[72px] h-[72px] lg:w-[103px] lg:h-[103px] flex items-center justify-center rounded-r-[20px] relative overflow-hidden group cursor-pointer">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#9277FF] rounded-tl-[20px] transition-all group-hover:h-full z-0" />
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26" viewBox="0 0 28 26" fill="none" className="z-10">
          <path fillRule="evenodd" clipRule="evenodd" d="M14 0L28 26H0L14 0Z" fill="white"/>
        </svg>
      </div>

      <div className="flex lg:flex-col items-center">
        <button 
          onClick={toggleTheme}
          className="p-6 lg:p-8 hover:text-[#DFE3FA] transition-colors text-[#858BB2]"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} fill="currentColor" /> : <Sun size={20} fill="currentColor" />}
        </button>
        
        <div className="h-full w-[1px] lg:h-[1px] lg:w-full bg-[#494E6E] mx-6 lg:mx-0 lg:my-0" />
        
        <div className="p-6 lg:p-8 flex items-center justify-center">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border border-gray-400">
            <img 
              src="https://picsum.photos/seed/user/100/100" 
              alt="Avatar" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-light-main dark:bg-dark-main transition-colors font-sans overflow-x-hidden">
      <Sidebar />
      <main className="lg:ml-[103px] px-6 py-8 md:px-16 md:pt-20 md:pb-10 max-w-[730px] mx-auto transition-all">
        {children}
      </main>
    </div>
  );
}
