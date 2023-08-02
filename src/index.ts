import { downloadPastWords } from './download-past-words.js';
import { loadWordsFromFile } from './load-words-from-file.js';


const run = async () => {
  const { pastWordsFromFile, possibleWords } = await loadWordsFromFile();

  let pastWordsToUse = pastWordsFromFile;
  const before = performance.now();
  try {
    pastWordsToUse = await downloadPastWords();
    const timeTakenToDownloadMs = Math.round(performance.now() - before);
    console.log(`Took ${timeTakenToDownloadMs}ms to download past words`);
  } catch (e) {
    console.warn('Unable to download words. Using cached words as backup');
  }

  const fiveLetterWordsSet = new Set(possibleWords);

  // Find how many past words are NOT in the top 10k words
  const missingWords = new Set<string>();
  for (const nextWord of pastWordsToUse) {
    if (!fiveLetterWordsSet.has(nextWord)) {
      missingWords.add(nextWord);
    }
  }

  console.log(`There are ${possibleWords.length} five-letter words`);
  console.log(`There are ${pastWordsToUse.length} historical Wordle words`);

};

run().catch(error => console.error(error));
