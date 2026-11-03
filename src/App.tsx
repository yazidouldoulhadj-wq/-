/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClubProvider, useClub } from './context/ClubContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ActivitiesTab } from './components/ActivitiesTab';
import { ContactTab } from './components/ContactTab';
import { DonationModal } from './components/DonationModal';
import { AssistanceRequestModal } from './components/AssistanceRequestModal';
import { VolunteerModal } from './components/VolunteerModal';
import { ZakatCalculatorModal } from './components/ZakatCalculatorModal';
import { SearchModal } from './components/SearchModal';
import { MenuDrawer } from './components/MenuDrawer';
import { ShareModal } from './components/ShareModal';
import { AdminConsole } from './components/AdminConsole';
import { WelcomeVoiceAudio } from './components/WelcomeVoiceAudio';
import { Language, TabId } from './types';
import { Smartphone, Monitor } from 'lucide-react';

function AppContent() {
  const { clubMeta } = useClub();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [viewMode, setViewMode] = useState<'mobile' | 'wide'>('mobile');

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateInitialType, setDonateInitialType] = useState<string | undefined>();
  const [isAidOpen, setIsAidOpen] = useState(false);
  const [aidDefaultType, setAidDefaultType] = useState<string | undefined>();
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isZakatOpen, setIsZakatOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync document direction with language
  useEffect(() => {
    if (currentLang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'fr';
    }
  }, [currentLang]);

  // Scroll to top on tab change
  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonate = (type?: string) => {
    setDonateInitialType(type);
    setIsDonateOpen(true);
  };

  const handleOpenAid = (type?: string) => {
    setAidDefaultType(type);
    setIsAidOpen(true);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#E4F6EB]/60 flex flex-col items-center">
      {/* Desktop view-mode switcher bar */}
      <aside aria-label="شريط المعاينة" className="hidden lg:flex items-center justify-between w-full max-w-4xl px-4 py-2 mt-2 text-xs text-slate-600 bg-white/80 backdrop-blur-md rounded-2xl shadow-xs border border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#19CC5B] animate-pulse"></span>
          <span className="font-bold text-[#116F33]">{clubMeta.shortName}</span>
          <span className="text-slate-400">• {clubMeta.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">وضع العرض:</span>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-[#19CC5B] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>عرض الهاتف المحمول</span>
          </button>
          <button
            onClick={() => setViewMode('wide')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              viewMode === 'wide'
                ? 'bg-[#19CC5B] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>عرض عريض</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main
        className={`w-full transition-all duration-300 ${
          viewMode === 'mobile'
            ? 'max-w-md my-0 lg:my-4 shadow-2xl rounded-none lg:rounded-[36px] overflow-hidden border-0 lg:border-8 lg:border-white ring-1 ring-slate-200/50'
            : 'max-w-3xl my-0 lg:my-4 shadow-xl rounded-none lg:rounded-[32px] overflow-hidden border-0 lg:border-4 lg:border-white'
        } bg-[#F3FBF6] relative flex flex-col min-h-screen lg:min-h-[860px]`}
      >
        {/* Header */}
        <Header
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenShare={handleShare}
        />

        {/* Tab Content */}
        <div className="flex-1 p-4 md:p-5">
          {activeTab === 'home' && (
            <HomeTab
              currentLang={currentLang}
              onSelectTab={handleSelectTab}
              onOpenDonate={() => handleOpenDonate()}
              onOpenAid={() => handleOpenAid()}
              onOpenVolunteer={() => setIsVolunteerOpen(true)}
              onOpenZakat={() => setIsZakatOpen(true)}
              onOpenShare={handleShare}
            />
          )}

          {activeTab === 'activities' && (
            <ActivitiesTab
              currentLang={currentLang}
              onOpenDonate={handleOpenDonate}
              onOpenAid={handleOpenAid}
              onOpenVolunteer={() => setIsVolunteerOpen(true)}
            />
          )}

          {activeTab === 'contact' && (
            <ContactTab
              currentLang={currentLang}
              onOpenDonate={() => handleOpenDonate()}
              onOpenAid={() => handleOpenAid()}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          currentLang={currentLang}
          onOpenDonate={() => handleOpenDonate()}
        />

        {/* Footer */}
        <footer className="pb-28 pt-4 px-4 text-center border-t border-emerald-100/70 bg-gradient-to-b from-transparent to-white/70">
          <div className="flex flex-col items-center justify-center gap-2">
            {/* Club Association Details & Application Logo Button */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="p-0.5 rounded-full hover:ring-2 hover:ring-[#19CC5B] transition cursor-pointer overflow-hidden shrink-0 shadow-2xs inline-flex items-center justify-center bg-white border border-emerald-300 active:scale-95"
                title={currentLang === 'ar' ? 'شعار التطبيق • لوحة تحكم الإدارة' : "Logo de l'application • Administration"}
              >
                <img
                  src={clubMeta.logoImage}
                  alt={clubMeta.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
              </button>
              <span>{clubMeta.name} • {clubMeta.location}</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        initialType={donateInitialType}
      />

      <AssistanceRequestModal
        isOpen={isAidOpen}
        onClose={() => setIsAidOpen(false)}
        defaultType={aidDefaultType}
      />

      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
      />

      <ZakatCalculatorModal
        isOpen={isZakatOpen}
        onClose={() => setIsZakatOpen(false)}
        onOpenDonate={(amount) => {
          setIsZakatOpen(false);
          handleOpenDonate('financial_support');
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={handleSelectTab}
        onOpenDonate={() => handleOpenDonate()}
        onOpenAid={() => handleOpenAid()}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenDonate={() => handleOpenDonate()}
        onOpenAid={() => handleOpenAid()}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
        onOpenZakat={() => setIsZakatOpen(true)}
        onOpenShare={handleShare}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Comprehensive Share & QR Code Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentLang={currentLang}
      />

      {/* Invisible Welcome Voice Audio player */}
      <WelcomeVoiceAudio currentLang={currentLang} />

      {/* Admin Console Modal */}
      <AdminConsole
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ClubProvider>
      <AppContent />
    </ClubProvider>
  );
}
