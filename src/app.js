const { WordlistService } = require('./service/WordlistService');
const { PromptsHandler } = require('./handler/PromptsHandler');
const { GameSystem } = require('./system/GameSystem');

const init = () => {
  const wordlistService = new WordlistService();
  const promptsHandler = new PromptsHandler(wordlistService);
  const gameSystem = new GameSystem(wordlistService, promptsHandler);

  // Start the game
  gameSystem.startGame(0);
};

init();
