import { timer } from '../utils';
import { downloadPastWords } from './download-past-words';
import { loadWordsFromFile } from './load-words-from-file';

type GetWordsFn = () => Promise<{
  allPossibleWords: string[];
  pastWords: string[];
  wordsContainingLetter: Map<string, Set<string>>;
  wordsStartingWithLetter: Map<string, Set<string>>;
}>;

export const getWords: GetWordsFn = async () => {
  console.log(`
===================
 Initialising data
===================
`);

  const { pastWordsFromFile, possibleWords } = await loadWordsFromFile();

  // Try to download the past words
  timer.start('Download past words');
  let pastWordsToUse = pastWordsFromFile;
  try {
    pastWordsToUse = await downloadPastWords();
    timer.succeed();
  } catch {
    timer.fail();
  }

  // Find how many past words are NOT in the possible words
  timer.start('Check for missing words');
  const fiveLetterWordsSet = new Set(possibleWords);
  const missingWords = new Set<string>();
  for (const nextWord of pastWordsToUse) {
    if (!fiveLetterWordsSet.has(nextWord)) {
      missingWords.add(nextWord);
    }
  }

  timer.succeed();

  // If there are any historical words NOT in the possibles, then throw an error
  if (missingWords.size > 0) {
    throw new Error(`There are ${missingWords.size} historical words missing from the possible words`);
  }

  // Setup the possible words by letter map
  timer.start('Group possible words');
  const possibleWordsByStartingLetter = new Map<string, Set<string>>();
  const possibleWordsByContainedLetters = new Map<string, Set<string>>();
  for (const nextWord of possibleWords) {
    for (let i = 0; i < 5; i++) {
      const nextLetter = nextWord[i]!;
      if (i === 0) {
        let startingLetterSet = possibleWordsByStartingLetter.get(nextLetter);
        if (!startingLetterSet) {
          startingLetterSet = new Set<string>();
          possibleWordsByStartingLetter.set(nextLetter, startingLetterSet);
        }

        startingLetterSet.add(nextWord);
      }

      let containedLettersSet = possibleWordsByContainedLetters.get(nextLetter);
      if (!containedLettersSet) {
        containedLettersSet = new Set<string>();
        possibleWordsByContainedLetters.set(nextLetter, containedLettersSet);
      }

      containedLettersSet.add(nextWord);
    }
  }

  timer.succeed();

  return {
    allPossibleWords: possibleWords,
    pastWords: pastWordsToUse,
    wordsContainingLetter: possibleWordsByContainedLetters,
    wordsStartingWithLetter: possibleWordsByStartingLetter
  };
};
