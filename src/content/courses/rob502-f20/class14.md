---
title: "ROB 502: Programming for Robotics: Class 14"
date: "2020-07-07"
---

**Due Monday, November 16 6:00PM**

## Casting pointers

Fundamentally, all pointers are basically the same: they store an address in memory. In C, when we write a pointer, we also include a type that says the kind of data we are pointing to. This "pointee" type makes the pointer a lot more useful to work with, because we can pretend that we are more directly working with that target data type instead of just with an address. It also allows us to treat pointers as arrays, because the compiler knows the size of the target type and can appropriately move to the right address offset for us. However, in the end, a pointer is just an address, and we can easily cast one pointer type to another. There is even a special pointer `void *` which does not include any type at all, and is just a generic address.

Casting from one pointer type to another also makes it easier for us to convert between different interpretations of the same data:

```
uint8_t data8[] = {0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08};

// print data as 8 uint8_t's
for (int i = 0; i < sizeof(data8) / sizeof(uint8_t); i++) {
    printf("uint8_t %d: %d\n", i, data8[i]);
}

// print data as 4 uint16_t's
uint16_t *data16 = (uint16_t *)data8;
for (int i = 0; i < sizeof(data8) / sizeof(uint16_t); i++) {
    printf("uint16_t %d: %d\n", i, data16[i]);
}

// print data as 2 uint32_t's
uint32_t *data32 = (uint32_t *)data8;
for (int i = 0; i < sizeof(data8) / sizeof(uint32_t); i++) {
    printf("uint32_t %d: %d\n", i, data32[i]);
}

// print data as 1 uint64_t's
uint64_t *data64 = (uint64_t *)data8;
for (int i = 0; i < sizeof(data8) / sizeof(uint64_t); i++) {
    printf("uint64_t %d: %ld\n", i, data64[i]);
}
```

This prints out:

```
uint8_t 0: 1
uint8_t 1: 2
uint8_t 2: 3
uint8_t 3: 4
uint8_t 4: 5
uint8_t 5: 6
uint8_t 6: 7
uint8_t 7: 8
uint16_t 0: 513
uint16_t 1: 1027
uint16_t 2: 1541
uint16_t 3: 2055
uint32_t 0: 67305985
uint32_t 1: 134678021
uint64_t 0: 578437695752307201
```

Pointer casting is particularly important for setting up the entries table in `hashcomp`. We have data that should start out as either a `uint16_t` or as a string, and we want to represent it with a single pointer of type `uint8_t *` and the number of bytes `n` located at that address. It is important to understand here that we use type `uint8_t` because it is a type appropriate to our hash functions, not because our data should make any sense at all as `uint8_t` values! So we should create our data as it makes sense for us, and then finally cast it to the correct pointer type when we are done:

```
uint16_t *value = ...; // get a long-lived pointer in some valid way, e.g. by using malloc or a local variable
*value = 600; // set our value
uint8_t *data = (uint8_t *)value; // finally cast our pointer to the output type
```

### Clicker Questions

Use p4r-clicker to submit your answer

1. Suppose I give you a special number `uint32_t value = 7364963;` and promise that it is actually a null-terminated 3-character string! How would you go about printing it out as a string using `printf`?

2. Knowing how to look up an ASCII table online, and that each byte will be either in a 1's place, 256's place, or 65536's place, can you figure out what one of the characters in the message is? Choose any one character to try to manually decode.

### Final introductory note

If you are behind right now, complete at least problem 1, `helloworlds`, before continuing to work on another assignment, like `bigrams` or finishing `hashcomp`. I say this because `helloworlds` should take little time to complete but will at least introduce today's new concepts.

## Basic threading

Many simple programs can be viewed as a function that starts with some input, performs a computation, and finally delivers the output. As we progress to writing more complicated programs, we eventually have to deal with multiple sources of input and output with different requirements. We may also have to deal with long running computations that need to not freeze up the main program.

For example, I am currently writing this document in the _Atom_ text editor. Although the program is open, if I am not currently typing or interacting with the editor, it uses very little processing power. As I type, though, it is able to immediately react to display my typing on the screen. It even considers what words I may want to type and begins to offer suggestions. As soon as those suggestions are no longer possible, however, it causes them to disappear. In addition, if I change any of the files in the project I currently have open, it will also immediately show those changes in the file panel on the left.

These behaviors are only possible because the _Atom_ text editor is taking advantage of threading, or the concurrent use of multiple _threads_ of execution. The programs we are used to writing have only a single thread. By contrast, at the moment I checked the process, _Atom_ was using 28 distinct threads. Many of these threads were paying attention to different forms of input from the user. One thread was keeping track of files. Another was monitoring the GPU, because apparently the editor uses it. One thread must have been waiting for me to type. Probably the majority of the threads were waiting to be given jobs to complete by another thread, because if multiple threads can work on a problem together, they can take advantage of the many CPU cores most computers now have.

## In-class problem 1: helloworlds

In this problem we are going to start 16 different threads, and each thread will print out "Hello world from %d!" message, with the number of that thread.

We are going to be using C's _pthread_ library to handle threading. So make sure to have `#include <pthread.h>` in your file and also add `-lpthread` (use library pthread) to your makefile.

Let's also make a new `thread_info_t` structure to hold both the required `pthread_t` and also the id number we are assigning to each thread:

```
typedef struct thread_info {
    int num;
    pthread_t thread;
} thread_info_t;
```

