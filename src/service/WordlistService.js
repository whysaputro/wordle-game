const wordlistJSON = require('../words.json');

class WordlistService {
  constructor() {
    this._wordlist = wordlistJSON;
  }

  getRandomWord() {
    const randomNumber = Math.floor(Math.random(this._wordlist.length) * this._wordlist.length);
    return wordlistJSON[randomNumber];
  }

  getAllWords() {
    return this._wordlist;
  }
}

module.exports = {
  WordlistService,
};
