import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import devil from "../../../assets/logo.png";
const getRandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const GAUNTLET_START_DIALOGUES = [
  {
    text: "Let's see if you have what it takes, mortal.",
    audioUrl:
      "https://devils-gauntlet-audio-12345.s3.eu-north-1.amazonaws.com/Let's+see+if+you+have+what+it+takes%2C+mortal.mp3",
  },
  {
    text: "Your trial begins now. Try not to disappoint me.",
    audioUrl:
      "https://devils-gauntlet-audio-12345.s3.eu-north-1.amazonaws.com/Your+trial+begins+now.+Try+not+to+disappoint+me.mp3",
  },
  {
    text: "Another soul dares to challenge me? Amusing.",
    audioUrl:
      "https://devils-gauntlet-audio-12345.s3.eu-north-1.amazonaws.com/ElevenLabs_2025-08-26T04_45_08_Mordred+-+Evil+Villain+B%C3%B6sewicht_pvc_sp100_s50_sb75_se0_b_m2.mp3",
  },
];

const FaVolumeUp = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 16 16"
    height="1.3em"
    width="1.3em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"></path>
    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.482 5.482 0 0 1 11.025 8a5.482 5.482 0 0 1-1.61 3.89l.706.706z"></path>
    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"></path>
  </svg>
);
const FaVolumeMute = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 16 16"
    height="1.3em"
    width="1.3em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"></path>
  </svg>
);

const DevilDialogue = ({ feedback }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [isMuted, setIsMuted] = useState(() => {
    // Persist mute state in localStorage
    const stored = localStorage.getItem("devil-audio-muted");
    return stored === "true";
  });
  const audioRef = useRef(null);

  // Show GAUNTLET_START dialogue on mount
  useEffect(() => {
    const startDialogue = getRandomFromArray(GAUNTLET_START_DIALOGUES);
    setCurrentDialogue(startDialogue);
    setIsVisible(true);
  }, []);

  // When feedback changes, show and play new dialogue immediately
  useEffect(() => {
    if (feedback && feedback.text) {
      setCurrentDialogue(feedback);
      setIsVisible(true);
    }
  }, [feedback]);

  // Play or pause audio every time currentDialogue or isMuted changes
  useEffect(() => {
    if (currentDialogue && currentDialogue.audioUrl && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = currentDialogue.audioUrl;
      if (!isMuted) {
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play failed", e));
      }
    }
    if (isMuted && audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentDialogue, isMuted]);

  // Persist mute state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("devil-audio-muted", isMuted ? "true" : "false");
  }, [isMuted]);

  // Hide dialogue after 5s
  useEffect(() => {
    if (isVisible) {
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isVisible, currentDialogue]);

  return (
    <AnimatePresence>
      {isVisible && currentDialogue && (
        <motion.div
          className="fixed top-40 right-6 z-50 max-w-xs w-[90vw] sm:w-96 bg-gradient-to-br from-black/50 to-red-900/50 border-2 border-red-500/60 rounded-2xl shadow-2xl p-4 flex flex-row-reverse items-start gap-4"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100, transition: { duration: 0.5 } }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          style={{
            boxShadow: "0 0 35px rgba(220, 38, 38, 0.5)",
            pointerEvents: "auto",
          }}
        >
          {/* --- DEVIL IMAGE PLACEHOLDER --- */}
          <div className="w-14 h-14 bg-black/30 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-red-800/50 overflow-hidden">
            <img
              src={devil}
              alt="The Devil Logo"
              className="w-full h-full object-contain"
              draggable="false"
            />
          </div>

          <div className="flex-1">
            <div
              className="text-xs text-orange-400 font-bold mb-1 tracking-wider"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              THE DEVIL SPEAKS:
            </div>
            <p
              className="text-base italic text-red-200 leading-relaxed"
              style={{
                fontFamily: "'Rajdhani', 'Exo 2', sans-serif",
                textShadow: "0 0 8px rgba(248, 113, 113, 0.4)",
              }}
            >
              "{currentDialogue.text}"
            </p>
          </div>

          {/* Mute/Unmute Button */}
          <motion.button
            onClick={() => setIsMuted((m) => !m)}
            className="text-lg text-gray-400 hover:text-orange-400 p-2 rounded-full bg-black/30 hover:bg-red-900/30 border border-red-700/30 hover:border-orange-500/50 transition-all ml-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isMuted ? "Unmute Devil" : "Mute Devil"}
            style={{ alignSelf: "flex-start" }}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </motion.button>

          <audio ref={audioRef} hidden />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DevilDialogue;
