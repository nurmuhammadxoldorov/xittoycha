import React, { useState } from 'react';
import { CertificateData } from '../types';
import {
  Printer,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
  Award,
  Sparkles,
  Download,
  Copy,
  Check,
} from 'lucide-react';

interface OfficialCertificateCardProps {
  certificate: CertificateData;
  onVerifyDirectly?: (certId: string) => void;
  onClose?: () => void;
}

export const OfficialCertificateCard: React.FC<OfficialCertificateCardProps> = ({
  certificate,
  onVerifyDirectly,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate QR Code URL using public QR Server API with reliable high-res SVG/PNG
  const verifyUrl = certificate.verificationUrl || (typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?verify=${certificate.id}`
    : `https://xitoycha.uz?verify=${certificate.id}`);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=2&data=${encodeURIComponent(
    verifyUrl
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top action toolbar (hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              {certificate.level} Rasmiy Sertifikati
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              ID: {certificate.id}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct verification button */}
          <button
            type="button"
            onClick={() => onVerifyDirectly?.(certificate.id)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="QR kod orqali haqiqiyligini tekshirishni sinab ko'rish"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>QR orqali tekshirish</span>
          </button>

          {/* Copy link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Nusxa olindi!' : 'Havolani olish'}</span>
          </button>

          {/* Print button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Chop etish (PDF)</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold text-xs cursor-pointer"
            >
              Yopish
            </button>
          )}
        </div>
      </div>

      {/* Main Certificate Sheet (Designed for screen & print) */}
      <div
        id="official-certificate-sheet"
        className="relative bg-[#FCF9F2] text-slate-900 p-6 sm:p-10 md:p-12 rounded-3xl border-8 border-double border-amber-600/70 shadow-2xl overflow-hidden print:border-8 print:p-8 print:m-0 print:shadow-none"
      >
        {/* Subtle decorative background watermarks */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none font-serif text-[180px] font-black leading-none text-slate-950">
          汉学
        </div>

        {/* Ornate Corner Accents */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-700 pointer-events-none" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-700 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-700 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-700 pointer-events-none" />

        {/* Inner thin decorative border */}
        <div className="border border-amber-700/30 p-5 sm:p-8 rounded-2xl relative">
          {/* Header Row: Lanterns & Chinese Calligraphy */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl text-red-600">🏮</span>
              <span className="text-xs sm:text-sm font-serif font-black tracking-[0.35em] text-red-700 uppercase">
                {certificate.titleCn}
              </span>
              <span className="text-2xl sm:text-3xl text-red-600">🏮</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight uppercase">
              {certificate.level} CERTIFICATE
            </h1>

            <div className="text-[11px] sm:text-xs font-bold text-amber-900/80 tracking-wider uppercase">
              XITOYCHA • HSK MANDARIN ACADEMY OFFICIAL DIPLOMA
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider">
              SERIYA: {certificate.id}
            </div>
          </div>

          {/* Certificate Awarded To */}
          <div className="my-6 sm:my-8 text-center space-y-3">
            <p className="text-xs sm:text-sm text-slate-500 font-serif italic">
              Ushbu rasmiy hujjat quyidagi talabaga topshiriladi:
            </p>

            <div className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-wide border-b-2 border-amber-400/80 pb-2 max-w-xl mx-auto">
              {certificate.userName.toUpperCase()}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed pt-1">
              Xitoy tili bo'yicha <strong className="font-extrabold text-slate-900">{certificate.level}</strong> xalqaro standartlariga to'la javob beruvchi barcha tizimli darslar, leksik-grammatik modullar va yakuniy imtihon sinovlaridan muvaffaqiyatli o'tib, yuqori natijaga erishdi.
            </p>
          </div>

          {/* Performance Summary Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-2xl mx-auto text-center my-6">
            <div className="p-2.5 sm:p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs">
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Daraja</div>
              <div className="text-base sm:text-lg font-black text-slate-900">{certificate.level}</div>
            </div>

            <div className="p-2.5 sm:p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs">
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Baholash</div>
              <div className="text-base sm:text-lg font-black text-emerald-700">{certificate.grade}</div>
            </div>

            <div className="p-2.5 sm:p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs">
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Natija</div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {certificate.score ? `${certificate.score} / ${certificate.totalPossibleScore || 300}` : '100% Tugallangan'}
              </div>
            </div>

            <div className="p-2.5 sm:p-3 bg-white/90 rounded-xl border border-amber-200/90 shadow-2xs">
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Berilgan sana</div>
              <div className="text-base sm:text-lg font-black text-slate-900">{certificate.issueDate}</div>
            </div>
          </div>

          {/* Bottom Row: QR Code, Official Red Stamp (Seal), and Director Signature */}
          <div className="pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Scannable QR Code */}
            <div className="flex items-center gap-3 p-3 bg-white/95 rounded-2xl border border-amber-300 shadow-xs max-w-xs">
              <div className="relative shrink-0 w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center">
                <img
                  src={qrImageUrl}
                  alt="Sertifikat haqiqiylik QR kodi"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-left space-y-0.5">
                <div className="flex items-center gap-1 text-[11px] font-black text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>HAQIQIY SERTIFIKAT</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Kamera orqali QR kodni skaner qilib, rasmiy ma'lumotlar bazasidan tekshiring.
                </p>
                <div className="text-[9px] font-mono text-slate-400">
                  {certificate.id}
                </div>
              </div>
            </div>

            {/* Official Vermilion Red Stamp / Seal (Rasmiy Qizil Pechat) */}
            <div className="relative flex items-center justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-red-600/90 p-1 flex flex-col items-center justify-center text-center text-red-600 font-serif select-none transform -rotate-12 shadow-sm bg-red-50/20 backdrop-blur-2xs">
                <div className="w-full h-full rounded-full border border-dashed border-red-500/80 flex flex-col items-center justify-center p-1.5 space-y-0.5">
                  <span className="text-[9px] font-black tracking-widest uppercase">
                    中国汉语水平考试
                  </span>
                  <div className="text-lg font-black leading-none">★</div>
                  <span className="text-[10px] font-bold tracking-tight">
                    OFFICIAL SEAL
                  </span>
                  <span className="text-[8px] font-black tracking-wider text-red-700">
                    XITOYCHA ACADEMY
                  </span>
                </div>
              </div>
            </div>

            {/* Director Signature */}
            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif italic text-base sm:text-lg text-slate-800 font-bold border-b border-slate-300 pb-1 px-3">
                {certificate.director}
              </div>
              <div className="text-[11px] font-bold text-slate-600">
                Akademik rahbar & Asoschi
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {certificate.issuer}
              </div>
            </div>
          </div>

          {/* Micro Security Footprint */}
          <div className="mt-6 pt-3 border-t border-dashed border-amber-300/60 flex flex-wrap items-center justify-between text-[9px] text-slate-400 font-mono">
            <span>HASH: {certificate.securityHash}</span>
            <span>VERIFIED DIGITAL CREDENTIAL • 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
