import React from 'react';
import { motion } from 'motion/react';
import { UserX } from 'lucide-react';
import { StudentRecord } from '@/src/types';

import bgCewe from '@/assets/background-cewe.svg';
import bgCowo from '@/assets/background-cowo.svg';
import papanNama from '@/assets/papan-nama.svg';

import cewePisah1 from '@/assets/cewe-pisah-1.svg';
import cewePisah2 from '@/assets/cewe-pisah-2.svg';
import cewePisah3 from '@/assets/cewe-pisah-3.svg';
import cewePisah4 from '@/assets/cewe-pisah-4.svg';

import cowoPisah1 from '@/assets/cowo-pisah-1.svg';
import cowoPisah2 from '@/assets/cowo-pisah-2.svg';
import cowoPisah3 from '@/assets/cowo-pisah-3.svg';
import cowoPisah4 from '@/assets/cowo-pisah-4.svg';

const isFemale = (name: string): boolean => {
  const lower = name.toLowerCase();
  const femaleList = ['cici', 'eka', 'fani', 'gita', 'kirana', 'lia', 'nita', 'siti', 'susi', 'ani', 'dewi', 'putri', 'rara', 'tari', 'wulan', 'yuni', 'putu', 'made', 'ketut', 'nyoman'];
  if (femaleList.some(f => lower.includes(f))) return true;
  const males = ['budi', 'andi', 'dodi', 'hari', 'joko', 'iwan', 'adi'];
  if (males.some(m => lower.includes(m))) return false;
  return lower.endsWith('a') || lower.endsWith('i');
};

const getStudentAvatar = (name: string) => {
  const isCewe = isFemale(name);
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  const index = (hash % 4) + 1;
  const bg = isCewe ? bgCewe : bgCowo;
  let pisah = cewePisah1;
  if (isCewe) {
    if (index === 1) pisah = cewePisah1;
    else if (index === 2) pisah = cewePisah2;
    else if (index === 3) pisah = cewePisah3;
    else if (index === 4) pisah = cewePisah4;
  } else {
    if (index === 1) pisah = cowoPisah1;
    else if (index === 2) pisah = cowoPisah2;
    else if (index === 3) pisah = cowoPisah3;
    else if (index === 4) pisah = cowoPisah4;
  }
  return { bg, pisah };
};

interface StudentCardProps {
  student: StudentRecord;
  idx: number;
  day: string;
  isHighlighted: boolean;
  onToggleHighlight: (day: string, idx: number) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  idx,
  day,
  isHighlighted,
  onToggleHighlight,
}) => {
  const status = student.status;
  const isAbsentStatus = status === 'Alfa' || status === 'Izin' || status === 'Sakit';
  const isRevealed = !isAbsentStatus || isHighlighted;

  // Mystery State (Absent student not yet revealed)
  if (!isRevealed) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggleHighlight(day, idx)}
        className="relative p-1 rounded-lg bg-amber-50/10 hover:bg-amber-100/20 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 w-full aspect-square overflow-hidden"
        id={`student-item-${day}-${idx}`}
      >
        {/* Big Mystery Question Mark */}
        <div className="absolute inset-x-0 top-0 bottom-6 sm:bottom-7 md:bottom-10 flex items-center justify-center">
          <span className="text-lg sm:text-xl font-black text-slate-400/80 animate-pulse">❓</span>
        </div>

        {/* Name Plate absolute at bottom */}
        <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
          <div className="relative w-full h-full">
            <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
            <span className="absolute inset-0 flex items-center justify-center font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 uppercase tracking-wider animate-pulse flex items-center gap-0.5 font-display">
              ❓ <span className="font-mono">Klik</span>
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Absent State (Revealed, no character avatar, only nameplate and status badge)
  if (isAbsentStatus) {
    let cardStyle = "bg-white";
    let statusBadgeStyle = "bg-slate-100 text-slate-900 border-slate-350";

    if (status === 'Izin') {
      cardStyle = "bg-sky-50/40 hover:bg-sky-50/60";
      statusBadgeStyle = "bg-[#E0F2FE] text-sky-900 border-sky-400";
    } else if (status === 'Sakit') {
      cardStyle = "bg-amber-50/40 hover:bg-amber-50/60";
      statusBadgeStyle = "bg-[#FEF3C7] text-amber-900 border-amber-400";
    } else if (status === 'Alfa') {
      cardStyle = "bg-rose-50/40 hover:bg-rose-50/60";
      statusBadgeStyle = "bg-[#FEE2E2] text-rose-900 border-rose-400";
    }

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onToggleHighlight(day, idx)}
        className={`relative p-1 rounded-lg flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 w-full aspect-square overflow-hidden ${cardStyle}`}
        id={`student-item-${day}-${idx}`}
      >
        {/* Status Badge - Centered in the upper region */}
        <div className="absolute inset-x-0 top-0 bottom-6 sm:bottom-7 md:bottom-10 flex items-center justify-center shrink-0 scale-95 sm:scale-100">
          <span className={`px-1.5 py-0.5 rounded-lg text-[8px] sm:text-[9px] md:text-[10px] font-black border flex items-center gap-0.5 shadow-[0.5px_0.5px_0px_#000] ${statusBadgeStyle}`}>
            <UserX className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-inherit" />
            {status}
          </span>
        </div>

        {/* Name Plate absolute at bottom */}
        <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
          <div className="relative w-full h-full">
            <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
            <span className="absolute inset-0 flex items-center justify-center font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 truncate px-1.5">
              {student.name}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Hadir State (Always Revealed, shows avatar and nameplate at bottom, no status badge)
  let cardStyle = "bg-white hover:bg-emerald-50/50 text-slate-900";
  if (isHighlighted) {
    cardStyle = "bg-slate-100 opacity-60 text-slate-400";
  }

  const { bg, pisah } = getStudentAvatar(student.name);

  return (
    <motion.div
      whileHover={{ scale: isHighlighted ? 1 : 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onToggleHighlight(day, idx)}
      className={`relative rounded-lg flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-300 w-full aspect-square overflow-hidden ${cardStyle}`}
      id={`student-item-${day}-${idx}`}
    >
      {/* Avatar Container - takes full size of card */}
      <div className="absolute inset-0 w-full h-full pb-3 flex justify-center items-center">
        <div className="relative w-full h-full">
          <img src={bg} className="absolute inset-0 w-full h-full object-contain" alt="avatar-bg" />
          <img src={pisah} className="absolute inset-0 w-full h-full object-contain" alt="avatar-face" />
        </div>
      </div>

      {/* Name Plate absolute at bottom */}
      <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
        <div className="relative w-full h-full">
          <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
          <span className={`absolute inset-0 flex items-center justify-center font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 truncate px-1.5 ${isHighlighted ? 'line-through text-slate-500' : ''}`}>
            {student.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
