type WordGuess = [LetterGuess, LetterGuess, LetterGuess, LetterGuess, LetterGuess] | undefined;
type LetterGuess = boolean | undefined;

export const testGuess = (guess: string, target: string): WordGuess => {
  const result: WordGuess = [undefined, undefined, undefined, undefined, undefined];
  let guessLettersPresent = 0;

  const targetLetterCounts = new Map<string, number>();
  for (const letter of target) {
    const count = targetLetterCounts.get(letter) ?? 0;
    targetLetterCounts.set(letter, count + 1);
  }

  for (let i = 0; i < 5; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nextLetter = guess[i]!;
    if (nextLetter === target[i]) {
      result[i] = true;
      guessLettersPresent++;
      // eslint-disable-next-line no-self-compare
    } else if (targetLetterCounts.get(nextLetter) ?? 0 > 0) {
      result[i] = false;
      guessLettersPresent++;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      targetLetterCounts.set(nextLetter, targetLetterCounts.get(nextLetter)! - 1);
    }
  }

  if (guessLettersPresent === 0) {
    return undefined;
  }

  return result;
};
