/**
 * This module is the top-level entry point and controller of the boggle-solver application.
 *
 * @module main
 */

var Q = require('q');

var Trie = require('./trie');
var dictionaryManager = require('./dictionary-manager');
var boardManager = require('./board-manager');

var config = {};

config.printSolution = true;
config.recordRunTime = false;
config.printBoard = false;
config.useRandomBoard = false;
config.randomBoardSideLength = 100;

config.dictionaryPath = './docs/dict.txt';
config.boardPath = '../docs/board.js';

var dictionary = null;
var board = null;

run();

// ---  --- //

/**
 * Finds and prints all possible solutions for a game of Boggle.
 */
function run() {
  if (config.recordRunTime) {
    console.time('Boggle setup');

    setup()
      .then(printBoard)
      .then(console.timeEnd.bind(console, 'Boggle setup'))
      .then(console.time.bind(console, 'Boggle solution'))
      .then(findAllSolutions)
      .then(printSolutions)
      .then(console.timeEnd.bind(console, 'Boggle solution'))
      .catch(console.error.bind(console));
  } else {
    setup()
      .then(findAllSolutions)
      .then(printSolutions)
      .catch(console.error.bind(console));
  }
}

/**
 * Reads in the dictionary and the board to use.
 *
 * @returns {Q.Promise}
 */
function setup() {
  return Q.all([
    dictionaryManager.load(config.dictionaryPath),
    boardManager.load(config)
  ])
    .then(function () {
      dictionary = dictionaryManager.getInstance();
      board = boardManager.getInstance();
    });
}

/**
 * Finds all possible words in the module's board according to the module's dictionary.
 *
 * @returns {Trie}
 */
function findAllSolutions() {
  var x, y;
  var boardSideLength = board.length;
  var visitedCells = initializeVisitedArray(boardSideLength);
  var solutions = new Trie();
  var currentLetters = [];

  // Find all words starting from each cell on the board
  for (x = 0; x < boardSideLength; x += 1) {
    for (y = 0; y < boardSideLength; y += 1) {
      exploreCell(x, y, dictionary.root, currentLetters, visitedCells, solutions);
    }
  }

  return solutions;
}

/**
 * Performs a depth-first traversal of the boggle board continuing at the cell at the given coordinates. Each letter
 * and cell is checked for valid word formations (according to the dictionary) and valid cell usage (so the same cell
 * is not visited twice within one path).
 *
 * @param {Number} x
 * @param {Number} y
 * @param {TrieNode} parentNode
 * @param {Array.<String>} currentLetters
 * @param {Array.<Array.<Boolean>>} visitedCells
 * @param {Trie} solutions
 */
function exploreCell(x, y, parentNode, currentLetters, visitedCells, solutions) {
  var letter, trieNode, nx, ny, nxMax, nyMax;

  // Has the current cell already been used in the current path?
  if (!visitedCells[x][y]) {
    // Get the letter at the current cell on the board
    letter = board[x][y];

    // Get the child trie node for the current letter
    trieNode = parentNode[letter];

    // Does the current letter represent a valid prefix/word from the dictionary?
    if (trieNode) {
      // Mark the current cell as visited
      visitedCells[x][y] = true;

      // Add the current letter to the current prefix/word
      currentLetters.push(letter);

      // Does the current trie node represent a complete word from the dictionary?
      if (trieNode.end) {
        solutions.addWord(currentLetters);
      }

      // Try to traverse across each of the neighbors of the current cell
      for (nx = x - 1, nxMax = x + 1; nx <= nxMax; nx += 1) {
        for (ny = y - 1, nyMax = y + 1; ny <= nyMax; ny += 1) {
          exploreCell(nx, ny, trieNode, currentLetters, visitedCells, solutions);
        }
      }

      // Remove the current letter from the current prefix/word
      currentLetters.pop();

      // Un-mark the current cell as visited
      visitedCells[x][y] = false;
    }
  }
}

/**
 * Create a 2D array that will be used to keep track of whether each cell of the board has been visited. Importantly,
 * this 2D array will have an "edge" around the bounds of the actual board. This edge simplifies the process of
 * performing bounds checks when iterating through the cells of the board.
 *
 * @param {Number} rowCount
 * @returns {Array.<Boolean|undefined>}
 */
function initializeVisitedArray(rowCount) {
  var i;
  var array = [];

  // Initialize the row arrays
  for (i = -1; i <= rowCount; i += 1) {
    array[i] = [];
  }

  // Mark all of the outer neighbor cells as visited
  for (i = -1; i <= rowCount; i += 1) {
    array[i][-1] = true;
    array[i][rowCount] = true;
    array[-1][i] = true;
    array[rowCount][i] = true;
  }

  return array;
}

/**
 * Prints each word in the given collection of solutions in alphabetical order.
 *
 * @param {Trie} solutions
 */
function printSolutions(solutions) {
  if (config.printSolution) {
    solutions.printAllWords();
  }
}

/**
 * Prints the module's board.
 */
function printBoard() {
  var i;
  var boardSideLength = board.length;

  if (config.printBoard) {
    for (i = 0; i < boardSideLength; i += 1) {
      console.info(board[i].join(' '));
    }
  }
}
