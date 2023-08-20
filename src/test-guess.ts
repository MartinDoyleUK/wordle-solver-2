type LetterGuess = false | true | undefined;

type WordGuess = [LetterGuess, LetterGuess, LetterGuess, LetterGuess, LetterGuess];

export const testGuess = (guess: string, target: string): WordGuess => {
  const result: WordGuess = [undefined, undefined, undefined, undefined, undefined];

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
      // eslint-disable-next-line no-self-compare
    } else if (targetLetterCounts.get(nextLetter) ?? 0 > 0) {
      result[i] = false;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      targetLetterCounts.set(nextLetter, targetLetterCounts.get(nextLetter)! - 1);
    }
  }

  return result;
};
