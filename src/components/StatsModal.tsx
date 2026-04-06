import React from 'react';
import { motion } from 'framer-motion';
import type { PlayerStats } from '../lib/storage';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: PlayerStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
    if (!isOpen) return null;

    const maxDistribution = Math.max(...Object.values(stats.distribution), 1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass w-full max-w-md p-6 rounded-3xl border border-white/20 shadow-2xl relative"
            >
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <h2 className="text-2xl font-light tracking-wider text-white mb-6">ESTADÍSTICAS</h2>

                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="text-3xl font-light text-white mb-1">{stats.gamesPlayed}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">Jugadas</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="text-3xl font-light text-white mb-1">{stats.winStreak}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">Racha<br/>Actual</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="text-3xl font-light text-white mb-1">{stats.maxStreak}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">Mejor<br/>Racha</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-widest text-center mb-4">Distribución de Pings</h3>
                    {Object.entries(stats.distribution).map(([key, value]) => {
                        const widthPercent = (value / maxDistribution) * 100;
                        return (
                            <div key={key} className="flex items-center gap-3 text-sm">
                                <div className="w-6 text-right font-mono text-white/70">{key}</div>
                                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden relative border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${widthPercent}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-full bg-white/30"
                                    />
                                    {value > 0 && (
                                        <div className="absolute top-0 left-0 h-full px-2 flex items-center justify-end text-xs font-bold text-white" style={{width: `${widthPercent}%`}}>
                                            {value}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};