const prompts = require('prompts');
const chalk = require('chalk');
const wordsJSON = require('./wordlist/words.json');

const TERMINAL_COLS = process.stdout.columns;
const MAX_TRIES = 6;
const previousGuess = [];

// Global result for showing all results at once
let globalResult = '';
let puzzle = '';

const wordlePrompt = {
  type: 'text',
  name: 'word',
  format: (value) => value.toUpperCase(),
  message: 'Enter a 5 letter words...',
  validate: (value) => {
    if (value.length !== 5) {
      return 'Word must be 5 letters';
    }
    if (!/^[a-z]+$/i.test(value)) {
      return 'Word must only contain letters';
    }
    if (!wordsJSON.includes(value.toUpperCase())) {
      return 'Word not found in word list';
    }
    if (previousGuess.includes(value.toUpperCase())) {
      return 'You have already entered this word';
    }
    return true;
  },
};

const check = async (guess) => {
  // Clear previous results
  console.clear();
  let results = '';
  let puzzleNotMatchedLetters = puzzle;
  // Loop over each letter in the word
  for (const i in guess) {
    const letter = guess[i];
    // check if the letter at the specified index in the guess word exactly
    // matches the letter at the specified index in the puzzle
    if (letter === puzzle[i]) {
      puzzleNotMatchedLetters = puzzleNotMatchedLetters.replace(letter, '');
      results += chalk.white.bgGreen.bold(` ${letter} `);
      continue;
    }
    // check if the letter at the specified index in the guess word is at least
    // contained in the puzzle at some other position
    if (puzzleNotMatchedLetters.includes(letter)) {
      puzzleNotMatchedLetters = puzzleNotMatchedLetters.replace(letter, ' ');
      results += chalk.white.bgYellow.bold(` ${letter} `);
      continue;
    }
    // otherwise the letter doesn't exist at all in the puzzle
    results += chalk.white.bgGrey.bold(` ${letter} `);
  }
  globalResult += results.padEnd(results.length + TERMINAL_COLS - 15, ' ');
  // 15 in above code is 5 letters and 2 spaces in start and end of characters, 3 char for a letter, total 3 *5 =15
  // it has to be hardcoded as the chalk's result changes the number of characters
  process.stdout.write(globalResult);
};

const play = async (tries) => {
  // User gets 5 tries to solve the puzzle not including first guess
  if (tries < MAX_TRIES) {
    // Ask the player for guess a word
    const response = await prompts(wordlePrompt);
    const guess = response.word;
    if (typeof guess === 'undefined') {
      // this scenario happens when a user presses Ctrl+C and terminates program
      // previously it was throwing an error
      console.clear();
      console.log('You closed the game, Good Bye!');
      process.exit(0);
    }
    // add to already enterd words list
    previousGuess.push(guess);
    // if the word matches, they win!
    if (guess == puzzle) {
      // show board again
      check(guess);
      console.log(chalk.green('\n\nWINNER!'));
    } else {
      check(guess);
      // this forces std out to print out the results for the last guess
      process.stdout.write('\n');
      // repeat the game and increment the number of tries
      play(++tries);
    }
  } else {
    console.log(`\nINCORRECT: The word was ${puzzle}`);
  }
};

const init = async () => {
  // Get random word
  const randomNumber = Math.floor(Math.random(wordsJSON.length) * wordsJSON.length);
  puzzle = wordsJSON[randomNumber].toUpperCase();
  console.log(puzzle);
  // Start the game
  await play(0);
};

init();
