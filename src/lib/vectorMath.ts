export const anchorVectors = [
    { word: 'Luz', emoji: '💡' },
    { word: 'Calor', emoji: '🔥' },
    { word: 'Agua', emoji: '💧' },
    { word: 'Naturaleza', emoji: '🌿' },
    { word: 'Tecnología', emoji: '⚙️' },
    { word: 'Intelecto Humano', emoji: '🧠' },
    { word: 'Emoción', emoji: '❤️' },
    { word: 'Tiempo', emoji: '⏳' },
    { word: 'Espacio', emoji: '🌌' },
    { word: 'Movimiento', emoji: '💨' },
    { word: 'Materia', emoji: '🪨' },
    { word: 'Vida', emoji: '🌱' },
    { word: 'Muerte', emoji: '💀' },
    { word: 'Sonido', emoji: '🔊' },
    { word: 'Silencio', emoji: '🔇' },
];

export const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const calculateMissingIngredient = async (targetVector: number[], guessVector: number[], getEmbedding: (word: string) => Promise<{data: number[]}>) => {
    const directionVector = targetVector.map((val, i) => val - guessVector[i]);

    let norm = 0;
    for (let i=0; i<directionVector.length; i++) {
        norm += directionVector[i] * directionVector[i];
    }
    norm = Math.sqrt(norm);
    const normalizedDirection = directionVector.map(val => val / norm);

    let bestMatch = anchorVectors[0];
    let maxSimilarity = -Infinity;

    for (const anchor of anchorVectors) {
        try {
            const result = await getEmbedding(anchor.word);
            const sim = cosineSimilarity(normalizedDirection, result.data);
            if (sim > maxSimilarity) {
                maxSimilarity = sim;
                bestMatch = anchor;
            }
        } catch (e) {
            console.error("Error getting anchor embedding", e);
        }
    }

    return `${bestMatch.emoji} ${bestMatch.word}`;
};