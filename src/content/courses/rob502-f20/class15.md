---
title: "ROB 502: Programming for Robotics: Class 15"
date: "2020-07-07"
---

## Due date: Monday November 30th, 6:00pm, updated on 11/25/20 3:35pm with some small clarifications.

## ATM's and race conditions

Let's start by considering the classic ATM/cash withdrawal machine problem. You are running a bank server that keeps track of the amount of money in each user's account. One day, a user tries to withdraw $100 from two ATM's in different parts of the country at the same time.

Maybe the ATM and bank server transaction goes like this:

```
ATM1: Server, how much money is in my account?
Server: ATM1, $1000
ATM2: Server, how much money is in my account?
Server: ATM2, $1000
ATM1 dispenses $100 to the user
ATM1: Server, the user has $900 left
ATM2 dispenses $100 to the user
ATM2: Server, the user has $900 left
```

The problem is that the user should only have $800 left, so $100 has gone unaccounted for.

Although here we have described a ATM's and a bank server, the analogy also applies to a computer with multiple threads processing the same memory. In this case, the individual ATM's represent different program threads, and the bank server represents the computer's memory.

This is equivalent to a program:

```
int value = 1000; // global variable

thread1: value = value - 100;
thread2: value = value - 100;
```

This scenario is called a race condition, because depending on who "wins" the race, the program gets a different result. It is also very possible that the two ATM withdrawals are not so perfectly timed, and there is no issue.

## Mutexes

In order to address this problem, we just have to tell the bank server we are going to be performing a transaction and it will know to focus on us until the transaction is over. Here is the new scenario with this extra step:

```
ATM1: Server, I want to make a transaction
Server: ATM1, go ahead
ATM2: Server, I want to make a transaction
Server: ATM2, I'm sorry you will have to wait, I'm already working on a transaction
ATM1: Server, how much money is in my account?
Server: ATM1, $1000
ATM1 dispenses $100 to the user
ATM1: Server, the user has $900 left
ATM1: Server, I am done with the transaction

ATM2: Server, I want to make a transaction
Server: ATM2, go ahead
ATM2: Server, how much money is in my account?
Server: ATM2, $900
ATM2 dispenses $100 to the user
ATM2: Server, the user has $800 left
ATM2: Server, I am done with the transaction
```

When the ATM is asking the server to make a transaction, it is asking for exclusive access to the server. And once the server has given exclusive access to an ATM, it is "locked" and it will tell any other ATM's that they have to wait. The data structure responsible for this behavior is called a mutex, short for mutual exclusion, because it only ever allows one client to have access to some resource. Here the resource we are talking about is the memory/record of money in an account, but mutexes can also be used to manage control of other resources, like a database, collaborative online document, or a printer.

Ideally, the mutex is only _locked_ for a very short period of time, sometimes referred to as the _critical section_ of the code, after which it is _unlocked_ and other processes can gain access to the resource. It is common behavior that when your code tries to lock a mutex that is already being used, it will automatically wait for the mutex to be released so it can lock it again and then proceed. Naturally, your program will run more slowly if it is constantly waiting for a shared resource to be released by different parts of the program.

## The dining philosophers problem

"Five silent philosophers sit at a round table with bowls of spaghetti. Forks are placed between each pair of adjacent philosophers.

Each philosopher must alternately think and eat. However, a philosopher can only eat spaghetti when they have both left and right forks. Each fork can be held by only one philosopher and so a philosopher can use the fork only if it is not being used by another philosopher. After an individual philosopher finishes eating, they need to put down both forks so that the forks become available to others. A philosopher can take the fork on their right or the one on their left as they become available, but cannot start eating before getting both forks."

