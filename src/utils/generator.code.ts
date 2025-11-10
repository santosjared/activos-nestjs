export const generateCode =(): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  const randomBlock = () =>
    Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');

  return `${randomBlock()}-${randomBlock()}-${randomBlock()}`;
}