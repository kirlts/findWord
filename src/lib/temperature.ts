export const getTemperatureEmoji = (percentage: number): string => {
  if (percentage < 10) return ['🕳️', '🌌', '🌑', '🕋', '⚓', '🪨', '⛓️‍💥'][Math.floor(Math.random() * 7)];
  if (percentage < 20) return ['🧊', '❄️', '🏔️', '💧', '🩵', '💦', '🫧'][Math.floor(Math.random() * 7)];
  if (percentage < 30) return ['🌊', '🪼', '🐋', '🦈', '🐚', '🛶', '🌧️'][Math.floor(Math.random() * 7)];
  if (percentage < 40) return ['🌱', '🪴', '🌿', '🍀', '🌾', '🍄‍🟫', '🌵', '🪵'][Math.floor(Math.random() * 8)];
  if (percentage < 50) return ['🍃', '🎐', '🪽', '🪭', '🪁', '🚁', '🧭', '💨'][Math.floor(Math.random() * 8)];
  if (percentage < 60) return ['☀️', '🌤️', '🌻', '🍋‍🟩', '🍯', '💡', '🕯️'][Math.floor(Math.random() * 7)];
  if (percentage < 70) return ['⚡', '🌩️', '🔌', '🔋', '🪄', '✨', '🌟', '💥'][Math.floor(Math.random() * 8)];
  if (percentage < 80) return ['🔥', '♨️', '🌶️', '🌋', '🧨', '🧯', '🚗', '🌡️'][Math.floor(Math.random() * 8)];
  if (percentage < 90) return ['🩸', '🌹', '🍷', '🍎', '🎸', '🧲', '🥊', '🚨'][Math.floor(Math.random() * 8)];
  if (percentage < 100) return ['🚀', '☄️', '🐦‍🔥', '🐉', '☢️', '🎯', '🥇'][Math.floor(Math.random() * 7)];
  return '💎';
};

export const getTemperatureColor = (percentage: number): string => {
    if (percentage < 10) return 'bg-gray-900/50 text-gray-300';
    if (percentage < 20) return 'bg-blue-900/50 text-blue-200';
    if (percentage < 30) return 'bg-cyan-800/50 text-cyan-200';
    if (percentage < 40) return 'bg-green-800/50 text-green-200';
    if (percentage < 50) return 'bg-emerald-600/50 text-emerald-100';
    if (percentage < 60) return 'bg-yellow-600/50 text-yellow-100';
    if (percentage < 70) return 'bg-amber-500/50 text-amber-50';
    if (percentage < 80) return 'bg-orange-600/50 text-orange-100';
    if (percentage < 90) return 'bg-red-700/50 text-red-100';
    if (percentage < 100) return 'bg-fuchsia-600/50 text-fuchsia-100';
    return 'bg-white/20 text-white border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.5)]';
}