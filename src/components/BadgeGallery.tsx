import React from 'react';
import { Badge } from '@/src/types';
import { BADGES } from '@/src/data/levels';

import { Award, Lock, Milestone, CheckCircle2 } from 'lucide-react';

interface BadgeGalleryProps {
  unlockedBadgeIds: string[];
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({
  unlockedBadgeIds,
}) => {
  return (
    <div className="bg-white rounded-xl border-4 border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-2 border-b-2 border-black pb-3 mb-4">
        <Award className="w-5 h-5 text-rose-600" />
        <h3 className="text-sm font-black text-slate-950 font-display uppercase tracking-tight">
          Galeri Lencana Kehormatan
        </h3>
      </div>

      <p className="text-[11px] text-slate-700 mb-4 font-bold leading-relaxed">
        Lencana di bawah ini merepresentasikan kecakapan Berpikir Komputasional (BK) yang berhasil dikuasai siswa dalam simulasi sekolah.
      </p>

      <div className="space-y-3">
        {BADGES.map((b) => {
          const isUnlocked = unlockedBadgeIds.includes(b.id);
          
          return (
            <div 
              key={b.id}
              className={`p-3 rounded-lg border-2 border-black transition-all duration-300 flex items-start gap-3.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] ${
                isUnlocked 
                  ? b.id === 'data-collector' ? 'bg-[#CCFBF1]' : 
                    b.id === 'graph-maker' ? 'bg-[#FBCFE8]' : 
                    b.id === 'data-analyst' ? 'bg-[#A5F3FC]' : 'bg-[#FDE047]'
                  : 'bg-slate-100 grayscale opacity-60'
              }`}
            >
              {/* Badge visual icon represent */}
              <div className={`w-11 h-11 shrink-0 rounded-full border-2 border-black flex items-center justify-center text-xl bg-[#FDE047] shadow-[2px_2px_0px_#000] ${
                isUnlocked ? '' : 'bg-slate-300'
              }`}>
                {isUnlocked ? (
                  b.id === 'data-collector' ? '📊' : 
                  b.id === 'graph-maker' ? '📈' : 
                  b.id === 'data-analyst' ? '🔍' : '🏆'
                ) : (
                  <Lock className="w-4 h-4 text-slate-700" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-black font-display text-slate-950">
                    {b.name}
                  </h4>
                  {isUnlocked && (
                    <span className="text-[8px] bg-black text-white font-black font-mono px-1.5 py-0.2 rounded-full border border-black uppercase scale-90">
                      Aktif
                    </span>
                  )}
                </div>
                
                <p className="text-[10px] text-slate-900 leading-relaxed mt-1 font-bold">
                  {b.description}
                </p>

                {!isUnlocked && (
                  <p className="text-[9px] text-rose-600 mt-1 font-bold flex items-center gap-1">
                    <Milestone className="w-3 h-3 text-rose-600" />
                    Terbuka di Misi Level {b.achievedAtLevel}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
