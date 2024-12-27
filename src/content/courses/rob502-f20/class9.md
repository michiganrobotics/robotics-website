---
title: "ROB 502: Programming for Robotics: Class 9"
date: "2020-07-07"
---

### Clicker Questions

Use p4r-clicker to submit your answer

```
int recursive1(int n) {
    if (n > 0) {
        return 2 + recursive1(n - 1);
    } else if (n < 0) {
        return -2 + recursive1(n + 1);
    }
    return 1;
}

int main(void) {
    printf("%d\n", recursive1(1)); // 1
    printf("%d\n", recursive1(5)); // 2
    printf("%d\n", recursive1(-2)); // 3

    return 0;
}
```

```
int recursive2(int n) {
    if (n % 2 == 0) {
        return 100 + recursive2(n / 2);
    } else if (n > 0) {
        return 1 + recursive2(n - 1);
    }
    return 0;
}

int main(void) {
    printf("%d\n", recursive2(2)); // 4
    printf("%d\n", recursive2(8)); // 5
    printf("%d\n", recursive2(10)); // 6

    return 0;
}
```

## In-class problem 1: spellcheck

For this problem we are going to implement a simple spelling correction algorithm based on a ternary search tree.

In a [ternary search tree](https://en.wikipedia.org/wiki/Ternary_search_tree) (TST), there are three possible children to each node, a "low" child, an "equal" child, and a "high" child. As each node only has one letter, the path we take through the tree determines the word we find. First, we use the low and high children to find a correct letter and then we _only_ take a letter from a node when we follow its equal branch. Sometimes we have to follow multiple low and high branches until we can get to the next letter to take. At any point of our search, we will have some prefix (the incomplete start of a word) built up of characters from all the equal branches we have taken. This makes the TST a kind of prefix tree, also called a [trie](https://en.wikipedia.org/wiki/Trie).

The figure below shows a ternary search tree that represents the words "the", "tea", "that", and "thee". The letter "a" is the low branch of "h" because it precedes "h" in the alphabet. We use the null-character "\\0" to represent the end of a valid word.

[This video](https://youtu.be/CIGyewO7868?t=224) gives an explanation of how to search and build a similar TST.

![Comparison of structure of linked list vs ternary search tree](/wp-content/uploads/sites/6/2019/07/ternary_search_tree.svg)

> In the last class we looked at linked lists. A linked list can be seen as a "tree" where each node has only one child node.

### Building a Ternary Search Tree

In order to build a TST, we follow the existing tree as far as we can: if a letter matches we take the equal/middle branch and start looking for the next letter; if our letter is smaller ("e" in "tea" instead of "h"), then we take the lower/left branch and continue looking for it; and if our letter is greater ("e" in "thee" instead of "\\0"), then we likewise take the higher/right branch.

When we reach a null link, we create the new node that we want to be there. In the figure below, we add words in the order "the", "tea", "that", and "thee".

![Inserting words into a ternary search tree](/wp-content/uploads/sites/6/2019/07/building_ternary_search_tree.svg)

> The tree will be constructed differently depending on the order of the words. If the words come in alphabetical (low to high) order, then every branch will always be a "higher" branch, and all the "low" branches will be wasted. This would make a "degenerate" tree. To prevent this, the word list we are using has been randomized. There are also balancing algorithms to modify the tree so that both low and high branches are used equally often, but a randomized word order gives similar performance without any more code.

We are providing the basic outline of the code for this assignment so you can focus on the code for building and searching the tree.

Use this pseudocode to build up your tree, and notice that this is an _iterative_ solution, not a recursive one yet:

```
void tst_add(tst_t *tst, const char *word) {
    make root node of tree if it doesn't exist
    keep track of current node, starting at root node (the value of this pointer will change as we move between nodes)
    forever {
        depending on *word {
            * less than node->c: move to node->left, creating it if it doesn't exist
            * greater than node->c: move to node->right, creating it if it doesn't exist
            * equal to node->c
                * return if *word is '\0'
                * advance word (moving the pointer with word++)
                * create node->equal if it doesn't exist
                * move to node->equal
        }
    }
}
```

In the comments of the `main` function we have put a couple lines you might want to use for debugging before you use the entire 10,000 word dictionary. If you uncomment these, just make sure to comment out the other line of `tst_add` that is going through the whole dictionary!

```
// tst_add(tst, "the");
// tst_add(tst, "tea");
// tst_add(tst, "that");
// tst_add(tst, "thee");
// tst_add(tst, "hospital");
```

### Checking your tree

Especially with a complex data structure such as a TST, good debugging technique will make a big difference in how efficiently you will be able to write your code. Here is a little procedure to make sure the line `tst_add(tst, "the")` works correctly as the first add to the tree. We put the breakpoint on `tst_add(tst, "tea")` because it is immediately after that first add.

```
gdb --args ./spellcheck the
(gdb) break <line number of tst_add(tst, "tea")>
(gdb) run
(gdb) p tst[0]
$15 = {node = 0x5555557690c0}
(gdb) p tst[0].node[0]
$16 = {c = 116 't', low = 0x0, equal = 0x5555557690f0, high = 0x0}
(gdb) p tst[0].node[0].equal[0]
$17 = {c = 104 'h', low = 0x0, equal = 0x555555769120, high = 0x0}
(gdb) p tst[0].node[0].equal[0].equal[0]
$18 = {c = 101 'e', low = 0x0, equal = 0x555555769150, high = 0x0}
(gdb) p tst[0].node[0].equal[0].equal[0].equal[0]
$19 = {c = 0 '\000', low = 0x0, equal = 0x0, high = 0x0}
```

In this output we have the sequence 't', 'h', 'e', '\\0', following the equal branches. This is what we expect from the figures above! We can then put another breakpoint after the next `tst_add` and perform the same check that the structure is correct, and so forth!

### Searching a Ternary Search Tree

The basic code for searching a TST is almost exactly the same as for adding a word to it. The only difference is that if we reach a null link, then we know our word is not contained by the TST. If instead we match a null character (`\0`) from our query word and also in the tree, then we have found our word.

When your program successfully finds the target word, you should print it out on the screen. So you should get output like this:

```
./spellcheck hopsital
./spellcheck hospital
hospital
```

The base code we have provided uses the following function signature for the search:

```
void tst_node_search(tst_node_t *node, char *word, char *suggestion, char *sugg_start, int errs)
```

The first parameter, `node`, is simply the current node of the graph we have reached; and `word` is a pointer to the next character of the query word that needs to be matched.

For the next two parameters, the idea is that because words are formed based on that path taken through the graph, we need some way to keep track of our path. We are going to do this by reconstructing the string as we go. When `tst_node_search` is initially called, it is given a bunch (256 bytes) of space for constructing the string. At first, both `suggestion` and `sugg_start` will point to the beginning of that space. However, you will advance the `suggestion` pointer over time, while `sugg_start` will always point to the beginning of the string buffer.

At any point we can null-terminate the suggestion and print out the current reconstructed string from the beginning:

```
suggestion[0] = '\0';
printf("%s\n", sugg_start);
```

(And `errs` is not used until the next section.)

It should roughly follow this pseudocode:

```
void tst_node_search(tst_node_t *node, char *word, char *suggestion, char *sugg_start, int errs) {
    while we have a valid node {
        depending on *word {
            * less than node->c, move to node->left
            * greater than node->c, move to node->right
            * equal to node->c
                * set *suggestion to *word
                * advance both word and suggestion
                * print out the full suggestion if we matched a null character
                * move to nove->equal
        }
    }
}
```

Make sure that your code is getting this right before going on!

### Fuzzily searching a Ternary Search Tree

In order to correct spelling mistakes we will need to find matches that are not exact, but may have one or more errors. For now, we will only allow up to one error per word.

We will try to handle the following mistakes:

- Insertion: `hospital -> hosipital`
- Deletion: `hospital -> hopital`
- Replacement: `hospital` -> `hospitel`
- Transposition: `hospital -> hosptial`

The idea is that we introduce recursion to explore the many branching possibilities that differ from the exact search algorithm that we introduced in the last section. This will make the pseudocode look more like the following:

```
void tst_node_search(tst_node_t *node, char *word, char *suggestion, char *sugg_start, int errs) {
    while we have a valid node {
        if errs > 0
            * what would happen if we skipped a character in word?
                * (to fix insertion errors)
                * recursive call to tst_node_search with errs = errs - 1
            * what would happen if we assumed word has the missing character? (node->c)
                * (to fix deletion errors)
                * recursive call to tst_node_search with errs = errs - 1
            * what would happen if we replaced the wrong character in word with the right one?
                * (to fix replacement errors)
                * recursive call to tst_node_search with errs = errs - 1
            * what would happen if we swapped the next two characters in word?
                * (to fix transposition errors)
                * recursive call to tst_node_search with errs = errs - 1
        depending on *word {
            * less than node->c
                * what would happen if we went to node->right instead?
                    * recursive call to tst_node_search with same number of errs
                * move to node->left
            * greater than node->c
                * what would happen if we went to node->left instead?
                    * recursive call to tst_node_search with same number of errs
                * move to node->right
            * equal to node->c
                * what if we had gone to node->left or node->right instead?
                    * recursive calls to tst_node_search with same number of errs
                * set *suggestion to *word
                * advance both word and suggestion
                * print out the full suggestion if we matched a null character
                * move to node->equal
        }
    }
}
```

Each time we have a "what would happen if" in the above pseudocode, that means you make a recursive call to `tst_node_search` with different parameters that perform that specific alternate search. One of the important things here is that in the recursive calls, we explore a different possibility without messing up the state of the calling function. This is the benefit of recursion, that all these state changes and different possibilities are managed for us automatically by the program's stack.

We need to correctly use the `errs` variable. When we "fix" an error (and not when we take a different node branch), we decrement `errs` by one in the recursive call to `tst_node_search`. We also refuse to fix any more errors if `errs` reaches zero.

For efficiency, you should also not recurse into the alternative branches once `errs` gets to zero because those alternative branches cannot possibly give a perfect match.

### Another tree to consider for testing

Consider a tree made with only the following words:

```
tst_add(tst, "taker");
tst_add(tst, "tamer");
tst_add(tst, "taper");
tst_add(tst, "taser");
tst_add(tst, "taxer");
```

And a search for the word "taer":

```
./spellcheck taer
taker
tamer
taper
taser
taxer
```

This is an example case where we need to fix a deletion error, but there are many different ways to do this.

This is one scenario where searching all the alternative branches is important. These are the recursive calls that are described like "what would happen if we went to node->right instead?". Please notice that these branches to node->left instead of node->right or vice versa are necessary to even consider the correct fixes to find these other possible words. This is also why taking one of these alternative branches does not "use an error". Only the actual corrective steps use errors.

### Evaluation

Finally, you may find that because there are many memory operations needed to construct the full tree, your program will run much faster without the `-fsanitize=address` compiler flag. On the other hand, this flag should also be very helpful in debugging memory issues in your program!

Your program will be evaluated with its output sorted and with duplicate entries and blank lines removed, like this (the pipe `|` directs output from one program to a different program for additional processing):

```
./spellcheck readi | sort | uniq | awk NF
read
reads
ready
```
