import React, { useState } from 'react';
import {
  Users,
  Truck,
  CheckCircle2,
  Phone,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Baby,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useClub } from '../context/ClubContext';
import { Language } from '../types';

interface ActivitiesTabProps {
  currentLang: Language;
  onOpenDonate: (type?: string) => void;
  onOpenAid: (type?: string) => void;
  onOpenVolunteer: () => void;
}

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  currentLang,
  onOpenDonate,
  onOpenAid,
  onOpenVolunteer,
}) => {
  const { activities, clubMeta } = useClub();
  const [expandedId, setExpandedId] = useState<string | null>(activities[0]?.id || 'activity_patients');

  const getIcon = (name: string) => {
    switch (name) {
      case 'medkit':
        return <Stethoscope className="w-8 h-8 text-[#19CC5B]" />;
      case 'users':
        return <Users className="w-8 h-8 text-[#19CC5B]" />;
      case 'truck':
        return <Truck className="w-8 h-8 text-[#19CC5B]" />;
      default:
        return <Sparkles className="w-8 h-8 text-[#19CC5B]" />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-24 animate-fadeIn">
      {/* Page Title & Mission Intro */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#E4F6EB] text-[#158A3F] text-xs font-bold mb-2">
          مجالات العطاء • أنشطة نادي رفقاء الخير
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 font-arabic">
          الأنشطة والمبادرات الإنسانية
        </h2>
        <p className="text-slate-600 text-xs md:text-sm mt-1 max-w-md mx-auto">
          نعمل في الميدان ببلدية حمادي والمناطق المحيطة بها لتقديم الدعم الصحي والاجتماعي المباشر.
        </p>
      </div>

      {/* The 3 Core Activities */}
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const isExpanded = expandedId === activity.id;

          return (
            <div
              key={activity.id}
              className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-emerald-100 transition duration-200 hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E4F6EB] flex items-center justify-center shrink-0 shadow-xs">
                  {getIcon(activity.iconName)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg md:text-xl font-extrabold text-slate-900 font-arabic">
                        {activity.title}
                      </h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E4F6EB] text-[#158A3F]">
                        {activity.tag}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      aria-label="توسيع التفاصيل"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed font-arabic">
                    {activity.description}
                  </p>
                </div>
              </div>

              {/* Expandable details with highlights & equipment */}
              {isExpanded && (
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-4 animate-fadeIn">
                  {/* Highlights */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      أبرز ما يقدمه النادي في هذا المجال:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                      {activity.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 bg-[#E4F6EB]/40 p-2.5 rounded-xl border border-emerald-100/50">
                          <CheckCircle2 className="w-4 h-4 text-[#19CC5B] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Equipment or specific services */}
                  {activity.equipmentOrServices && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        العتاد والخدمات المتوفرة والمطلوبة:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activity.equipmentOrServices.map((eq, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contextual Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    {activity.actionType === 'request_aid' && (
                      <button
                        onClick={() => onOpenAid(activity.id)}
                        className="py-2.5 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>طلب إعارة عتاد طبي أو دواء</span>
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    )}

                    {activity.actionType === 'donate' && (
                      <button
                        onClick={() => onOpenDonate('financial_support')}
                        className="py-2.5 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>كفالة يتيم أو مساهمة في قفة</span>
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    )}

                    {activity.actionType === 'volunteer' && (
                      <button
                        onClick={onOpenVolunteer}
                        className="py-2.5 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>المشاركة كمتطوع في القافلة المقبلة</span>
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    )}

                    <button
                      onClick={() => onOpenDonate()}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition active:scale-95 cursor-pointer"
                    >
                      تقديم تبرع لهذا النشاط
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* How donations reach recipients */}
      <div className="bg-[#E4F6EB] rounded-3xl p-5 border border-[#2AE56E]/40 text-emerald-950">
        <h4 className="font-bold text-sm mb-1 text-[#116F33] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#19CC5B]" />
          <span>مبدأ الشفافية والأمانة في النادي</span>
        </h4>
        <p className="text-xs leading-relaxed text-emerald-900 mt-1">
          يحرص نادي رفقاء الخير على توجيه كافة التبرعات العينية والأدوية والعتاد الطبي مباشرة إلى مستحقيها بعد معاينة ميدانية دقيقة وبملفات طبية واجتماعية موثقة ببلدية حمادي وولاية بومرداس.
        </p>
      </div>
    </div>
  );
};
