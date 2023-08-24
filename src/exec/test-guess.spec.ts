import { testGuess } from './test-guess.js';

describe('testGuess', () => {
  it('should return undefined for no matches', () => {
    const TEST_GUESS = 'abcde';
    const TEST_TARGET = 'fghij';
    const EXPECTED_RESULT = undefined;

    const result = testGuess(TEST_GUESS, TEST_TARGET);

    expect(result).toEqual(EXPECTED_RESULT);
  });

  it('should return true for valid letters in the right place', () => {
    const TEST_GUESS = 'abcde';
    const TEST_TARGET = 'fgcde';
    const EXPECTED_RESULT = [undefined, undefined, true, true, true];

    const result = testGuess(TEST_GUESS, TEST_TARGET);

    expect(result).toEqual(EXPECTED_RESULT);
  });

  it('should return false for valid letters in the wrong place', () => {
    const TEST_GUESS = 'abcde';
    const TEST_TARGET = 'badfg';
    const EXPECTED_RESULT = [false, false, undefined, false, undefined];

    const result = testGuess(TEST_GUESS, TEST_TARGET);

    expect(result).toEqual(EXPECTED_RESULT);
  });

  it('should return just one false for multiple instances in guess where only one in target', () => {
    const TEST_GUESS = 'abccd';
    const TEST_TARGET = 'cefgh';
    const EXPECTED_RESULT = [undefined, undefined, false, undefined, undefined];

    const result = testGuess(TEST_GUESS, TEST_TARGET);

    expect(result).toEqual(EXPECTED_RESULT);
  });
});
