import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Share2,
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  Send,
  Smartphone,
  DownloadCloud,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CLUB_META } from '../data/clubData';
import { Language } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'qr' | 'install'>('share');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = 'النادي الخيري رفقاء الخير - حمادي';
  const shareText = `تطبيق النادي الخيري رفقاء الخير - بلدية حمادي، ولاية بومرداس. تصفح أنشطة مساعدة المرضى، كفالة الأيتام، القوافل التضامنية، وطرق التواصل والمساهمة:\n${currentUrl}`;

  // Direct Social Share URLs
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('تطبيق النادي الخيري رفقاء الخير - بلدية حمادي، ولاية بومرداس')}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  // Download QR code as PNG image
  const handleDownloadQr = () => {
    const svgElement = qrRef.current;
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 500, 500);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'QR_Rofaqaa_El_Kheir_Hammadi.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden text-right">
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-[#116F33] to-[#158A3F] text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#19CC5B] text-white font-bold">
                نشر ومشاركة التطبيق
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-12 h-12 rounded-full p-0.5 bg-white shrink-0 overflow-hidden shadow-sm">
              <img
                src={CLUB_META.logoImage}
                alt={CLUB_META.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-base font-arabic leading-snug">
                {CLUB_META.name}
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                بلدية حمادي، ولاية بومرداس
              </p>
            </div>
          </div>

          {/* 3 Tabs: Share Options, QR Code, Install App */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/20 rounded-xl mt-4 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('share')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
                activeTab === 'share'
                  ? 'bg-white text-[#116F33] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-white text-[#116F33] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>رمز QR</span>
            </button>

            <button
              onClick={() => setActiveTab('install')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
                activeTab === 'install'
                  ? 'bg-white text-[#116F33] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>تثبيت PWA</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {activeTab === 'share' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 text-center leading-relaxed font-arabic">
                تطبيقكم متاح الآن أونلاين! شاركوا الرابط مع أهالي بلدية حمادي والمتطوعين عبر الشبكات التالية:
              </p>

              {/* Social Channels Grid: WhatsApp, Telegram, Facebook */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#075E54] transition active:scale-95 group text-center no-underline"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-xs font-bold">واتساب</span>
                  <span className="text-[10px] text-slate-500">WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 text-[#0088cc] transition active:scale-95 group text-center no-underline"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0088cc] text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition">
                    <Send className="w-5 h-5 -rotate-45" />
                  </div>
                  <span className="text-xs font-bold">تيليجرام</span>
                  <span className="text-[10px] text-slate-500">Telegram</span>
                </a>

                {/* Facebook */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] transition active:scale-95 group text-center no-underline"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold">فيسبوك</span>
                  <span className="text-[10px] text-slate-500">Facebook</span>
                </a>
              </div>

              {/* Native Mobile Share */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Smartphone className="w-4 h-4 text-[#19CC5B]" />
                  <span>المشاركة عبر تطبيقات الهاتف (SMS / Messenger / إلخ)</span>
                </button>
              )}

              {/* Copy Direct Link */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                  رابط التطبيق المباشر المنشور:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="w-full bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 truncate focus:outline-none text-left"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                      copied
                        ? 'bg-[#19CC5B] text-white shadow-xs'
                        : 'bg-slate-800 text-white hover:bg-black'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-[#19CC5B] shadow-inner flex flex-col items-center">
                <QRCodeSVG
                  ref={qrRef}
                  value={currentUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#0E3E20"
                />
                <span className="text-[11px] font-bold text-[#158A3F] mt-2 block font-arabic">
                  امسح الرمز بكاميرا الهاتف لفتح التطبيق فوراً
                </span>
              </div>

              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                يمكنكم حفظ وطباعة رمز QR هذا لوضعه على مطبوعات النادي، الإعلانات، أو بمقر النادي ببلدية حمادي لسهولة الوصول.
              </p>

              <div className="flex items-center gap-2 w-full pt-1">
                <button
                  onClick={handleDownloadQr}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل رمز QR صورة (PNG)</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-3 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  title="نسخ الرابط"
                >
                  {copied ? <Check className="w-4 h-4 text-[#19CC5B]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="space-y-4 text-xs text-slate-700 font-arabic">
              {deferredPrompt && !isInstalled && (
                <button
                  onClick={handleTriggerInstall}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 mb-3"
                >
                  <DownloadCloud className="w-5 h-5" />
                  <span>تثبيت التطبيق على هاتفك الآن (بنقرة واحدة)</span>
                </button>
              )}

              {isInstalled && (
                <div className="p-3 bg-[#E4F6EB] text-[#116F33] rounded-2xl font-bold flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>التطبيق مثبت بالفعل على جهازكم!</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#19CC5B]" />
                  <span>كيفية تثبيت التطبيق كـ تطبيق هاتف حقيقي :</span>
                </h4>

                <div className="border-t border-slate-200/80 pt-2 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#116F33] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="block text-slate-800">على هواتف Android (Chrome / Brave) :</strong>
                      <span className="text-slate-600 text-[11px]">
                        اضغط على النقاط الثلاث (⋮) أعلى المتصفح ثم اختر <strong>«تثبيت التطبيق» (Installer l'application)</strong> أو «إضافة إلى الشاشة الرئيسية».
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#116F33] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="block text-slate-800">على هواتف iPhone / iPad (Safari) :</strong>
                      <span className="text-slate-600 text-[11px]">
                        اضغط على زر المشاركة (⎋) أسفل الشاشة ثم اختر <strong>«على الشاشة الرئيسية» (Sur l'écran d'accueil)</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#E4F6EB]/60 rounded-2xl p-3 border border-[#2AE56E]/40 text-emerald-950 text-[11px] leading-relaxed">
                ✨ <strong>مميزات التثبيت :</strong> يعمل التطبيق بدون شريط المتصفح مثل التطبيقات المحملة من المتجر تماماً، مع سرعة تصفح فائقة وإمكانية العمل في أي وقت.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
