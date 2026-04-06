export interface Attempt {
    word: string;
    similarity: number;
    percentage: number;
    ingredient: string;
}

export interface GameState {
    date: string;
    attempts: Attempt[];
    hasWon: boolean;
    difficulty: 'Fácil' | 'Medio' | 'Difícil';
}

const STORAGE_KEY = 'oraculo_semantico_state';

export const loadGameState = (): GameState | null => {
    try {
        const item = localStorage.getItem(STORAGE_KEY);
        if (item) {
            return JSON.parse(item);
        }
    } catch (error) {
        console.error("Error loading game state", error);
    }
    return null;
};

export const saveGameState = (state: GameState) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Error saving game state", error);
    }
};

export const generateShareText = (state: GameState): string => {
    const attemptsCount = state.attempts.length;

    const recentEmojis = state.attempts
        .slice(-10)
        .map(a => {
            const p = a.percentage;
            if (p < 10) return '🕳️';
            if (p < 20) return '🧊';
            if (p < 30) return '🌊';
            if (p < 40) return '🌱';
            if (p < 50) return '🍃';
            if (p < 60) return '☀️';
            if (p < 70) return '⚡';
            if (p < 80) return '🔥';
            if (p < 90) return '🩸';
            if (p < 100) return '🚀';
            return '💎';
        }).join(' ');

    const dateStr = state.date;

    return `🌟 Oráculo Semántico ${dateStr}\nEncontré el centro en ${attemptsCount} Pings.\n${recentEmojis}\n--- Sigue la brújula.`;
};