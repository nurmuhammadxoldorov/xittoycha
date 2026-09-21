import React, { useState } from 'react';
import { User, CertificateData, CertificateType } from '../types';
import {
  issueCertificate,
  autoCheckAndUnlockCertificates,
  checkCertificateEligibility,
} from '../utils/certificateUtils';
import { OfficialCertificateCard } from './OfficialCertificateCard';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  QrCode,
  Printer,
  ChevronRight,
  BookOpen,
  HelpCircle,
  ExternalLink,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface CertificatesHubViewProps {
  currentUser: User | null;
  onUserUpdate: (user: User) => void;
  onNavigateToMock: () => void;
  onNavigateToCourse: () => void;
  onOpenAuth: () => void;
  onOpenVerification: (certId?: string) => void;
}

export const CertificatesHubView: React.FC<CertificatesHubViewProps> = ({
  currentUser,
  onUserUpdate,
  onNavigateToMock,
  onNavigateToCourse,
  onOpenAuth,
  onOpenVerification,
}) => {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Xitoycha Rasmiy Sertifikatlashtirish Tizimi
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          HSK 1, HSK 2, HSK 3 darslari va to'liq Mock imtihonlarini tugatgach, rasmiy QR-kodli va muhrli sertifikatlarga ega bo'lish uchun tizimga kiring.
        </p>
        <button
          type="button"
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Ro'yxatdan o'tish / Kirish
        </button>
      </div>
    );
  }

  // Calculate completed course progress
  const hsk1Completed = (currentUser.completedLessonIds || []).length;
  const hsk2Completed = (currentUser.completedHsk2LessonIds || []).length;
  const hsk3Completed = (currentUser.completedHsk3LessonIds || []).length;

  const mockResults = currentUser.mockExamResults || [];
  const latestPassedMock = mockResults.find((m) => m.passed && m.totalScore >= 180);
  const latestMock = mockResults[0] || null;

  // Registered certificates
  const userCerts = currentUser.certificates || [];

  // Claim or unlock helper
  const handleClaimCertificate = (
    type: CertificateType,
    level: 'HSK 1' | 'HSK 2' | 'HSK 3',
    score?: number,
    total?: number
  ) => {
    const eligibility = checkCertificateEligibility(currentUser, type);
    if (!eligibility.isEligible) {
      setLockedNotice(eligibility.reasonUz);
      setTimeout(() => setLockedNotice(null), 5000);
      return;
    }

    const cert = issueCertificate(currentUser, type, level, score, total);
    if (cert) {
      const updated = {
        ...currentUser,
        certificates: [cert, ...(currentUser.certificates || []).filter((c) => c.type !== type)],
      };
      onUserUpdate(updated);
      setSelectedCertificate(cert);
    }
  };

  const hsk1Eligibility = checkCertificateEligibility(currentUser, 'HSK 1 Course');
  const hsk2Eligibility = checkCertificateEligibility(currentUser, 'HSK 2 Course');
  const hsk3Eligibility = checkCertificateEligibility(currentUser, 'HSK 3 Course');
  const hsk1MockEligibility = checkCertificateEligibility(currentUser, 'HSK 1 Mock');

  const certificateCards = [
    {
      id: 'hsk1-course',
      type: 'HSK 1 Course' as CertificateType,
      level: 'HSK 1' as const,
      titleUz: "HSK 1 To'liq Kurs Sertifikati",
      desc: "Talab: Barcha 30 ta darsni to'liq tugatish VA HSK 1 Full Final Exam'dan muvaffaqiyatli o'tish (kamida 180 ball).",
      progress: `${hsk1Completed}/30 dars • Final Exam: ${latestPassedMock ? '✓ O\'tildi (' + latestPassedMock.totalScore + 'b)' : 'Topshirilmagan'}`,
      isReady: hsk1Eligibility.isEligible,
      requirementText: hsk1Eligibility.reasonUz,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      actionUrl: hsk1Completed < 30 ? 'course' : 'mock',
      actionLabel: hsk1Completed < 30 ? "Darslarni o'qish" : "Final Exam'ni topshirish",
    },
    {
      id: 'hsk1-mock',
      type: 'HSK 1 Mock' as CertificateType,
      level: 'HSK 1' as const,
      titleUz: 'HSK 1 Full Final Mock Exam Sertifikati',
      desc: "Listening (100b), Reading (100b), Writing (50b), Speaking (50b) bo'limlaridan kamida 180 ball (60%) to'planganda beriladi.",
      progress: latestPassedMock
        ? `${latestPassedMock.totalScore}/300 ball (O'tildi)`
        : latestMock
        ? `${latestMock.totalScore}/300 ball (Yetarli emas)`
        : 'Topshirilmagan',
      isReady: hsk1MockEligibility.isEligible,
      requirementText: hsk1MockEligibility.reasonUz,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      actionUrl: 'mock',
      actionLabel: "Imtihonni topshirish",
    },
    {
      id: 'hsk2-course',
      type: 'HSK 2 Course' as CertificateType,
      level: 'HSK 2' as const,
      titleUz: "HSK 2 Ilg'or Kurs Sertifikati",
      desc: "50 ta ilg'or dars, 5 daqiqalik video-modullar va 20 talik amaliy testlar to'liq yakunlanganda taqdim etiladi.",
      progress: `${hsk2Completed}/50 dars tugatildi`,
      isReady: hsk2Eligibility.isEligible,
      requirementText: hsk2Eligibility.reasonUz,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      actionUrl: 'course',
      actionLabel: "HSK 2 darslarini tugatish",
    },
    {
      id: 'hsk3-course',
      type: 'HSK 3 Course' as CertificateType,
      level: 'HSK 3' as const,
      titleUz: "HSK 3 Chuqurlashtirilgan Kurs Sertifikati",
      desc: "50 ta chuqur tahliliy dars, 10 daqiqalik akademik tushuntirish va 30 talik testlarni 100% yakunlaganlar uchun.",
      progress: `${hsk3Completed}/50 dars tugatildi`,
      isReady: hsk3Eligibility.isEligible,
      requirementText: hsk3Eligibility.reasonUz,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      actionUrl: 'course',
      actionLabel: "HSK 3 darslarini tugatish",
    },
  ];

  return (
    <div id="certificates-hub" className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Award className="w-4 h-4" />
              <span>Xitoycha Rasmiy Sertifikatlashtirish Markazi</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Sertifikatlar & Rasmiy Muhr
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              HSK 1, 2, 3 darslari va to'liq Mock imtihonlarini tugatgandan so'ng beriladigan, xalqaro formatdagi, haqiqiyligi QR-kod bilan 100% isbotlanuvchi ideal sertifikatlar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenVerification()}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>QR Skanerni Tekshirish</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">Rasmiy Qizil Pechat</div>
              <div className="text-[11px] text-slate-400">Xitoycha akademiyasi muhri bilan</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">Jonli QR Verifikatsiya</div>
              <div className="text-[11px] text-slate-400">Skaner qilganda to'g'ridan-to'g'ri isbotlanadi</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-400 shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">Chop etish & PDF</div>
              <div className="text-[11px] text-slate-400">A4 formatdagi yuqori aniqlik</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Certificate Modal / Drawer */}
      {selectedCertificate && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Tanlangan Sertifikat: {selectedCertificate.titleUz}</span>
            </h3>
            <button
              type="button"
              onClick={() => setSelectedCertificate(null)}
              className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
            >
              Yopish ✕
            </button>
          </div>

          <OfficialCertificateCard
            certificate={selectedCertificate}
            onVerifyDirectly={(id) => onOpenVerification(id)}
            onClose={() => setSelectedCertificate(null)}
          />
        </div>
      )}

      {/* Alert / Notice for locked attempt */}
      {lockedNotice && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-extrabold text-sm text-rose-950 mb-0.5">Sertifikat Hozircha Qulfda!</div>
            <p className="leading-relaxed">{lockedNotice}</p>
          </div>
        </div>
      )}

      {/* Available Certifications Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <span>Mavjud Sertifikatlar Yo'nalishlari</span>
          <span className="text-xs font-normal text-slate-500">(Qat'iy yakuniy talablar asosida)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificateCards.map((card) => {
            const existingCert = userCerts.find((c) => c.type === card.type);

            return (
              <div
                key={card.id}
                className={`p-6 rounded-3xl border shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                  existingCert
                    ? 'bg-white border-emerald-200 hover:border-emerald-300'
                    : card.isReady
                    ? 'bg-amber-50/40 border-amber-300 shadow-md ring-2 ring-amber-400/20'
                    : 'bg-slate-50/70 border-slate-200 opacity-95'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${card.badgeColor}`}
                    >
                      {card.level}
                    </span>

                    {existingCert ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Olingan</span>
                      </span>
                    ) : card.isReady ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Olishga tayyor!</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Qulfda</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{card.titleUz}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Holat: </span>
                    <span className={card.isReady || existingCert ? 'text-emerald-700 font-bold' : 'text-slate-800'}>
                      {card.progress}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {existingCert ? (
                      <button
                        type="button"
                        onClick={() => setSelectedCertificate(existingCert)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sertifikatni ko'rish</span>
                      </button>
                    ) : card.isReady ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleClaimCertificate(
                            card.type,
                            card.level,
                            card.type.includes('Mock') ? 285 : 100,
                            card.type.includes('Mock') ? 300 : 100
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sertifikatni ochish</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (card.actionUrl === 'mock') {
                            onNavigateToMock();
                          } else {
                            onNavigateToCourse();
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title={card.requirementText}
                      >
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{card.actionLabel}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
