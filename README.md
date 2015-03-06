# boggle-solver

#### Given a boggle layout and a dictionary, finds the possible words

_You can also find my complete solution on GitHub at [github.com/levisl176/boggle-solver][github-url]_

_This was completed as a solution to an interview code challenge._

## Description of my Solution

The general approach I took is to: first store all of the words of dictionary in a [trie][trie-url], then perform a
depth-first traversal of the board graph, checking that each letter and cell is valid according to both the dictionary
trie and the cells already visited in the current path.

More specifically, my algorithm proceeds as follows:

1. Read in the dictionary file.
    - Store each word within a custom trie data structure.
    - Each node in this trie corresponds to a letter (as part of a prefix), the end of a complete word, or both.
2. For each cell in the board:
3. Check whether the cell has already been visited on the current path through the board.
4. Check whether the current trie node on our path through the trie tree contains a key matching the letter in the
   current cell.
5. Keep track of a running list of the letters on the current path, which represents the current word/prefix.
6. As we encounter trie nodes which correspond to the ends of complete words, add these words to a running list
   (actually another trie) of solutions.
7. Iterate across all of the neighbors of the current cell, and repeat with step 3.
8. Once the entire board has been traversed, and all of the solutions have been collected, iterate through the nodes
   of the solutions trie (in alphabetical order), and print all of the complete words.


## Answers to Questions from the Problem Statement

// QUESTION A: Does your program output match solution_output.txt exactly?  If not, why not?

Yes


// Your answer may be more than one file but please indicate HERE how you would run it:

// QUESTION B:  Please note how this solution is to be run.  If you must open a web page, run a set of shell commands,
run "node index.js", or similar, please indicate that in your answer.  These instructions should be followed by an
intelligent non-engineer.

- From a command line, navigate your working directory to `boggle-solver`
- Install NPM dependencies: `npm install`
- Run the application: `node src/main`

_See [Getting Set Up][./docs/getting-set-up.md] for more detail._


// Additionally, consider the following questions and answer here:

// 1. Would your solution work if we expanded the board to 5x5?  6x6?  At what point do you think it would give out?

This implementation scales somewhat decently to larger grids. It processes a 1000x1000 grid on my personal machine in
50 seconds.

However, this performance is highly dependent on the size of the dictionary and the maximum word length. If either of
these were to increase, my solution would not gain as much benefit from pruning during the graph traversal, and it
would consequently show slower run times.


// 2. What are some other ways to implement your answer? 3. For each of these, what is the time and space tradeoff for
running this against another solution?

When discussing space and time complexities, I will use the following symbols:

- Let _n_ represent the side length of the board.
- Let _m_ represent the number of words in the dictionary.
- Let _l_ represent the maximum word length.
- Let _k_ represent the number of letters in the alphabet.

My solution has a worst-case running time of _O(n^2 * l)_. This can be demonstrated with a board containing an 'A' in
each cell and a dictionary containing a word consisting of _n*n_ 'A's. In this case, every neighbor cell would be
explored at each point in every path, and no pruning would occur. However, the average case is much better, because
pruning allows the traversal to stop short as soon as a path finds a cell with a letter that does not correspond to
the current node in the trie.

The run time of loading the dictionary could be more significant with a larger dictionary. It takes _O(m * l)_ time to
load the dictionary.

My solution uses _O(k^l)_ space to store the dictionary in a trie and also _O(k^l)_ space to store the matching words.

Some other possible solutions include:

- Storing the dictionary in a binary search tree or a hash table.
    - In this implementation, the worst-case run time would still be _O(n^2 * l)_, but the average-case run time would
      be higher, because these other data structures would not facilitate pruning during the graph traversal. With the
      dictionary stored in a trie, it is easy to iterate over the individual letters within the dictionary and to then
      notice immediately when a path through the board reaches a combination of letters that does not correspond to
      any word in the dictionary.
    - In this implementation, the entirety of each word in the dictionary would be stored separately. In the trie
      implementation, each node represents a letter that is likely shared by many different words that are stored in
      the collection. With this alternate implementation, these letters would be stored redundantly, leading to a
      great deal of extra space being consumed. However, the worst-case complexity of this alternate implementation is
      still _O(m * l)_.
- Iterating through the words in the dictionary and then, for each word, attempting to find matches within the board.
    - The worst-case run time would be _O(m * n^2 * l)_, although this could vary somewhat depending on the data
      structure used to store the dictionary and how it were traversed.
- I believe there might also exist a solution involving dynamic programming. This could theoretically reduce the
  run-time complexity by a significant amount.


// 4. For each of these, is it more suited for a long-running server, or for a one-off script?

I'm not sure I understand the potential context for this question. In general, I would think this boggle solver should
be run as a one-off script.




[github-url]: https://github.com/levisl176/boggle-solver
[trie-url]: http://en.wikipedia.org/wiki/Trie
