/**
 * Speech synthesis utility for Mandarin Chinese (zh-CN)
 */

let selectedVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(null);
      return;
    }

    const updateVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Look for zh-CN voice
      const zhVoice =
        voices.find((v) => v.lang === 'zh-CN' || v.lang === 'zh_CN') ||
        voices.find((v) => v.lang.startsWith('zh')) ||
        null;
      selectedVoice = zhVoice;
      resolve(zhVoice);
    };

    updateVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoice;
    }
  });
}

// Preload voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
}

export function playChineseAudio(text: string, rate: number = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser');
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const zhVoice = voices.find((v) => v.lang.startsWith('zh'));
        if (zhVoice) utterance.voice = zhVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Audio synthesis error:', e);
      resolve();
    }
  });
}

export function stopAudio(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
