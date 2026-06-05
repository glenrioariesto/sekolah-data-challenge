import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { BadgeGallery } from './BadgeGallery';
import { playSynthesizerNote } from '../utils/audio';

interface BadgeModalProps {
  isOpen: boolean;
  unlockedBadgeIds: string[];
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, unlockedBadgeIds, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] p-6 max-w-lg w-full relative"
      >
        {/* Top Close Button icon */}
        <button 
          type="button" 
          onClick={() => { playSynthesizerNote('btn'); onClose(); }}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 border-2 border-black rounded-xl text-black font-black flex items-center justify-center cursor-pointer hover:scale-105"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badges container */}
        <div className="mb-6">
          <BadgeGallery unlockedBadgeIds={unlockedBadgeIds} />
        </div>

        {/* Bottom buttons action row */}
        <div className="flex justify-end pt-4 border-t-2 border-black">
          <button
            type="button"
            onClick={() => { playSynthesizerNote('btn'); onClose(); }}
            className="px-6 py-3 bg-black text-white hover:bg-slate-900 border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#000] transition-colors active:translate-y-0.5"
          >
            Kembali ke Misi
          </button>
        </div>
      </motion.div>
    </div>
  );
};
