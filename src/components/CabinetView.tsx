import React, { useState } from 'react';
import { User, CertificateData, CertificateType } from '../types';
import { updateUserProfile } from '../utils/storage';
import { issueCertificate, checkCertificateEligibility } from '../utils/certificateUtils';
import { OfficialCertificateCard } from './OfficialCertificateCard';
import {
  User as UserIcon,
  Award,
  BookOpen,
  Mic,
  Flame,
  Calendar,
  Clock,
  CheckCircle2,
  Printer,
  Sparkles,
  Edit3,
  LogOut,
  Shield,
  Zap,
  Target,
  QrCode,
  Lock,
} from 'lucide-react';

interface CabinetViewProps {
  currentUser: User | null;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
  onNavigateToMock: () => void;
  onNavigateToDialogue: () => void;
  onNavigateToCertificates?: () => void;
  onOpenVerification?: (certId?: string) => void;
}

const AVATAR_OPTIONS = ['🎓', '🐼', '🐉', '🏮', '👨‍🎓', '👩‍🎓', '🌟', '🎋'];

export const CabinetView: React.FC<CabinetViewProps> = ({
  currentUser,
  onUserUpdate,
  onLogout,
  onNavigateToMock,
  onNavigateToDialogue,
  onNavigateToCertificates,
  onOpenVerification,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || '🎓');
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificateData | null>(null);

  if (!currentUser) {
    return null;
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfile({
      name: nameInput.trim() || currentUser.name,
      email: emailInput.trim() || currentUser.email,
      avatar: selectedAvatar,
    });
    if (updated) {
      onUserUpdate(updated);
    }
    setIsEditing(false);
  };

  const hsk1Completed = (currentUser.completedLessonIds || []).length;
  const hsk1Percent = Math.min(100, Math.round((hsk1Completed / 30) * 100));

  const hsk2Completed = (currentUser.completedHsk2LessonIds || []).length;
  const hsk2Percent = Math.min(100, Math.round((hsk2Completed / 50) * 100));

  const hsk3Completed = (currentUser.completedHsk3LessonIds || []).length;
  const hsk3Percent = Math.min(100, Math.round((hsk3Completed / 50) * 100));

  const mockResults = currentUser.mockExamResults || [];
  const latestMock = mockResults[0] || null;

  // Level calculation
  const levelNumber = Math.max(1, Math.floor((currentUser.xp || 0) / 100) + 1);

  return (
    <div id="cabinet-container" className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-4xl shadow-inner">
              {currentUser.avatar || '🎓'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500 text-white uppercase tracking-wider">
                  Level {levelNumber}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>@{currentUser.username}</span>
                <span>•</span>
                <span>{currentUser.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  A'zo: {new Date(currentUser.createdAt).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Profilni tahrirlash</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Edit Drawer / Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 animate-slide-down"
        >
          <h3 className="text-sm font-bold text-slate-900">Shaxsiy ma'lumotlarni yangilash</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">To'liq ism</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Elektron pochta</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Avatarni tanlang</label>
            <div className="flex gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border cursor-pointer ${
                    selectedAvatar === av ? 'border-rose-500 bg-rose-50 scale-110' : 'border-slate-200 bg-white'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Saqlash
            </button>
          </div>
        </form>
      )}

      {/* Core Stats Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Jami XP</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{currentUser.xp} XP</div>
          <div className="text-[11px] text-slate-400">Level {levelNumber} darajasida</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Ketma-ketlik</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{currentUser.streakDays} kun</div>
          <div className="text-[11px] text-slate-400">Har kunlik o'qish zanjiri</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tugallangan Darslar</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {hsk1Completed + hsk2Completed + hsk3Completed} ta
          </div>
          <div className="text-[11px] text-slate-400">HSK 1: {hsk1Completed} • HSK 2: {hsk2Completed} • HSK 3: {hsk3Completed}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">AI Speaking</span>
            <Mic className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentUser.dialoguePracticesCount || 0} marta
          </div>
          <div className="text-[11px] text-slate-400">Ovozli suhbat seanslari</div>
        </div>
      </div>

      {/* Progress Bars for HSK 1, HSK 2 & HSK 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HSK 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">HSK 1 Kursi</h3>
              <p className="text-xs text-slate-500">30 ta darslik & video</p>
            </div>
            <span className="text-sm font-black text-rose-600">{hsk1Percent}%</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${hsk1Percent}%` }}
            />
          </div>

          <div className="text-xs text-slate-600 flex justify-between pt-1">
            <span>{hsk1Completed} / 30 dars</span>
            <span className="font-semibold text-rose-600">
              {hsk1Completed >= 30 ? '✓ Tugatildi' : `${30 - hsk1Completed} qoldi`}
            </span>
          </div>
        </div>

        {/* HSK 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">HSK 2 Ilg'or</h3>
              <p className="text-xs text-slate-500">50 ta dars • 5 min & testlar</p>
            </div>
            <span className="text-sm font-black text-purple-600">{hsk2Percent}%</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${hsk2Percent}%` }}
            />
          </div>

          <div className="text-xs text-slate-600 flex justify-between pt-1">
            <span>{hsk2Completed} / 50 dars</span>
            <span className="font-semibold text-purple-600">
              {hsk2Completed >= 50 ? '✓ Tugatildi' : `${50 - hsk2Completed} qoldi`}
            </span>
          </div>
        </div>

        {/* HSK 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">HSK 3 Chuqur</h3>
              <p className="text-xs text-slate-500">50 ta dars • 10 min & 30 talik test</p>
            </div>
            <span className="text-sm font-black text-amber-600">{hsk3Percent}%</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${hsk3Percent}%` }}
            />
          </div>

          <div className="text-xs text-slate-600 flex justify-between pt-1">
            <span>{hsk3Completed} / 50 dars</span>
            <span className="font-semibold text-amber-600">
              {hsk3Completed >= 50 ? '✓ Tugatildi' : `${50 - hsk3Completed} qoldi`}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Certificate Modal in Cabinet */}
      {selectedCertForModal && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{selectedCertForModal.titleUz}</span>
            </h3>
            <button
              type="button"
              onClick={() => setSelectedCertForModal(null)}
              className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
            >
              Yopish ✕
            </button>
          </div>

          <OfficialCertificateCard
            certificate={selectedCertForModal}
            onVerifyDirectly={(id) => onOpenVerification?.(id)}
            onClose={() => setSelectedCertForModal(null)}
          />
        </div>
      )}

      {/* Official Certificates Showcase */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>Mening Rasmiy Sertifikatlarim</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black uppercase">
                  HSK 1, 2, 3 & Mock
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Rasmiy qizil muhr, seriya raqami va to'g'ridan-to'g'ri isbotlanuvchi QR-kod bilan ta'minlangan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToCertificates && (
              <button
                type="button"
                onClick={onNavigateToCertificates}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Barcha Sertifikatlar</span>
              </button>
            )}

            {onOpenVerification && (
              <button
                type="button"
                onClick={() => onOpenVerification()}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>QR Tekshirish</span>
              </button>
            )}
          </div>
        </div>

        {/* List of Earned / Available Certificates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              type: 'HSK 1 Course' as CertificateType,
              level: 'HSK 1' as const,
              title: "HSK 1 To'liq Kurs Sertifikati",
            },
            {
              type: 'HSK 1 Mock' as CertificateType,
              level: 'HSK 1' as const,
              title: "HSK 1 Full Final Mock Exam Sertifikati",
            },
            {
              type: 'HSK 2 Course' as CertificateType,
              level: 'HSK 2' as const,
              title: "HSK 2 Ilg'or Kurs Sertifikati",
            },
            {
              type: 'HSK 3 Course' as CertificateType,
              level: 'HSK 3' as const,
              title: "HSK 3 Chuqurlashtirilgan Kurs Sertifikati",
            },
          ].map((item) => {
            const earned = (currentUser.certificates || []).find((c) => c.type === item.type);
            const eligibility = checkCertificateEligibility(currentUser, item.type);

            return (
              <div
                key={item.type}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  earned
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : eligibility.isEligible
                    ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{item.title}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {item.level}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Holat:{' '}
                    {earned ? (
                      <span className="font-bold text-emerald-700">✓ Berilgan ({earned.grade})</span>
                    ) : eligibility.isEligible ? (
                      <span className="font-bold text-amber-600">★ Tayyor (Olish mumkin)</span>
                    ) : (
                      <span className="text-slate-600 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400 inline" />
                        <span>Qulfda: {eligibility.reasonUz}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {earned ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCertForModal(earned)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ko'rish</span>
                    </button>
                  ) : eligibility.isEligible ? (
                    <button
                      type="button"
                      onClick={() => {
                        const newCert = issueCertificate(
                          currentUser,
                          item.type,
                          item.level,
                          item.type.includes('Mock') ? 285 : 100,
                          item.type.includes('Mock') ? 300 : 100
                        );
                        if (newCert) {
                          const updated = {
                            ...currentUser,
                            certificates: [
                              newCert,
                              ...(currentUser.certificates || []).filter((c) => c.type !== item.type),
                            ],
                          };
                          onUserUpdate(updated);
                          setSelectedCertForModal(newCert);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Olish</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (item.type.includes('Mock') || (item.type === 'HSK 1 Course' && hsk1Completed >= 30)) {
                          onNavigateToMock();
                        } else if (onNavigateToCertificates) {
                          onNavigateToCertificates();
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title={eligibility.reasonUz}
                    >
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Qulfda</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock Exam Status & Certificate in Cabinet */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                HSK 1 Rasmiy Mock Imtihon Natijalari
              </h3>
              <p className="text-xs text-slate-500">
                Listening, Reading, Writing va Speaking bo'yicha erishilgan ballar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToMock}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>{latestMock ? 'Yangi sinov topshirish' : 'Imtihonni topshirish'}</span>
          </button>
        </div>

        {latestMock ? (
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">
                  Oxirgi topshirilgan sana: {latestMock.date}
                </span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                  latestMock.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {latestMock.passed ? '✓ PASSED' : '✕ RE-TAKE'}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                Listening: <span className="font-bold">{latestMock.listeningScore}</span> • Reading: <span className="font-bold">{latestMock.readingScore}</span> • Writing: <span className="font-bold">{latestMock.writingScore}</span> • Speaking: <span className="font-bold">{latestMock.speakingScore}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">{latestMock.totalScore} / 300 Ball</div>
              <button
                type="button"
                onClick={onNavigateToMock}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Sertifikatni ko'rish & Chop etish →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
            Hozircha HSK 1 Full Mock imtihoni topshirilmagan. Yuqoridagi tugma orqali bilimingizni sinab, rasmiy sertifikatga ega bo'ling!
          </div>
        )}
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          🏆 Akademik Yutuqlar & Nishonlar
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-4 rounded-2xl border text-center space-y-1.5 ${
            hsk1Completed >= 1 ? 'bg-rose-50/60 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 opacity-50'
          }`}>
            <div className="text-2xl">🌱</div>
            <div className="font-bold text-xs">Birinchi Qadam</div>
            <div className="text-[10px] text-slate-500">1-dars yakunlandi</div>
          </div>

          <div className={`p-4 rounded-2xl border text-center space-y-1.5 ${
            hsk1Completed >= 30 ? 'bg-amber-50/60 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 opacity-50'
          }`}>
            <div className="text-2xl">🎓</div>
            <div className="font-bold text-xs">HSK 1 Bitiruvchisi</div>
            <div className="text-[10px] text-slate-500">30 ta dars to'liq</div>
          </div>

          <div className={`p-4 rounded-2xl border text-center space-y-1.5 ${
            hsk2Completed >= 1 ? 'bg-purple-50/60 border-purple-200 text-purple-900' : 'bg-slate-50 border-slate-200 opacity-50'
          }`}>
            <div className="text-2xl">🚀</div>
            <div className="font-bold text-xs">HSK 2 Sayohati</div>
            <div className="text-[10px] text-slate-500">HSK 2 darslari boshlandi</div>
          </div>

          <div className={`p-4 rounded-2xl border text-center space-y-1.5 ${
            (currentUser.dialoguePracticesCount || 0) >= 1 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 opacity-50'
          }`}>
            <div className="text-2xl">🗣️</div>
            <div className="font-bold text-xs">Speaking Ustasi</div>
            <div className="text-[10px] text-slate-500">AI bilan jonli suhbat</div>
          </div>
        </div>
      </div>
    </div>
  );
};
