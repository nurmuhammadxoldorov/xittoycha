import React, { useState, useEffect } from 'react';
import { CertificateData } from '../types';
import { lookupCertificateById } from '../utils/certificateUtils';
import { OfficialCertificateCard } from './OfficialCertificateCard';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Award,
  Calendar,
  User,
  Hash,
  Sparkles,
  ArrowLeft,
  Printer,
  ExternalLink,
} from 'lucide-react';

interface CertificateVerificationViewProps {
  initialCertId?: string;
  onBackToApp: () => void;
}

export const CertificateVerificationView: React.FC<CertificateVerificationViewProps> = ({
  initialCertId = '',
  onBackToApp,
}) => {
  const [searchId, setSearchId] = useState(initialCertId);
  const [currentCert, setCurrentCert] = useState<CertificateData | null>(null);
  const [searched, setSearched] = useState(false);
  const [showFullView, setShowFullView] = useState(true);

  useEffect(() => {
    if (initialCertId) {
      handleVerify(initialCertId);
    }
  }, [initialCertId]);

  const handleVerify = (idToVerify: string) => {
    const trimmed = idToVerify.trim();
    if (!trimmed) return;
    setSearched(true);
    const found = lookupCertificateById(trimmed);
    setCurrentCert(found);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(searchId);
  };

  return (
    <div id="certificate-verification-portal" className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Navigation & Status */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToApp}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Platformaga qaytish</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Onlayn Verifikatsiya Serveri</span>
        </div>
      </div>

      {/* Verification Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 shadow-xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Xitoycha Rasmiy Sertifikat Haqiqiyligini Tekshirish Tizimi</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Sertifikat Tekshiruvi & Autentifikatsiya
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          QR kod orqali skaner qilingan yoki seriya raqami kiritilgan har bir sertifikat to'g'ridan-to'g'ri rasmiy bazamiz orqali real vaqtda tasdiqlanadi.
        </p>

        {/* Verification Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto pt-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Masalan: HSK-HSK1-MCK-2026-..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:bg-white/15"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all cursor-pointer shrink-0"
          >
            Tekshirish
          </button>
        </form>
      </div>

      {/* Verification Result Card */}
      {searched && (
        <div className="space-y-6 animate-fade-in">
          {currentCert ? (
            <div className="p-6 rounded-3xl bg-white border-2 border-emerald-400 shadow-xl space-y-6">
              {/* Green Verified Seal */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-emerald-900 flex items-center gap-2">
                      <span>RASMIY VA HAQIQIY SERTIFIKAT</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-black uppercase">
                        Tasdiqlangan
                      </span>
                    </div>
                    <div className="text-xs text-emerald-700">
                      Ushbu hujjat Xitoycha akademiyasi ma'lumotlar bazasida ro'yxatdan o'tgan va qonuniy kuchga ega.
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-emerald-800">
                  <div>Status: <span className="font-bold text-emerald-900">FAOL / ACTIVE</span></div>
                  <div className="text-[10px] text-emerald-600">Tekshirilgan vaqt: {new Date().toLocaleTimeString('uz-UZ')}</div>
                </div>
              </div>

              {/* Verified Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Egasi (Talaba)</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">
                    {currentCert.userName}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Yo'nalish & Daraja</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">
                    {currentCert.level} ({currentCert.type})
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Berilgan sana</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">
                    {currentCert.issueDate}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Seriya Raqami (ID)</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-900 mt-1 break-all">
                    {currentCert.id}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Natija / Baho</span>
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700 mt-1">
                    {currentCert.grade}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Beruvchi Tashkilot</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {currentCert.issuer}
                  </div>
                </div>
              </div>

              {/* Digital Checksum */}
              <div className="p-3 rounded-xl bg-slate-100 font-mono text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Raqamli kriptografik imzo: <strong>{currentCert.securityHash}</strong></span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Raqamli muhr tekshirildi
                </span>
              </div>

              {/* View Full Certificate Toggle */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Sertifikatning to'liq asl nusxasi
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowFullView(!showFullView)}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    {showFullView ? "Yashirish" : "Ko'rsatish"}
                  </button>
                </div>

                {showFullView && (
                  <OfficialCertificateCard
                    certificate={currentCert}
                    onVerifyDirectly={() => {}}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Sertifikat topilmadi yoki seriya raqami noto'g'ri
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Kiritilgan seriya raqami ({searchId}) bo'yicha tizimda hech qanday sertifikat mavjud emas. Iltimos, seriya raqamini tekshirib qaytadan urinib ko'ring.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
