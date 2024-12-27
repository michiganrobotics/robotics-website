---
title: "ROB 502: Programming for Robotics: Homework 4"
date: "2020-07-07"
---

## Due Wednesday, November 18 06:00PM, document updated 11/4/20 10:13pm

### Returning multiple values

The C language only allows you to easily return a single value from any function. In order to return multiple values, you have to use one of several tricks. One option is to return a structure value, where that structure contains multiple individual values. The second option is to use pointers to specify the addresses of extra return values.

For example, if we have a function that needs to return 2 integers:

```
typedef struct two_ints {
    int a;
    int b;
} two_ints_t;

two_ints_t return_4_and_5_v1(void) {
    two_ints_t value = { 4, 5 };
    return value;
}

int return_4_and_5_v2(int *val_b) {
    *val_b = 5;
    return 4;
}

int main(void) {
    two_ints_t vals1 = return_4_and_5_v1();
    printf("version 1: %d and %d\n", vals1.a, vals1.b);

    int vals2_b;
    int vals2_a = return_4_and_5_v2(&vals2_b);
    printf("version 2: %d and %d\n", vals2_a, vals2_b);

    return 0;
}
```

## Problem 1: bigrams

In this problem we will finish implementing our hash table and we will use it to find the most common bigrams (pairs of consecutive words) in Jane Austen's _Pride and Prejudice_ (the `book.txt` also used in the last class assignment).

