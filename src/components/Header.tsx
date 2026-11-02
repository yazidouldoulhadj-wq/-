import React from 'react';
import { Search, Menu, Globe, MapPin, Heart, Share2 } from 'lucide-react';
import { CLUB_META, TRANSLATIONS } from '../data/clubData';
import { Language } from '../types';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onOpenShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenSearch,
  onOpenMenu,
  onOpenShare,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="relative w-full bg-[#158A3F] text-white shadow-lg">
      {/* Top action bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2.5 bg-black/20 backdrop-blur-md border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            aria-label="القائمة"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-white/90 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#2AE56E] animate-pulse"></span>
            <span>حمادي • بومرداس</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/15">
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                currentLang === 'ar'
                  ? 'bg-[#19CC5B] text-white shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                currentLang === 'fr'
                  ? 'bg-[#19CC5B] text-white shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              FR
            </button>
          </div>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="بحث"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition text-white cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Share Button with QR Code badge */}
          <button
            onClick={onOpenShare}
            aria-label="مشاركة التطبيق ورمز QR"
            title="مشاركة التطبيق عبر واتساب، تيليجرام، فيسبوك، ورمز QR"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#19CC5B] hover:bg-[#158A3F] active:scale-95 transition text-white shadow-xs font-bold text-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">مشاركة / QR</span>
          </button>
        </div>
      </div>

      {/* Hero Banner with Original Cover Image */}
      <div className="relative min-h-[220px] md:min-h-[250px] w-full overflow-hidden flex flex-col justify-end p-5 md:p-7">
        {/* Background Image */}
        <img
          src={CLUB_META.headerImage}
          alt="رفقاء الخير حمادي"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.45] scale-105"
        />

        {/* Gradient overlay for contrast and emerald branding */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E3E20] via-[#116F33]/80 to-transparent"></div>

        {/* Floating decoration */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-100">
          <Heart className="w-3.5 h-3.5 text-[#2AE56E] fill-[#2AE56E]" />
          <span>عمل تطوعي إنساني</span>
        </div>

        {/* Hero Content with Logo */}
        <div className="relative z-10 flex flex-col items-center text-center mt-4">
          {/* Circular Club Logo */}
          <div className="relative mb-3 group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-white shadow-xl ring-4 ring-[#19CC5B]/50 transition-transform duration-300 group-hover:scale-105 overflow-hidden">
              <img
                src={CLUB_META.logoImage}
                alt={CLUB_META.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Verified badge */}
            <span
              title="نادٍ خيري معتمد"
              className="absolute -bottom-1 -right-1 bg-[#19CC5B] text-white p-1 rounded-full shadow-md border-2 border-white flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>

          {/* Titles */}
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm font-arabic">
            {t.clubTitle}
          </h1>

          <div className="mt-1 flex items-center justify-center gap-1.5 text-emerald-100 text-sm font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#2AE56E]" />
            <span>{t.clubSubtitle}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
