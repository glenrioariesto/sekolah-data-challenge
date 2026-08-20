import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playSynthesizerNote } from '@/src/utils/audio';

interface AudioToggleProps {
  isMuted: boolean;
  onToggle: () => void;
  className?: string;
  id?: string;
}

export function AudioToggle({
  isMuted,
  onToggle,
  className = '',
  id = 'audio-toggle-button',
}: AudioToggleProps) {
  const handleClick = () => {
    playSynthesizerNote('click');
    onToggle();
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      aria-label={isMuted ? 'Nyalakan Musik Latar' : 'Matikan Musik Latar'}
      title={isMuted ? 'Nyalakan Musik Latar (Unmute Backsound)' : 'Matikan Musik Latar (Mute Backsound)'}
      className={`relative group rounded-xl md:rounded-2xl 2xl:rounded-3xl border-2 md:border-3 2xl:border-4 border-black flex items-center justify-center cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE047] focus-visible:ring-offset-2 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 shadow-[3px_3px_0px_rgba(0,0,0,1)] 2xl:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
        isMuted 
          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
          : 'bg-[#FDE047] text-black hover:bg-[#FACC15]'
      } ${className}`}
    >
      {isMuted ? (
        <div className="relative flex items-center justify-center text-slate-700 group-hover:text-black transition-colors">
          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8 stroke-[2.5]" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center text-black">
          {/* Subtle ambient soundwave animation ring */}
          <span className="absolute -inset-1 rounded-xl md:rounded-2xl 2xl:rounded-3xl bg-[#FDE047]/30 animate-ping opacity-75 pointer-events-none" />
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8 stroke-[2.5]" />
        </div>
      )}
    </button>
  );
}
