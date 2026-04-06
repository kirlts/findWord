import { useState, useEffect, useRef } from 'react';
import { useSemanticEngine } from './hooks/useSemanticEngine';
import { useDebounce } from './hooks/useDebounce';
import { Link } from 'react-router-dom';
import { FeedbackCapsule, CompassCapsule } from './components/FeedbackCapsules';
import { InputField } from './components/InputField';
import { TutorialModal } from './components/TutorialModal';
import { StatsModal } from './components/StatsModal';
import { HintSystem } from './components/HintSystem';
import { FallbackShareModal } from './components/FallbackShareModal';
import { getDailyWord, getRandomWord, getDifficultyThreshold, POLISEMICAS, normalizeWord, getWordDomain, getDayIndex } from './lib/gameLogic';
import type { Difficulty } from './lib/gameLogic';
import { sanitizeInput } from './lib/sanitizer';
import { calculateMissingIngredient } from './lib/vectorMath';
import { loadGameState, saveGameState, generateShareText, loadPlayerStats, savePlayerStats } from './lib/storage';
import type { Attempt } from './lib/storage';
import { motion, AnimatePresence } from 'framer-motion';

interface AppProps {
  mode?: 'daily' | 'practice';
}

function App({ mode = 'daily' }: AppProps) {
  const { status, initEngine, getEmbedding, compareWords } = useSemanticEngine();

  const [currentInput, setCurrentInput] = useState('');
  const debouncedInput = useDebounce(currentInput, 100);

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medio');
  const [polisemicWarning, setPolisemicWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [newDayToast, setNewDayToast] = useState(false);

  // Modals state
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFallbackShare, setShowFallbackShare] = useState(false);
  const [shareTextForFallback, setShareTextForFallback] = useState('');

  // Game state references
  const dailyWord = useRef(mode === 'daily' ? getDailyWord() : getRandomWord());
  const todayDateStr = new Date().toISOString().split('T')[0];
  const dayIndex = getDayIndex();

  // Stats
  const playerStats = useRef(loadPlayerStats());

  useEffect(() => {
    if (!playerStats.current.hasSeenTutorial) {
      setShowTutorial(true);
      playerStats.current.hasSeenTutorial = true;
      savePlayerStats(playerStats.current);
    }
  }, []);

  useEffect(() => {
    if (mode === 'practice') {
        // Reset state for practice mode on mount
        setAttempts([]);
        setHasWon(false);
        setDifficulty('Medio');
        dailyWord.current = getRandomWord();
        return;
    }

    const saved = loadGameState();
    if (saved) {
      if (saved.date === todayDateStr) {
        setAttempts(saved.attempts);
        setHasWon(saved.hasWon);
        if (saved.difficulty) setDifficulty(saved.difficulty);
      } else {
        // Transition of day detected! Reset progress, preserve difficulty.
        setNewDayToast(true);
        setTimeout(() => setNewDayToast(false), 5000);
        const prevDiff = saved.difficulty || 'Medio';
        setDifficulty(prevDiff);
        saveGameState({ date: todayDateStr, dayIndex, attempts: [], hasWon: false, difficulty: prevDiff });
      }
    } else {
      saveGameState({ date: todayDateStr, dayIndex, attempts: [], hasWon: false, difficulty: 'Medio' });
    }
  }, [todayDateStr, mode]);


  useEffect(() => {
      if (mode === 'practice') return;
      saveGameState({
          date: todayDateStr,
          dayIndex,
          attempts,
          hasWon,
          difficulty
      });
  }, [attempts, hasWon, difficulty, mode]);

  useEffect(() => {
    const processInput = async () => {
      if (!debouncedInput || hasWon || status !== 'ready') return;

      const sanitized = sanitizeInput(debouncedInput);
      if (!sanitized) {
          setInvalidInput(true);
          setTimeout(() => setInvalidInput(false), 800);
          return;
      }

      if (attempts.find(a => a.word.toLowerCase() === sanitized.toLowerCase())) {
          setInvalidInput(true);
          setTimeout(() => setInvalidInput(false), 800);
          return;
      }

      const normalizedGuess = difficulty === 'Fácil' ? normalizeWord(sanitized) : sanitized.toLowerCase();
      const normalizedTarget = difficulty === 'Fácil' ? normalizeWord(dailyWord.current) : dailyWord.current.toLowerCase();

      setIsProcessing(true);
      setPolisemicWarning(null);

      try {
        const isPolisemic = POLISEMICAS.find(p => p.toLowerCase() === sanitized.toLowerCase());
        if (isPolisemic) {
            setPolisemicWarning(`El término "${isPolisemic}" es ambiguo. Sé más específico.`);
        }

        const { similarity } = await compareWords(dailyWord.current, sanitized);

        let rawPercentage = ((similarity - 0.75) / (1 - 0.75)) * 100;
        if (rawPercentage < 0) rawPercentage = 0;
        if (rawPercentage > 100) rawPercentage = 100;

        const threshold = getDifficultyThreshold(difficulty);

        const isExactMatch = similarity >= threshold || normalizedGuess === normalizedTarget;
        const isGlitch = !isExactMatch && similarity > 0.95;

        let ingredient = "";

        if (isExactMatch) {
            setHasWon(true);
            rawPercentage = 100;

            // Update stats
            if (mode === 'daily') {
                const stats = { ...playerStats.current };
                stats.gamesPlayed += 1;
                stats.winStreak += 1;
                if (stats.winStreak > stats.maxStreak) stats.maxStreak = stats.winStreak;

                // +1 because we are about to push the winning attempt
                const numAttempts = attempts.length + 1;
                let distKey = numAttempts.toString();
                if (numAttempts > 6) distKey = '7+';
                stats.distribution[distKey] = (stats.distribution[distKey] || 0) + 1;

                playerStats.current = stats;
                savePlayerStats(stats);
            }
        } else {
            if (!isGlitch) {
                const targetEmb = await getEmbedding(dailyWord.current);
                const guessEmb = await getEmbedding(sanitized);
                ingredient = await calculateMissingIngredient(targetEmb.data, guessEmb.data, getEmbedding);
            }
        }

        setAttempts(prev => {
            const newAttempts = [{
                word: sanitized,
                similarity: similarity,
                percentage: rawPercentage,
                ingredient: ingredient
            }, ...prev];
            return newAttempts;
        });

        setCurrentInput('');

      } catch (e) {
          console.error(e);
      } finally {
          setIsProcessing(false);
      }
    };

    processInput();
  }, [debouncedInput, status]);

  const handleShare = () => {
      const text = generateShareText({ date: todayDateStr, dayIndex, attempts, hasWon, difficulty });
      try {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      } catch (e) {
          setShareTextForFallback(text);
          setShowFallbackShare(true);
      }
  };

  if (status === 'idle' || status === 'loading') {
      return (
          <div className="flex-1 flex flex-col items-center justify-center text-white space-y-6 min-h-screen relative overflow-hidden">
              <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

              <h1 className="text-3xl font-light tracking-widest text-white/80 z-10">ORÁCULO SEMÁNTICO</h1>

              {status === 'idle' && (
                  <button
                    onClick={initEngine}
                    className="px-6 py-2 rounded-full glass hover:bg-white/10 transition-colors border border-white/20 z-10"
                  >
                      Conectar Motor
                  </button>
              )}
              {status === 'loading' && (
                  <div className="flex flex-col items-center gap-4 z-10">
                    <div className="w-8 h-8 border-2 border-t-white border-white/20 rounded-full animate-spin" />
                    <span className="text-sm font-mono text-white/80 animate-pulse">Preparando el oráculo...</span>
                  </div>
              )}
          </div>
      );
  }

  if (status === 'error') {
      return (
          <div className="flex-1 flex flex-col items-center justify-center text-white space-y-6 min-h-screen relative p-4 text-center">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
              <h1 className="text-3xl font-light tracking-widest text-white/80 z-10">CONEXIÓN FALLIDA</h1>
              <p className="text-white/60 max-w-md z-10">El oráculo necesita reconectarse. Asegúrate de tener conexión o recarga la página para reintentar la sincronización de los modelos.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-full glass bg-red-900/40 hover:bg-red-800/60 transition-colors border border-red-500/30 text-white z-10"
              >
                  Reintentar Conexión
              </button>
          </div>
      );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full relative min-h-screen text-white">
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#0A0A0A]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px]" />
      </div>

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} stats={playerStats.current} />
      <FallbackShareModal isOpen={showFallbackShare} onClose={() => setShowFallbackShare(false)} shareText={shareTextForFallback} />

      <header className="flex justify-between items-center mb-8 mt-4 relative z-10">
          <div className="flex flex-col">
              <h1 className="text-xl font-light tracking-widest text-white/80">
                ORÁCULO SEMÁNTICO {mode === 'practice' && <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded ml-2">PRÁCTICA</span>}
              </h1>
              <div className="flex gap-4 text-xs mt-2 text-white/50 flex-wrap">
                  {mode === 'daily' ? (
                      <Link to="/practice" className="hover:text-white transition-colors underline decoration-white/30">Ir a Práctica Libre</Link>
                  ) : (
                      <Link to="/" className="hover:text-white transition-colors underline decoration-white/30">Volver al Reto Diario</Link>
                  )}
                  {mode === 'daily' && (
                      <button onClick={() => setShowStats(true)} className="hover:text-white transition-colors underline decoration-white/30">Estadísticas</button>
                  )}
              </div>
          </div>

          <div className="flex flex-col items-end gap-2">
              <select
                title="Dificultad"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="bg-transparent border border-white/20 rounded text-sm text-white focus:outline-none focus:border-white/50 max-w-[150px] truncate"
                disabled={hasWon}
              >
                  <option className="bg-black" value="Fácil">Fácil — Acepta similitudes cercanas</option>
                  <option className="bg-black" value="Medio">Medio — Balanceado (Recomendado)</option>
                  <option className="bg-black" value="Difícil">Difícil — Exige palabra exacta</option>
              </select>

              <div className="text-xs text-white/40 tracking-wider">
                  INTENTOS: <span className="text-white/80 font-mono">{attempts.length}</span>
              </div>
          </div>
      </header>

      <main className="flex-1 flex flex-col space-y-6">

          <AnimatePresence>
              {newDayToast && (
                  <motion.div
                    initial={{opacity: 0, y:-20}}
                    animate={{opacity: 1, y:0}}
                    exit={{opacity: 0}}
                    className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600/80 text-white px-4 py-2 rounded-full text-sm z-50 backdrop-blur-md border border-blue-400/50"
                  >
                      ✨ ¡Nuevo reto disponible! Progreso reiniciado.
                  </motion.div>
              )}
          </AnimatePresence>

          <AnimatePresence>
            {!hasWon && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0, height: 0}}>
                    <InputField
                        value={currentInput}
                        onChange={setCurrentInput}
                        isProcessing={isProcessing}
                        isInvalid={invalidInput}
                    />
                    <AnimatePresence>
                        {invalidInput && (
                            <motion.p
                                initial={{opacity:0}}
                                animate={{opacity:1}}
                                exit={{opacity:0}}
                                className="text-center text-red-400/80 text-xs mt-2"
                            >
                                Ingresa una palabra válida
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
              {polisemicWarning && (
                  <motion.div
                    initial={{opacity: 0, y:-10}}
                    animate={{opacity: 1, y:0}}
                    exit={{opacity: 0}}
                    className="text-center text-yellow-500/80 text-sm"
                  >
                      ⚠️ {polisemicWarning}
                  </motion.div>
              )}
          </AnimatePresence>

          {!hasWon && attempts.length > 3 && (
              <HintSystem domain={getWordDomain(dailyWord.current)} disabled={isProcessing} />
          )}

          <div className="flex flex-col gap-2 flex-1 mt-4">
              <AnimatePresence>
                  {attempts.map((attempt, index) => {
                      const isGlitch = !hasWon && attempt.similarity > 0.95 && attempt.percentage < 100;
                      return (
                          <motion.div key={`${attempt.word}-${index}`} layout>
                              <FeedbackCapsule
                                  percentage={attempt.percentage}
                                  word={attempt.word}
                                  isGlitch={isGlitch}
                              />
                              {!isGlitch && attempt.percentage < 100 && index === 0 && attempt.ingredient && (
                                  <CompassCapsule ingredient={attempt.ingredient} />
                              )}
                              {isGlitch && index === 0 && (
                                  <CompassCapsule ingredient="" isGlitch={true} />
                              )}
                          </motion.div>
                      )
                  })}
              </AnimatePresence>
          </div>
      </main>

      <AnimatePresence>
          {hasWon && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 p-6 glass rounded-t-3xl flex flex-col items-center justify-center space-y-4 shadow-[0_-10px_40px_rgba(255,255,255,0.1)] border-t border-white/20"
              >
                  <h2 className="text-3xl font-light text-white">¡Has ganado!</h2>
                  <p className="text-white/70 text-center max-w-sm">Has descubierto la palabra oculta de hoy en {attempts.length} intentos.</p>
                  <button
                    onClick={handleShare}
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                  >
                      {copied ? '¡Copiado al portapapeles!' : 'Compartir progreso (solo emojis)'}
                  </button>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

export default App;