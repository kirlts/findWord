import React from 'react';
import { motion } from 'framer-motion';

interface FallbackShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareText: string;
}

export const FallbackShareModal: React.FC<FallbackShareModalProps> = ({ isOpen, onClose, shareText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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

                <h2 className="text-xl font-light tracking-wider text-white mb-4">COMPARTIR</h2>
                <p className="text-white/70 text-sm mb-4">Copia el siguiente texto para compartir tu victoria:</p>

                <textarea
                    readOnly
                    value={shareText}
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white/90 font-mono text-sm resize-none focus:outline-none focus:border-white/30"
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
            </motion.div>
        </div>
    );
};