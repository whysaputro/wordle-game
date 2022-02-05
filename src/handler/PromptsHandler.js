const prompts = require('prompts');
const { Guess: { playerPreviousGuess } } = require('../utils/Guess');

class PromptsHandler {
  constructor(wordlistService) {
    this._wordlistService = wordlistService;
    this._playerPreviousGuess = playerPreviousGuess;

    this._wordlePrompt = {
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
        if (!this._wordlistService.getAllWords().includes(value.toUpperCase())) {
          return 'Word not found in word list';
        }
        if (this._playerPreviousGuess.includes(value.toUpperCase())) {
          return 'You have already entered this word';
        }
        return true;
      },
    };
  }

  async getResponseUser() {
    return prompts(this._wordlePrompt);
  }
}

module.exports = {
  PromptsHandler,
};
