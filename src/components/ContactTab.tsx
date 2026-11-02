import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  Send,
  HeartHandshake,
  Facebook,
  ShieldCheck,
  Building
} from 'lucide-react';
import { CLUB_META, TRANSLATIONS, FAQ_ITEMS } from '../data/clubData';
import { Language } from '../types';

interface ContactTabProps {
  currentLang: Language;
  onOpenDonate: () => void;
  onOpenAid: () => void;
}

export const ContactTab: React.FC<ContactTabProps> = ({
  currentLang,
  onOpenDonate,
  onOpenAid,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const copyToClipboard = (num: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) return;

    try {
      const messages = JSON.parse(localStorage.getItem('rofaqaa_messages') || '[]');
      messages.unshift({
        id: crypto.randomUUID(),
        name: contactName,
        phone: contactPhone,
        message: contactMessage,
        date: new Date().toISOString(),
      });
      localStorage.setItem('rofaqaa_messages', JSON.stringify(messages));
    } catch (err) {
      console.error(err);
    }

    setMessageSent(true);
    setContactName('');
    setContactPhone('');
    setContactMessage('');
    setTimeout(() => setMessageSent(false), 5000);
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-24 animate-fadeIn">
      {/* 1. Headquarters Location Card */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E4F6EB] text-[#19CC5B] flex items-center justify-center shrink-0 shadow-xs">
            <Building className="w-7 h-7" />
          </div>

          <div className="flex-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E4F6EB] text-[#158A3F]">
              المقر الرئيسي
            </span>

            <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mt-1 font-arabic">
              {t.contactOfficeTitle}
            </h3>

            <p className="text-slate-700 text-sm mt-2 leading-relaxed font-arabic">
              {t.contactOfficeDesc}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <MapPin className="w-4 h-4 text-[#19CC5B] shrink-0" />
                <span>بلدية حمادي، دائرة خميس الخشنة، ولاية بومرداس</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{CLUB_META.receptionHours}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Direct Phone Dialers */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100">
        <div className="text-center mb-4">
          <span className="text-xs font-bold text-[#158A3F] uppercase tracking-wider block mb-1">
            الاتصال الهاتفي المباشر
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 font-arabic">
            أرقام هواتف مسؤولي النادي
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            اضغط على الرقم للاتصال الفوري أو انسخه للمحادثة
          </p>
        </div>

        {/* The 3 Phone Buttons */}
        <div className="space-y-3">
          {CLUB_META.phoneNumbers.map((phone, idx) => (
            <div
              key={phone.raw}
              className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-[#19CC5B] text-white shadow-md shadow-emerald-600/25 transition-all hover:bg-[#158A3F] active:scale-98"
            >
              {/* Main Call Action */}
              <a
                href={`tel:${phone.intl}`}
                className="flex items-center gap-3 flex-1 text-right no-underline text-white font-arabic"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-base font-extrabold tracking-wide block font-mono">
                    {phone.label}
                  </span>
                  <span className="text-[11px] text-white/80">
                    خط مباشر • بلدية حمادي
                  </span>
                </div>
              </a>

              {/* Utility buttons: WhatsApp & Copy */}
              <div className="flex items-center gap-1.5 pl-1">
                <a
                  href={`https://wa.me/${phone.intl.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="محادثة واتساب"
                  className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <span>واتساب</span>
                </a>

                <button
                  onClick={(e) => copyToClipboard(phone.raw, e)}
                  title="نسخ الرقم"
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                >
                  {copiedNumber === phone.raw ? (
                    <Check className="w-4 h-4 text-emerald-200" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {copiedNumber && (
          <div className="mt-3 text-center text-xs text-[#158A3F] font-bold animate-fadeIn">
            ✓ تم نسخ الرقم بنجاح إلى الحافظة ({copiedNumber})
          </div>
        )}
      </section>

      {/* 3. Facebook Official Page Banner */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-5 md:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Facebook className="w-5 h-5 text-blue-200" />
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                {t.followFbTitle}
              </span>
            </div>

            <p className="text-xs md:text-sm text-blue-50 leading-relaxed max-w-md font-arabic">
              {t.followFbDesc}
            </p>
          </div>

          <a
            href={CLUB_META.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-white text-blue-800 font-bold text-xs hover:bg-blue-50 shadow-md transition active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <span>زيارة صفحة فيسبوك</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 4. Quick Direct Message Form */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100">
        <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-[#E4F6EB] text-[#19CC5B]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 font-arabic">
              إرسال استفسار أو رسالة مباشرة
            </h3>
            <p className="text-xs text-slate-500">
              سيقوم أحد أعضاء النادي بالرد عليكم عبر الهاتف
            </p>
          </div>
        </div>

        {messageSent ? (
          <div className="p-4 rounded-2xl bg-[#E4F6EB] border border-[#2AE56E]/40 text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#19CC5B] text-white flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#116F33]">
              تم استلام رسالتكم بنجاح!
            </h4>
            <p className="text-xs text-emerald-800 mt-1">
              شكراً لتواصلكم مع نادي رفقاء الخير، سنتصل بكم في أقرب وقت.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم الكريم *
              </label>
              <input
                type="text"
                required
                placeholder="اسمك الكامل"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف للتواصل *
              </label>
              <input
                type="tel"
                required
                placeholder="05 / 06 / 07 ..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نص الرسالة أو الاستفسار *
              </label>
              <textarea
                required
                rows={3}
                placeholder="اكتب استفسارك بخصوص التبرعات، العتاد الطبي، أو طلب مساعدة..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>إرسال الرسالة إلى إدارة النادي</span>
            </button>
          </form>
        )}
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100">
        <h3 className="font-bold text-base text-slate-900 mb-3 font-arabic">
          أسئلة شائعة حول التبرع والمساعدات
        </h3>
        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-xs text-slate-800 mb-1">
                {item.q}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
