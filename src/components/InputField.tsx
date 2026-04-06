import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputFieldProps {
    value: string;
    onChange: (val: string) => void;
    isProcessing: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ value, onChange, isProcessing }) => {
    return (
        <div className="relative w-full max-w-md mx-auto">
            <motion.div
                animate={{
                    boxShadow: isProcessing ? '0 0 20px rgba(255,255,255,0.1)' : '0 0 0px rgba(255,255,255,0)'
                }}
                className="glass rounded-2xl overflow-hidden p-1 relative"
            >
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/5 animate-pulse"
                        />
                    )}
                </AnimatePresence>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Siente la palabra..."
                    className="w-full bg-transparent text-center text-2xl py-4 font-light tracking-wider text-white placeholder-white/30 focus:outline-none relative z-10"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
            </motion.div>
        </div>
    );
};