const chalk = require('chalk');
const { Guess: { playerGuess, playerPreviousGuess } } = require('../utils/Guess');

class GameSystem {
  constructor(wordlistService, promptsHandler) {
    this._MAX_TRIES = 6;
    this._tries = 0;
    this._puzzle = wordlistService.getRandomWord();
    this._promptsHandler = promptsHandler;
    this._playerGuess = playerGuess;
    this._playerPreviousGuess = playerPreviousGuess;

    // Global result for showing all results at once
    this._globalResult = '';
  }

  async startGame() {
    // User gets 5 tries to solve the puzzle not including first guess
    if (this._tries < this._MAX_TRIES) {
    // Ask the player for guess a word
      const response = await this._promptsHandler.getResponseUser();
      this._playerGuess = response.word;
      if (typeof this._playerGuess === 'undefined') {
      /* this scenario happens when a user presses Ctrl+C and terminates program
      ** previously it was throwing an error */
        console.clear();
        console.log('You closed the game, Good Bye!');
        process.exit(0);
      }
      // add to already enterd words list
      this._playerPreviousGuess.push(this._playerGuess);

      // if the word matches, they win!
      if (this._playerGuess == this._puzzle) {
      // show board again
        this._checkPlayerGuess(this._playerGuess);
        console.log(chalk.green('\n\nWINNER!'));
      } else {
        this._checkPlayerGuess(this._playerGuess);
        // this forces std out to print out the results for the last guess
        process.stdout.write('\n');
        // repeat the game and increment the number of tries
        this.startGame(this._tries++);
      }
    } else {
      console.log(`\nINCORRECT: The word was ${this._puzzle}`);
    }
  }

  async _checkPlayerGuess(guess) {
    // Clear previous results
    console.clear();
    let results = '';
    let puzzleNotMatchedLetters = this._puzzle;
    // Loop over each letter in the word
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];

      /* check if the letter at the specified index in the guess word exactly
      ** matches the letter at the specified index in the puzzle */
      if (letter === this._puzzle[i]) {
        puzzleNotMatchedLetters = puzzleNotMatchedLetters.replace(letter, '');
        results += chalk.white.bgGreen.bold(` ${letter} `);
        continue;
      }

      /* check if the letter at the specified index in the guess word is at least
      ** contained in the puzzle at some other position */
      if (puzzleNotMatchedLetters.includes(letter)) {
        puzzleNotMatchedLetters = puzzleNotMatchedLetters.replace(letter, ' ');
        results += chalk.white.bgYellow.bold(` ${letter} `);
        continue;
      }

      // otherwise the letter doesn't exist at all in the puzzle
      results += chalk.white.bgGrey.bold(` ${letter} `);
    }

    this._globalResult += results.padEnd(results.length + process.stdout.columns - 15, ' ');
    /* 15 in above code is 5 letters and 2 spaces in start and end of characters,
    ** 3 char for a letter, total 3 * 5 = 15
    ** it has to be hardcoded as the chalk's result changes the number of characters */

    process.stdout.write(this._globalResult);
  }
}

module.exports = {
  GameSystem,
};
