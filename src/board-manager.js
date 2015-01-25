/**
 * This module defines logic for the Boggle board.
 *
 * @module board-manager
 */

/**
 * @typedef {Array.<Array.<String>>} Board
 */

// --- Imports --- //

// --- Exports --- //

var boardManager = {};
var instance = null;

boardManager.load = load;
boardManager.getInstance = getInstance;

module.exports = boardManager;

// --- Internal logic --- //

/**
 * Reads in the raw board data from the given file.
 *
 * @param {Object} config
 * @returns {Q.promise|Object}
 */
function load(config) {
  instance = config.useRandomBoard ? createRandomBoard(config.randomBoardSideLength) : require(config.boardPath).board;
  return instance;
}

/**
 * Returns the last Board that was read in from a file.
 *
 * @returns {Board}
 */
function getInstance() {
  return instance;
}

/**
 * Creates a random Board with the given side length.
 *
 * @returns {Board}
 */
function createRandomBoard(randomBoardSideLength) {
  // Duplicates could be added to this alphabet to make some letter frequencies more realistic
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  var x, y, column;
  var board = [];
  
  for (x = 0; x < randomBoardSideLength; x += 1) {
    column = [];
    board[x] = column;

    for (y = 0; y < randomBoardSideLength; y += 1) {
      column[y] = alphabet[parseInt(Math.random() * alphabet.length)];
    }
  }

  return board;
}
