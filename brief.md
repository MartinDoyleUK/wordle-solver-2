# Project brief

## Q&A session

**What do you want to achieve?**
I want to know the best starting words to use in Wordle.

**What are the best starting words?**
The ones that will most reduce the number of possible words, when compared to the target word.

**How are possible words excluded?**
When the letters in the guess words are not present in the target word, we can eliminate any possible words containing these letters.

**How else can we reduce the number of possible words?**
By using the correct letters from the guess to reduce the possible words.

**What process should we use to perform this analysis?**
Use the total-possible-words list (from CWS/SOWPODS), and for each word in that list, compare it against the historical target words used in Wordle. The result of that guess/comparison will be a subset of possible words.

**How do we determine the "winner" when comparing the words?**
Each word tested will have a subset-size for each historical word. Against each test-word we should record the average (mean) subset-size, which will then be the "score" for how good that test word is at reducing the pool of possible words.

**How should we present the results?**
In a table of the top-10 words, also showing their average subset size.
