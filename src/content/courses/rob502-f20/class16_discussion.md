---
title: "ROB 502: Programming for Robotics: Class 16"
date: "2020-11-19"
---

## Clicker Questions

Use p4r-clicker to submit your answer

1. How many different outputs are possible for the following program?

```
int number = 0;

void *thread2(void *user) {
    for (int i = 0; i < 9; i++) {
        number += 1;
    }
}

void *thread3(void *user) {
    for (int i = 0; i < 9; i++) {
        number += 10;
    }
}

void *thread4(void *user) {
    for (int i = 0; i < 9; i++) {
        number += 100;
    }
}

int main(void) {
    pthread_t threads[3];
    pthread_create(&threads[0], NULL, thread2, NULL);
    pthread_create(&threads[1], NULL, thread3, NULL);
    pthread_create(&threads[2], NULL, thread4, NULL);

    printf("%d\n", number);

    return 0;
}
```

In theory, when dealing with multiple threads, there are no guarantees about the order that they run in, or for how long any thread runs when it does run. The operating system may choose to run them all on separate processor cores simultaneously, or it might choose to run them all on a single core, and alternate between them and other processes. This is all unpredictable to your program, since you also can't know for sure what operating system your program will run on. So it is possible for any ordering of thread executions to happen. For example, by the time the main thread goes to print `number`, each thread may have run any number of loop iterations, modifying `number`. So it is possible for any of **1000** different numbers to be printed out, including every number from 0 to 999.

2. In practice, what do you think are the most likely results? (if you have more than one, put them in order from most to least likely) My personal guess was that 0 would be the most likely result, because perhaps the newly created threads would not have a chance to run before we get to the `printf`. In practice on my laptop, however, I got the numbers **9** and **99** about 50% of the time each. On one occasion I also got 90 as a result. This happens because running `pthread_create` itself is relatively slow, and so starting `thread3` gives `thread2` a chance to run, and starting `thread4` gives `thread2` and `thread3` a chance to run. Because the threads themselves have such short and fast loops, it is very likely that if the thread runs at all, it will run to completion. `thread2` seems to always run to completion, and `thread3` runs to completion about half the time. Apparently in a rare case, `thread2` didn't manage to run, while `thread3` did, giving the result of 90, but `thread4` doesn't have anything happen after it, and so doesn't have enough time to run and do anything before the `printf`.

We will now use the following pseudo-program:

```
ht = hashtable_create()

word = block of memory for 256 characters
last_word = block of memory for 256 characters
for each word in "file" copied/read into word:
    if not first word in file:
        bigram = combination of last_word, " ", and word
        if bigram in ht:
            ht[bigram] += 1
        else:
            ht[bigram] = 1
    copy word into last_word

# We are not calling hashtable_destroy at the end!
```

3. For this file, how many total calls to `malloc` must have been made?

```
0 1 2 3 4 5 6 7 8 9
```

As we form our hash table, we have been using 2 calls to `malloc`, one for the structure itself and one for the internal table. Then we have two (optional, since we could have used arrays on the stack) allocations for `word` and `last_word`. Most importantly, we have the bigrams that need to be put into the hash table. Whether these are malloced when we form the bigram or when we put it into the hash table, we need to have a call for `malloc` for each unique bigram so that the hash table can keep track of them. In the file example, there are exactly 9 bigrams and they are all unique, so we would have a total of 2+2+9=**13** calls to `malloc`.

4. For this file, at the end of the program, how many more calls to `malloc` need to have been made than to `free`? In other words, how many blocks of memory do we need to still have accessible?

```
0 1 2 3 4 5 6 7 8 9
```

The only real difference here is that it would be okay for `word` and `last_word` to be freed by the end of the program. In the end, our valid hash table must still have the 9 bigrams and the 2 hash table allocations for **11** total.

5. And for this file?

```
0 1 2 3 4 5 6 7 8 9
0 1 2 3 4 5 6 7 8 9
```

This file has a total of 19 bigrams, of which 9 are duplicates. We have one new bigram: "9 0". The hash table has no way of storing the duplicate bigrams, so they should all get freed at some point. We should have a total of **12** outstanding allocations left, just one more for the one new bigram!
