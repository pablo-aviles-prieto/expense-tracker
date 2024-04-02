export const getRandomItem = <T>(arrayItems: T[]) => {
  if (arrayItems.length === 0) return null;
  const index = Math.floor(Math.random() * arrayItems.length);
  return arrayItems[index];
};