[https://en.wikipedia.org/wiki/Dining\_philosophers\_problem](https://en.wikipedia.org/wiki/Dining_philosophers_problem)

What kind of instructions could you give to the philosophers so that all can both eat and think? (Try to make your idea short) **15.1 Use p4r-clicker to submit your answer**

The core problem here is how to avoid _dead lock_, a scenario in which a program is unable to make to make progress because different parts are simultaneously waiting for each of the others to finish first. In this scenario, dead lock might looks like each philosopher holding a fork in their right hand while waiting for the fork on the left to become available. No philosopher puts the right fork down so no philosopher can ever pick up a left fork.

We also need to avoid another degenerate case called _live lock_. In live lock, the program has activity and resources/mutexes are locked and freed, but the program still can't make progress because no one thread ever has all the right resources to finish its part. In this scenario, live lock might involve each philosopher picking up the left fork, waiting 5 seconds for the right fork, putting the left fork back down and picking up the right fork, waiting 5 seconds, and so on repeating. They are trying to give opportunities to each other but no one is able to get both forks at the same time in order to make progress anyway.

## Video example using YouTube and Twitter: "Why Computers Can't Count Sometimes"

[https://www.youtube.com/watch?v=RY\_2gElt3SA](https://www.youtube.com/watch?v=RY_2gElt3SA)

## In-class problem 1: buffer

In this problem we will have two threads that are communicating with each other over a shared stack buffer. The producer thread will be putting messages onto the stack, while the consumer thread will be popping the messages off and displaying them to the user. Remember that a stack will give us last-in-first-out behavior, which will reverse many of the messages.

There will be a total of 30 messages, consisting of the numbers from 0 to 29 inclusive. The stack buffer will only be 8 elements long, meaning that the producer and consumer will need to take turns to consume all 30 messages.

We might expect the following sequence of events, then:

- The producer fills up the buffer with 8 elements: 0, 1, 2, 3, 4, 5, 6, 7
- The consumer pops those 8 elements off the buffer: 7, 6, 5, 4, 3, 2, 1, 0
- The producer fills up the buffer with 8 elements: 8, 9, 10, 11, 12, 13, 14, 15
- The consumer pops those 8 elements off the buffer: 15, 14, 13, 12, 11, 10, 9, 8
- etc...

Which would result in total output of:

```
7
6
5
4
3
2
1
0
15
14
13
12
11
10
9
8
etc...
```

If the threads switch a little more unreliably, we might get:

- The producer pushes 4 elements: 0, 1, 2, 3,
- The consumer pops off 2 elements: 3, 2
- The producer pushes 5 elements: 4, 5, 6, 7, 8
- The consumer pops off 1 element: 8
- The producer pushes 1 element: 9
- The consumer pops off 7 elements: 9, 7, 6, 5, 4, 1, 0
- etc...

```
3
2
8
9
7
6
5
4
1
0
etc...
```

I hope it is clear then, that depending on how the operating system chooses to run the threads, we can get different results! And some of the results will be even less clean that these.

### Implementation

First, use a pair of global variables to define our buffer:

```
int buffer[BUFFER_CAPACITY];
int buffer_size = 0;
```

We need to use both of these variables to fully define this stack buffer. We need to use the `buffer_size` to know what indices in `buffer` are valid at any point in time!

### The producer thread

Write a producer thread function to push the messages onto the stack:

```
void *producer_thread(void *user) {
    // loop over all 30 messages, trying to put them on the stack
    // only quit and set 'producer_finished = true' once ALL 30 messages
    // have been sent
    return NULL;
}
```

If the stack is already full, the thread should sleep to give the consumer time to catch up. We specify the minimum amount of sleeping time here, 1 nanosecond, because the consumer will need very little time to read at least one message. Also, Linux will likely sleep the thread for a lot longer, anyways, because sleeping a thread is not very precise.

```
// wait a nanosecond, or as little as possible
struct timespec interval = {0, 1}; // the former number is seconds, the latter is nanoseconds
nanosleep(&interval, NULL);
```

Your producer thread should set a flag before it exits to tell the consumer that all the messages have been written. This is important because some of messages will likely be lost, so we can't just wait until we get all 30! Choose a reasonable name for this flag, like `producer_finished`.

### The consumer/main thread

The main thread will first start up the producer thread, and then it will act as the consumer:

```
int main(void) {
    pthread_t producer;
    pthread_create(&producer, NULL, producer_thread, NULL);

    // this thread is now the consumer thread

    return 0;
}
```

The consumer thread will _busy wait_ for messages in the buffer. Busy waiting is when a thread continually checks for new data in a while loop without calling any kind of sleep function. This is useful when we have to react instantly to some condition or message and can afford the high CPU usage of busy waiting. As soon as any message is available (even just one!) the consumer will remove it from the stack and print it to the screen.

The consumer thread will exit once the buffer/stack has been emptied and the flag indicating the producer has finished is set.

### Using pthread\_mutex\_t

You should notice that your program up to this point is very inconsistent. Not only should the order of the messages change every time, but some messages will be duplicated or even missing!

This happens because the two threads will sometimes end up switching between themselves in the middle of an operation on the stack. For example, a push onto the buffer involves changing both `buffer_size` and also `buffer[i]`, but the other thread might end up popping an element in the middle of the push operation! Ultimately, this results in pushes and pops that fail to work as intended.

The solution to this is using a mutex to "lock" `buffer` and `buffer_size` so that we can finish modifying both of them together, uninterrupted. You need to make sure that the lock and unlock operations are around a section of code that is as small and fast to execute as possible. This means that while you should read from the buffer in that _critical section_, you should not call `printf` until after you have released the mutex. You will need to add these sections to both the producer and the consumer.

Allow your program to take an optional command line argument "mutex" indicating that it should use a mutex:

```
./buffer
// output for not mutex

./buffer mutex
// output using the mutex
```

```
// add this new global variable to your program
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

// to then acquire the mutex
pthread_mutex_lock(&mutex);

// and to release it
pthread_mutex_unlock(&mutex);
```

### A note on optimization

Because C uses an external library for threading (pthreads), the language itself has no inherent ability to understand that data shared by threads needs to be treated differently. Most of the time this isn't a problem, however when you have higher optimization levels enabled (e.g. `-O2` or `-O3`), this can cause problems. In order to see all the interesting behavior in this problem (and pass all the tests), please _do_ enable `-O3` optimization and also disable the address sanitizer (well, leave it enabled as long as you think you might have any memory bugs, but then disable it!).

For example the following code can get _optimized_ like so:

```
while (!producer_finished) {
    // do stuff that doesn't change the value of producer_finished
}
```

is optimized to

```
if (!producer_finished) {
    while (true) {
        // do stuff that doesn't change the value of producer_finished
    }
}
```

and this is a bad infinite loop! But it makes sense that the compiler would do this, because after all, if the value of `producer_finished` can't change, then there is no need to check it every time through the loop!

The compromise solution in C is to mark the variable `producer_finished` as `volatile` in its variable definition:

```
volatile bool producer_finished = false;
```

The keyword `volatile` tells the compiler to not cache the variable and instead access it from memory every time it is used. This keyword was originally meant to be used with physical memory-mapped hardware (like on an embedded microcontroller), where the compiler can never now when the physical memory has changed, so it isn't perfectly suited to use with threads, but it is still necessary to prevent the compiler from caching a value that might change because of another thread.

Please note that you might need to use `volatile` with other variables in your program!

### When do you need volatile?

You need to mark a variable as volatile when:

- It is used multiple times in a function
- And the correct behavior of that function depends on the variable's value being changed by another thread
- And you have optimization enabled (but even if not, you should use volatile for good measure!)

So the following needs volatile:

```
volatile bool producer_finished = false;

int main(void) {
    // start another thread that changes producer_finished
    while (!producer_finished) {
        // do stuff that doesn't change producer_finished
    }
}
```

And the following does not:

```
bool producer_finished = false;

void do_stuff(void) {
    if (producer_finished) {
        exit(0);
    }
    // do stuff
}

int main(void) {
    // start another thread that changes producer_finished
    while (true) {
        do_stuff();
    }
}
```

Note that `volatile` and mutexes solve completely different problems, and you may need `volatile`, or a mutex, or both, and it will depend on your specific program.
