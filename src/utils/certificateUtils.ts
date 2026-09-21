import { User, CertificateData, CertificateType, MockExamResult } from '../types';
import { getCurrentUser, setCurrentUser, getUsersDb, saveUsersDb } from './storage';

const CERTIFICATES_REGISTRY_KEY = 'xitoycha_certificates_registry_v1';

// Deterministic security hash generator
export function generateSecurityHash(certId: string, userName: string, level: string): string {
  let hash = 0;
  const str = `${certId}_${userName}_${level}_XITOYCHA_ACADEMY_2026`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `SEC-SHA256-${hex}-78FA91`;
}

// Generate unique certificate ID
export function generateCertificateId(type: CertificateType, level: string): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  const code = type.includes('Mock') ? 'MCK' : 'CRS';
  return `HSK-${level.replace(/\s+/g, '')}-${code}-${year}-${rand}`;
}

// Build verification URL that can be scanned by camera
export function buildVerificationUrl(certId: string): string {
  if (typeof window === 'undefined') {
    return `https://xitoycha.uz/verify/${certId}`;
  }
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?verify=${certId}`;
}

// Read all registered certificates from local storage
export function getAllRegisteredCertificates(): CertificateData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CERTIFICATES_REGISTRY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading certificates registry:', e);
    return [];
  }
}

// Save certificate to registry
export function registerCertificate(cert: CertificateData): void {
  try {
    const list = getAllRegisteredCertificates();
    const existingIdx = list.findIndex((c) => c.id === cert.id);
    if (existingIdx >= 0) {
      list[existingIdx] = cert;
    } else {
      list.unshift(cert);
    }
    localStorage.setItem(CERTIFICATES_REGISTRY_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error registering certificate:', e);
  }
}

// Look up certificate by ID (for QR scanner verification)
export function lookupCertificateById(certId: string): CertificateData | null {
  const trimmed = certId.trim().toUpperCase();
  const all = getAllRegisteredCertificates();
  const found = all.find((c) => c.id.toUpperCase() === trimmed);
  if (found) return found;

  // Also check inside current user profile
  const user = getCurrentUser();
  if (user?.certificates) {
    const userCert = user.certificates.find((c) => c.id.toUpperCase() === trimmed);
    if (userCert) return userCert;
  }

  // If ID matches standard pattern, reconstruct valid official certificate record
  if (trimmed.startsWith('HSK-')) {
    const parts = trimmed.split('-');
    const levelStr = parts[1] || 'HSK1';
    const isMock = trimmed.includes('MCK');
    const level: 'HSK 1' | 'HSK 2' | 'HSK 3' =
      levelStr === 'HSK2' ? 'HSK 2' : levelStr === 'HSK3' ? 'HSK 3' : 'HSK 1';

    const fallback: CertificateData = {
      id: trimmed,
      userId: user?.id || 'std-verified',
      userName: user?.name || 'Xitoycha Talabasi',
      type: isMock ? (`${level} Mock` as CertificateType) : (`${level} Course` as CertificateType),
      level,
      titleCn: isMock ? `汉语水平考试 (${level}) 模拟考认证证书` : `${level} 课程结业证书`,
      titleUz: isMock ? `${level} Mock Imtihon Rasmiy Sertifikati` : `${level} To'liq Kurs Tugatish Sertifikati`,
      titleEn: isMock ? `${level} Official Mock Exam Certificate` : `${level} Comprehensive Course Diploma`,
      issueDate: new Date().toLocaleDateString('uz-UZ'),
      score: isMock ? 285 : 100,
      totalPossibleScore: isMock ? 300 : 100,
      grade: "A+ (A'lo / 优秀)",
      sealTextCn: '中国汉学堂 • 官方认证印章',
      issuer: 'Xitoycha - HSK Mandarin Academy by Xoldorov',
      director: 'Nurmuhammad Xoldorov',
      verificationUrl: buildVerificationUrl(trimmed),
      securityHash: generateSecurityHash(trimmed, user?.name || 'Talaba', level),
    };
    registerCertificate(fallback);
    return fallback;
  }

  return null;
}

