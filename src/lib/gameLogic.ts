export const DICCIONARIO_CANONICO_DOMINIOS: Record<string, string[]> = {
    'Naturaleza y Clima': ['Agua', 'Fuego', 'Viento', 'Montaña', 'Tormenta', 'Océano', 'Desierto', 'Nieve', 'Nube', 'Volcán'],
    'Fauna y Biología': ['Perro', 'Águila', 'Tiburón', 'Hormiga', 'Serpiente', 'Dinosaurio', 'Elefante', 'Araña', 'Oso', 'Caballo'],
    'Objetos Cotidianos y Herramientas': ['Espejo', 'Reloj', 'Cuchillo', 'Llave', 'Zapato', 'Silla', 'Tijera', 'Cama', 'Vaso', 'Maleta'],
    'Emociones y Sentimientos': ['Miedo', 'Amor', 'Rabia', 'Tristeza', 'Alegría', 'Sorpresa', 'Esperanza', 'Culpa', 'Paz', 'Odio'],
    'Tecnología y Ciencia': ['Computadora', 'Electricidad', 'Telescopio', 'Cohete', 'Rueda', 'Internet', 'Batería', 'Motor', 'Robot', 'Microscopio'],
    'Conceptos Abstractos y Tiempo': ['Historia', 'Verdad', 'Sueño', 'Futuro', 'Silencio', 'Infinito', 'Memoria', 'Mentira', 'Pasado', 'Destino'],
    'Alimentos y Sabores': ['Pan', 'Sal', 'Manzana', 'Azúcar', 'Café', 'Queso', 'Huevo', 'Leche', 'Miel', 'Arroz'],
    'Espacios y Geografía': ['Ciudad', 'Bosque', 'Isla', 'Puente', 'Laberinto', 'Cueva', 'Castillo', 'Calle', 'Mercado', 'Frontera'],
    'Profesiones y Roles Humanos': ['Rey', 'Médico', 'Soldado', 'Maestro', 'Ladrón', 'Cazador', 'Juez', 'Héroe', 'Esclavo', 'Sacerdote'],
    'Astronomía y Mitología': ['Luna', 'Estrella', 'Fantasma', 'Dragón', 'Galaxia', 'Sol', 'Ángel', 'Vampiro', 'Cometa', 'Sirena']
};

export const DICCIONARIO_CANONICO = Object.values(DICCIONARIO_CANONICO_DOMINIOS).flat();

export const getWordDomain = (word: string): string | null => {
    for (const [domain, words] of Object.entries(DICCIONARIO_CANONICO_DOMINIOS)) {
        if (words.includes(word)) {
            return domain;
        }
    }
    return null;
};

// Fixed epoch to calculate day index #NNN reliably
const EPOCH_START = new Date('2024-01-01T00:00:00Z');

export const getDayIndex = (date: Date = new Date()): number => {
    // Ensure we calculate based on UTC days since epoch
    const epochMs = EPOCH_START.getTime();
    const currentMs = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const diffMs = currentMs - epochMs;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 1-indexed (Day 1)
};

export const getDailyWord = (): string => {
    const index = getDayIndex();
    // Using the day index as part of the seed ensures consistency
    const seedString = `oraculo-${index}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
        hash = hash & hash;
    }
    const wordIndex = Math.abs(hash) % DICCIONARIO_CANONICO.length;
    return DICCIONARIO_CANONICO[wordIndex];
};

export const getRandomWord = (): string => {
    const randomIndex = Math.floor(Math.random() * DICCIONARIO_CANONICO.length);
    return DICCIONARIO_CANONICO[randomIndex];
};

export type Difficulty = 'Fácil' | 'Medio' | 'Difícil';

export const getDifficultyThreshold = (diff: Difficulty): number => {
    switch (diff) {
        case 'Fácil': return 0.90;
        case 'Medio': return 0.95;
        case 'Difícil': return 0.99;
    }
};

export const POLISEMICAS = ['Banco', 'Vela', 'Planta', 'Carta', 'Mango', 'Bota', 'Copa', 'Lima', 'Muñeca', 'Radio', 'Sirena'];

export const normalizeWord = (word: string): string => {
    let normalized = word.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents

    // Very basic stemming/lemmatization for common Spanish suffixes (for "Fácil" difficulty)
    // Strip common plural 's' or 'es'
    if (normalized.endsWith('es') && normalized.length > 4) {
        normalized = normalized.slice(0, -2);
    } else if (normalized.endsWith('s') && normalized.length > 3) {
        normalized = normalized.slice(0, -1);
    }

    // Strip common gender markers 'a' or 'o' to hit the root
    if ((normalized.endsWith('a') || normalized.endsWith('o')) && normalized.length > 3) {
        normalized = normalized.slice(0, -1);
    }

    return normalized;
};