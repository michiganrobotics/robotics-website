---
title: "ROB 502: Programming for Robotics: Class 5"
date: "2020-07-07"
---

### Clicker Questions

Use p4r-clicker to submit your answer

```
1. (0b11101101 << 2) & 0x0f == 0b?
2. 0xaa ^ 0xb0 == 0x?
3. printf("%s", &"taco cat"[3]);
4. char msg[] = "taco cat"; msg[6] = '\0'; printf("%s", msg);
5. sizeof(argv[1]) when you run ./test "hello world!"
6. int vals[] = {5, 15, 25, 35}; printf("%d", &vals[3] - &vals[0]);
7. int vals[] = {5, 15, 25, 35}; printf("%d", sizeof(vals) / sizeof(vals[0]))
```

## malloc and free

One of the difficulties (and opportunities!) of programming in C is that you have a lot more raw access to memory. `malloc` stands for (roughly) “memory allocate” and it allows you to ask the operating system to give your program an almost arbitrarily large amount of memory to use for anything you like. The memory it gives you will have arbitrary values and you will have to set them yourself or your program will have undefined behavior! (undefined behavior is very bad and can be very hard to debug!)

One of the main difficulties with using `malloc` is that we have to remember to also `free` the pointers given to us by malloc, or our program will “leak” memory. And, also very important, if we have freed some memory, we have to make sure to not use it again.

### Some examples…

```
char *message = malloc(1024); // 1kB for a string
message[0] = 'H';
message[1] = 'i';
message[2] = '\0'; // I could keep on going, of course!
printf("%s\n", message);
free(message);
message = NULL; // helps to remind us that the old pointer is invalid now
```

  

```
int height = 1024;
int width = 1024;
uint8_t *image = malloc(height * width * 3); // 4 megapixel RGB image
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        uint8_t *pixel = &image[(y * width + x) * 3];
        // set to medium torquise
        pixel[0] = 0x40; // R
        pixel[1] = 0xe0; // G
        pixel[2] = 0xd0; // B
    }
}
free(image);
image = NULL;
```

  

Note that when we don’t want to operate on raw bytes we need to use the `sizeof` operator to get the size of the structure/type since this depends on many factors such as computer architecture and padding.

```
int n_bodies = 128;
rigid_body_t *bodies = malloc(sizeof(rigid_body_t) * n_bodies);
for (int i = 0; i < n_bodies; i++) {
    create_random_body(&bodies[i]);
}
physics_calculation(bodies);
free(bodies);
bodies = NULL;
```

## An extra debugging tool: http://pythontutor.com/c.html

In the last class with the “addresses” example, you saw that we have three different kinds of memory: global or static memory, local variables, and heap/allocated memory. They all have different “life times” when they are valid. This can be hard to understand, so a tool like this C Tutor can help! It works best for short snippets of code, but can help you see what is going on, in addition to what you would see from using GDB or Valgrind or the AddressSanitizer or another debugging tool.

### Clicker Questions

Use p4r-clicker to submit your answer

```
size_t buffer_size = sizeof(char) * 16;
char *text_buffer = malloc(buffer_size);
printf("%s\n", text_buffer); // 8
free(text_buffer);

char *message = "Hello world";
strncpy(text_buffer, message, buffer_size);
free(message); // 9

printf("%s\n", text_buffer); // 10
free(text_buffer); // 11
```

### Makefile flags

**Please make sure you are using all the makefile flags given back in class3 for the tricolor problem!** I’ll repeat them here! You should use them for everything from here on out! The errors and warnings from these settings will help you get more feedback to quickly fix bugs:

```
CFLAGS = -ggdb3 -std=c11 -Wall -Wunused-parameter -Wstrict-prototypes -Werror -Wextra -Wshadow
CFLAGS += -fsanitize=signed-integer-overflow -Wfloat-conversion
CFLAGS += -Wno-sign-compare -Wno-unused-parameter -Wno-unused-variable
CFLAGS += -fsanitize=address -fsanitize=undefined

tricolor: tricolor.c
	gcc -o $@ $^ $(CFLAGS)
```

