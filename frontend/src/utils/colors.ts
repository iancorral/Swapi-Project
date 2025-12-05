const colors = [
  "#EF4444", // Rojo
  "#F97316", // Naranja
  "#F59E0B", // Ámbar
  "#10B981", // Esmeralda
  "#06B6D4", // Cian
  "#3B82F6", // Azul
  "#6366F1", // Índigo
  "#8B5CF6", // Violeta
  "#EC4899", // Rosa
  "#F43F5E"  // Rosa fuerte
];

export const getAvatarColor = (name: string): string => {
  if (!name) return "#9CA3AF"; 
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};