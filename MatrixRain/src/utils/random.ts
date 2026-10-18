// Funções pequenas para centralizar as escolhas aleatórias da animação.
const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*+-<>[]{}';

export const COLORS = ['#20ff70', '#00d95f', '#80ffb0', '#b7ffd0', '#21c7a8', '#a0ff18'];
export const FONT_FAMILIES = ['monospace', 'sans-serif', 'serif'];

export function randomCharacter(): string {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

export function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function randomFont(): string {
  // São famílias genéricas normalmente disponíveis no Android; não simulamos fontes inexistentes.
  return FONT_FAMILIES[Math.floor(Math.random() * FONT_FAMILIES.length)];
}

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}