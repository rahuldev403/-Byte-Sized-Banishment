import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Typing effect removed as per user request.

// --- SVG Icons (Replaced react-icons) ---
// These are now self-contained SVG components to avoid external dependencies.
const FaVolumeUp = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 16 16"
    height="1em"
    width="1em"
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
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"></path>
  </svg>
);

const DevilDialogue = ({ feedback }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [backendFeedback, setBackendFeedback] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState(true); // NEW
  // displayedText state removed, not needed without typing effect
  const audioRef = useRef(null);

  // Fetch dialogue from backend if not provided
  useEffect(() => {
    if (!feedback) {
      fetch("/api/devil-dialogue")
        .then((res) => res.json())
        .then((data) => setBackendFeedback(data))
        .catch(() => setBackendFeedback(null));
    }
  }, [feedback]);

  // Use backend feedback if no prop
  const activeFeedback = feedback || backendFeedback || {};
  const dialogueText = welcomeMessage
    ? "Welcome to the Gauntlet! Prove your worth by answering these questions, or face eternal shame!"
    : activeFeedback.text || "";

  useEffect(() => {
    if (welcomeMessage || activeFeedback.text) {
      setIsVisible(true);

      if (
        !welcomeMessage &&
        activeFeedback.audioUrl &&
        !isMuted &&
        audioRef.current
      ) {
        audioRef.current.src = activeFeedback.audioUrl;
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play failed", e));
      }

      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
        setWelcomeMessage(false);
      }, 5000);

      return () => clearTimeout(fadeOutTimer);
    } else {
      setIsVisible(false);
    }
  }, [activeFeedback, isMuted, welcomeMessage]);

  return (
    <AnimatePresence>
      {isVisible && (
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
          <div className="w-14 h-14 bg-black/30 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-red-800/50">
            {/* Example: <img src="/path/to/devil.png" alt="The Devil" className="w-full h-full object-cover rounded-full" /> */}
            <span className="text-red-500 text-3xl font-serif italic">?</span>
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
              "{dialogueText}"
            </p>
          </div>

          {/* Mute Button */}
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            className="text-lg text-gray-400 hover:text-orange-400 p-2 rounded-full bg-black/30 hover:bg-red-900/30 border border-red-700/30 hover:border-orange-500/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isMuted ? "Unmute" : "Mute"}
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