## Debugging memory errors

Let’s try out some common memory mistakes to see what kinds of errors we get! The error messages you get will likely be full of confusing information. Try to learn to filter just the most important things, like line numbers in your source code and the kind of error itself, like a “stack buffer overflow” or “use after free” or “double free”.

First, make sure your makefile has the Address/Undefined sanitizers disabled (just comment out with a # the last `CFLAGS +=` line above), then compile and run the following program without arguments.

```
#include <stdio.h>

int main(int argc, char **argv) {
    printf("%s\n", argv[1]);
    return 0;
}
```

You might get the classic segmentation fault. You also might get the text `(null)`. Hard to ever say what will happen with undefined behavior! If it crashed, try running it with the `valgrind` tool. For example (if you called your program ‘test’), `valgrind ./test`. (You may need to run `sudo apt install valgrind` on Ubuntu or `brew install valgrind` on Mac OS, although it appears to not work with High Sierra or more recent, in which case you won’t have access to it, and should rely on the AddressSanitizer built into the compiler more.)

At the top you should notice a section something like this:

```
==18044== Invalid read of size 1
==18044==    at 0x4C32CF2: strlen (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==18044==    by 0x5BDD9D1: puts (ioputs.c:35)
==18044==    by 0x10872B: main (test.c:4)
==18044==  Address 0x0 is not stack'd, malloc'd or (recently) free'd
```

There are several important pieces of information here:

- The program is crashing because it is trying to read 1 byte of memory that isn’t valid.
- The function actually doing the bad read is `strlen`, which can be traced back to our program on line 4.
- The bad address itself is 0x0, or NULL, which makes sense because the argv list is typically NULL terminated.

Now try recompiling with the sanitizers enabled, and running the program directly. This gives us similar information about the bug, but in a fairly different format. Try to find the same pieces of information: which line caused the problem, what the bad address is, and what the bad operation is (read or write).

Now repeat the above exercise with a couple different common errors…

```
#include <stdio.h>

int main(void) {
    char buffer[32];
    printf("%s\n", buffer);
    return 0;
}
```

You should see fairly different information/output from each method (running directly without sanitizers enabled, with valgrind, and with sanitizers enabled in makefile). Again, you also might get no error, either, it is hard to say!

And also try… This should definitely be reported as an error by most debugging tools, although is also likely to run fine without any of them enabled. Your compiler might also refuse to compile this, in which case you can disable the warning/error flags to see how this gives errors.

```
#include <stdio.h>

int main(void) {
    char buffer[32] = { 0 };
    buffer[32] = 'H';
    buffer[33] = 'i';
    buffer[34] = '\0';
    printf("%s\n", buffer);
    return 0;
}
```

And then…

```
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char *buffer = malloc(32);
    free(buffer);
    buffer[0] = 'H';
    buffer[1] = 'i';
    buffer[2] = '\0';
    printf("It still works: %s\n", buffer);

    char *buffer2 = malloc(32);
    printf("This should be different: %s\n", buffer2);
    free(buffer2);
}
```

For this example, the tools should tell you both where the suspect memory was allocated, where it was freed, and then also where it was used improperly after freeing.

Several of the above errors will also be pointed out by the submission style checker, however AddressSanitizer and Valgrind will both do a much better job of catching _all_ the memory violations in your program. The style checker will only find the simplest ones, because it doesn’t actually run your program.

## Dynamic Arrays

The [dynamic array](https://en.wikipedia.org/wiki/Dynamic_array) (called Vector in C++, List in Python, and ArrayList in Java) is a data structure that can hold any number of some kind of element, expanding itself as necessary.

If you knew that your program would need to read in 1000 ints, then you would just declare `int numbers[1000];` and be done with it. If you knew that your program will be told the number of elements it will receive, then you could just do a similar `int *numbers = malloc(sizeof(int) * number_of_ints);` and not have to worry about having enough space again either. Notice this convention for allocating an array with malloc. We multiply the result of `sizeof` used with our type by the number of elements of that type that we want.

When you can’t know beforehand how many elements need to be in your array, then you want to use a dynamic array that can resize itself accordingly.

Vectors (to use a shorter name) generally keep track of the following information: 1) the number of elements currently in the array (size), 2) the number of elements the array has space to hold (capacity), and 3) the pointer to the array itself (data).

