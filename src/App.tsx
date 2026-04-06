import { useState, useEffect, useRef } from 'react';
import { useSemanticEngine } from './hooks/useSemanticEngine';
import { useDebounce } from './hooks/useDebounce';
import { FeedbackCapsule, CompassCapsule } from './components/FeedbackCapsules';
import { InputField } from './components/InputField';
import { getDailyWord, getDifficultyThreshold, POLISEMICAS } from './lib/gameLogic';
import type { Difficulty } from './lib/gameLogic';
import { sanitizeInput } from './lib/sanitizer';
import { calculateMissingIngredient } from './lib/vectorMath';
import { loadGameState, saveGameState, generateShareText } from './lib/storage';
import type { Attempt } from './lib/storage';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { status, progress, initEngine, getEmbedding, compareWords } = useSemanticEngine();

  const [currentInput, setCurrentInput] = useState('');
  const debouncedInput = useDebounce(currentInput, 100);

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medio');
  const [polisemicWarning, setPolisemicWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const dailyWord = useRef(getDailyWord());
  const todayDateStr = new Date().toLocaleDateString();

  useEffect(() => {
    const saved = loadGameState();
    if (saved && saved.date === todayDateStr) {
      setAttempts(saved.attempts);
      setHasWon(saved.hasWon);
      setDifficulty(saved.difficulty);
    } else if (saved && saved.date !== todayDateStr) {
        saveGameState({ date: todayDateStr, attempts: [], hasWon: false, difficulty: 'Medio' });
    }
  }, [todayDateStr]);


  useEffect(() => {
      saveGameState({
          date: todayDateStr,
          attempts,
          hasWon,
          difficulty
      });
  }, [attempts, hasWon, difficulty]);

  useEffect(() => {
    const processInput = async () => {
      if (!debouncedInput || hasWon || status !== 'ready') return;

      const sanitized = sanitizeInput(debouncedInput);
      if (!sanitized) return;

      if (attempts.find(a => a.word.toLowerCase() === sanitized.toLowerCase())) return;

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

        const isExactMatch = similarity >= threshold;
        const isGlitch = !isExactMatch && similarity > 0.95;

        let ingredient = "";

        if (isExactMatch) {
            setHasWon(true);
            rawPercentage = 100;
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
      const text = generateShareText({ date: todayDateStr, attempts, hasWon, difficulty });
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'idle' || status === 'loading') {
      return (
          <div className="flex-1 flex flex-col items-center justify-center text-white space-y-6 min-h-screen relative overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

              <h1 className="text-3xl font-light tracking-widest text-white/80 z-10">ORÁCULO SEMÁNTICO</h1>

              {status === 'idle' ? (
                  <button
                    onClick={initEngine}
                    className="px-6 py-2 rounded-full glass hover:bg-white/10 transition-colors border border-white/20 z-10"
                  >
                      Conectar Motor
                  </button>
              ) : (
                  <div className="flex flex-col items-center gap-4 z-10">
                    <div className="w-8 h-8 border-2 border-t-white border-white/20 rounded-full animate-spin" />
                    {progress && progress.status !== 'done' && (
                        <span className="text-sm font-mono text-white/50">{progress.file} - {Math.round((progress.progress || 0))} %</span>
                    )}
                  </div>
              )}
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

      <header className="flex justify-between items-center mb-8 mt-8 relative z-10">
          <h1 className="text-xl font-light tracking-widest text-white/80">ORÁCULO SEMÁNTICO</h1>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="bg-transparent border border-white/20 rounded text-sm text-white focus:outline-none focus:border-white/50"
            disabled={hasWon}
          >
              <option className="bg-black" value="Fácil">Dificultad: Fácil</option>
              <option className="bg-black" value="Medio">Dificultad: Medio</option>
              <option className="bg-black" value="Difícil">Dificultad: Difícil</option>
          </select>
      </header>

      <main className="flex-1 flex flex-col space-y-6">

          <AnimatePresence>
            {!hasWon && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0, height: 0}}>
                    <InputField
                        value={currentInput}
                        onChange={setCurrentInput}
                        isProcessing={isProcessing}
                    />
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
                  <h2 className="text-3xl font-light text-white">¡Sintonía Perfecta!</h2>
                  <p className="text-white/70">Has descubierto la palabra en {attempts.length} pings.</p>
                  <button
                    onClick={handleShare}
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                  >
                      {copied ? '¡Copiado!' : 'Compartir Frecuencia'}
                  </button>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

export default App;