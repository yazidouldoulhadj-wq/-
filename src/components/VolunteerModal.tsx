import React, { useState } from 'react';
import { X, Users, CheckCircle2, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VolunteerSubmission } from '../types';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [professionOrSkills, setProfessionOrSkills] = useState('');
  const [availability, setAvailability] = useState<VolunteerSubmission['availability']>('flexible');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'قوافل تضامنية',
    'توزيع المساعدات',
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) return;

    const newVolunteer: VolunteerSubmission = {
      id: crypto.randomUUID(),
      fullName,
      phoneNumber,
      age,
      professionOrSkills,
      availability,
      interests: selectedInterests,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('rofaqaa_volunteers') || '[]');
      localStorage.setItem('rofaqaa_volunteers', JSON.stringify([newVolunteer, ...existing]));
    } catch (err) {
      console.error(err);
    }

    confetti({
      particleCount: 70,
      spread: 60,
      colors: ['#19CC5B', '#2AE56E', '#158A3F'],
    });

    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFullName('');
    setPhoneNumber('');
    setAge('');
    setProfessionOrSkills('');
    onClose();
  };

  const interestOptions = [
    'توزيع قفف ومساعدات',
    'قوافل المناطق النائية',
    'مساعدة المرضى ونقل العتاد',
    'تنظيم مطاعم إفطار رمضان',
    'حملات التبرع بالدم',
    'إعلام وتصوير وتصميم',
    'طب وتمريض وإسعاف',
  ];

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

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#E4F6EB] text-[#19CC5B] mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#116F33] mb-2 font-arabic">
              مرحباً بك في أسرة رفقاء الخير!
            </h3>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              شكرًا لروحك التطوعية النبيلة. تم تسجيل بياناتك بنجاح، وسيتواصل معك منسق العمل الميداني لإضافتك إلى مجموعة المتطوعين ودعوتك لأول نشاط قادم.
            </p>

            <div className="bg-[#E4F6EB] rounded-2xl p-4 text-xs text-emerald-900 mb-6 font-medium">
              «خير الناس أنفعهم للناس» • معاً لنصنع الفارق في بلدية حمادي
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
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-arabic">
                  استمارة الانضمام لفريق التطوع
                </h3>
                <p className="text-xs text-slate-500">
                  النادي الخيري رفقاء الخير • بلدية حمادي
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم واللقب *
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

              {/* Phone & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07 ..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    العمر (سنة)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="80"
                    placeholder="مثال: 24"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right"
                  />
                </div>
              </div>

              {/* Profession or Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المهنة أو المهارات (سائق، طالب، ممرض، تاجر، كهربائي...)
                </label>
                <input
                  type="text"
                  placeholder="مثال: طالب جامعي / لدي سيارة نقل / ممرض"
                  value={professionOrSkills}
                  onChange={(e) => setProfessionOrSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  أوقات التفرغ المناسبة
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right bg-white"
                >
                  <option value="weekends">عطلة نهاية الأسبوع (الجمعة / السبت)</option>
                  <option value="evenings">الفترة المسائية</option>
                  <option value="flexible">مرن ومستعد للحالات الطارئة</option>
                  <option value="campaigns_only">خلال الحملات الكبرى ومواسم رمضان فقط</option>
                </select>
              </div>

              {/* Areas of interest */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  مجالات التطوع التي ترغب في المشاركة بها:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {interestOptions.map((opt) => {
                    const isSelected = selectedInterests.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleInterest(opt)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#19CC5B] text-white border-[#19CC5B] font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>تأكيد طلب الانضمام كمتطوع</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
