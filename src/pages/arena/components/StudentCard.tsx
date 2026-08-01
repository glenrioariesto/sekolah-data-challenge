import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserX } from 'lucide-react';
import { StudentRecord } from '@/src/types';
import { playSynthesizerNote } from '@/src/utils/audio';

import bgCewe from '@/assets/background-cewe.svg';
import bgCowo from '@/assets/background-cowo.svg';
import papanNama from '@/assets/papan-nama.svg';

// Import Cewe Avatar Assets (1 - 18)
import cewe1 from '@/assets/cewe-1-v2.svg';
import cewe2 from '@/assets/cewe-2-v2.svg';
import cewe3 from '@/assets/cewe-3-v2.svg';
import cewe4 from '@/assets/cewe-4-v2.svg';
import cewe5 from '@/assets/cewe-5-v2.svg';
import cewe6 from '@/assets/cewe-6-v2.svg';
import cewe7 from '@/assets/cewe-7-v2.svg';
import cewe8 from '@/assets/cewe-8-v2.svg';
import cewe9 from '@/assets/cewe-9-v2.svg';
import cewe10 from '@/assets/cewe-10-v2.svg';
import cewe11 from '@/assets/cewe-11-v2.svg';
import cewe12 from '@/assets/cewe-12-v2.svg';
import cewe13 from '@/assets/cewe-13-v2.svg';
import cewe14 from '@/assets/cewe-14-v2.svg';
import cewe15 from '@/assets/cewe-15-v2.svg';
import cewe16 from '@/assets/cewe-16-v2.svg';
import cewe17 from '@/assets/cewe-17-v2.svg';
import cewe18 from '@/assets/cewe-18-v2.svg';

// Import Cowok Avatar Assets (1 - 12)
import cowok1 from '@/assets/cowok-1-v2.svg';
import cowok2 from '@/assets/cowok-2-v2.svg';
import cowok3 from '@/assets/cowok-3-v2.svg';
import cowok4 from '@/assets/cowok-4-v2.svg';
import cowok5 from '@/assets/cowok-5-v2.svg';
import cowok6 from '@/assets/cowok-6-v2.svg';
import cowok7 from '@/assets/cowok-7-v2.svg';
import cowok8 from '@/assets/cowok-8-v2.svg';
import cowok9 from '@/assets/cowok-9-v2.svg';
import cowok10 from '@/assets/cowok-10-v2.svg';
import cowok11 from '@/assets/cowok-11-v2.svg';
import cowok12 from '@/assets/cowok-12-v2.svg';

const CEWE_AVATARS = [
  cewe1, cewe2, cewe3, cewe4, cewe5, cewe6, cewe7, cewe8, cewe9,
  cewe10, cewe11, cewe12, cewe13, cewe14, cewe15, cewe16, cewe17, cewe18
];

const COWOK_AVATARS = [
  cowok1, cowok2, cowok3, cowok4, cowok5, cowok6,
  cowok7, cowok8, cowok9, cowok10, cowok11, cowok12
];

const isFemale = (name: string): boolean => {
  const lower = name.toLowerCase();
  const femaleList = ['cici', 'eka', 'fani', 'gita', 'kirana', 'lia', 'nita', 'siti', 'susi', 'ani', 'dewi', 'putri', 'rara', 'tari', 'wulan', 'yuni', 'putu', 'made', 'ketut', 'nyoman', 'naura', 'alesha', 'kayla', 'mikayla', 'lyodra', 'ziva', 'amel', 'endang', 'fitri', 'indah', 'kartika', 'mega', 'novi', 'ratna', 'sari', 'euis', 'lilis'];
  if (femaleList.some(f => lower.includes(f))) return true;
  const males = ['budi', 'andi', 'dodi', 'hari', 'iwan', 'joko', 'maman', 'oki', 'puji', 'rian', 'tono', 'udin', 'yudi', 'zacky', 'adit', 'bambang', 'hendra', 'lukman', 'putra', 'tri', 'asep', 'cecep', 'dadang', 'guruh', 'indra', 'jajang', 'koko', 'mamat'];
  if (males.some(m => lower.includes(m))) return false;
  return lower.endsWith('a') || lower.endsWith('i');
};