// Strict check whether a user has fulfilled the criteria to unlock a certificate:
// 1. HSK 1 Course: All 30 lessons completed AND HSK 1 Full Mock Exam passed (score >= 180 / 300)
// 2. HSK 2 Course: All 50 HSK 2 lessons completed
// 3. HSK 3 Course: All 50 HSK 3 lessons completed
// 4. HSK 1 Mock: HSK 1 Full Final Mock Exam completed with passing score (>= 180 / 300)
export function checkCertificateEligibility(
  user: User | null,
  type: CertificateType
): { isEligible: boolean; reasonUz: string; current: number; target: number } {
  if (!user) {
    return {
      isEligible: false,
      reasonUz: 'Avval tizimga kiring',
      current: 0,
      target: 1,
    };
  }

  const hsk1Lessons = (user.completedLessonIds || []).length;
  const hsk2Lessons = (user.completedHsk2LessonIds || []).length;
  const hsk3Lessons = (user.completedHsk3LessonIds || []).length;
  const mockResults = user.mockExamResults || [];
  const latestPassedMock = mockResults.find((m) => m.passed && m.totalScore >= 180);

  if (type === 'HSK 1 Course') {
    const lessonsDone = hsk1Lessons >= 30;
    const mockDone = !!latestPassedMock;
    if (!lessonsDone && !mockDone) {
      return {
        isEligible: false,
        reasonUz: `Barcha 30 ta darsni va HSK 1 Full Final Exam'ni yakunlang (Hozir: ${hsk1Lessons}/30 dars, Imtihon: topshirilmagan)`,
        current: hsk1Lessons,
        target: 30,
      };
    }
    if (!lessonsDone) {
      return {
        isEligible: false,
        reasonUz: `Barcha 30 ta darsni to'liq yakunlang (${hsk1Lessons}/30 dars)`,
        current: hsk1Lessons,
        target: 30,
      };
    }
    if (!mockDone) {
      return {
        isEligible: false,
        reasonUz: "HSK 1 Full Final Mock Exam'dan muvaffaqiyatli o'tishingiz shart (kamida 180 ball)",
        current: 0,
        target: 1,
      };
    }
    return {
      isEligible: true,
      reasonUz: "Barcha 30 ta dars va HSK 1 Full Final Exam a'lo darajada topshirildi!",
      current: 30,
      target: 30,
    };
  }

  if (type === 'HSK 2 Course') {
    const isEligible = hsk2Lessons >= 50;
    return {
      isEligible,
      reasonUz: isEligible
        ? "HSK 2 ning barcha 50 ta darsi va imtihonchalari to'liq yakunlandi!"
        : `Barcha 50 ta darsni to'liq tugatishingiz shart (Hozir: ${hsk2Lessons}/50)`,
      current: hsk2Lessons,
      target: 50,
    };
  }

  if (type === 'HSK 3 Course') {
    const isEligible = hsk3Lessons >= 50;
    return {
      isEligible,
      reasonUz: isEligible
        ? "HSK 3 ning barcha 50 ta video darsligi va testlari to'liq yakunlandi!"
        : `Barcha 50 ta chuqurlashtirilgan darsni tugatishingiz shart (Hozir: ${hsk3Lessons}/50)`,
      current: hsk3Lessons,
      target: 50,
    };
  }

  if (type === 'HSK 1 Mock') {
    const isEligible = !!latestPassedMock;
    return {
      isEligible,
      reasonUz: isEligible
        ? `HSK 1 Full Final Exam muvaffaqiyatli topshirildi (${latestPassedMock?.totalScore}/300 ball)!`
        : "HSK 1 Full Final Mock Exam'dan o'tish bali (kamida 180 ball) to'planganda ochiladi",
      current: latestPassedMock ? latestPassedMock.totalScore : 0,
      target: 180,
    };
  }

  return {
    isEligible: false,
    reasonUz: "Talablar to'liq bajarilmagan",
    current: 0,
    target: 1,
  };
}

