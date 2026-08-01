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
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Custom SVG Tagname with dynamic gender fill color: #f2cf5c for male, #57ade6 for female */}
          <svg viewBox="0 0 296.92 95.79" className="w-full h-full object-contain">
            <rect fill={isCewe ? "#57ade6" : "#f2cf5c"} x="0" y="0" width="296.92" height="95.79" rx="47.89" ry="47.89"/>
            <path fill="#fff" d="M246.38,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM233.98,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM221.59,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM209.19,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM196.79,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM184.39,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM171.99,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM159.59,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM147.19,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM134.79,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM122.39,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM109.99,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM97.59,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM85.19,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM72.79,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM60.39,91.51h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM48,91.51h-.1c-2.21,0-4.43-.17-6.6-.5-.58-.09-.98-.63-.9-1.22.09-.58.63-.98,1.22-.9,2.06.31,4.18.47,6.28.47h.1c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM252.31,91.39c-.55,0-1.02-.43-1.06-.99-.05-.59.39-1.1.98-1.15,2.09-.16,4.19-.48,6.22-.96.57-.13,1.15.22,1.28.8.13.57-.22,1.15-.8,1.28-2.14.5-4.34.84-6.55,1.01-.03,0-.06,0-.08,0ZM35.67,89.73c-.1,0-.21-.01-.31-.05-2.11-.63-4.19-1.44-6.18-2.39-.53-.25-.76-.89-.51-1.42.25-.53.89-.76,1.42-.5,1.9.9,3.87,1.67,5.88,2.27.57.17.89.77.72,1.33-.14.46-.56.76-1.02.76ZM264.36,88.66c-.43,0-.83-.26-1-.68-.21-.55.06-1.17.61-1.38,1.95-.76,3.86-1.67,5.68-2.72.51-.29,1.16-.12,1.46.39.29.51.12,1.16-.39,1.46-1.91,1.1-3.92,2.06-5.97,2.86-.13.05-.26.07-.39.07ZM24.48,84.48c-.2,0-.41-.06-.59-.18-1.84-1.22-3.6-2.58-5.23-4.06-.44-.4-.47-1.07-.08-1.51.4-.44,1.07-.47,1.51-.08,1.56,1.41,3.23,2.71,4.98,3.86.49.33.63.99.3,1.48-.21.31-.55.48-.89.48ZM275.1,82.57c-.32,0-.63-.14-.84-.41-.36-.47-.28-1.14.19-1.5,1.65-1.29,3.23-2.71,4.67-4.23.41-.43,1.08-.45,1.51-.04.43.41.45,1.08.04,1.51-1.52,1.6-3.17,3.1-4.91,4.45-.2.15-.43.22-.66.22ZM15.27,76.25c-.31,0-.61-.13-.82-.38-1.42-1.69-2.71-3.5-3.86-5.38-.31-.5-.15-1.16.36-1.47.51-.31,1.16-.15,1.47.36,1.09,1.79,2.32,3.51,3.67,5.12.38.45.32,1.13-.13,1.51-.2.17-.44.25-.69.25ZM283.66,73.66c-.21,0-.43-.06-.62-.2-.48-.34-.59-1.01-.25-1.49,1.22-1.71,2.32-3.52,3.27-5.39.27-.53.91-.74,1.44-.47.53.27.74.91.47,1.44-1,1.96-2.15,3.87-3.43,5.66-.21.29-.54.45-.87.45ZM8.79,65.74c-.41,0-.81-.24-.98-.65-.87-2.02-1.59-4.13-2.15-6.27-.15-.57.2-1.15.77-1.3.57-.15,1.15.2,1.3.77.53,2.03,1.21,4.03,2.04,5.96.23.54-.02,1.17-.56,1.4-.14.06-.28.09-.42.09ZM289.31,62.67c-.11,0-.23-.02-.35-.06-.56-.19-.86-.8-.67-1.36.68-1.98,1.21-4.03,1.57-6.1.1-.58.66-.97,1.24-.87.58.1.97.66.87,1.24-.39,2.17-.94,4.33-1.65,6.42-.15.44-.57.72-1.01.72ZM5.62,53.8c-.54,0-1-.4-1.06-.95-.19-1.64-.28-3.31-.28-4.96,0-.55.01-1.11.03-1.66.02-.59.5-1.05,1.11-1.03.59.02,1.05.52,1.03,1.11-.02.52-.03,1.05-.03,1.57,0,1.57.09,3.16.27,4.72.07.59-.35,1.12-.94,1.18-.04,0-.08,0-.12,0ZM291.55,50.53s-.03,0-.04,0c-.59-.02-1.05-.52-1.03-1.11.02-.51.03-1.01.03-1.52,0-1.59-.09-3.2-.27-4.77-.07-.59.35-1.12.94-1.18.58-.07,1.12.35,1.18.94.19,1.65.29,3.34.29,5.01,0,.54,0,1.07-.03,1.6-.02.58-.5,1.03-1.07,1.03ZM6.01,41.46c-.06,0-.13,0-.19-.02-.58-.1-.97-.66-.86-1.24.39-2.17.95-4.33,1.66-6.41.19-.56.8-.86,1.36-.66.56.19.86.8.66,1.36-.68,1.98-1.21,4.03-1.58,6.1-.09.52-.54.88-1.05.88ZM290.21,38.25c-.47,0-.91-.32-1.03-.8-.53-2.03-1.22-4.03-2.05-5.95-.23-.54.02-1.17.56-1.4.54-.23,1.17.01,1.4.56.88,2.03,1.6,4.13,2.15,6.26.15.57-.19,1.15-.76,1.3-.09.02-.18.03-.27.03ZM9.93,29.75c-.16,0-.33-.04-.48-.12-.53-.27-.74-.91-.47-1.44,1-1.96,2.16-3.87,3.44-5.66.34-.48,1.01-.59,1.49-.25.48.34.59,1.01.25,1.49-1.22,1.71-2.32,3.52-3.27,5.38-.19.37-.56.58-.95.58ZM285.39,26.88c-.36,0-.71-.18-.91-.51-1.09-1.79-2.33-3.51-3.68-5.11-.38-.45-.32-1.13.13-1.51.45-.38,1.13-.32,1.51.13,1.42,1.69,2.72,3.5,3.86,5.38.31.5.15,1.16-.36,1.47-.17.11-.37.16-.56.16ZM17.07,19.66c-.26,0-.53-.1-.74-.29-.43-.41-.45-1.08-.04-1.51,1.52-1.6,3.17-3.09,4.91-4.44.47-.36,1.14-.28,1.5.19.36.47.28,1.14-.19,1.5-1.66,1.28-3.23,2.71-4.67,4.23-.21.22-.49.33-.77.33ZM277.5,17.37c-.26,0-.51-.09-.72-.28-1.56-1.41-3.23-2.7-4.98-3.86-.49-.32-.63-.99-.3-1.48.33-.49.99-.63,1.48-.3,1.84,1.21,3.6,2.58,5.24,4.05.44.4.47,1.07.08,1.51-.21.23-.5.35-.79.35ZM26.78,12.03c-.37,0-.73-.19-.93-.54-.29-.51-.12-1.17.39-1.46,1.91-1.1,3.92-2.06,5.98-2.85.55-.21,1.17.06,1.38.61.21.55-.06,1.17-.61,1.38-1.95.75-3.86,1.66-5.68,2.71-.17.1-.35.14-.53.14ZM267.23,10.51c-.15,0-.31-.03-.46-.1-1.9-.9-3.88-1.66-5.88-2.26-.57-.17-.89-.76-.72-1.33.17-.57.76-.89,1.33-.72,2.11.63,4.19,1.43,6.19,2.38.53.25.76.89.51,1.42-.18.39-.57.61-.97.61ZM38.27,7.51c-.49,0-.93-.33-1.04-.83-.13-.57.22-1.15.8-1.28,2.14-.5,4.35-.83,6.55-1,.58-.05,1.1.4,1.15.99.04.59-.4,1.1-.99,1.15-2.09.16-4.19.48-6.23.95-.08.02-.16.03-.24.03ZM255.42,6.89c-.05,0-.11,0-.16-.01-2.05-.31-4.15-.47-6.23-.47-.59,0-1.09-.48-1.09-1.07s.45-1.07,1.04-1.07h.05c2.19,0,4.4.17,6.55.49.58.09.99.63.9,1.22-.08.53-.54.91-1.06.91ZM243.04,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM230.65,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM218.25,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM205.85,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM193.45,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM181.05,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM168.65,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM156.25,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM143.85,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM131.45,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM119.05,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM106.65,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM94.25,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM81.85,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM69.45,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07ZM57.05,6.41h-6.47c-.59,0-1.07-.48-1.07-1.07s.48-1.07,1.07-1.07h6.47c.59,0,1.07.48,1.07,1.07s-.48,1.07-1.07,1.07Z"/>
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center font-sans font-black text-[8px] sm:text-[10px] md:text-sm text-slate-800 truncate px-1.5 ${isHighlighted ? 'line-through text-slate-500 font-bold' : ''}`}>
            {student.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
