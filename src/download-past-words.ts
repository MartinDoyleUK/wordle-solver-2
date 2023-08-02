import axios from 'axios';

const PAST_WORDS_PAGE = 'https://www.rockpapershotgun.com/wordle-past-answers';
const LINE_TO_INDEX = '<h2>All Wordle answers</h2>';
const ANSWER_LINE_REGEX = /^<li>([^<]+)<\/li>$/;

export const downloadPastWords = async (): Promise<string[]> => {
  const { data, status, statusText } = await axios.get(PAST_WORDS_PAGE);
  const pastWords: string[] = [];
  if (status >= 400) {
    throw new Error(`Unable to download previous words (${status}: ${statusText})`);
  }

  const WEB_PAGE_LINES = data.split('\n');
  let shouldParse = false;
  let startedParsing = false;
  for (const nextLine of WEB_PAGE_LINES) {
    if (!shouldParse) {
      if (nextLine === LINE_TO_INDEX) {
        shouldParse = true;
      }
    } else {
      let nextMatch: RegExpExecArray | null;
      if ((nextMatch = ANSWER_LINE_REGEX.exec(nextLine))) {
        if (!startedParsing) {
          startedParsing = true;
        }
        const [, word] = nextMatch;
        pastWords.push(word!);
      } else {
        if (startedParsing) {
          break;
        }
      }
    }
  }

  return pastWords;
};