Although you generally access the data from a vector similar to a normal array, (`nums->data[3]`), you have to use a dedicated method to append elements because the vector needs to check its capacity and potentially resize itself.

For resizing you should use the `realloc` function, which is similar to `malloc` but efficiently copies the data from the old pointer to the new one if necessary.

```
// we use sizeof(*arr) instead of sizeof(int)
// so that if the type changes our code still works.
// but they are equivalent
int *arr = malloc(sizeof(*arr) * capacity);
// do things with arr...

// now we need it to be twice as big
capacity *= 2;
arr = realloc(arr, sizeof(*arr) * capacity);
free(arr);
```

When resizing the vector it is important that capacities follow a geometric progression. For example, you can double the capacity of the vector each time. This is important because if we resize the vector every time we add an element it will be very slow. _Allocating memory is one of the slowest operations programs commonly perform!_

> One difficulty with vectors is that inserting or deleting an element from anywhere but the end can be an expensive operation, because all the values following that insertion/deletion need to be shifted over. One exception is when you are deleting an element and you don’t care about the order of the list. In this case, you can do a “swap remove” and overwrite the element you are deleting with the last element in the vector. In this case, no other elements need to be shifted around.

## In-class problem 1: golomb

In this problem we will be printing out [Golomb numbers](https://en.wikipedia.org/wiki/Golomb_sequence) in reverse order (high to low). Your program will be given a number for the Golomb sequence to not exceed and it needs to be efficient at using only enough memory to get the job done.

The basic idea then is to use a vector to store all the numbers found so far, and once we are done finding them all, we just print out the numbers from the vector in reverse!

The vector you need to implement for this can be very simple, since it will only need to implement appending. First, make a structure with the size, capacity, and data:

```
#include <stdlib.h> // defines size_t

typedef struct vector {
    size_t size; // number of elements added to vector
    size_t capacity; // number of elements that can be put in data array
    int *data;
} vector_t;
```

Next, write two functions for your vector: 1) a function to create an empty vector with some initial capacity; and 2) a function to append an element to the vector and resize the vector if necessary:

```
vector_t vector_create(void) {
}

void vector_append(vector_t *vec, int value) {
}

// use them, for example,  like this:
vector_t vec = vector_create();
vector_append(&vec, 1);
vector_append(&vec, 2);
vector_append(&vec, 3);
```

The first several numbers in the Golomb sequence are: 1, 2, 2, 3, 3, 4, 4, 4 So since the Golomb sequence uses 1-indexing:

```
Golomb[1] = 1
Golomb[2] = 2
Golomb[3] = 2
Golomb[4] = 3
Golomb[5] = 3
```

And

Finally, generating the Golomb sequence is simple:

- Start with the Golomb = \[1, 2, 2\]
- Then for each number _i_ from 3 to the maximum number we want to print
    - Look up the one-indexed Golomb\[_i_\] and add that many _i_’s to the output sequence
    - For example, since the Golomb\[3\] in our base sequence is 2, we will add two 3’s to the sequence. Since Golomb\[4\] is 3, we will add three 4’s. Since Golomb\[5\] is 3, we will add three 5’s.

```
./golomb
usage: ./golomb <max golomb number>
./golomb 0
./golomb 1
1
./golomb 2
2
2
1
./golomb 4
4
4
4
3
3
2
2
1
```
