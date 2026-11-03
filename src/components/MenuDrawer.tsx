import { X, Home, HandHeart, PhoneCall, Calculator, Users, Globe, ExternalLink, Share2, MapPin, Info, Lock } from 'lucide-react';
import { useClub } from '../context/ClubContext';
import { TRANSLATIONS } from '../data/clubData';
import { TabId, Language } from '../types';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenDonate: () => void;
  onOpenAid: () => void;
  onOpenVolunteer: () => void;
  onOpenZakat: () => void;
  onOpenShare: () => void;
  onOpenAdmin: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  currentLang,
  onLanguageChange,
  onOpenDonate,
  onOpenAid,
  onOpenVolunteer,
  onOpenZakat,
  onOpenShare,
  onOpenAdmin,
}) => {
  const { clubMeta } = useClub();
  const t = TRANSLATIONS[currentLang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col text-right">
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-[#116F33] to-[#158A3F] text-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#19CC5B] text-white font-bold">
              تطبيق النادي
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={clubMeta.logoImage}
              alt={clubMeta.name}
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <div>
              <h3 className="font-extrabold text-base leading-tight font-arabic">
                {clubMeta.name}
              </h3>
              <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#2AE56E]" />
                <span>{clubMeta.location}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-medium">
          {/* Navigation */}
          <button
            onClick={() => {
              onSelectTab('home');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#E4F6EB] text-[#116F33] font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t.tabHome}</span>
            <Home className="w-4 h-4 text-[#19CC5B]" />
          </button>

          <button
            onClick={() => {
              onSelectTab('activities');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-[#E4F6EB] text-[#116F33] font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t.tabActivities}</span>
            <HandHeart className="w-4 h-4 text-[#19CC5B]" />
          </button>

          <button
            onClick={() => {
              onSelectTab('contact');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#E4F6EB] text-[#116F33] font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t.tabContact}</span>
            <PhoneCall className="w-4 h-4 text-[#19CC5B]" />
          </button>

          <div className="my-2 border-t border-slate-100"></div>

          {/* Interactive Services */}
          <button
            onClick={() => {
              onClose();
              onOpenDonate();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <span>تسجيل تبرع أو مساهمة</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-[#116F33] font-bold">
              ساهم
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAid();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <span>طلب مساعدة أو عتاد طبي</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold">
              مجاني
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenVolunteer();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <span>الانضمام كمتطوع</span>
            <Users className="w-4 h-4 text-[#19CC5B]" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenZakat();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <span>حاسبة زكاة المال (دج)</span>
            <Calculator className="w-4 h-4 text-[#19CC5B]" />
          </button>

          <div className="my-2 border-t border-slate-100"></div>

          {/* Official Facebook Link */}
          <a
            href={clubMeta.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50/70 text-blue-800 hover:bg-blue-100/70 transition"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold">المجموعة الرسمية على فيسبوك</span>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </a>

          {/* Share & QR Code */}
          <button
            onClick={() => {
              onClose();
              onOpenShare();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <span>مشاركة التطبيق ورمز QR</span>
            <Share2 className="w-4 h-4 text-[#19CC5B]" />
          </button>

          {/* Install on phone */}
          <button
            onClick={() => {
              onClose();
              onOpenShare();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-[#116F33] font-bold transition cursor-pointer"
          >
            <span>تثبيت التطبيق على هاتفك (PWA)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#19CC5B] text-white">
              مجاناً
            </span>
          </button>

          {/* Admin Console Entry */}
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white font-bold transition cursor-pointer mt-1 hover:bg-black"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#19CC5B] animate-pulse"></span>
              <span className="text-xs">لوحة تحكم الإدارة (Admin)</span>
            </div>
            <Lock className="w-4 h-4 text-[#19CC5B]" />
          </button>

          {/* Language Switch */}
          <div className="p-3 bg-slate-50 rounded-2xl mt-4">
            <span className="text-xs font-bold text-slate-400 block mb-2">
              لغة التطبيق / Langue:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onLanguageChange('ar')}
                className={`py-2 px-2 rounded-lg font-bold transition cursor-pointer text-center ${
                  currentLang === 'ar'
                    ? 'bg-[#19CC5B] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`py-2 px-2 rounded-lg font-bold transition cursor-pointer text-center ${
                  currentLang === 'fr'
                    ? 'bg-[#19CC5B] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                Français
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            النادي الخيري رفقاء الخير • حمادي، ولاية بومرداس
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            نسخة الويب التفاعلية المخصصة
          </p>
        </div>
      </div>
    </div>
  );
};
