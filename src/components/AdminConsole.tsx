import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Settings,
  Phone,
  HandHeart,
  AlertCircle,
  Inbox,
  KeyRound,
  Save,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle,
  Eye,
  EyeOff,
  Building,
  Users,
  HeartHandshake,
  MessageSquare
} from 'lucide-react';
import { useClub, PhoneNumberItem } from '../context/ClubContext';
import { ActivityItem, UrgentAppeal } from '../types';

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ isOpen, onClose }) => {
  const {
    clubMeta,
    phoneNumbers,
    activities,
    appeals,
    adminPassword,
    updateClubMeta,
    updatePhoneNumbers,
    updateActivities,
    updateAppeals,
    updateAdminPassword,
    resetToDefaults,
  } = useClub();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Active Tab in Admin
  const [activeTab, setActiveTab] = useState<'meta' | 'phones' | 'activities' | 'appeals' | 'inbox' | 'security'>('meta');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for Meta
  const [formMeta, setFormMeta] = useState(clubMeta);

  // Form state for Phones
  const [phonesList, setPhonesList] = useState<PhoneNumberItem[]>(phoneNumbers);
  const [newPhone, setNewPhone] = useState({ label: '', raw: '', intl: '' });

  // Form state for Activities
  const [activitiesList, setActivitiesList] = useState<ActivityItem[]>(activities);

  // Form state for Appeals
  const [appealsList, setAppealsList] = useState<UrgentAppeal[]>(appeals);
  const [newAppeal, setNewAppeal] = useState<Partial<UrgentAppeal>>({
    title: '',
    category: 'medical',
    targetAmountOrItem: '',
    urgency: 'high',
    description: '',
    date: 'عاجل الآن',
    verified: true,
  });

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Read stored submissions from localStorage
  const donations = JSON.parse(localStorage.getItem('rofaqaa_donations') || '[]');
  const requests = JSON.parse(localStorage.getItem('rofaqaa_requests') || '[]');
  const volunteers = JSON.parse(localStorage.getItem('rofaqaa_volunteers') || '[]');
  const messages = JSON.parse(localStorage.getItem('rofaqaa_messages') || '[]');

  if (!isOpen) return null;

  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
      setFormMeta(clubMeta);
      setPhonesList(phoneNumbers);
      setActivitiesList(activities);
      setAppealsList(appeals);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    updateClubMeta(formMeta);
    triggerSaveNotification();
  };

  // Phone operations
  const handleAddPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.raw) return;
    const item: PhoneNumberItem = {
      label: newPhone.label || `اتصل: ${newPhone.raw}`,
      raw: newPhone.raw,
      intl: newPhone.intl || (newPhone.raw.startsWith('0') ? `+213${newPhone.raw.substring(1)}` : newPhone.raw),
    };
    const updated = [...phonesList, item];
    setPhonesList(updated);
    updatePhoneNumbers(updated);
    setNewPhone({ label: '', raw: '', intl: '' });
    triggerSaveNotification();
  };

  const handleDeletePhone = (idx: number) => {
    const updated = phonesList.filter((_, i) => i !== idx);
    setPhonesList(updated);
    updatePhoneNumbers(updated);
    triggerSaveNotification();
  };

  // Activities operations
  const handleUpdateActivity = (index: number, field: keyof ActivityItem, value: any) => {
    const updated = [...activitiesList];
    updated[index] = { ...updated[index], [field]: value };
    setActivitiesList(updated);
    updateActivities(updated);
    triggerSaveNotification();
  };

  // Appeals operations
  const handleAddAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppeal.title || !newAppeal.targetAmountOrItem) return;
    const item: UrgentAppeal = {
      id: `appeal_${Date.now()}`,
      title: newAppeal.title,
      category: (newAppeal.category as any) || 'medical',
      targetAmountOrItem: newAppeal.targetAmountOrItem,
      urgency: (newAppeal.urgency as any) || 'high',
      description: newAppeal.description || '',
      date: newAppeal.date || 'مستمر الآن',
      verified: true,
    };
    const updated = [item, ...appealsList];
    setAppealsList(updated);
    updateAppeals(updated);
    setNewAppeal({
      title: '',
      category: 'medical',
      targetAmountOrItem: '',
      urgency: 'high',
      description: '',
      date: 'عاجل الآن',
      verified: true,
    });
    triggerSaveNotification();
  };

  const handleDeleteAppeal = (id: string) => {
    const updated = appealsList.filter((a) => a.id !== id);
    setAppealsList(updated);
    updateAppeals(updated);
    triggerSaveNotification();
  };

  // Password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setPasswordMsg('كلمة المرور يجب أن تتكون من 4 أحرف أو أرقام على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('كلمتا المرور غير متطابقتين');
      return;
    }
    updateAdminPassword(newPassword);
    setPasswordMsg('✓ تم تغيير كلمة المرور بنجاح!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden text-right">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition cursor-pointer"
              >
                تسجيل الخروج
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#19CC5B] text-slate-900">
              Admin
            </span>
            <h2 className="font-extrabold text-base sm:text-lg font-arabic flex items-center gap-2">
              <span>لوحة تحكم إدارة النادي</span>
              <Settings className="w-5 h-5 text-[#19CC5B]" />
            </h2>
          </div>
        </div>

        {/* Success toast banner */}
        {saveSuccess && (
          <div className="bg-[#19CC5B] text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4" />
            <span>تم حفظ التعديلات بنجاح وتحديث التطبيق مباشرة!</span>
          </div>
        )}

        {/* Content Section */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#E4F6EB] text-[#158A3F] flex items-center justify-center mb-4 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 font-arabic mb-1">
              تسجيل الدخول إلى لوحة الإدارة
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
              هذه المنطقة مخصصة لمسؤولي النادي الخيري رفقاء الخير لتعديل النصوص، الهواتف، الأنشطة، والنداءات.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="كلمة المرور الإدارية"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#19CC5B] text-right font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg">
                  كلمة المرور غير صحيحة، يرجى المحاولة مجدداً
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                دخول إلى لوحة التحكم
              </button>

              <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-200 mt-4">
                💡 كلمة المرور الافتراضية الأولى هي: <strong className="font-mono text-slate-800">admin123</strong> (يمكنكم تغييرها داخل اللوحة).
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 p-2 flex md:flex-col gap-1 overflow-x-auto text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('meta')}
                className={`flex-1 md:flex-initial flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'meta'
                    ? 'bg-[#19CC5B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>معلومات النادي</span>
                <Building className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('phones')}
                className={`flex-1 md:flex-initial flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'phones'
                    ? 'bg-[#19CC5B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>أرقام الهواتف</span>
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('activities')}
                className={`flex-1 md:flex-initial flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'activities'
                    ? 'bg-[#19CC5B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>إدارة الأنشطة</span>
                <HandHeart className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('appeals')}
                className={`flex-1 md:flex-initial flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'appeals'
                    ? 'bg-[#19CC5B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>النداءات العاجلة</span>
                <AlertCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex-1 md:flex-initial flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'inbox'
                    ? 'bg-[#19CC5B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>الواردات</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[10px]">
                    {donations.length + requests.length + volunteers.length}
                  </span>
                </div>
                <Inbox className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 md:flex-initial flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#19CC5B] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>الأمان والكلمة</span>
                <KeyRound className="w-4 h-4" />
              </button>
            </div>

            {/* Main Tab Panels */}
            <div className="flex-1 p-5 overflow-y-auto max-h-[75vh]">
              {/* Tab 1: General Meta Information */}
              {activeTab === 'meta' && (
                <form onSubmit={handleSaveMeta} className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-base text-slate-900 font-arabic">
                      معلومات النادي والنصوص الأساسية
                    </h3>
                    <p className="text-xs text-slate-500">
                      تتغير هذه النصوص في الصفحة الرئيسية وصفحة التواصل فور الحفظ
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        اسم النادي الكامل
                      </label>
                      <input
                        type="text"
                        value={formMeta.name}
                        onChange={(e) => setFormMeta({ ...formMeta, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#19CC5B]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        البلدية والولاية (العنوان المختصر)
                      </label>
                      <input
                        type="text"
                        value={formMeta.location}
                        onChange={(e) => setFormMeta({ ...formMeta, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#19CC5B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نص الترحيب والتعريف بالنادي (بالعربية)
                    </label>
                    <textarea
                      rows={3}
                      value={formMeta.welcomeIntroAr}
                      onChange={(e) => setFormMeta({ ...formMeta, welcomeIntroAr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#19CC5B] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نص "كيف تساهم وتتبرع؟" (بالعربية)
                    </label>
                    <textarea
                      rows={2}
                      value={formMeta.howToContributeAr}
                      onChange={(e) => setFormMeta({ ...formMeta, howToContributeAr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#19CC5B] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        عنوان مقر النادي بالتفصيل
                      </label>
                      <input
                        type="text"
                        value={formMeta.addressFull}
                        onChange={(e) => setFormMeta({ ...formMeta, addressFull: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#19CC5B]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        أوقات الاستقبال بالمقر
                      </label>
                      <input
                        type="text"
                        value={formMeta.receptionHours}
                        onChange={(e) => setFormMeta({ ...formMeta, receptionHours: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#19CC5B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رابط صفحة فيسبوك الرسمية
                    </label>
                    <input
                      type="url"
                      value={formMeta.facebookUrl}
                      onChange={(e) => setFormMeta({ ...formMeta, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#19CC5B] text-left"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات العامة</span>
                  </button>
                </form>
              )}

              {/* Tab 2: Phone Numbers */}
              {activeTab === 'phones' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-base text-slate-900 font-arabic">
                      أرقام هواتف النادي للاتصال والتبرعات
                    </h3>
                    <p className="text-xs text-slate-500">
                      هذه الأرقام تظهر في صفحة التواصل وأزرار الاتصال السريع
                    </p>
                  </div>

                  <div className="space-y-2">
                    {phonesList.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDeletePhone(idx)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                            title="حذف الرقم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="font-mono font-bold text-slate-800 text-sm">
                            {p.raw}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 font-medium">
                          {p.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add phone form */}
                  <form onSubmit={handleAddPhone} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                    <h4 className="font-bold text-xs text-[#116F33] flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      <span>إضافة رقم هاتف جديد للنادي</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">الرقم (مثال: 0550123456) *</label>
                        <input
                          type="tel"
                          required
                          placeholder="05..."
                          value={newPhone.raw}
                          onChange={(e) => setNewPhone({ ...newPhone, raw: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-right font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1 font-bold">الاسم أو الصفة الظاهرة</label>
                        <input
                          type="text"
                          placeholder="مثال: مسؤول العتاد الطبي"
                          value={newPhone.label}
                          onChange={(e) => setNewPhone({ ...newPhone, label: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-right"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      إضافة الرقم إلى القائمة
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 3: Activities & Sections */}
              {activeTab === 'activities' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-base text-slate-900 font-arabic">
                      تعديل وتخصيص الأنشطة والمبادرات
                    </h3>
                    <p className="text-xs text-slate-500">
                      يمكنكم تغيير عناوين الأنشطة والشروحات والخدمات المعروضة
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activitiesList.map((act, index) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              عنوان النشاط
                            </label>
                            <input
                              type="text"
                              value={act.title}
                              onChange={(e) => handleUpdateActivity(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              التصنيف / الوسم (Tag)
                            </label>
                            <input
                              type="text"
                              value={act.tag}
                              onChange={(e) => handleUpdateActivity(index, 'tag', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            شرح ووصف النشاط
                          </label>
                          <textarea
                            rows={2}
                            value={act.description}
                            onChange={(e) => handleUpdateActivity(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Urgent Appeals */}
              {activeTab === 'appeals' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-base text-slate-900 font-arabic">
                      إدارة النداءات التضامنية والحالات المستعجلة
                    </h3>
                    <p className="text-xs text-slate-500">
                      الحالات تظهر مباشرة في الشريط العاجل على الصفحة الرئيسية
                    </p>
                  </div>

                  {/* Add appeal form */}
                  <form onSubmit={handleAddAppeal} className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
                    <h4 className="font-bold text-xs text-red-800 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-red-600" />
                      <span>نشر نداء عاجل جديد</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">عنوان الحالة *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: توفير مكثف أكسجين لمريض..."
                          value={newAppeal.title}
                          onChange={(e) => setNewAppeal({ ...newAppeal, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-right"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">المطلوب بدقة (العتاد أو المبلغ) *</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: جهاز 10L أو 5 علب حليب"
                          value={newAppeal.targetAmountOrItem}
                          onChange={(e) => setNewAppeal({ ...newAppeal, targetAmountOrItem: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل إضافية عن الحالة</label>
                      <textarea
                        rows={2}
                        placeholder="تفاصيل الحالة بحمادي..."
                        value={newAppeal.description}
                        onChange={(e) => setNewAppeal({ ...newAppeal, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white resize-none text-right"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      نشر النداء في الصفحة الرئيسية
                    </button>
                  </form>

                  {/* List of current appeals */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      النداءات المنشورة حالياً ({appealsList.length}):
                    </h4>
                    {appealsList.map((app) => (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3"
                      >
                        <button
                          onClick={() => handleDeleteAppeal(app.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer shrink-0"
                          title="حذف النداء"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold">
                            المطلوب: {app.targetAmountOrItem}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 mt-1">{app.title}</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">{app.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Submissions Inbox */}
              {activeTab === 'inbox' && (
                <div className="space-y-4 text-xs">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-base text-slate-900 font-arabic">
                      صندوق الوارد (التبرعات والطلبات المسجلة)
                    </h3>
                    <p className="text-xs text-slate-500">
                      قائمة التبرعات والطلبات الواردة مباشرة من مستخدمي التطبيق
                    </p>
                  </div>

                  {/* Donations */}
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                      <HeartHandshake className="w-4 h-4 text-[#19CC5B]" />
                      <span>التبرعات المسجلة ({donations.length}):</span>
                    </h4>
                    {donations.length === 0 ? (
                      <p className="text-slate-400 italic">لا توجد تبرعات مسجلة بعد</p>
                    ) : (
                      <div className="space-y-2">
                        {donations.map((d: any) => (
                          <div key={d.id} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{d.fullName} ({d.phoneNumber})</span>
                              <span className="text-[#158A3F]">{d.donationType}</span>
                            </div>
                            <p className="text-slate-600 mt-1">{d.itemDetails}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">المنطقة: {d.wilaya}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assistance requests */}
                  <div className="pt-3 border-t border-slate-200">
                    <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>طلبات المساعدة والعتاد الطبي ({requests.length}):</span>
                    </h4>
                    {requests.length === 0 ? (
                      <p className="text-slate-400 italic">لا توجد طلبات مساعدة مسجلة</p>
                    ) : (
                      <div className="space-y-2">
                        {requests.map((r: any) => (
                          <div key={r.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{r.fullName} ({r.phoneNumber})</span>
                              <span className="text-amber-800">{r.assistanceType}</span>
                            </div>
                            <p className="text-slate-600 mt-1">{r.patientAgeOrDetails}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">الحي: {r.cityOrTown}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Volunteers */}
                  <div className="pt-3 border-t border-slate-200">
                    <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>المتطوعون المسجلون ({volunteers.length}):</span>
                    </h4>
                    {volunteers.length === 0 ? (
                      <p className="text-slate-400 italic">لا يوجد متطوعون مسجلون بعد</p>
                    ) : (
                      <div className="space-y-2">
                        {volunteers.map((v: any) => (
                          <div key={v.id} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{v.fullName} ({v.phoneNumber})</span>
                              <span>العمر: {v.age} سنة</span>
                            </div>
                            <p className="text-slate-600 mt-0.5">المهنة والمهارات: {v.professionOrSkills}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 6: Security & Password */}
              {activeTab === 'security' && (
                <div className="space-y-5 text-xs">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-base text-slate-900 font-arabic">
                      أمان لوحة التحكم وكلمة المرور
                    </h3>
                    <p className="text-xs text-slate-500">
                      يمكنكم تغيير كلمة المرور أو إعادة ضبط كافة البيانات إلى حالتها الأصلية
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 max-w-sm">
                    <h4 className="font-bold text-xs text-slate-800">
                      تغيير كلمة المرور الإدارية:
                    </h4>

                    <div>
                      <label className="block text-slate-600 mb-1 font-bold">كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1 font-bold">تأكيد كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono text-right"
                      />
                    </div>

                    {passwordMsg && (
                      <div className={`p-2 rounded-lg font-bold text-xs ${passwordMsg.includes('✓') ? 'bg-emerald-100 text-[#116F33]' : 'bg-red-100 text-red-600'}`}>
                        {passwordMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white font-bold transition cursor-pointer"
                    >
                      حفظ كلمة المرور الجديدة
                    </button>
                  </form>

                  {/* Reset to defaults */}
                  <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-2">
                    <h4 className="font-bold text-xs text-red-700 flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4" />
                      <span>إعادة ضبط المصنع (استعادة النصوص والأرقام الافتراضية)</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      هذا الخيار يعيد تعيين كافة النصوص، الأنشطة، أرقام الهواتف، وكلمة المرور (`admin123`) إلى بياناتها الأولية.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('هل أنت متأكد من استعادة كافة الإعدادات والبيانات الأصلية؟')) {
                          resetToDefaults();
                          setFormMeta(clubMeta);
                          triggerSaveNotification();
                        }
                      }}
                      className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer transition"
                    >
                      استعادة الإعدادات الافتراضية
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
