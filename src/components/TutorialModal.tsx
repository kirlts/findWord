import React from 'react';
import { motion } from 'framer-motion';

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass w-full max-w-md p-6 rounded-3xl border border-white/20 shadow-2xl relative overflow-y-auto max-h-full"
            >
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <h2 className="text-2xl font-light tracking-wider text-white mb-6">CÓMO JUGAR</h2>

                <div className="space-y-6 text-white/80 text-sm leading-relaxed">
                    <p>
                        El <strong className="text-white">Oráculo Semántico</strong> ha ocultado una palabra secreta diaria.
                        Tu objetivo es descubrirla a través de su significado.
                    </p>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-white">1. Escribe palabras</h3>
                        <p>No hay botón de "Adivinar". Simplemente teclea una palabra y el Oráculo te responderá de inmediato.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-white">2. Lee la Temperatura</h3>
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                            <span className="text-2xl">🔥</span>
                            <p className="flex-1">La <strong className="text-white">cápsula térmica</strong> mide en porcentaje cuán cerca estás del significado objetivo.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-white">3. Sigue la Brújula</h3>
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                            <span className="text-lg">🧭</span>
                            <p className="flex-1">La <strong className="text-white">brújula alquímica</strong> te dirá qué "ingrediente" le falta a tu palabra para llegar a la meta.</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-8 py-3 rounded-xl bg-white text-black font-semibold tracking-wide hover:bg-gray-200 transition-colors"
                >
                    Comenzar Sintonización
                </button>
            </motion.div>
        </div>
    );
};