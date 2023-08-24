import { timer } from '../utils';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type LoadWordsFromFileFn = () => Promise<{ pastWordsFromFile: string[], possibleWords: string[] }>;

// Set up paths
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const ROOT_DIR = path.join(DIRNAME, '..', '..');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const ALL_WORDS_FILE = path.join(ASSETS_DIR, 'csw.txt');
const PAST_WORDS_FILE = path.join(ASSETS_DIR, 'past-words.txt');

// Other constants
const WORD_REGEX = /^([A-Z]+)\s/u;

export const loadWordsFromFile: LoadWordsFromFileFn = async () => {
  // Grab raw file contents
  timer.start('Read words from file');
  const allWords = await fs.readFile(ALL_WORDS_FILE, 'utf8');
  const pastWords = await fs.readFile(PAST_WORDS_FILE, 'utf8');
  timer.succeed();

  // Refine the possible five-letter words
  timer.start('Refine possible words');
  const possibleWords = new Set<string>();
  for (const nextLine of allWords.split('\n')) {
    const [, nextWord] = WORD_REGEX.exec(nextLine) || [];
    if (nextWord && nextWord.trim().length === 5) {
      possibleWords.add(nextWord);
    }
  }

  // Trim and sort the collections
  const sortedPossibleWords = [...possibleWords].sort((a, b) => a.localeCompare(b))
  const pastWordsFromFile = pastWords
    .split('\n')
    .map((nextWord) => nextWord.trim())
    .filter((nextWord) => nextWord.length === 5)
    .sort((a, b) => a.localeCompare(b));
  timer.succeed();

  return { pastWordsFromFile, possibleWords: sortedPossibleWords };
};
