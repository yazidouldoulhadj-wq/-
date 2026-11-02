import React, { useState, useMemo } from 'react';
import { Search, X, ArrowLeft, Phone, HandHeart, HelpCircle } from 'lucide-react';
import { useClub } from '../context/ClubContext';
import { FAQ_ITEMS } from '../data/clubData';
import { TabId } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabId) => void;
  onOpenDonate: () => void;
  onOpenAid: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenDonate,
  onOpenAid,
}) => {
  const { activities, appeals, phoneNumbers } = useClub();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedActivities = activities.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.highlights.some((h) => h.toLowerCase().includes(q)) ||
        (a.equipmentOrServices && a.equipmentOrServices.some((e) => e.toLowerCase().includes(q)))
    );

    const matchedAppeals = appeals.filter(
      (app) =>
        app.title.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.targetAmountOrItem.toLowerCase().includes(q)
    );

    const matchedFaqs = FAQ_ITEMS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );

    const phoneMatch = phoneNumbers.filter((p) => p.raw.includes(q) || p.label.toLowerCase().includes(q));

    return {
      activities: matchedActivities,
      appeals: matchedAppeals,
      faqs: matchedFaqs,
      phones: phoneMatch,
      total:
        matchedActivities.length +
        matchedAppeals.length +
        matchedFaqs.length +
        phoneMatch.length,
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-20 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[80vh] text-right">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 bg-[#E4F6EB]/30 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#19CC5B] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="ابحث عن أكسجين، كرسي، أدوية، كفالة، هاتف..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none text-right"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="p-1 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              إلغاء
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-6 text-center">
              <span className="text-xs text-slate-400 block mb-3">
                كلمات شائعة للبحث السريع:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {['مكثف أكسجين', 'كرسي متحرك', 'أدوية', 'كفالة أيتام', 'قفة رمضان', 'حمادي', 'تبرع بالدم'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-full bg-[#E4F6EB] text-[#158A3F] text-xs font-medium hover:bg-emerald-200 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : searchResults && searchResults.total === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              لا توجد نتائج مطابقة لـ «{query}».
              <p className="text-xs text-slate-400 mt-1">
                يمكنكم الاتصال مباشرة بالنادي للمساعدة الفورية.
              </p>
            </div>
          ) : (
            searchResults && (
              <div className="space-y-4">
                {/* Activities */}
                {searchResults.activities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      الأنشطة والخدمات
                    </h4>
                    <div className="space-y-2">
                      {searchResults.activities.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onClose();
                            onSelectTab('activities');
                          }}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-[#E4F6EB] border border-slate-100 hover:border-[#2AE56E]/40 transition cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs px-2 py-0.5 rounded-md bg-[#19CC5B]/20 text-[#158A3F] font-bold">
                              {item.tag}
                            </span>
                            <h5 className="font-bold text-sm text-slate-800">
                              {item.title}
                            </h5>
                          </div>
                          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appeals */}
                {searchResults.appeals.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      النداءات المستعجلة
                    </h4>
                    <div className="space-y-2">
                      {searchResults.appeals.map((app) => (
                        <div
                          key={app.id}
                          className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/60"
                        >
                          <h5 className="font-bold text-xs text-[#116F33]">
                            {app.title}
                          </h5>
                          <p className="text-xs text-slate-600 mt-1">
                            {app.description}
                          </p>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenDonate();
                            }}
                            className="mt-2 text-xs font-bold text-[#19CC5B] hover:underline"
                          >
                            ساهم في هذه الحالة ←
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phone numbers match */}
                {searchResults.phones.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      أرقام الهاتف
                    </h4>
                    <div className="space-y-2">
                      {searchResults.phones.map((p) => (
                        <a
                          key={p.raw}
                          href={`tel:${p.intl}`}
                          className="flex items-center justify-between p-3 rounded-2xl bg-emerald-100/50 text-[#116F33] font-bold text-sm"
                        >
                          <Phone className="w-4 h-4 text-[#19CC5B]" />
                          <span>{p.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs */}
                {searchResults.faqs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      الأسئلة الشائعة
                    </h4>
                    <div className="space-y-2">
                      {searchResults.faqs.map((f, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="font-bold text-xs text-slate-800 block mb-1">
                            {f.q}
                          </span>
                          <span className="text-xs text-slate-600">{f.a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
