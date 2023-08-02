import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line canonical/id-match
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const SRC_DIR = DIRNAME;
const SOWPODS_FILE = path.join(SRC_DIR, 'sowpods.txt');
const PAST_WORDS_FILE = path.join(SRC_DIR, 'past-words.txt');

export const loadWordsFromFile = async (): Promise<{ pastWordsFromFile: string[], possibleWords: string[] }> => {
  // Grab raw file contents
  const sowpodWords = await fs.readFile(SOWPODS_FILE, 'utf8');
  const pastWords = await fs.readFile(PAST_WORDS_FILE, 'utf8');

  // Refine the possible five-letter words
  const possibleWords = sowpodWords
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

  // Trim and sort the past words
  const pastWordsFromFile = pastWords
    .split('\n')
    .map((nextWord) => nextWord.trim())
    .filter((nextWord) => nextWord.length === 5)
    .sort((a, b) => a.localeCompare(b));

  return { pastWordsFromFile, possibleWords };
};
