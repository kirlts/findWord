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
    dayIndex?: number;
}

export interface PlayerStats {
    gamesPlayed: number;
    winStreak: number;
    maxStreak: number;
    distribution: Record<string, number>;
    hasSeenTutorial: boolean;
}

const STORAGE_KEY = 'oraculo_semantico_state';
const STATS_KEY = 'oraculo_semantico_stats';

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

export const loadPlayerStats = (): PlayerStats => {
    const defaultStats: PlayerStats = {
        gamesPlayed: 0,
        winStreak: 0,
        maxStreak: 0,
        distribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, '7+': 0
        },
        hasSeenTutorial: false
    };

    try {
        const item = localStorage.getItem(STATS_KEY);
        if (item) {
            return { ...defaultStats, ...JSON.parse(item) };
        }
    } catch (error) {
        console.error("Error loading player stats", error);
    }
    return defaultStats;
};

export const savePlayerStats = (stats: PlayerStats) => {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error("Error saving player stats", error);
    }
};

export const generateShareText = (state: GameState): string => {
    const attemptsCount = state.attempts.length;

    // We slice the most recent 10, but we need to reverse them back
    // so chronological order is maintained (oldest to newest)
    const recentAttempts = [...state.attempts].slice(0, 10).reverse();

    const recentEmojis = recentAttempts
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

    const challengeId = state.dayIndex ? `#${state.dayIndex}` : state.date;

    return `🌟 Oráculo Semántico ${challengeId}\nEncontré el centro en ${attemptsCount} Pings.\n${recentEmojis}\n--- Sigue la brújula.`;
};