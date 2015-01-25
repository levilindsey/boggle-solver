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

boardManager.readFromFile = readFromFile;
boardManager.getInstance = getInstance;

module.exports = boardManager;

// --- Internal logic --- //

/**
 * Reads in the raw board data from the given file.
 *
 * @param {String} path
 * @returns {Q.promise|Object}
 */
function readFromFile(path) {
  instance = require(path).board;
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