// Static 1-to-1 deterministic map for the 16 class student names:
// 100% DISTINCT mapping with ZERO avatar asset collisions!
const ALL_NAMES_GLOBAL_MAP: Record<string, string> = {
  // 10 Female Students (mapped strictly to cewe1 .. cewe10)
  'Cici': cewe1,
  'Eka': cewe2,
  'Fani': cewe3,
  'Gita': cewe4,
  'Kirana': cewe5,
  'Lia': cewe6,
  'Nina': cewe7,
  'Susi': cewe8,
  'Wati': cewe9,
  'Amel': cewe10,

  // 6 Male Students (mapped strictly to cowok1 .. cowok6)
  'Andi': cowok1,
  'Budi': cowok2,
  'Dodi': cowok3,
  'Hari': cowok4,
  'Iwan': cowok5,
  'Joko': cowok6,
};

const getStudentAvatar = (name: string, studentIdxInClass: number = 0) => {
  const isCewe = isFemale(name);
  const bg = isCewe ? bgCewe : bgCowo;

  if (ALL_NAMES_GLOBAL_MAP[name]) {
    return { bg, pisah: ALL_NAMES_GLOBAL_MAP[name] };
  }

  if (isCewe) {
    const avatarIndex = studentIdxInClass % CEWE_AVATARS.length;
    return { bg, pisah: CEWE_AVATARS[avatarIndex] };
  } else {
    const avatarIndex = studentIdxInClass % COWOK_AVATARS.length;
    return { bg, pisah: COWOK_AVATARS[avatarIndex] };
  }
};

