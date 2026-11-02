import React from 'react';
import {
  HandHeart,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  AlertCircle,
  Calculator,
  Users,
  CheckCircle,
  Share2,
  QrCode,
  MessageCircle,
  Send as TelegramIcon
} from 'lucide-react';
import { useClub } from '../context/ClubContext';
import { TRANSLATIONS, getPublicAppUrl } from '../data/clubData';
import { Language, TabId } from '../types';

interface HomeTabProps {
  currentLang: Language;
  onSelectTab: (tab: TabId) => void;
  onOpenDonate: () => void;
  onOpenAid: () => void;
  onOpenVolunteer: () => void;
  onOpenZakat: () => void;
  onOpenShare: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  currentLang,
  onSelectTab,
  onOpenDonate,
  onOpenAid,
  onOpenVolunteer,
  onOpenZakat,
  onOpenShare,
}) => {
  const { clubMeta, appeals } = useClub();
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="space-y-4 md:space-y-6 pb-24 animate-fadeIn">
      {/* 1. Welcome Card */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#E4F6EB] -z-0 opacity-70"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-[#E4F6EB] text-[#19CC5B]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#158A3F]">
              مرحباً بكم • أهلاً بكم
            </span>
          </div>

          <p className="text-slate-700 text-sm md:text-base leading-relaxed font-arabic">
            {currentLang === 'ar' ? clubMeta.welcomeIntroAr : clubMeta.welcomeIntroFr}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#19CC5B]" />
              <span>مقر النادي: {clubMeta.location}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold">
              تطوعي ١٠٠٪
            </span>
          </div>
        </div>
      </section>

      {/* 2. Shortcuts Navigation Grid */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Shortcut: Activities */}
          <button
            onClick={() => onSelectTab('activities')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-[#E4F6EB]/60 border border-emerald-100/80 shadow-xs transition duration-200 active:scale-95 group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E4F6EB] text-[#19CC5B] group-hover:bg-[#19CC5B] group-hover:text-white flex items-center justify-center mb-2 shadow-xs transition-all">
              <HandHeart className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#116F33] transition">
              {t.shortcutActivities}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">المرضى والمبادرات</span>
          </button>

          {/* Shortcut: Contact */}
          <button
            onClick={() => onSelectTab('contact')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-[#E4F6EB]/60 border border-emerald-100/80 shadow-xs transition duration-200 active:scale-95 group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E4F6EB] text-[#19CC5B] group-hover:bg-[#19CC5B] group-hover:text-white flex items-center justify-center mb-2 shadow-xs transition-all">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#116F33] transition">
              {t.shortcutContact}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">أرقام الهواتف والمقر</span>
          </button>

          {/* Shortcut: Request Aid */}
          <button
            onClick={onOpenAid}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-[#E4F6EB]/60 border border-emerald-100/80 shadow-xs transition duration-200 active:scale-95 group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E4F6EB] text-[#19CC5B] group-hover:bg-[#19CC5B] group-hover:text-white flex items-center justify-center mb-2 shadow-xs transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#116F33] transition">
              {t.shortcutRequestAid}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">عتاد طبي أو دواء</span>
          </button>

          {/* Shortcut: Volunteer */}
          <button
            onClick={onOpenVolunteer}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-[#E4F6EB]/60 border border-emerald-100/80 shadow-xs transition duration-200 active:scale-95 group cursor-pointer text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E4F6EB] text-[#19CC5B] group-hover:bg-[#19CC5B] group-hover:text-white flex items-center justify-center mb-2 shadow-xs transition-all">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#116F33] transition">
              {t.shortcutVolunteer}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">كن من رفقاء الخير</span>
          </button>
        </div>
      </section>

      {/* 3. Card Item: "كيف تساهم؟" */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E4F6EB] text-[#19CC5B] flex items-center justify-center shrink-0 shadow-xs">
            <HandHeart className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 font-arabic">
                {t.howToContributeTitle}
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E4F6EB] text-[#158A3F]">
                متاح دائماً
              </span>
            </div>

            <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
              {currentLang === 'ar' ? clubMeta.howToContributeAr : clubMeta.howToContributeFr}
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                onClick={onOpenDonate}
                className="py-2.5 px-5 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.donateButton}</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>

              <button
                onClick={() => onSelectTab('contact')}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#19CC5B]" />
                <span>أرقام الهواتف والمقر</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Urgent Appeals Section (نداءات مستعجلة وحالات إنسانية) */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-slate-900 font-arabic">
              {t.urgentAppealsTitle}
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            حالات موثقة وميدانية
          </span>
        </div>

        <div className="space-y-3">
          {appeals.map((appeal) => (
            <div
              key={appeal.id}
              className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white border border-emerald-100/80 hover:border-emerald-300 transition"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                  عاجل بحمادي
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {appeal.date}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {appeal.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {appeal.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-[#158A3F] bg-[#E4F6EB] px-2.5 py-1 rounded-lg">
                  المطلوب: {appeal.targetAmountOrItem}
                </span>

                <button
                  onClick={onOpenDonate}
                  className="px-3.5 py-1.5 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                >
                  أنا أتكفل بهذا
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Zakat & Sadaqah Highlight Banner */}
      <section className="bg-gradient-to-br from-[#116F33] to-[#158A3F] text-white rounded-3xl p-5 md:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-right">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-2">
              خدمة إسلامية وتكافلية
            </span>
            <h3 className="text-lg md:text-xl font-extrabold font-arabic">
              {t.zakatTitle}
            </h3>
            <p className="text-xs text-emerald-100 mt-1 max-w-md">
              {t.zakatDesc}
            </p>
          </div>

          <button
            onClick={onOpenZakat}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-white text-[#116F33] font-bold text-xs hover:bg-emerald-50 shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Calculator className="w-4 h-4 text-[#19CC5B]" />
            <span>فتح حاسبة الزكاة الآن</span>
          </button>
        </div>
      </section>

      {/* 6. QR Code & Instant Social Share Card */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E4F6EB] text-[#19CC5B] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-arabic">
                رمز الاستجابة QR ومشاركة التطبيق
              </h3>
              <p className="text-xs text-slate-500">
                شارك التطبيق مع العائلات والمتطوعين ببلدية حمادي
              </p>
            </div>
          </div>

          <button
            onClick={onOpenShare}
            className="px-3 py-1.5 rounded-xl bg-[#E4F6EB] hover:bg-[#19CC5B] hover:text-white text-[#158A3F] font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>عرض الرمز</span>
          </button>
        </div>

        {/* Quick Social Buttons: WhatsApp, Telegram, Facebook */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent('تطبيق النادي الخيري رفقاء الخير - بلدية حمادي، ولاية بومرداس لمساعدة المرضى والدعم الاجتماعي:\n' + getPublicAppUrl())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] font-bold text-xs border border-[#25D366]/30 transition active:scale-95 no-underline"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
            <span>واتساب</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(getPublicAppUrl())}&text=${encodeURIComponent('تطبيق النادي الخيري رفقاء الخير - حمادي')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-bold text-xs border border-[#0088cc]/30 transition active:scale-95 no-underline"
          >
            <TelegramIcon className="w-4 h-4 text-[#0088cc] -rotate-45" />
            <span>تيليجرام</span>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getPublicAppUrl())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-bold text-xs border border-[#1877F2]/30 transition active:scale-95 no-underline"
          >
            <svg className="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>فيسبوك</span>
          </a>
        </div>
      </section>

      {/* 7. Club Impact Stats in Hammadi */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-4">
          أثر رفقاء الخير في الميدان • حمادي وبومرداس
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-x-reverse divide-slate-100">
          <div>
            <span className="block text-xl md:text-2xl font-extrabold text-[#19CC5B] font-mono">
              +140
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              عتاد طبي مُعار
            </span>
          </div>
          <div>
            <span className="block text-xl md:text-2xl font-extrabold text-[#19CC5B] font-mono">
              +420
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              عائلة مستفيدة
            </span>
          </div>
          <div>
            <span className="block text-xl md:text-2xl font-extrabold text-[#19CC5B] font-mono">
              18
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              قافلة وحملة تبرع
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
