const { WordlistService } = require('./service/WordlistService');
const { PromptsHandler } = require('./handler/PromptsHandler');
const { GameSystem } = require('./system/GameSystem');

const init = () => {
  const wordlistService = new WordlistService();
  const prompt = new PromptsHandler(wordlistService);
  const game = new GameSystem(6, wordlistService.getRandomWord(), prompt);

  // Start the game
  game.startGame(0);
};

init();
