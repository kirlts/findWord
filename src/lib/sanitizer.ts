export const sanitizeInput = (input: string): string | null => {
    if (!input.trim()) return null;
    const noEmojis = input.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    if (!noEmojis.trim()) return null;
    return noEmojis.trim().slice(0, 50).toLowerCase();
};