We need to keep track of these `pthread_t` values so that we can control and interact with our threads later. In addition, our only way to communicate with the threads is through a pointer to some value. So this `thread_info_t` can conveniently be the structure that we use to communicate with our threads.

Now we can start each thread with `pthread_create`:

```
thread_info_t thread_infos[N_THREADS];
for (int i = 0; i < N_THREADS; i++) {
    thread_infos[i].num = i;
    pthread_create(&thread_infos[i].thread, NULL, thread_start, &thread_infos[i]);
}
```

The second argument can be null or used to set extra attributes for the thread. The third argument, `thread_start` needs to be a function that will be run by the new thread. The fourth argument is the pointer that will be given to the `thread_start` function when the new thread begins.

Any thread start function needs to have the following signature. The first thing we do is cast the void pointer (meaning a pointer that could be to anything) to the correct pointer type. Although we return null, it would be possible for the main program to read the return value of this function.

```
void *thread_start(void *user) {
    thread_info_t *info = user;
    printf("Hello world from %d!\n", info->num);
    return NULL;
}
```

You will likely get something like this when you run your program:

```
./helloworlds
Hello world from 0!
Hello world from 2!
Hello world from 1!
Hello world from 4!
Hello world from 3!
Hello world from 5!
Hello world from 6!
Hello world from 7!
Hello world from 8!
Hello world from 9!
Hello world from 10!
Hello world from 11!
Hello world from 12!
Hello world from 13!
Hello world from 14!
Hello world from 2101487808!
Hello world from 2101487808!
```

And each time you run it, the result should be slightly different. If the results are all too clean and perfect (everything in order and no big numbers), try commenting out the `-fsanitize=address` line in your makefile; it is slowing down your program too much.

The reason that some of the numbers are coming out of order is that Linux makes no guarantees about how it schedules when to run different threads or processes. Our program can make all these threads, but we can't control the order that they run in. This is okay! We will learn more about the difficulties and solutions to this situation in the next class.

The only actual problem we have is that on occasion the last couple lines we sometimes get very large numbers... and then somehow the wrong number of lines! This is 17 not 16!

The problem here is that the last thread was created right before the main program/thread returns. The reason that it prints out the wrong number is that the number was being stored in the `thread_infos` local variable of the main thread. When the main thread returns, this local variable no longer exists and gets overwritten with different data.

The solution to this problem is that we need to prevent the main program from exiting unless all of the threads have finished first. The function `pthread_join` waits for a pthread to finish running. So we just have to call `pthread_join` on each thread! We pass null for the second parameter because we do not care about the return value of the thread. It is important that we first create all 16 threads before calling join on any of them, or we won't be truly running the threads in parallel.

```
pthread_join(thread_infos[i].thread, NULL);
```

Run this and you should only ever get the 16 correct messages, although their order should still be unpredictable.

## In-class problem 2: parallelhashcomp

In this problem we will perform the exact same work as in the earlier _hashcomp_ problem from the class on hashing and hash tables. The only difference is that now we want to perform the various benchmarks in parallel using threads. So that we can see whether using threads like this impacts the timing, your program will also be given the number of threads to use as a command line argument.

The basic idea is that instead of directly calling some `evaluate_hash_reduce` function to evaluate a given pair of hash and reduce functions, we will instead create a thread which will then call that `evaluate_hash_reduce` function _from_ its `thread_start` function. And once we have created _n_ threads, we will wait for them all to finish before creating the next batch. You should modify your `thread_info_t` structure to contain all of the parameters necessary to call `evaluate_hash_reduce`.

Your program must output the benchmarks in the same order as the original `hashcomp`, so we need to figure out how to guarantee consistent ordering.

The key to this is that only the main thread will actually call `printf`. All of the "worker" threads will simply put their calculated result back into their `thread_info_t` object. After the main thread calls `pthread_join` on a thread, it will know that thread has finished and it can read out the result from the info, and print it to the screen. As the hash comparison problem uses a lot of data, your thread info structure will have many entries for all of the data input as well as the output (number of collisions and average time used). You do want to make sure you are sharing all of the word entries between the threads, because it would be inefficient for each thread to have to read all that data from `book.txt` again and again.

### Using `clock_gettime()` instead of `clock()`

Using `clock()` in the original problem was a good solution because this is a function that is guaranteed to exist by the C standard. Unfortunately, the standard does not say how precise it is and this could be a problem in some scenarios. The real problem is that `clock()` measures the total CPU time taken _by all the program threads summed together_, so it won't work for each thread to individually perform its benchmark for 0.5 seconds.

Instead we will use `clock_gettime()`, which should be both more precise and also allow us to measure the real-world time independently for each thread. The only problem is that this function is only available on "POSIX" compliant systems, mostly meaning operating systems related to Linux. As we have done before, we will have to define a certain preprocessor variable `_GNU_SOURCE` to allow us to use this function. Use the following function to get time in seconds:

```
#define _GNU_SOURCE
#include <time.h>

double seconds_now(void) {
    struct timespec now;
    if (clock_gettime(CLOCK_MONOTONIC, &now)) {
        fprintf(stderr, "Retrieving system time failed.\n");
        exit(1);
    }
    return now.tv_sec + now.tv_nsec / 1000000000.0;
}
```

### Evaluation

The output of your program will be in the same order as the original `hashcomp` no matter how many threads you give it to use at a time. The difference is that the lines will appear on the screen in batches according to the number of threads you are using.

```
./parallelhashcomp 1
# Runs exactly the same as ./hashcomp

./parallelhashcomp 2
# Runs hopefully about 2 times faster

# and so on
./parallelhashcomp 4
```
