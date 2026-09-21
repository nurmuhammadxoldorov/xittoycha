import React, { useState, useEffect } from 'react';
import { User, LessonData } from './types';
import { getCurrentUser, setCurrentUser } from './utils/storage';
import { LESSONS_DATA } from './data/lessonsData';
import { HSK2_LESSONS_DATA } from './data/hsk2LessonsData';
import { SakuraEffect } from './components/SakuraEffect';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { AuthGatewayView } from './components/AuthGatewayView';
import { CourseView } from './components/CourseView';
import { LessonDetailView } from './components/LessonDetailView';
import { VocabularyView } from './components/VocabularyView';
import { DashboardView } from './components/DashboardView';
import { FlashcardsView } from './components/FlashcardsView';
import { MockExamView } from './components/MockExamView';
import { AiDialogueView } from './components/AiDialogueView';
import { CabinetView } from './components/CabinetView';
import { CertificatesHubView } from './components/CertificatesHubView';
import { CertificateVerificationView } from './components/CertificateVerificationView';

export default function App() {
  const [currentUser, setCurrUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentTab, setCurrentTab] = useState<
    'course' | 'vocabulary' | 'flashcards' | 'dashboard' | 'mock' | 'dialogue' | 'cabinet' | 'certificates' | 'verify'
  >('course');
  const [verificationCertId, setVerificationCertId] = useState<string>('');
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);
  const [sakuraActive, setSakuraActive] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Initialize current user and preferences from localStorage on mount,
  // and check for QR code verification URL parameter (?verify=CERT_ID or #verify/CERT_ID)
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrUser(user);
    }

    const savedSakura = localStorage.getItem('hsk_sakura_active');
    if (savedSakura !== null) {
      setSakuraActive(savedSakura === 'true');
    }

    // Check if user came via QR Code scanner
    const params = new URLSearchParams(window.location.search);
    const verifyParam = params.get('verify');
    const hash = window.location.hash;

    if (verifyParam) {
      setVerificationCertId(verifyParam);
      setCurrentTab('verify');
    } else if (hash.startsWith('#verify/')) {
      const hId = hash.replace('#verify/', '');
      setVerificationCertId(hId);
      setCurrentTab('verify');
    }
  }, []);

  const handleOpenVerification = (certId?: string) => {
    setActiveLesson(null);
    setVerificationCertId(certId || '');
    setCurrentTab('verify');
    if (certId) {
      window.history.replaceState(null, '', `?verify=${encodeURIComponent(certId)}`);
    }
  };

  const handleToggleSakura = () => {
    const nextState = !sakuraActive;
    setSakuraActive(nextState);
    localStorage.setItem('hsk_sakura_active', String(nextState));
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'demo_student',
      username: 'demo_user',
      name: 'Xurshidbek (Demo)',
      email: 'talaba@hsk.uz',
      avatar: '🎓',
      xp: 280,
      lessonsCompleted: 2,
      completedLessonIds: [1, 2],
      completedHsk2LessonIds: [1],
      bookmarkedWords: ['你好', '谢谢'],
      streakDays: 5,
      createdAt: new Date().toISOString(),
    };
    handleAuthSuccess(demoUser);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrUser(user);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrUser(null);
    setActiveLesson(null);
    setCurrentTab('course');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectLesson = (lesson: LessonData) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCourse = () => {
    setActiveLesson(null);
    setCurrentTab('course');
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const isHsk2 = activeLesson.level === 'HSK 2' || activeLesson.id > 30;
    const dataset = isHsk2 ? HSK2_LESSONS_DATA : LESSONS_DATA;
    const nextId = activeLesson.id + 1;
    const next = dataset.find((l) => l.id === nextId);

    if (next) {
      setActiveLesson(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveLesson(null);
      setCurrentTab('course');
    }
  };

  const getPageTitle = () => {
    if (activeLesson) {
      return `${activeLesson.level || 'HSK 1'} • ${activeLesson.id}-Dars: ${activeLesson.titleCn}`;
    }
    switch (currentTab) {
      case 'course':
        return 'Xitoy Tili Darslari (HSK 1 & HSK 2)';
      case 'certificates':
        return 'Rasmiy Sertifikatlar (HSK 1, 2, 3 & Mock)';
      case 'verify':
        return 'Sertifikat Haqiqiyligini Tekshirish Tizimi';
      case 'dialogue':
        return 'AI Dialogue — Ovozli Speaking Murabbiyi';
      case 'mock':
        return 'HSK 1 Full Mock Exam & Sertifikat';
      case 'cabinet':
        return 'O\'quvchi Shaxsiy Kabineti';
      case 'vocabulary':
        return "5000+ Ieroglif va Lug'at Qidiruvi";
      case 'flashcards':
        return 'Flashcard Xotira Mashqi';
      case 'dashboard':
        return 'Boshqaruv Paneli & Tahlil';
      default:
        return 'Xitoycha — HSK Mandarin Akademiyasi';
    }
  };

  // 1. Direct QR Verification Route: accessible by anyone scanning the QR code
  if (currentTab === 'verify') {
    return (
      <div className="relative min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-800 p-4 sm:p-8">
        <SakuraEffect active={sakuraActive} />
        <CertificateVerificationView
          initialCertId={verificationCertId}
          onBackToApp={() => {
            window.history.replaceState(null, '', window.location.pathname);
            if (currentUser) {
              setCurrentTab('certificates');
            } else {
              setCurrentTab('course');
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-rose-100 selection:text-rose-800 overflow-x-hidden">
      {/* 🌸 Universal Falling Sakura Effect across ALL views */}
      <SakuraEffect active={sakuraActive} />

      {/* If no user is logged in, show mandatory Registration / Auth Gateway screen */}
      {!currentUser ? (
        <AuthGatewayView onAuthSuccess={handleAuthSuccess} />
      ) : (
        <>
          {/* Main Navigation Sidebar */}
          <Sidebar
            currentTab={activeLesson ? 'course' : currentTab}
            onSelectTab={(tab) => {
              setActiveLesson(null);
              setCurrentTab(tab);
            }}
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('signin')}
            onLogout={handleLogout}
            sakuraActive={sakuraActive}
            onToggleSakura={handleToggleSakura}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative z-10">
            {/* Top Navbar */}
            <Navbar
              currentUser={currentUser}
              onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              onOpenAuth={() => handleOpenAuth('signin')}
              onNavigateToCabinet={() => {
                setActiveLesson(null);
                setCurrentTab('cabinet');
              }}
              sakuraActive={sakuraActive}
              onToggleSakura={handleToggleSakura}
              title={getPageTitle()}
            />

            {/* Content Body */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
              {activeLesson ? (
                <LessonDetailView
                  lesson={activeLesson}
                  currentUser={currentUser}
                  onBack={handleBackToCourse}
                  onNextLesson={handleNextLesson}
                  onUserUpdate={(updated) => setCurrUser(updated)}
                />
              ) : (
                <>
                  {currentTab === 'course' && (
                    <CourseView
                      currentUser={currentUser}
                      onSelectLesson={handleSelectLesson}
                      onOpenAuth={() => handleOpenAuth('signin')}
                    />
                  )}

                  {currentTab === 'certificates' && (
                    <CertificatesHubView
                      currentUser={currentUser}
                      onUserUpdate={(updated) => setCurrUser(updated)}
                      onNavigateToMock={() => setCurrentTab('mock')}
                      onNavigateToCourse={() => setCurrentTab('course')}
                      onOpenAuth={() => handleOpenAuth('signin')}
                      onOpenVerification={handleOpenVerification}
                    />
                  )}

                  {currentTab === 'dialogue' && (
                    <AiDialogueView
                      currentUser={currentUser}
                      onUserUpdate={(updated) => setCurrUser(updated)}
                      onOpenAuth={() => handleOpenAuth('signin')}
                    />
                  )}

                  {currentTab === 'mock' && (
                    <MockExamView
                      currentUser={currentUser}
                      onUserUpdate={(updated) => setCurrUser(updated)}
                      onOpenAuth={() => handleOpenAuth('signin')}
                      onBackToCourse={() => setCurrentTab('course')}
                      onOpenVerification={handleOpenVerification}
                    />
                  )}

                  {currentTab === 'cabinet' && (
                    <CabinetView
                      currentUser={currentUser}
                      onUserUpdate={(updated) => setCurrUser(updated)}
                      onLogout={handleLogout}
                      onNavigateToMock={() => setCurrentTab('mock')}
                      onNavigateToDialogue={() => setCurrentTab('dialogue')}
                      onNavigateToCertificates={() => setCurrentTab('certificates')}
                      onOpenVerification={handleOpenVerification}
                    />
                  )}

                  {currentTab === 'vocabulary' && (
                    <VocabularyView
                      currentUser={currentUser}
                      onUserUpdate={(updated) => setCurrUser(updated)}
                      onOpenAuth={() => handleOpenAuth('signin')}
                    />
                  )}

                  {currentTab === 'flashcards' && (
                    <FlashcardsView
                      currentUser={currentUser}
                      onOpenAuth={() => handleOpenAuth('signin')}
                    />
                  )}

                  {currentTab === 'dashboard' && (
                    <DashboardView
                      currentUser={currentUser}
                      onOpenAuth={() => handleOpenAuth('signin')}
                      onNavigateTab={(tab) => {
                        setActiveLesson(null);
                        setCurrentTab(tab);
                      }}
                      onSelectLesson={handleSelectLesson}
                    />
                  )}
                </>
              )}
            </main>
          </div>

          {/* Login & Registration Auth Modal */}
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
            initialMode={authMode}
          />
        </>
      )}
    </div>
  );
}
