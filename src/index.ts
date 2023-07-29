import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT_DIR = path.join(__dirname, '..');
const ALL_WORDS_FILE = path.join(ROOT_DIR, 'words.txt');
const PAST_WORDLE_WORDS_FILE = path.join(ROOT_DIR, 'past-wordle-words.txt');

const run = async () => {
  // Grab raw file contents
  const allWordsRaw = await fs.readFile(ALL_WORDS_FILE, 'utf8');
  const pastWordsRaw = await fs.readFile(PAST_WORDLE_WORDS_FILE, 'utf8');

  // Obtain the five-letter words
  const fiveLetterWords = allWordsRaw
    .split('\n')
    .map((nextWord) => nextWord.trim())
    .filter((nextWord) => {
      for (let i = 0, j = nextWord.length; i < j; i++) {
        const nextLetterCode = nextWord.codePointAt(i);
        if (!nextLetterCode || nextLetterCode > 122 || nextLetterCode < 97) {
          return false;
        }
      }

      return true;
    })
    .filter((nextWord) => nextWord.length === 5)
    .sort((a, b) => a.localeCompare(b));
  const fiveLetterWordsSet = new Set(fiveLetterWords);

  // Find how many past words are NOT in the top 10k words
  const missingWords = new Set<string>();
  const pastWords = pastWordsRaw
    .split('\n')
    .map((nextWord) => nextWord.trim())
    .filter((nextWord) => nextWord.length);
  for (const nextWord of pastWords) {
    if (!fiveLetterWordsSet.has(nextWord)) {
      missingWords.add(nextWord);
    }
  }

  console.log(`There are ${fiveLetterWords.length} five-letter words`);
  console.log(`There are ${pastWords.length} historical Wordle words`);
  console.log(
    `There are ${missingWords.size} historical Wordle words missing from the current total words list`,
  );
  console.log(`The following past words are not in the current total words list:
${[...missingWords]
      .map((nextWord, idx) => `${idx + 1}. ${nextWord}`)
      .join('\n')}
`);
  console.log(`These are the five-letter words:
${[...fiveLetterWordsSet]
      .map((nextWord, idx) => `${idx + 1}. ${nextWord}`)
      .join('\n')}
`);
};

run();
