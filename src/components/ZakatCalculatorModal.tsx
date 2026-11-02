import React, { useState } from 'react';
import { X, Calculator, Coins, Check, ArrowRight } from 'lucide-react';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDonate: (amount?: number) => void;
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenDonate,
}) => {
  // Nisab standard in Algeria (approx 85g 24k gold, around 1,350,000 DZD)
  const [nisabThreshold, setNisabThreshold] = useState<number>(1350000);
  const [cashSavings, setCashSavings] = useState<string>('');
  const [commercialValue, setCommercialValue] = useState<string>('');
  const [goldWeightGrams, setGoldWeightGrams] = useState<string>('');
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(16000); // DZD per gram approx
  const [debtsDue, setDebtsDue] = useState<string>('');

  if (!isOpen) return null;

  const cash = parseFloat(cashSavings) || 0;
  const commercial = parseFloat(commercialValue) || 0;
  const goldValue = (parseFloat(goldWeightGrams) || 0) * goldPricePerGram;
  const debts = parseFloat(debtsDue) || 0;

  const totalAssets = Math.max(0, cash + commercial + goldValue - debts);
  const isNisabReached = totalAssets >= nisabThreshold;
  const zakatDue = isNisabReached ? Math.round(totalAssets * 0.025) : 0;

  const formatDzd = (num: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      maximumFractionDigits: 0,
    }).format(num) + ' دج';
  };

  const handleDonateZakat = () => {
    onClose();
    onOpenDonate(zakatDue);
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

        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <div className="p-3 rounded-2xl bg-[#E4F6EB] text-[#19CC5B]">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-arabic">
              حاسبة زكاة المال (بالدينار الجزائري)
            </h3>
            <p className="text-xs text-slate-500">
              حساب دقيق لنسبة 2.5% مع ضبط نصاب الذهب الرسمي
            </p>
          </div>
        </div>

        {/* Nisab notice banner */}
        <div className="bg-[#E4F6EB]/70 border border-[#2AE56E]/40 rounded-2xl p-3.5 mb-5 text-xs text-emerald-950 flex items-start gap-2.5">
          <Coins className="w-4 h-4 text-[#19A94E] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span>النصاب المعتمد تقديرياً في الجزائر: </span>
            <strong className="text-[#116F33]">{formatDzd(nisabThreshold)}</strong>
            <span className="text-slate-500 block text-[11px] mt-0.5">
              (يعادل قيمة 85 غراماً من الذهب الخالص بعد مرور حول كامل)
            </span>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Cash */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              السيولة النقدية والمدخرات البنكية أو البريدية (CCP / بنك)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={cashSavings}
                onChange={(e) => setCashSavings(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right font-mono"
              />
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">دج</span>
            </div>
          </div>

          {/* Commercial */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              قيمة عروض التجارة والسلع المعدة للبيع (بسعر الجملة)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={commercialValue}
                onChange={(e) => setCommercialValue(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right font-mono"
              />
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">دج</span>
            </div>
          </div>

          {/* Gold weight */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              وزن الذهب المكنوز أو للادخار (بالغرام)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={goldWeightGrams}
                  onChange={(e) => setGoldWeightGrams(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right font-mono"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">غرام</span>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-2.5 flex items-center justify-between text-[11px] text-slate-600">
                <span>سعر الغرام:</span>
                <span className="font-mono font-bold text-slate-800">{goldPricePerGram} دج</span>
              </div>
            </div>
          </div>

          {/* Debts deduction */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              الديون الحالة الواجبة السداد عليك (تُخصم من المال)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={debtsDue}
                onChange={(e) => setDebtsDue(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right font-mono"
              />
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">دج</span>
            </div>
          </div>
        </div>

        {/* Calculation Result Box */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#116F33] to-[#158A3F] text-white shadow-lg">
          <div className="flex items-center justify-between text-xs text-emerald-100 border-b border-white/15 pb-2 mb-3">
            <span>إجمالي الوعاء الزكوي الخاضع:</span>
            <span className="font-mono font-bold text-white text-sm">{formatDzd(totalAssets)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-100 block">مقدار الزكاة الواجب إخراجها (2.5%):</span>
              <span className="text-2xl font-extrabold font-mono text-[#5BE68E]">
                {formatDzd(zakatDue)}
              </span>
            </div>

            <div className="text-left">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  isNisabReached
                    ? 'bg-[#19CC5B] text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {isNisabReached ? 'بلغ النصاب وجبت الزكاة' : 'لم يبلغ النصاب بعد'}
              </span>
            </div>
          </div>
        </div>

        {/* Action to donate zakat to Refkaa El Kheir */}
        {zakatDue > 0 && (
          <div className="mt-4 pt-2">
            <button
              onClick={handleDonateZakat}
              className="w-full py-3 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>توجيه جزء من الزكاة لصالح أيتام ومرضى حمادي</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <span className="block text-[11px] text-slate-500 text-center mt-1.5">
              يقوم النادي بتوزيع أموال الزكاة حصراً على مصارفها الشرعية (المعوزين، الأيتام، المرضى العاجزين)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
