import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HintSystemProps {
    domain: string | null;
    disabled: boolean;
}

export const HintSystem: React.FC<HintSystemProps> = ({ domain, disabled }) => {
    const [hintRevealed, setHintRevealed] = useState(false);

    if (!domain) return null;

    return (
        <div className="flex flex-col items-center mt-6">
            <AnimatePresence mode="wait">
                {!hintRevealed ? (
                    <motion.button
                        key="hint-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        onClick={() => setHintRevealed(true)}
                        disabled={disabled}
                        className={`text-sm tracking-widest uppercase px-6 py-2 rounded-full border border-white/20 transition-colors ${
                            disabled
                            ? 'opacity-50 cursor-not-allowed text-white/50'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        Solicitar Pista
                    </motion.button>
                ) : (
                    <motion.div
                        key="hint-text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass px-6 py-3 rounded-xl border border-blue-500/30 bg-blue-900/20 text-center"
                    >
                        <span className="text-xs text-blue-200/60 uppercase tracking-widest block mb-1">Dominio Revelado</span>
                        <span className="text-sm font-medium text-blue-100">{domain}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};