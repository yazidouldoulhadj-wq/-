import React, { useState } from 'react';
import { X, HeartHandshake, CheckCircle2, Phone, MapPin, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useClub } from '../context/ClubContext';
import { DonationSubmission } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  initialType,
}) => {
  const { phoneNumbers, clubMeta } = useClub();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [wilaya, setWilaya] = useState('بومرداس - حمادي');
  const [donationType, setDonationType] = useState<DonationSubmission['donationType']>(
    (initialType as any) || 'medical_equipment'
  );
  const [itemDetails, setItemDetails] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DonationSubmission['deliveryMethod']>('deliver_to_hammadi');
  const [notes, setNotes] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !itemDetails) return;

    const receipt = `REFK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newDonation: DonationSubmission = {
      id: crypto.randomUUID(),
      fullName,
      phoneNumber,
      wilaya,
      donationType,
      itemDetails,
      deliveryMethod,
      notes,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('rofaqaa_donations') || '[]');
      localStorage.setItem('rofaqaa_donations', JSON.stringify([newDonation, ...existing]));
    } catch (err) {
      console.error(err);
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#19CC5B', '#2AE56E', '#158A3F', '#FFFFFF'],
    });

    setSubmittedReceipt(receipt);
  };

  const handleReset = () => {
    setSubmittedReceipt(null);
    setFullName('');
    setPhoneNumber('');
    setItemDetails('');
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
              جزاكم الله خيراً وأجزل مثوبتكم!
            </h3>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              تم تسجيل مساهمتكم الكريمة في سجل تبرعات نادي رفقاء الخير. سيقوم فريق النادي بالتواصل معكم هاتفياً لترتيب الاستلام.
            </p>

            <div className="bg-[#E4F6EB]/80 border border-[#2AE56E]/40 rounded-2xl p-4 mb-6">
              <span className="text-xs text-emerald-800 font-medium block mb-1">
                رقم المتابعة المرجعي الخاص بكم
              </span>
              <span className="text-xl font-mono font-bold text-[#158A3F] tracking-wider select-all">
                {submittedReceipt}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 mb-6 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-[#19CC5B] shrink-0" />
              <span>مقر النادي: بلدية حمادي، ولاية بومرداس</span>
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
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-arabic">
                  تسجيل مساهمة أو تبرع
                </h3>
                <p className="text-xs text-slate-500">
                  النادي الخيري رفقاء الخير • بلدية حمادي
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type of donation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نوع المساهمة أو التبرع *
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'medical_equipment', label: 'عتاد طبي (أكسجين، كرسي)' },
                    { id: 'medicines', label: 'أدوية علاجية فائضة' },
                    { id: 'infant_formula', label: 'حليب أطفال أو حفاضات' },
                    { id: 'food_supplies', label: 'مواد غذائية / قفة' },
                    { id: 'clothing', label: 'ألبسة وكسوة العيد' },
                    { id: 'financial_support', label: 'كفالة يتيم / مساهمة مالية' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setDonationType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-right transition cursor-pointer ${
                        donationType === t.id
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
                  الاسم واللقب *
                </label>
                <input
                  type="text"
                  required
                  placeholder="فاعل خير أو الاسم الكامل"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] focus:border-transparent text-right"
                />
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف للتواصل *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 0550123456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] focus:border-transparent text-right"
                />
              </div>

              {/* Wilaya / Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البلدية أو الولاية *
                </label>
                <input
                  type="text"
                  required
                  placeholder="حمادي، رغاية، الرويبة، بومرداس، إلخ."
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] focus:border-transparent text-right"
                />
              </div>

              {/* Item Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تفاصيل المادة أو التبرع *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="مثال: كرسي متحرك بحالة جيدة جداً، أو 4 علب حليب رضع، إلخ."
                  value={itemDetails}
                  onChange={(e) => setItemDetails(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] focus:border-transparent text-right resize-none"
                />
              </div>

              {/* Delivery method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  طريقة التسليم
                </label>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'deliver_to_hammadi'}
                      onChange={() => setDeliveryMethod('deliver_to_hammadi')}
                      className="text-[#19CC5B] focus:ring-[#19CC5B]"
                    />
                    <span>سأقوم بإيصاله مباشرة لمقر النادي ببلدية حمادي</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'call_first'}
                      onChange={() => setDeliveryMethod('call_first')}
                      className="text-[#19CC5B] focus:ring-[#19CC5B]"
                    />
                    <span>أفضل التنسيق عبر الهاتف أولاً قبل الحضور</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>تأكيد تسجيل المساهمة</span>
                </button>
              </div>

              {/* Instant Call numbers footer */}
              <div className="mt-3 text-center border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-500 block mb-1">
                  يمكنكم أيضاً الاتصال المباشر بأرقام النادي:
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