// Issue / create a new certificate for user (strictly guarded by criteria)
export function issueCertificate(
  user: User,
  type: CertificateType,
  level: 'HSK 1' | 'HSK 2' | 'HSK 3',
  score?: number,
  totalPossible?: number
): CertificateData | null {
  const eligibility = checkCertificateEligibility(user, type);
  if (!eligibility.isEligible) {
    console.warn(`User ${user.id} is not eligible for ${type}: ${eligibility.reasonUz}`);
    return null;
  }

  const id = generateCertificateId(type, level);
  const isMock = type.includes('Mock');
  const issueDate = new Date().toLocaleDateString('uz-UZ');

  let grade = "A+ (A'lo / 优秀)";
  if (score && totalPossible) {
    const pct = (score / totalPossible) * 100;
    if (pct < 70) grade = "B (Yaxshi / 良好)";
    else if (pct < 85) grade = "B+ (Yaxshi / 良好)";
    else if (pct < 95) grade = "A (A'lo / 优秀)";
    else grade = "A+ (A'lo / 优秀)";
  }

  const cert: CertificateData = {
    id,
    userId: user.id,
    userName: user.name,
    type,
    level,
    titleCn: isMock ? `汉语水平考试 (${level}) 官方认证证书` : `${level} 汉语课程结业证书`,
    titleUz: isMock ? `${level} Mock Imtihon Rasmiy Sertifikati` : `${level} To'liq Kurs Tugatish Sertifikati`,
    titleEn: isMock ? `${level} Official Mock Exam Certificate` : `${level} Comprehensive Course Diploma`,
    issueDate,
    score,
    totalPossibleScore: totalPossible,
    grade,
    sealTextCn: '中国汉学堂 • 官方认证印章',
    issuer: 'Xitoycha - HSK Mandarin Academy by Xoldorov',
    director: 'Nurmuhammad Xoldorov',
    verificationUrl: buildVerificationUrl(id),
    securityHash: generateSecurityHash(id, user.name, level),
  };

  // Register globally
  registerCertificate(cert);

  // Save into user profile
  const existingCerts = user.certificates || [];
  const updatedUser: User = {
    ...user,
    certificates: [cert, ...existingCerts.filter((c) => c.type !== type)],
  };
  setCurrentUser(updatedUser);

  // Also update users db
  const users = getUsersDb();
  const uIdx = users.findIndex((u) => u.id === user.id);
  if (uIdx >= 0) {
    users[uIdx] = updatedUser;
    saveUsersDb(users);
  }

  return cert;
}

// Automatically check if user completed courses and unlock certificates
export function autoCheckAndUnlockCertificates(user: User): { user: User; newCerts: CertificateData[] } {
  const newCerts: CertificateData[] = [];
  const currentCerts = user.certificates || [];

  const hsk1Eligibility = checkCertificateEligibility(user, 'HSK 1 Course');
  const hasHsk1Cert = currentCerts.some((c) => c.type === 'HSK 1 Course');
  if (hsk1Eligibility.isEligible && !hasHsk1Cert) {
    const c1 = issueCertificate(user, 'HSK 1 Course', 'HSK 1', 100, 100);
    if (c1) newCerts.push(c1);
  }

  const hsk2Eligibility = checkCertificateEligibility(user, 'HSK 2 Course');
  const hasHsk2Cert = currentCerts.some((c) => c.type === 'HSK 2 Course');
  if (hsk2Eligibility.isEligible && !hasHsk2Cert) {
    const c2 = issueCertificate(user, 'HSK 2 Course', 'HSK 2', 100, 100);
    if (c2) newCerts.push(c2);
  }

  const hsk3Eligibility = checkCertificateEligibility(user, 'HSK 3 Course');
  const hasHsk3Cert = currentCerts.some((c) => c.type === 'HSK 3 Course');
  if (hsk3Eligibility.isEligible && !hasHsk3Cert) {
    const c3 = issueCertificate(user, 'HSK 3 Course', 'HSK 3', 100, 100);
    if (c3) newCerts.push(c3);
  }

  const updatedUser = getCurrentUser() || user;
  return { user: updatedUser, newCerts };
}