const getStudentQuote = (name: string, isCewe: boolean, isHighlighted: boolean): string => {
  if (isHighlighted) {
    const checkedQuotes = [
      "Sudah dihitung! 🙋",
      "Kehadiran tercatat! 📝",
      "Selesai dihitung! ✓",
      "Sudah masuk daftar! 👍",
      "Sip, tercatat! 🎯",
      "Selesai! ✏️"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
    return checkedQuotes[hash % checkedQuotes.length];
  } else {
    const maleQuotes = [
      "Hadir! 🙋‍♂️",
      "Saya masuk hari ini! 🙋‍♂️",
      "Siap belajar 🙋‍♂️",
      "Absen aman, Hadir! 🙋‍♂️",
      "Ada dong, hadir! 🙋‍♂️",
      "Hadir, siap grak! 🙋‍♂️",
      "Masuk terus pantang bolos! 🙋‍♂️",
      "Nggak pernah absen! 🙋‍♂️"
    ];
    const femaleQuotes = [
      "Hadir! 🙋‍♀️",
      "Saya masuk hari ini! 🙋‍♀️",
      "Siap belajar! 🙋‍♀️",
      "Absen aman, Hadir! 🙋‍♀️",
      "Ada dong, hadir! 🙋‍♀️",
      "Hadir, siap belajar! 🙋‍♀️",
      "Masuk terus pantang bolos! 🙋‍♀️",
      "Nggak pernah absen! 🙋‍♀️"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
    const quotes = isCewe ? femaleQuotes : maleQuotes;
    return quotes[hash % quotes.length];
  }
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

  const [isHovered, setIsHovered] = useState(false);

  // Generate unique random breathing cycle values per card instance so they don't animate in sync
  const randomDuration = useMemo(() => 2.5 + Math.random() * 1.5, []);
  const randomDelay = useMemo(() => Math.random() * -2, []);

  const isCewe = isFemale(student.name);
  const quote = getStudentQuote(student.name, isCewe, isHighlighted);

  const handleCardClick = () => {
    playSynthesizerNote('btn');
    onToggleHighlight(day, idx);
  };

  // Mystery State (Absent student not yet revealed)
  if (!isRevealed) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative p-1 rounded-lg bg-amber-50/10 hover:bg-amber-100/20 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 w-full aspect-square border border-dashed border-amber-500/20"
        id={`student-item-${day}-${idx}`}
      >
        {/* Big Mystery Question Mark */}
        <div className="absolute inset-x-0 top-0 bottom-6 sm:bottom-7 md:bottom-10 flex items-center justify-center">
          <motion.span 
            animate={isHovered ? { scale: [1, 1.25, 1], rotate: [0, -12, 12, -12, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.45 }}
            className="text-lg sm:text-xl font-black text-slate-400/80 animate-pulse"
          >
            ❓
          </motion.span>
        </div>

        {/* Name Plate absolute at bottom */}
        <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
          <div className="relative w-full h-full">
            <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
            <span className="absolute inset-0 flex items-center justify-center font-sans font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 uppercase tracking-wider animate-pulse flex items-center gap-0.5">
              ❓ <span className="text-[7px] sm:text-[9px] font-sans font-black">Klik</span>
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
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-1 rounded-lg flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 w-full aspect-square border border-black/10 ${cardStyle}`}
        id={`student-item-${day}-${idx}`}
      >
        {/* Status Badge - Centered in the upper region */}
        <div className="absolute inset-x-0 top-0 bottom-6 sm:bottom-7 md:bottom-10 flex items-center justify-center shrink-0 scale-95 sm:scale-100">
          <motion.span 
            animate={isHovered ? { scale: 1.12, rotate: [0, -4, 4, 0] } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className={`px-1.5 py-0.5 rounded-lg text-[8px] sm:text-[9px] md:text-[10px] font-black border flex items-center gap-0.5 shadow-[0.5px_0.5px_0px_#000] font-display uppercase ${statusBadgeStyle}`}
          >
            <UserX className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-inherit" />
            {status}
          </motion.span>
        </div>

        {/* Name Plate absolute at bottom */}
        <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
          <div className="relative w-full h-full">
            <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
            <span className="absolute inset-0 flex items-center justify-center font-sans font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 truncate px-1.5">
              {student.name}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Hadir State (Always Revealed, shows avatar and nameplate at bottom, no status badge)
  let cardStyle = "bg-white hover:bg-emerald-50/50 text-slate-900 border border-slate-200 shadow-sm";
  if (isHighlighted) {
    cardStyle = "bg-slate-100 opacity-60 text-slate-400 border border-slate-300/60";
  }

  const { bg, pisah } = getStudentAvatar(student.name, idx);

  // Framer Motion variants for avatar face layer
  const faceVariants = {
    idle: {
      y: [0, -3.5, 0],
      rotate: [0, 0, 1.2, -1.2, 0, 0, 0, 0], // look around subtle sway
      transition: {
        repeat: Infinity,
        duration: randomDuration,
        ease: "easeInOut" as const,
        delay: randomDelay,
      }
    },
    hover: {
      scale: 1,
      y: -6,
      rotate: 3.5,
      transition: { type: "spring" as const, stiffness: 350, damping: 14 }
    },
    tap: {
      scale: 0.88,
      y: 3,
      transition: { type: "spring" as const, stiffness: 450, damping: 8 }
    }
  };

  // Framer Motion variants for avatar background layer (gentle float for parallax depth effect)
  const bgVariants = {
    idle: {
      y: [0, -1.2, 0],
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: randomDuration * 1.3,
        ease: "easeInOut" as const,
        delay: randomDelay,
      }
    },
    hover: {
      scale: 1,
      y: -2.5,
      transition: { type: "spring" as const, stiffness: 300, damping: 16 }
    },
    tap: {
      scale: 0.94,
      y: 1
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-lg flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-300 w-full aspect-square ${
        isHovered ? 'z-30' : 'z-10'
      } ${cardStyle}`}
      id={`student-item-${day}-${idx}`}
    >
      {/* Cartoon Speech Bubble Dialog */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 8, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.7, y: 8, x: "-50%" }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className="absolute top-[-16px] sm:top-[-23px] left-1/2 z-40 bg-white border-2 border-black px-1.5 py-0.5 rounded-md sm:rounded-lg shadow-[1.5px_2px_0px_#000] text-[7px] sm:text-[9px] md:text-[10px] font-black text-slate-800 flex items-center justify-center whitespace-nowrap leading-none font-sans font-black"
          >
            <span>{quote}</span>
            {/* Triangular arrow below speech bubble */}
            <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white border-r-2 border-b-2 border-black rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Container - takes full size of card. Uses inner overflow-hidden to clip character layers inside the card shape while permitting the speech bubble to overflow above */}
      <div className="absolute inset-0 w-full h-full pb-3 flex justify-center items-center overflow-hidden rounded-lg">
        <div className="relative w-full h-full">
          <motion.img 
            src={bg} 
            variants={bgVariants}
            animate={isHovered ? "hover" : "idle"}
            className="absolute inset-0 w-full h-full object-contain" 
            alt="avatar-bg" 
          />
          <motion.img 
            src={pisah} 
            variants={faceVariants}
            animate={isHovered ? "hover" : "idle"}
            className="absolute inset-0 w-full h-full object-contain" 
            alt="avatar-face" 
          />
        </div>
      </div>

      {/* Name Plate absolute at bottom */}
      <div className="absolute bottom-1 left-1 right-1 h-6 sm:h-7 md:h-10 flex items-center justify-center z-10">
        <div className="relative w-full h-full">
          <img src={papanNama} className="w-full h-full object-contain" alt="Papan Nama" />
          <span className={`absolute inset-0 flex items-center justify-center font-sans font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 truncate px-1.5 ${isHighlighted ? 'line-through text-slate-500 font-bold' : ''}`}>
            {student.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
