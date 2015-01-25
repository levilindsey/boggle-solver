/**
 * This module defines logic for a trie data structure that is used to store a collection of words.
 *
 * @module trie
 */

/**
 * @typedef {Object} TrieNode
 * @property {String} ['[A-Z]'] A TrieNode contains a single-letter key for each of its children.
 * @property {Boolean} [end] This flag means that the TrieNode marks the end of a complete word.
 */

// --- Imports --- //

// --- Exports --- //

module.exports = Trie;

// --- Internal logic --- //

/**
 * Constructor for a Trie.
 *
 * @constructor
 */
function Trie() {
  /** @type {TrieNode} */
  this.root = null;
  this.clear = clear;
  this.addWord = addWord;
  this.containsWord = containsWord;
  this.toString = toString;
  this.printAllWords = printAllWords;

  this.clear();
}

/**
 * Empties this Trie.
 *
 * @this Trie
 */
function clear() {
  this.root = {};
}

/**
 * Adds the given word to this Trie.
 *
 * @this Trie
 * @param {String|Array.<String>} word
 */
function addWord(word) {
  var i, count, letter;
  var node = this.root;

  for (i = 0, count = word.length; i < count; i += 1) {
    letter = word[i];

    if (!node[letter]) {
      createNode(node, letter);
    }

    node = node[letter];
  }

  node.end = true;
}

/**
 * Returns true if this Trie contains the given word.
 *
 * @this Trie
 * @param {String} word
 */
function containsWord(word) {
  for (var node = this.root, i = 0, count = word.length;
       i < count;
       i += 1) {
    node = node[word[i]];

    if (!node) {
      return false;
    }
  }

  return true;
}

/**
 * Returns a string representation of this Trie.
 *
 * @this Trie
 * @returns {String}
 */
function toString() {
  return JSON.stringify(this.root);
}

/**
 * Prints each word in this Trie in alphabetical order.
 *
 * @this Trie
 */
function printAllWords() {
  var nodeLetterPair, node, letters, keys, i, count, key, lettersCopy;

  // A stack of Trie nodes with their corresponding prefixes/words
  var nodeLetterPairs = [{
    node: this.root,
    letters: []
  }];

  // An iterative depth-first traversal of this Trie
  while (nodeLetterPairs.length) {
    nodeLetterPair = nodeLetterPairs.pop();
    node = nodeLetterPair.node;
    letters = nodeLetterPair.letters;

    keys = Object.keys(node).sort(trieKeyComparator);

    for (i = 0, count = keys.length; i < count; i += 1) {
      key = keys[i];

      if (key === 'end') {
        // The current Trie node represents a complete word from the dictionary, so print the word
        console.log(letters.join(''));
      } else {
        // We have found a child of the current Trie node, so add it to the stack
        lettersCopy = letters.slice(0);
        lettersCopy.push(key);

        nodeLetterPairs.push({
          node: node[key],
          letters: lettersCopy
        });
      }
    }
  }
}

/**
 * This comparator is used to sort values in reverse-alphabetical order with strings longer than a single letter
 * ('end') occurring before all others.
 *
 * @param {String} key1
 * @param {String} key2
 * @returns {Number}
 */
function trieKeyComparator(key1, key2) {
  if (key1.length > 1) {
    return -1;
  } else if (key2.length > 1) {
    return 1;
  } else {
    // We need not consider key equality, because we know that should not occur with our implementation
    return key1 < key2 ? 1 : -1;
  }
}

/**
 * Creates a new TrieNode as a child of the given parent TrieNode.
 *
 * @param {TrieNode} parent
 * @param {String} letter
 */
function createNode(parent, letter) {
  parent[letter] = {};
}
