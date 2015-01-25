/**
 * This module defines logic for the dictionary of possible words.
 *
 * @module dictionary-manager
 */

/**
 * @typedef {Trie} Dictionary
 */

// --- Imports --- //

var fs = require('fs');
var readline = require('readline');
var Stream = require('stream');
var Q = require('q');

var Trie = require('./trie');

// --- Exports --- //

var dictionaryManager = {};
var instance = null;

dictionaryManager.load = load;
dictionaryManager.getInstance = getInstance;

module.exports = dictionaryManager;

// --- Internal logic --- //

/**
 * Reads in the raw dictionary data from the given file.
 *
 * This uses a read stream and the readline library in order to more efficiently read the input file line-by-line
 * rather than forcing the entire file string into memory simultaneously.
 *
 * NOTE: This requires the file text to contain a trailing newline character.
 * NOTE: This works in a case-insensitive manner. If we can assume all input will have uniform case, then this can be
 *       optimized by removing the call to toUpperCase.
 *
 * @param {String} path
 * @returns {Q.promise}
 */
function load(path) {
  var deferred = Q.defer();

  instance = new Trie();

  var inStream = fs.createReadStream(path);
  var outStream = new Stream();
  var readLineInterface = readline.createInterface({
    input: inStream,
    output: outStream,
    terminal: false
  });

  readLineInterface.on('line', onLine);
  readLineInterface.on('close', onClose);

  return deferred.promise;

  // ---  --- //

  function onLine(line) {
    instance.addWord(line.toUpperCase());
  }

  function onClose() {
    deferred.resolve(instance);
  }
}

/**
 * Returns the last Dictionary that was read in from a file.
 *
 * @returns {Dictionary}
 */
function getInstance() {
  return instance;
}
