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

  // What do you want to achieve? I want to know the best starting words.
  // What are the best starting words? The ones that will most reduce the number of possible words, when compared to the target word.
  // How are possible words excluded? When the letters in the guess words are not present in the target word, we can eliminate any possible words containing these letters.
  // How else can we reduce the number of possible words? By using the correct letters from the guess to reduce the possible words.

  const firstGuess = 'sooty';
  const targetWord = 'those';
  const firstGuessResult = testGuess(firstGuess, targetWord);

  console.log('firstGuessResult', firstGuessResult);
};

run().catch(error => console.error(error));
