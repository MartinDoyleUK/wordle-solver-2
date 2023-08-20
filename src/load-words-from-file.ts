import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line canonical/id-match
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const SRC_DIR = DIRNAME;
const ALL_WORDS_FILE = path.join(SRC_DIR, 'csw.txt');
const PAST_WORDS_FILE = path.join(SRC_DIR, 'past-words.txt');
const WORD_REGEX = /^([A-Z]+)\s/u;

export const loadWordsFromFile = async (): Promise<{ pastWordsFromFile: string[], possibleWords: string[] }> => {
  // Grab raw file contents
  const allWords = await fs.readFile(ALL_WORDS_FILE, 'utf8');
  const pastWords = await fs.readFile(PAST_WORDS_FILE, 'utf8');

  // Refine the possible five-letter words
  const possibleWords = new Set<string>();
  for (const nextLine of allWords.split('\n')) {
    const [, nextWord] = WORD_REGEX.exec(nextLine) || [];
    if (nextWord && nextWord.trim().length === 5) {
      possibleWords.add(nextWord);
    }
  }

  // Sort the possible words
  const sortedPossibleWords = [...possibleWords].sort((a, b) => a.localeCompare(b))

  // Trim and sort the past words
  const pastWordsFromFile = pastWords
    .split('\n')
    .map((nextWord) => nextWord.trim())
    .filter((nextWord) => nextWord.length === 5)
    .sort((a, b) => a.localeCompare(b));

  return { pastWordsFromFile, possibleWords: sortedPossibleWords };
};
