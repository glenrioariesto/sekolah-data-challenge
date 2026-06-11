import React from 'react';
import { RotateCw, Smartphone } from 'lucide-react';

export function PortraitWarning() {
  return (
    <div className="hidden portrait:flex fixed inset-0 z-[9999] bg-slate-950 text-slate-100 flex-col items-center justify-center text-center p-6 select-none">
      <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
        {/* Phone frame with custom rotate animation */}
        <div 
          className="w-12 h-20 border-4 border-slate-700 rounded-xl bg-slate-900 flex items-center justify-center transition-transform" 
          style={{ 
            animation: 'portraitRotate 2.5s ease-in-out infinite' 
          }}
        >
          <Smartphone className="w-6 h-6 text-indigo-400" />
        </div>
        
        {/* Curved arrow indicator */}
        <RotateCw className="w-8 h-8 text-amber-500 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '5s' }} />
      </div>

      <h2 className="text-sm font-black tracking-wider text-white mb-2 uppercase">
        Gunakan Orientasi Horizontal
      </h2>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
        Silakan putar perangkat Anda ke **lanskap (horizontal)** untuk kenyamanan menyelesaikan tantangan data sekolah.
      </p>

      {/* Embedded keyframes for custom phone rotation animation */}
      <style>{`
        @keyframes portraitRotate {
          0%, 20% { transform: rotate(0deg); }
          50%, 80% { transform: rotate(-90deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
