import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaFire,
  FaBolt,
  FaSkull,
  FaCode,
  FaPaperPlane,
  FaQuestionCircle,
} from "react-icons/fa";
import DevilDialogue from "./gauntlet/components/DevilDialogue";
import AnswerZone from "./gauntlet/components/AnswerZone";
import QuestionTimer from "./gauntlet/components/QuestionTimer";
import { useAuth } from "../context/AuthContext";

const DuelGauntletPage = () => {
  const { duelId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Timer duration calculator function
  const getTimerDuration = (difficulty, questionType) => {
    const timers = {
      easy: {
        mcq: 30, // 30 seconds
        integer: 45, // 45 seconds
        code: 60, // 1 minute
      },
      medium: {
        mcq: 45, // 45 seconds
        integer: 60, // 1 minute
        code: 180, // 3 minutes
      },
      hard: {
        mcq: 180, // 3 minutes
        integer: 300, // 5 minutes
        code: 600, // 10 minutes
      },
    };

    return timers[difficulty]?.[questionType] || 30; // Default 30 seconds
  };

  const [duel, setDuel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState({
    text: "Welcome to the duel! Good luck.",
  });

  useEffect(() => {
    const fetchDuel = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await api.get(`/api/duels/${duelId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDuel(data.duel);
        setQuestions(data.duel.questions);
        setQuestionStartTime(Date.now()); // Start timer for first question
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error(
            "You are not authorized to access this duel. Only participants can view it."
          );
          navigate("/friends");
        } else {
          toast.error("Failed to load duel.");
          navigate("/friends");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDuel();
  }, [duelId, navigate]);

  // Reset answer when question changes and restart timer
  useEffect(() => {
    if (questions.length > 0) {
      setUserAnswer(""); // Clear answer for new question
      setTimerActive(true); // Activate timer
      setQuestionStartTime(Date.now()); // Reset timer start time
      setFeedback({
        text: `Question ${currentQuestionIndex + 1} of ${
          questions.length
        }. Time is ticking...`,
      });
    }
  }, [currentQuestionIndex, questions.length]);

  const handleTimeout = () => {
    if (!questions[currentQuestionIndex] || !timerActive) return;

    setTimerActive(false);
    setFeedback({
      text: "Time's up! Moving to next question...",
    });

    // Auto move to next question on timeout
    setTimeout(() => {
      handleNextQuestion(true); // true indicates timeout
    }, 2000);
  };

  const handleNextQuestion = (isTimeout = false) => {
    setTimerActive(false); // Stop current timer

    if (!isTimeout) {
      // Only check answer if not timeout
      if (
        userAnswer.toString() ===
        questions[currentQuestionIndex].correctAnswer?.toString()
      ) {
        setScore((prev) => prev + 10);
        setFeedback({
          text: "Correct!",
        });
      } else {
        setFeedback({
          text: "Incorrect!",
        });
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 2000);
    } else {
      setTimeout(() => {
        handleSubmitScore();
      }, 2000);
    }
  };

  const handleSubmitScore = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await api.post(
        `/api/duels/submit/${duelId}`,
        { score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Duel complete! Your score has been submitted.");
      navigate("/friends");
    } catch (error) {
      toast.error("Failed to submit score.");
    } finally {
      setLoading(false);
    }
  };

  if (
    loading ||
    !duel ||
    !duel.challenger ||
    !duel.opponent ||
    !currentUser ||
    !Array.isArray(questions) ||
    questions.length === 0
  )
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center text-white text-2xl animate-pulse">
        <div className="text-center">
          <FaSkull className="text-6xl text-red-500 mx-auto mb-4 animate-bounce" />
          <p>
            {loading
              ? "Loading Duel..."
              : "Duel data is missing or invalid. Please try again later or contact support."}
          </p>
        </div>
      </div>
    );

  // Defensive: opponent logic
  let opponent = null;
  if (duel.challenger && duel.opponent && currentUser) {
    opponent =
      duel.challenger._id === currentUser.id ? duel.opponent : duel.challenger;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-orange-900/10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="relative z-10 p-4 sm:p-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaFire className="text-3xl text-red-500 animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Duel vs. {opponent.username}
              </h1>
              <FaBolt className="text-3xl text-yellow-500 animate-pulse" />
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-center gap-6 bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-xl px-6 py-3">
              <div className="flex items-center gap-2">
                <FaQuestionCircle className="text-blue-400" />
                <span className="text-sm text-gray-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="text-sm text-gray-300">Score: {score}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCode className="text-green-400" />
                <span className="text-sm text-gray-300">
                  Subject: {duel.subject}
                </span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Main Game Area */}
        <main className="flex-grow flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
          {/* Devil Dialogue */}
          <div className="w-full mb-8">
            <DevilDialogue feedback={feedback} />
          </div>

          {/* Question Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion?._id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/60 backdrop-blur-md border-2 border-red-500/30 rounded-2xl p-8 shadow-2xl">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {currentQuestionIndex + 1}
                    </div>
                    <div>
                      <span className="text-sm text-gray-400 uppercase tracking-wider">
                        {currentQuestion?.type} • {currentQuestion?.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <FaStar />
                    <span className="text-sm">+10 points</span>
                  </div>
                </div>

                {/* Question Content */}
                <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white mb-8">
                  {currentQuestion?.prompt}
                </h2>

                {/* Answer Zone */}
                <AnswerZone
                  question={currentQuestion}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Question Timer */}
          {currentQuestion && (
            <QuestionTimer
              duration={getTimerDuration(
                currentQuestion.difficulty,
                currentQuestion.type
              )}
              onTimeout={handleTimeout}
              isActive={timerActive && !loading}
              questionId={currentQuestion._id}
              difficulty={currentQuestion.difficulty}
              questionType={currentQuestion.type}
              startTime={questionStartTime}
            />
          )}

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <motion.button
              onClick={() => handleNextQuestion(false)}
              disabled={loading || !userAnswer.toString().trim()}
              className={`
                ${
                  loading || !userAnswer.toString().trim()
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
                }
                text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300
                shadow-lg border-2 border-red-500/50 backdrop-blur-sm
                flex items-center gap-3 mx-auto
              `}
              whileHover={
                !loading && userAnswer.toString().trim() ? { scale: 1.05 } : {}
              }
              whileTap={
                !loading && userAnswer.toString().trim() ? { scale: 0.95 } : {}
              }
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Duel"}
                </>
              )}
            </motion.button>
          </div>
        </main>
      </div>
    </div>
  );
};
export default DuelGauntletPage;
