---
title: "ROB 502: Programming for Robotics: Class 4"
date: "2020-07-07"
---

## The sizeof operator

`sizeof` is an interesting operator in C. It returns the number of bytes that a type uses. Most of the time, this is a value of 1 (e.g. char, uint8_t), 2 (e.g short, int16\_t), 4 (e.g. int32\_t or int), or 8 (e.g. a pointer, double). If the variable is \_directly declared_ as an array, then it will give the total number of bytes in that whole array.

### Clicker Questions

Use p4r-clicker to submit your answer

```
1. 13 & 1 == ?
2. 20 >> 3 == ?
3. (0b11101101 >> 2) & 0x0f == 0b?
4. 0xa0 ^ 0xb0 == 0x?
```

Now, using the following code:

```
char a = 'a';
int b = 100;
char c[40] = {0};
char *d = c;
```

```
5. sizeof(a)
6. sizeof(b)
7. sizeof(c)
8. sizeof(d)
```

### About pointers

Although we can think about arrays and strings in C fairly naturally, we can also look at them as being pointers. For example, the following equalities hold:

```
str[0]   == *str
str[1]   == *(str + 1)
str[-1]  == *(str - 1)
&str[0]  == str
&str[1]  == str + 1
&str[-1] == str - 1
```

Although from the perspective of an array or string literal, the index -1 makes no sense, as far as C and the computer are concerned, it is simply referring to an arithmetic operation on the address.

This means that we can use pointers both to represent arrays and strings, but also to “move around” in them.

```
char message[] = "Hello world! I am very excited to be learning about pointers today\n";
char *submessage = &message[23];
printf("I am not %s", submessage); // I am not excited to be learning about pointers today

char *subsubmessage = submessage + 29;
printf("Be friends with %s", subsubmessage); // Be friends with pointers today

char *othermessage = subsubmessage - 10;
printf("I am think%s", othermessage); // I am thinking about pointers today

// Zero out the original message
// strings in C are "null-terminated" meaning whenever they get to a 0 in the string
// that means the string is now over.
size_t messsage_len = strlen(message);
for (size_t i = 0; i < message_len; i++) {
    message[i] = '\0';
}

printf("I am think%s", othermessage); // I am think
```

### Clicker Questions

Use p4r-clicker to submit your answer

```
char message[] = "taco cat";
printf("%s", &message[5]); // clicker question 9
printf("%s", message + 2); // clicker question 10
message[4] = '\0';
printf("%s", message); // clicker question 11
printf("%s", message + 5); // clicker question 12
```

### Extra point about pointers

Besides their use in moving around and manipulating arrays, pointers are also useful when you want to allow a function to modify a variable you pass it.

```
void add_one(int a) {
    a += 1;
}

void add_one2(int *a) {
    *a += 1;
}

void main(void) {
    int b = 1;

    add_one(b);
    printf("%d\n", b); // prints 1

    add_one2(&b);
    printf("%d\n", b); // prints 2

    return 0;
}
```

## In-class problem 1: addresses

In this exercise we will be exploring the nature of “addresses”. On a computer, every piece of data lives somewhere in the computer’s memory and has an address, specifying that location. In C, we can get the address of a piece of data by prefixing the variable with `&`. We can also print out the address by using the `%p` specifier of `printf` and casting the type to `void *`, which is the type of a generic address.

For example:

```
int main(void) {
    int variable = 10;
    printf("%p\n", (void *)&variable); // does NOT print 10!
    return 0;
}
```

Start with this program, that doesn’t do anything but declare memory in three different ways. At the top of the program we have variables that are shared by the entire program. In main we have variables declared just for the function main, and then we also ask `malloc` to provide us with memory on the _heap_ for one variable:

```
#include <stdio.h>
#include <stdlib.h>

// global static memory
char char1;
int int1;
double arr1[2];

int main(void) {
    // local stack memory
    char char2;
    int int2;
    float arr2[2];

    // manually allocated heap memory
    void *mem = malloc(1);

    free(mem);

    return 0;
}
```

Have your program print out the following things in order, one thing on each line, with no extra text:

- address of char1
- address of int1
- distance/difference between char1 and int1, (you must cast the pointers to long)
- address of arr1
- address of arr1\[0\]
- address of arr1\[1\]
- distance/difference between arr1\[0\] and arr1\[1\] (casting the pointers to long)
- distance/difference between arr1\[0\] and arr1\[1\] (without casting the pointers to long)
- each of the above lines but with char2, int2, and arr2
- value of mem (as a pointer), since it is _already_ an address!

You will notice that the addresses are printed out in hexadecimal, which is the convention for addresses.

We cannot directly compare the pointers to the char and int variables, and the compiler will give us an error if we try. We can make the subtraction work by casting each address to a `long` (long integer) before the subtraction. Do not cast to a long pointer, `long *` because we explicitly want to treat the addresses as numbers and not pointers:

```
long difference = (long)pointer_a - (long)pointer_b;
```

We’ll talk more about dynamic memory and malloc/free later, but it is a third kind of memory.

### What do these different memory addresses mean?

The variables at the top of your program exist in static memory, meaning that those memory addresses and their data are valid throughout the life of your program.

The variables declared inside of main exist on the _stack_. Whenever a function is called, it adds a bunch of data/variables onto the stack, and when that function returns, it “pops” those values off of the stack. So these memory addresses are only valid for as long as main is running. When main returns, these memory address and their data may be reused for something else.

Finally, the memory address returned by `malloc` is located on the _heap_. This is an area of memory used exclusively whenever the program explicitly asks for memory. It is valid until the exact memory address is released with `free`.

Since all three of these types of memory and data have different lifetimes, it makes sense that the memory addresses themselves are located in different regions of memory.

## In-class problem 2: substring

In this problem we will search a file for a key (some string) and then print the text that comes before each instance of that key, as shown below.

```
./substring
usage: ./substring <file> <key> <lines before>
./substring searchs.txt season 0
Could not open searchs.txt: No such file or directory
./substring search.txt season 0
season

season

./substring search.txt season 1
it was the season

it was the season

./substring search.txt season 2
it was the epoch of incredulity,
it was the season

it was the season of Light,
it was the season

./substring search.txt best 3
It was the best

```

The _lines before_ parameter means the number of lines to print before our target key. Zero means we only print the word itself. One means we print only the part of the current line that is before our target key (including it). And two or greater includes the full lines the come before. Essentially the _lines before_ is the number of newline characters we need to find as we go backwards from the target key. Use the `atoi` function to parse a string as an integer.

There could be many different approaches to solve this problem, but we are trying to get practice working with pointers, so let’s follow the approach below which avoids needing to copy memory:

- Use the `strstr` substring function with your text and key. It will return a pointer to the first instance of the key that it finds in the text. If it can’t find it, it returns NULL.
- Write a “get context” function that takes an instance of the key found by `strstr` and looks back to find the start of the requested number of lines, making sure not to look back earlier than the actual string goes.
- The program will first call `strstr` to find the key and then call your context function to get the starting location. It then prints the text between the starting location and the end of the key. It repeats these three steps as many times as necessary, each time calling `strstr` with a pointer into the text at a point just after the last key we found. This way, the text string always “looks” smaller, even though we aren’t actually modifying it.
- When printing out the full context around each instance, make sure to stop right after the found key. You may need to temporarily add a null terminator to the string.

We have provided you code that will read the file into memory.
