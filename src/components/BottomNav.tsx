import React from 'react';
import { Home, HandHeart, PhoneCall, PlusCircle } from 'lucide-react';
import { TabId, Language } from '../types';
import { TRANSLATIONS } from '../data/clubData';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  currentLang: Language;
  onOpenDonate: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  currentLang,
  onOpenDonate,
}) => {
  const t = TRANSLATIONS[currentLang];

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: t.tabHome,
      icon: <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'stroke-[2.5] scale-110' : ''}`} />,
    },
    {
      id: 'activities',
      label: t.tabActivities,
      icon: <HandHeart className={`w-5 h-5 transition-transform ${activeTab === 'activities' ? 'stroke-[2.5] scale-110' : ''}`} />,
    },
    {
      id: 'contact',
      label: t.tabContact,
      icon: <PhoneCall className={`w-5 h-5 transition-transform ${activeTab === 'contact' ? 'fill-current scale-110' : ''}`} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] max-w-lg mx-auto">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#19CC5B] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-[#E4F6EB] text-[#19A94E]' : 'bg-transparent'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[90px]">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Floating Fast Action: Donate Pledge */}
        <button
          onClick={onOpenDonate}
          title="تسجيل مساهمة أو تبرع"
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-emerald-700 hover:text-emerald-900 transition cursor-pointer group"
        >
          <div className="p-1.5 rounded-xl bg-[#19CC5B] text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 active:scale-95 transition-all">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold mt-0.5 text-[#158A3F] truncate">
            ساهم معنا
          </span>
        </button>
      </div>
    </nav>
  );
};
