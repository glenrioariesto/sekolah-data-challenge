import bgmUrl from '@/assets/audio/bgm.mp3';
import clickSfxUrl from '@/assets/audio/click.mp3';
import popSfxUrl from '@/assets/audio/pop.wav';
import successSfxUrl from '@/assets/audio/success.wav';
import errorSfxUrl from '@/assets/audio/error.mp3';
import victorySfxUrl from '@/assets/audio/victory.mp3';

// Singleton BGM Audio Element
let bgmAudio: HTMLAudioElement | null = null;
let isBgmMutedState = false;
let userInteractionListenerAttached = false;

// Initialize mute state from localStorage if available (controls BGM only)
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('sekolah_data_audio_muted');
    isBgmMutedState = stored === 'true';
  } catch (e) {
    isBgmMutedState = false;
  }
}

type AudioListener = (isMuted: boolean) => void;
const listeners = new Set<AudioListener>();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener(isBgmMutedState);
    } catch (e) {
      // Ignore listener error
    }
  });
};

export const subscribeAudioState = (listener: AudioListener): (() => void) => {
  listeners.add(listener);
  listener(isBgmMutedState);
  return () => {
    listeners.delete(listener);
  };
};

export const getAudioMuted = (): boolean => isBgmMutedState;

// Set BGM to a very gentle, subtle ambient background level (8%)
const DEFAULT_BGM_VOLUME = 0.08;

export const getBgmAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  if (!bgmAudio) {
    bgmAudio = new Audio(bgmUrl);
    bgmAudio.loop = true;
    bgmAudio.volume = DEFAULT_BGM_VOLUME;
    bgmAudio.preload = 'auto';
  } else {
    bgmAudio.volume = DEFAULT_BGM_VOLUME;
  }
  return bgmAudio;
};

// Set up one-time listener to start BGM as soon as user touches/clicks anywhere
export const setupAutoplayUnlock = () => {
  if (typeof window === 'undefined' || userInteractionListenerAttached) return;
  userInteractionListenerAttached = true;

  const handleFirstInteraction = () => {
    if (!isBgmMutedState) {
      startBgm();
    }
    window.removeEventListener('pointerdown', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
    window.removeEventListener('touchstart', handleFirstInteraction);
    window.removeEventListener('click', handleFirstInteraction);
  };

  window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
  window.addEventListener('keydown', handleFirstInteraction, { once: true });
  window.addEventListener('touchstart', handleFirstInteraction, { once: true });
  window.addEventListener('click', handleFirstInteraction, { once: true });
};

export const startBgm = () => {
  if (typeof window === 'undefined') return;
  if (isBgmMutedState) return;

  const audio = getBgmAudio();
  if (!audio) return;
  audio.volume = DEFAULT_BGM_VOLUME;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked by browser policy; user gesture will start it via setupAutoplayUnlock
      setupAutoplayUnlock();
    });
  }
};

export const stopBgm = () => {
  if (bgmAudio) {
    bgmAudio.pause();
  }
};

export const toggleAudioMute = (): boolean => {
  setAudioMuted(!isBgmMutedState);
  return isBgmMutedState;
};

export const setAudioMuted = (muted: boolean) => {
  isBgmMutedState = muted;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sekolah_data_audio_muted', String(muted));
    } catch (e) {}
  }

  if (muted) {
    stopBgm();
  } else {
    startBgm();
  }

  notifyListeners();
};

export type SoundEffectType = 
  | 'click' 
  | 'btn' 
  | 'pop' 
  | 'card' 
  | 'flip' 
  | 'whoosh' 
  | 'select' 
  | 'success' 
  | 'fail' 
  | 'error' 
  | 'unlock' 
  | 'victory' 
  | 'complete' 
  | 'hint';

// Procedural Web Audio API Synthesizer fallback (Always available for responsive tactile feedback)
const playProceduralSynthesizerNote = (type: SoundEffectType) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'click' || type === 'btn') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'pop' || type === 'card') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'flip' || type === 'whoosh') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.07);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'hint') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'fail' || type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220.00, now);
      osc.frequency.exponentialRampToValueAtTime(130.81, now + 0.25);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'unlock') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.00, now);
      osc.frequency.setValueAtTime(523.25, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(783.99, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.65);
    } else if (type === 'victory' || type === 'complete') {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.28, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.08 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.65);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    }
  } catch (e) {
    // Fallback
  }
};

// Main Sound Effect player: Plays downloaded high quality audio files with instant synthesizer fallback
// Note: SFX is always active and will continue playing even if backsound (BGM) is muted
export const playSynthesizerNote = (type: SoundEffectType) => {
  try {
    let url: string | null = null;
    let volume = 0.9;

    if (type === 'click' || type === 'btn') {
      url = clickSfxUrl;
      volume = 0.9;
    } else if (type === 'pop' || type === 'card') {
      url = popSfxUrl;
      volume = 0.95;
    } else if (type === 'success') {
      url = successSfxUrl;
      volume = 1.0;
    } else if (type === 'fail' || type === 'error') {
      url = errorSfxUrl;
      volume = 0.95;
    } else if (type === 'victory' || type === 'complete') {
      url = victorySfxUrl;
      volume = 1.0;
    }

    if (url) {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play().catch(() => {
        // In case audio file play was rejected or blocked, fallback to procedural synthesis
        playProceduralSynthesizerNote(type);
      });
      return;
    }
  } catch (e) {
    // Fallback
  }

  // Fallback for procedural sound types (flip, select, hint, unlock)
  playProceduralSynthesizerNote(type);
};
