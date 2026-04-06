import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputFieldProps {
    value: string;
    onChange: (val: string) => void;
    isProcessing: boolean;
    isInvalid?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ value, onChange, isProcessing, isInvalid = false }) => {
    return (
        <div className="relative w-full max-w-md mx-auto">
            <motion.div
                animate={isInvalid ? {
                    x: [0, -10, 10, -10, 10, 0],
                    transition: { duration: 0.4 }
                } : {
                    boxShadow: isProcessing ? '0 0 20px rgba(255,255,255,0.1)' : '0 0 0px rgba(255,255,255,0)'
                }}
                className="rounded-2xl overflow-hidden p-1 relative bg-transparent"
            >
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/5 animate-pulse rounded-2xl pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isInvalid && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-red-500/20 rounded-2xl pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Siente la palabra..."
                    className="w-full bg-transparent text-center text-2xl py-4 font-light tracking-wider text-white placeholder-white/30 focus:outline-none focus:ring-0 border-none outline-none relative z-10"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
            </motion.div>
        </div>
    );
};