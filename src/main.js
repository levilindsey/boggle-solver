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

config.debug = false;

// TODO: let these be passed in as command-line arguments
config.dictionaryPath = './docs/dict.txt';
config.boardPath = '../docs/board.js';

var dictionary = null;
var board = null;

// ---  --- //

run();

// ---  --- //

function run() {
  if (config.debug) {
    console.time('Boggle setup');

    setup()
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

function setup() {
  return Q.all([
    dictionaryManager.readFromFile(config.dictionaryPath),
    boardManager.readFromFile(config.boardPath)
  ])
    .then(function () {
      dictionary = dictionaryManager.getInstance();
      board = boardManager.getInstance();
    });
}

function findAllSolutions() {
  var x, y, trieNode, letter;
  var boardSideLength = board.length;
  var visitedCells = initializeVisitedArray(boardSideLength);
  var solutions = new Trie();
  var currentLetters = [];

  // Find all words starting from each cell on the board
  for (x = 0; x < boardSideLength; x += 1) {
    for (y = 0; y < boardSideLength; y += 1) {
      // Get the letter at the current cell on the board
      letter = board[x][y];

      // Get the child trie node for the current letter
      trieNode = dictionary.root[letter];

      // Does the current letter represent a valid prefix/word from the dictionary?
      if (trieNode) {
        currentLetters.push(letter);

        // Does the current trie node represent a complete word from the dictionary?
        if (trieNode.end) {
          solutions.addWord(currentLetters);
        }

        // Continue traversing from the current cell on the board
        traverseBoard(x, y, trieNode, currentLetters, visitedCells, solutions, boardSideLength);

        currentLetters.pop();
      }
    }
  }

  return solutions;
}

function traverseBoard(x, y, trieNode, currentLetters, visitedCells, solutions, boardSideLength) {
  var nx, ny, nxMax, nyMax, letter, neighborNode;

  // Mark the current cell as visited
  visitedCells[x][y] = true;

  // Try to traverse across each of the neighbors of the current cell
  for (nx = x - 1, nxMax = x + 1; nx <= nxMax; nx += 1) {
    for (ny = y - 1, nyMax = y + 1; ny <= nyMax; ny += 1) {
      // Have the current neighbor already been used in the current path?
      if (!visitedCells[nx][ny]) {
        // Get the letter at the current cell on the board
        letter = board[nx][ny];

        // Get the child trie node for the current letter
        neighborNode = trieNode[letter];

        // Does the current letter represent a valid prefix/word from the dictionary?
        if (neighborNode) {
          currentLetters.push(letter);

          // Does the current trie node represent a complete word from the dictionary?
          if (neighborNode.end) {
            solutions.addWord(currentLetters);
          }

          // Continue traversing from the current neighbor cell
          traverseBoard(nx, ny, neighborNode, currentLetters, visitedCells, solutions, boardSideLength);

          currentLetters.pop();
        }
      }
    }
  }

  // Un-mark the current cell as visited
  visitedCells[x][y] = false;
}

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
  solutions.printAllWords();
}
