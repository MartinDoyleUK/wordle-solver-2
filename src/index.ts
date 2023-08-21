import { downloadPastWords } from './download-past-words.js';
import { loadWordsFromFile } from './load-words-from-file.js';
import { testGuess } from './test-guess.js';


const run = async () => {
  const { pastWordsFromFile, possibleWords } = await loadWordsFromFile();

  // Try to download the past words
  let pastWordsToUse = pastWordsFromFile;
  const before = performance.now();
  try {
    pastWordsToUse = await downloadPastWords();
    const timeTakenToDownloadMs = Math.round(performance.now() - before);
    console.log(`Took ${timeTakenToDownloadMs}ms to download past words`);
  } catch {
    console.warn('Unable to download words. Using cached words as backup');
  }


  // Find how many past words are NOT in the possible words
  const fiveLetterWordsSet = new Set(possibleWords);
  const missingWords = new Set<string>();
  for (const nextWord of pastWordsToUse) {
    if (!fiveLetterWordsSet.has(nextWord)) {
      missingWords.add(nextWord);
    }
  }

  // Debug info
  // console.log(`There are ${possibleWords.length} possible five-letter words`);
  // console.log(`There are ${pastWordsToUse.length} historical Wordle words`);
  // console.log(`There are ${missingWords.size} historical words missing from the possible words`);
  // There are 12972 possible five-letter words
  // There are 791 historical Wordle words
  // There are 0 historical words missing from the possible words

  const firstGuess = 'sooty';
  const targetWord = 'those';
  const firstGuessResult = testGuess(firstGuess, targetWord);

  console.log('firstGuessResult', firstGuessResult);
};

run().catch(error => console.error(error));
