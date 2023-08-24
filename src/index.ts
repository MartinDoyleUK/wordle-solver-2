import { findStartingWords } from "./exec";
import { getWords } from "./init";
import { timer } from "./utils";

const run = async () => {
  const {
    pastWords,
    wordsContainingLetter,
    wordsStartingWithLetter,
    allPossibleWords
  } = await getWords();
  const bestStartingWords = await findStartingWords({
    allPossibleWords,
    numStartingWords: 1,
    pastWords,
    topX: 10,
    wordsContainingLetter,
    wordsStartingWithLetter
  });

  console.log('bestStartingWords', bestStartingWords);
};

run().catch(error => {
  timer.fail(`Error running program: ${error.message}`)
  // eslint-disable-next-line node/no-process-exit
  process.exit(1);
});

// There are 12972 possible five-letter words
// There are 791 historical Wordle words
// There are 0 historical words missing from the possible words
