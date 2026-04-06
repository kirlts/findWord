export const DICCIONARIO_CANONICO = [
    'Agua', 'Fuego', 'Viento', 'Montaña', 'Tormenta', 'Océano', 'Desierto', 'Nieve', 'Nube', 'Volcán',
    'Perro', 'Águila', 'Tiburón', 'Hormiga', 'Serpiente', 'Dinosaurio', 'Elefante', 'Araña', 'Oso', 'Caballo',
    'Espejo', 'Reloj', 'Cuchillo', 'Llave', 'Zapato', 'Silla', 'Tijera', 'Cama', 'Vaso', 'Maleta',
    'Miedo', 'Amor', 'Rabia', 'Tristeza', 'Alegría', 'Sorpresa', 'Esperanza', 'Culpa', 'Paz', 'Odio',
    'Computadora', 'Electricidad', 'Telescopio', 'Cohete', 'Rueda', 'Internet', 'Batería', 'Motor', 'Robot', 'Microscopio',
    'Historia', 'Verdad', 'Sueño', 'Futuro', 'Silencio', 'Infinito', 'Memoria', 'Mentira', 'Pasado', 'Destino',
    'Pan', 'Sal', 'Manzana', 'Azúcar', 'Café', 'Queso', 'Huevo', 'Leche', 'Miel', 'Arroz',
    'Ciudad', 'Bosque', 'Isla', 'Puente', 'Laberinto', 'Cueva', 'Castillo', 'Calle', 'Mercado', 'Frontera',
    'Rey', 'Médico', 'Soldado', 'Maestro', 'Ladrón', 'Cazador', 'Juez', 'Héroe', 'Esclavo', 'Sacerdote',
    'Luna', 'Estrella', 'Fantasma', 'Dragón', 'Galaxia', 'Sol', 'Ángel', 'Vampiro', 'Cometa', 'Sirena'
];

export const getDailyWord = (): string => {
    const today = new Date();
    const dateString = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}`;
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % DICCIONARIO_CANONICO.length;
    return DICCIONARIO_CANONICO[index];
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