The implementation we are using is very loosely based on/inspired by the [Google Abseil (a C++ library) "Swiss Table" family of hashtables](https://abseil.io/blog/20180927-swisstables). If/when you write actual code in C++ and you need a hashtable, I would highly recommend this library!

Here is an overview of how hash table's work. This mentions using "chaining" with linked lists. So you can guess _we_ won't be using linked lists! The basics still all hold though: [https://www.youtube.com/watch?v=shs0KM3wKv8](https://www.youtube.com/watch?v=shs0KM3wKv8)

### Hiding implementation

We will start by making a pair of files, `hashtable.h` and `hashtable.c`. We will use the header (.h) file to declare and define the interface (functions) of our hash table while including as little information as possible about its implementation. We will only be able to access our hashtable through those functions.

In order to hide the details of our hash table, we will use something called an _incomplete type_. Use the following line in `hashtable.h`:

```
typedef struct hashtable hashtable_t;
```

This line says we have a type `hashtable_t` and gives no more information about it. Any program that includes `hashtable.h` will only ever be able to work with pointers to `hashtable_t`, because the compiler does not know how big the type is, or what fields it has. Pointers, on the other hand, always have a known size.

The rest of the function definitions we put in `hashtable.h` will always work with those pointers, and only our implementation in `hashtable.c` will have the actual type definition and the functions that work on those internals.

This means that one day, we could make massive changes to our `hashtable_t` type and `hashtable.c` implementation and code using our hash table will still work correctly!

This is why the standard C libraries often use pointers for important structures. For example, if you want to work with a file in C, we always just use that pointer:

```
FILE *f = fopen("file.txt", "r");

int a = 0;
int b = 0;
int num_read = fscanf(f, "%d %d", &a, &b);
printf("We read %d numbers: %d and %d\n", num_read, a, b);

for (int i = 0; i < 10; i++) {
    int c = fgetc(f);
    printf("Character is %d or '%c'\n", c, c);
}

fclose(f);
```

Now depending on which operating system I look at, I can find multiple definitions of `FILE`!

For example, googling around I found this version:

```
struct _iobuf {
  char *_ptr;
  int _cnt;
  char *_base;
  int _flag;
  int _file;
  int _charbuf;
  int _bufsiz;
  char *_tmpfname;
};
typedef struct _iobuf FILE;
```

And then I also looked at my own computer and found this:

```
struct _IO_FILE
{
  int _flags;           /* High-order word is _IO_MAGIC; rest is flags. */

  /* The following pointers correspond to the C++ streambuf protocol. */
  char *_IO_read_ptr;   /* Current read pointer */
  char *_IO_read_end;   /* End of get area. */
  char *_IO_read_base;  /* Start of putback+get area. */
  char *_IO_write_base; /* Start of put area. */
  char *_IO_write_ptr;  /* Current put pointer. */
  char *_IO_write_end;  /* End of put area. */
  char *_IO_buf_base;   /* Start of reserve area. */
  char *_IO_buf_end;    /* End of reserve area. */

  /* The following fields are used to support backing up and undo. */
  char *_IO_save_base; /* Pointer to start of non-current get area. */
  char *_IO_backup_base;  /* Pointer to first valid character of backup area */
  char *_IO_save_end; /* Pointer to end of non-current get area. */

  struct _IO_marker *_markers;

  struct _IO_FILE *_chain;

  int _fileno;
  int _flags2;
  __off_t _old_offset; /* This used to be _offset but it's too small.  */

  /* 1+column number of pbase(); 0 is unknown. */
  unsigned short _cur_column;
  signed char _vtable_offset;
  char _shortbuf[1];

  _IO_lock_t *_lock;
#ifdef _IO_USE_OLD_IO_FILE
};
typedef struct _IO_FILE FILE;
```

Now while I might be able to access these details in my program (they didn't hide the implementation!!), whether my program will compile or not will depend on the specific computer and maybe even compiler that I use. Specifically, it will depend on the specific version of the C Standard Library (libc) I am using. While the implementations are not hid, the writers of these structures made the names start with an underscore character `_` to express that they are internal details you shouldn't mess with.

```
int main(void) {
    FILE *f = fopen("file.txt", "r");

    // One of these two lines might work! Or maybe neither one...
    printf("_flag: %d\n", f->_flag);
    printf("_flags: %d\n", f->_flags);

    // Or maybe one of these two?
    printf("_file: %d\n", f->_file);
    printf("_fileno: %d\n", f->_fileno);

    fclose(f);
    return 1;
}
```

### Linear probing

As we saw in the previous class, hash tables invariably have to deal with hash collisions, and most kinds of hash tables are defined by how they handle these collisions. The idea of linear probing is that if a spot in the table is already taken, simply try the next one until you find an empty spot. And when looking up a key, continue searching until either you find your key or you find an empty spot. If we get to the end of the hash table, we wrap back to the beginning to continue the search.

Here is a brief video going over this approach: [https://www.youtube.com/watch?v=0dCb1cq6hmI](https://www.youtube.com/watch?v=0dCb1cq6hmI)

The reason this works so well is because of something called _cache locality_ or _locality of reference_. In essence, when the computer is loading memory to the processor, it tends to load the memory in small chunks. When we load the next spot in our hash table, there is a high chance the memory is already in the processor and the load is practically free! On the other hand, if it is not already in the processor's _cache_, then we have a _cache miss_ and have to load another chunk of memory into the processor. In general, loading memory will always be the slowest operation for any data structure.

> The key to making a fast data structure is to minimize the number of random-access memory look-ups. In general, arrays are very fast when accessed sequentially because the memory loaded in chunks. On the other hand, linked-lists are slow because every link involves following a pointer and a new random-access look-up.
> 
> In our hash table implementation, looking up an element requires a memory access to calculate the hash of the key, another access to find our location in the hash table, and one more access to compare the two keys. For each time this comparison fails, we use one more memory access to compare against the new key.
> 
> In contrast, some hash tables use "chaining" to resolve collisions, and have a linked list as the base element in each spot of the hash table. Every key that hashes to this location gets to have an entry in that linked list. Each time the key comparison fails, this will use two additional memory accesses instead of one, because we have to follow the linked list before we get the new key.
> 
> By way of example, [Google's SwissTable](https://abseil.io/blog/20180927-swisstables) hash tables for C++ use highly optimized linear probing.

### Implementing the hash table

The choice of linear probing also helps make our data structure relatively simple.

Give your `hashtable_t` the following three data fields in `hashtable.c`:

- The main table of _entries_ `hashtable_entry_t`, which consist of a key (`char *`) and value (`int`).
- The total size of our main table; the _table size_.
- The number of distinct keys in our table; the number of entries in the hash table; the _size_ of our data structure from the user's perspective. (Three definitions of the same variable!)

Write a `hashtable_create` function to create an empty hash table with a default table size of 128. Make sure to use `calloc` to allocate memory for the main table because we will use null keys to indicate empty spots.

Next, write your `hashtable_set` function, which will take a key and value.

1. Use your `fxhash32` and `fibonacci32_reduce` functions from the class assignment to get a hash of the correct bit size for your current table size.
2. Using the reduced hash value as your index, check if the main hash table has an empty slot there. If it does, copy over the key and value into that entry, and increment user size/number of distinct keys by 1.
3. If the slot is not empty, compare the keys. If they match, update the entry's value.
4. If the keys do not match, increment the hash index (modulo table size), and repeat back to step 2.

Now write `hashtable_get`, which should take a key and a value pointer (`int *`), and return a boolean.

1. Same as above.
2. Using the reduced hash value as your index, check if the main hash table has an empty slot there. If it does, return false because the hash table does not contain this key.
3. If the slot is not empty, compare the keys. If they match, copy out the value of this entry using the value pointer (for example `*val = entry.value;`) and return true.
4. If the keys do not match, increment the hash index (modulo table size), and repeat back to step 2.

Test these functions with some simple inputs and make sure they work before going on!

```
char *bigram = strdup("as we"); // malloc'ed memory for the string literal
hashtable_set(ht, bigram, 1);

int count = 0;
hashtable_get(ht, bigram, &count); // count will stay 0 if bigram isn't in ht
printf("Count for bigram '%s' is %d\n", bigram, count);
```

In order to have access to `strdup` you will need to have `#define _GNU_SOURCE` as the first line in your file, and then `#include <string.h>` afterwards.

### Load factor and rehashing

In general, most hash tables in real-world applications remain small. Because of this, we want our hash table size to also remain relatively small if it only has a few elements in it. On the other hand, as the hash table fills up there will be increasingly more collisions and it can slow down.

The _load factor_ of a hash table is defined as the number of distinct keys contained in the table divided by the table size. Using the names from the above section, this would be _size_ divided by _table\_size_. Depending on how collisions are resolved by the table, we choose a maximum load factor to allow. Once the load factor reaches this maximum, we make a new hash table with an increased table size, and move all the hash table entries into this new table. We recalculate the reduced hashes for all the entries, and the number of collisions naturally drops. We will use a maximum load factor of `0.5`.

Write a new function to perform this table growing and rehashing.

1. Create a new hash table with double the _table size_
2. Iterate through the old table and for each populated entry, use `hashtable_set` on the new table to copy over that entry.
3. Carefully overwrite/update the old table's contents/data with the new one's. Although we made a new hash table internally, we need the user's pointer to the original hash table to remain valid. We can't give the user the pointer to our new hash table, so instead we need to exchange the fields of the new and old hash table. Finally, we need to free unneeded memory that is left over after this operation.

And now we also modify `hashtable_set` to have an additional check at the very beginning:

1. If the current load factor of the hash table is equal to or greater than the maximum load factor (i.e. 0.5), call the above function to grow and rehash the table.

With these changes, your code should be able to process any number of entries, so let's start looking at the getting back to our bigram problem.

### Bigrams

A bigram is a sequence of two things. For this problem we are interested in counting the English word bigrams in `book.txt`.

This text file contains punctuation and line breaks that we don't want to affect our results. First, write a function that uses `fgetc` to read the file character by character and parse out a single alphabetical word, with only consecutive letters. We will keep both lower and upper-case letters and we will treat them as distinct. Do not treat characters like commas or quotation marks special in any way, since this will make your function brittle and unlikely to work in all cases. You may find it helpful to allocate a buffer for the parsed output and then give your read-word function both this buffer as well as its length, for example:

```
char *word = malloc(256);
read_word(f, word, 256);
```

If the input is "Ben's blue-eyed dog", then the calling `read_word` five times will produce words: "Ben", "s", "blue", "eyed", "dog".

After the first word, every word you read in from the file completes a new bigram. Use `malloc` and `snprintf` to create this bigram as a new string. Then use your hash table to count the number of times you have seen this specific bigram. `snprintf` works exactly the same as `printf`, except that it prints into a string buffer instead of printing to the screen.

```
#define BIGRAM_SIZE 256

char *word1 = "we";
char *word2 = "do";
char *bigram = malloc(BIGRAM_SIZE);
snprintf(bigram, BIGRAM_SIZE, "%s %s", word1, word2); // now bigram has string "we do"
```

For example, if you have the text "we do as we do", we get the following bigrams:

- we do
- do as
- as we
- we do

And after this text our hash table should have the following entries (see the next section):

- we do -> 2
- do as -> 1
- as we -> 1

### Iterating through the table

In order to find the most common bigrams, we need some way to search through the hash table without knowing all the keys. We can do this by allowing the user to look through the raw hash table itself, but we still need to hide the specific implementation details of our table.

More sophisticated languages have better ways to support iteration, and we will just do something simple for our hash table.

Implement a `hashtable_probe_max` function to return the size of the internal table.

Implement a `hashtable_probe` to take an integer from 0 to `hashtable_probe_max`, exclusive, and if present, return the key and value for an entry at that index.

Your definitions could look like these:

```
// Use this alongside hashtable_probe
// to iterate through the table
int hashtable_probe_max(hashtable_t *ht);

// permits iterating through the table
// iterate with i from 0 to hashtable_probe_max
// and if this function returns true, key and val are copied to.
// Do not mutate key!
bool hashtable_probe(hashtable_t *ht, int i, char **key, int *val);
```

By using these values to iterate through the table you will also be able to dump the entire table contents, which may be helpful for debugging.

The idea of these functions is to let us iterate through the table. Ideally we could just do this:

```
for (int i = 0; i < ht->n; i++) {
    char *key = ht->entries[i].key;
    int val = ht->entries[i].val;
    if (key) {
        ...
    }
}
```

But we can't because we hid the implementation of the hashtable! If we try to use the above we should get an `error: dereferencing pointer to incomplete type ‘hashtable_t {aka struct hashtable}’`

So instead we write that loop like this:

```
int n = hashtable_probe_max(ht);
for (int i = 0; i < n; i++) {
    char *key;
    int val;
    if (hashtable_probe(ht, i, &key, &val)) {
        ...
    }
}
```

### Putting it all together

You will need to implement two more functions: `hashtable_destroy` and `hashtable_size` (the actual number of entries).

Your program should read all the bigrams from the given file (for example, `book.txt`) and do the following:

1. Each time your hash table rehashes, print out the number of collisions in the table before and after the resizing. Count collisions with a function just like in `hashcomp`, and make sure your function is O(N) and not O(N^2).
2. After reading the whole text, print out all the bigrams with at least 200 occurrences. If there are no bigrams with that many occurrences, print out all the bigrams.
3. Finally, output the number of distinct bigrams found.

```
./bigrams book.txt
Rehashing reduced collisions from XX to XX
...
Bigram 'of the' has count of XXX
...
Total of XXXXX different bigrams recorded
```
