/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/no-array-reduce */
import { timer } from '../utils/command-line-utils.js';
import { testGuess } from './test-guess.js';
import chalk from 'chalk';

type WordScoreMap = Map<string, number>;

type FindStartingWordsFn = (opts: {
  allPossibleWords: string[];
  numStartingWords: number;
  pastWords: string[];
  topX: number;
  wordsContainingLetter: Map<string, Set<string>>;
  wordsStartingWithLetter: Map<string, Set<string>>;
}) => Promise<WordScoreMap[]>;

export const findStartingWords: FindStartingWordsFn = async ({
  numStartingWords,
  topX,
  pastWords,
  allPossibleWords,
  wordsContainingLetter,
  wordsStartingWithLetter
}) => {
  console.log(`
=====================
 Find starting words
=====================
`);

  // Currently only support 1 starting word
  if (numStartingWords !== 1) {
    throw new Error('Only 1 starting word is supported');
  }

  // Currently only support a top 10 of results
  if (topX !== 10) {
    throw new Error('Only the top 10 results are supported');
  }

  // Setup data structures
  const candidateWordScores: WordScoreMap = new Map();

  // Run through all possible words
  let candidateCounter = 0;
  for (const nextCandidate of allPossibleWords) {
    timer.start(`Test candidate ${chalk.bold(`"${nextCandidate}"`)}`);

    // Need to test against each previously-used word
    for (const nextTarget of pastWords) {
      // Setup the initial word-pool to be eliminated
      const candidateResultsPool = new Set(allPossibleWords);

      // Test the candidate word and then use the result to eliminate words from the pool
      const guessResult = testGuess(nextCandidate, nextTarget);
      if (guessResult) {
        const wordsToDelete: string[] = [];
        for (const [i, nextGuess] of guessResult.entries()) {
          const nextLetter = nextCandidate[i]!;
          const wordsContainingLetter = possibleWordsByLetter.get(nextLetter)!;
          if (nextGuess === undefined) {
            wordsToDelete.push(...wordsContainingLetter);
          } else if (nextGuess === false) {
            for (const nextCandidatePoolWord of candidateResultsPool) {
              if (!wordsContainingLetter.has(nextCandidatePoolWord)) {
                candidateResultsPool.delete(nextCandidatePoolWord);
              }
            }
          } else {
            for (const nextCandidatePoolWord of candidateResultsPool) {
              if (nextCandidatePoolWord[i] !== nextLetter) {
                candidateResultsPool.delete(nextCandidatePoolWord);
              }
            }
          }
        }
      } else {
        // If the guess result is undefined, then the candidate word is not a possible solution
        // This means that we can delete every word from the pool that contains any of the candidate letters
      }

      // Increment the candidate total pool score
      const currentScore = candidateWordScores.get(nextCandidate) ?? 0;
      candidateWordScores.set(nextCandidate, currentScore + candidateResultsPool.size);
    }

    timer.succeed();

    // // Convert the candidate word scores to average pool size per past word, to give a more intuitive score
    // for (const [candidateWord, candidateScore] of candidateWordScores.entries()) {
    //   candidateWordScores.set(candidateWord, candidateScore / pastWords.length);
    // }

    // if (++candidateCounter % 10 === 0) {
    if (candidateCounter++ > 1) {
      break;
    }
  }

  // Sort the candidate word scores
  const sortedCandidateWordScores = [...candidateWordScores.entries()].sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
  const sortedMap: WordScoreMap = new Map(sortedCandidateWordScores.slice(0, topX));

  return [sortedMap];
};
