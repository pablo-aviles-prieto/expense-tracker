export const guessCSVDelimiter = (firstLine: string) => {
  const delimiters = [",", ";", "|", "\t"];
  let maxSplits = 0;
  let guessedDelimiter = ","; // Fallback to comma

  delimiters.forEach((delimiter) => {
    const splits = firstLine.split(delimiter).length;
    if (splits > maxSplits) {
      maxSplits = splits;
      guessedDelimiter = delimiter;
    }
  });

  return guessedDelimiter;
};
