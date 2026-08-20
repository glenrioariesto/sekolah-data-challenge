import { useState, useEffect } from 'react';
import { getAudioMuted, toggleAudioMute, setAudioMuted, subscribeAudioState, startBgm } from '@/src/utils/audio';

export function useAudio() {
  const [isMuted, setIsMuted] = useState<boolean>(getAudioMuted());

  useEffect(() => {
    const unsubscribe = subscribeAudioState((muted) => {
      setIsMuted(muted);
    });
    // Start BGM if not muted
    startBgm();
    return () => unsubscribe();
  }, []);

  const toggle = () => {
    toggleAudioMute();
  };

  return {
    isMuted,
    toggle,
    setMuted: setAudioMuted
  };
}
