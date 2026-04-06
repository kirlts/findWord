import React from 'react';
import { motion } from 'framer-motion';
import { getTemperatureColor, getTemperatureEmoji } from '../lib/temperature';

interface FeedbackCapsuleProps {
    percentage: number;
    word: string;
    isGlitch?: boolean;
}

export const FeedbackCapsule: React.FC<FeedbackCapsuleProps> = ({ percentage, word, isGlitch = false }) => {
    const displayPercentage = percentage < 20 ? '< 20%' : `${Math.floor(percentage)}%`;
    const emoji = getTemperatureEmoji(percentage);
    const colorClass = getTemperatureColor(percentage);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className={`flex items-center justify-between p-3 mb-2 rounded-xl border border-white/5 backdrop-blur-md ${colorClass} ${isGlitch ? 'animate-glitch opacity-80' : ''}`}
        >
            <div className="flex items-center gap-3">
                <span className="text-2xl drop-shadow-md">{emoji}</span>
                <span className="font-medium text-lg tracking-wide">{word}</span>
            </div>
            {!isGlitch && (
                <div className="text-sm font-semibold opacity-80 bg-black/20 px-2 py-1 rounded-md">
                    {displayPercentage}
                </div>
            )}
        </motion.div>
    );
}

interface CompassCapsuleProps {
    ingredient: string;
    isGlitch?: boolean;
}

export const CompassCapsule: React.FC<CompassCapsuleProps> = ({ ingredient, isGlitch = false }) => {
    if (isGlitch) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center p-2 mb-4 rounded-lg bg-red-900/40 border border-red-500/30 text-red-200 animate-glitch"
            >
                <span className="font-mono text-sm tracking-widest">[🫨 Interferencia Electromagnética]</span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 p-2 mb-4 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm"
        >
            <span>🧭 Te falta el ingrediente:</span>
            <span className="font-semibold text-white">[{ingredient}]</span>
        </motion.div>
    );
}