import React, { useState } from 'react';
import { X, HandHeart, CheckCircle2, Phone, AlertCircle, Send } from 'lucide-react';
import { useClub } from '../context/ClubContext';
import { AssistanceRequest } from '../types';

interface AssistanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
}

export const AssistanceRequestModal: React.FC<AssistanceRequestModalProps> = ({
  isOpen,
  onClose,
  defaultType,
}) => {
  const { phoneNumbers, clubMeta } = useClub();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cityOrTown, setCityOrTown] = useState('حمادي');
  const [assistanceType, setAssistanceType] = useState<AssistanceRequest['assistanceType']>(
    (defaultType as any) || 'medical_borrow'
  );
  const [patientAgeOrDetails, setPatientAgeOrDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !patientAgeOrDetails) return;

    const receipt = `AID-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRequest: AssistanceRequest = {
      id: crypto.randomUUID(),
      fullName,
      phoneNumber,
      cityOrTown,
      assistanceType,
      patientAgeOrDetails,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('rofaqaa_requests') || '[]');
      localStorage.setItem('rofaqaa_requests', JSON.stringify([newRequest, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setSubmittedReceipt(receipt);
  };

  const handleReset = () => {
    setSubmittedReceipt(null);
    setFullName('');
    setPhoneNumber('');
    setPatientAgeOrDetails('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6 md:p-7 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedReceipt ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#E4F6EB] text-[#19CC5B] mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#116F33] mb-2 font-arabic">
              تم استلام طلبكم بنجاح
            </h3>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              شفاكم الله وعافاكم. سيقوم المشرف الطبي أو مسؤول الشؤون الاجتماعية بالتواصل معكم في أقرب وقت لدراسة الطلب وتوفير المطلوب حسب التوفر.
            </p>

            <div className="bg-[#E4F6EB]/80 border border-[#2AE56E]/40 rounded-2xl p-4 mb-6">
              <span className="text-xs text-emerald-800 font-medium block mb-1">
                رقم ملف الطلب للمتابعة
              </span>
              <span className="text-xl font-mono font-bold text-[#158A3F] tracking-wider select-all">
                {submittedReceipt}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                للحالات الحرجة جداً (ضيق تنفس حاد بحاجة أكسجين فوري)، يرجى الاتصال فوراً بأرقام هواتف النادي مباشرة دون انتظار.
              </span>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-6 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              تم، العودة إلى التطبيق
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
              <div className="p-3 rounded-2xl bg-[#E4F6EB] text-[#19CC5B]">
                <HandHeart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-arabic">
                  طلب مساعدة أو إعارة عتاد طبي
                </h3>
                <p className="text-xs text-slate-500">
                  خدمة مجانية لأهالي بلدية حمادي والمناطق المجاورة
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type of assistance */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نوع المساعدة المطلوبة *
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'medical_borrow', label: 'إعارة عتاد (أكسجين / كرسي)' },
                    { id: 'chronic_medicine', label: 'دواء للأمراض المزمنة' },
                    { id: 'baby_milk', label: 'حليب أطفال تخصصي' },
                    { id: 'social_basket', label: 'قفة أو طرد غذائي' },
                    { id: 'orphan_support', label: 'كفالة أيتام / عائلة' },
                    { id: 'other', label: 'مساعدة اجتماعية أخرى' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setAssistanceType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-right transition cursor-pointer ${
                        assistanceType === t.id
                          ? 'border-[#19CC5B] bg-[#E4F6EB] text-[#116F33] font-bold shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المستفيد أو ولي الأمر *
                </label>
                <input
                  type="text"
                  required
                  placeholder="الاسم واللقب"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف للتواصل *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 0661234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان السكن والحي *
                </label>
                <input
                  type="text"
                  required
                  placeholder="حمادي (الحي أو القرية)، بومرداس"
                  value={cityOrTown}
                  onChange={(e) => setCityOrTown(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right"
                />
              </div>

              {/* Situation / Needs description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  شرح الحالة والاحتياج بدقة *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="مثال: مريض بحاجة إلى مكثف أكسجين مع وصفة الطبيب، أو اسم الدواء والجرعة المطلوبة..."
                  value={patientAgeOrDetails}
                  onChange={(e) => setPatientAgeOrDetails(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right resize-none"
                />
              </div>

              {/* Disclaimer */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 leading-relaxed">
                📌 <strong>ملاحظة هامة:</strong> بالنسبة للعتاد الطبي والأدوية، يتوجب إحضار وصفة طبية أو شهادة طبية عند الاستلام من مقر النادي بحمادي لحفظ حقوق المرضى وضمان الاستخدام الآمن.
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>إرسال طلب المساعدة</span>
                </button>
              </div>

              {/* Direct phone links for urgencies */}
              <div className="mt-3 text-center border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-500 block mb-1">
                  للحالات المستعجلة اتصل مباشرة:
                </span>
                <div className="flex flex-wrap justify-center gap-2 text-xs font-bold text-[#158A3F]">
                  {phoneNumbers.map((p) => (
                    <a
                      key={p.raw}
                      href={`tel:${p.intl}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E4F6EB] hover:bg-emerald-200 transition"
                    >
                      <Phone className="w-3 h-3 text-[#19CC5B]" />
                      <span>{p.raw}</span>
                    </a>
                  ))}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
