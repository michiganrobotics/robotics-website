---
title: "ROB 502: Programming for Robotics: Class 3"
date: "2020-07-07"
---

## Note, updated template file for tricolor problem

Run the following command to get my updated template file:

```
git pull upstream master
```

If you have already started working on the problem you will probably have to resolve a _merge conflict_. At every step of the way, use `git status` to know what step you are currently in the process:

1. Git will add both versions (what you had, and what I added) to the file with some <<<<<< and ======= and >>>>>>> markers to separate them.
2. It will be your job to manually combine/merge the different sections of code and delete the extra markers.
3. Then you can `git add` the change and `git commit` the merge. At that point, the merge will be considered finished.

## ASCII Representation

The American Standard Code for Information Interchange (ASCII) defines meanings for the numbers 0 to 127. This allows an ASCII character to take up only 7 bits. Generally, the 8th bit is set to 0, although various extensions may use the numbers larger than 128 for special symbols.

The important thing for us is how lower and upper-case letters are represented. `A` through `Z` fit at codes 65 to 90, and `a` through `z` fit between 97 and 122. So the difference between upper and lower case versions of a character is always 32, the same as a single bit being flipped.

This means you get the following equivalence:

```
// Choose one of these lines to uncomment:
// char letter_a = 'A';
// char letter_a = 65;

printf("letter_a: %c\n", letter_a); // prints letter_a: a
printf("letter_a: %d\n", letter_a); // prints letter_a: 65
```

However, even though 65 and ‘A’ are the same number, using a character literal when that is your _meaning_ is a lot clearer! Don’t directly use the number values. Some more examples:

```
if (letter >= 'a') {
    printf("This letter must be lower-case because all the lower-case letters have higher values!\n");
}
printf("The difference between z and a is: %d\n", 'z' - 'a');
```

To express the intent of the difference between lower and upper case, I would recommend you calculate it as `'a' - 'A'` instead of hard-coding the value 32. Even better, you could use a C _define_ for that value:

```
#define TO_LOWERCASE ('a' - 'A')
// or alternatively
#define TO_UPPERCASE ('A' - 'a')

// now 'z' + TO_UPPERCASE == 'Z'

// we explicitly cast to char since C likes to make the addition of chars result in an integer
// which is too big to fit into the 8-bit character
char letter = (char)('z' + TO_UPPERCASE);
```

Create and run the following program (you could call it `args.c` if you like). This shows how to access the different command line arguments, and how characters are also numbers.

```
#include <stdio.h>
#include <stdint.h>
#include <string.h>

int main(int argc, char **argv) {
    printf("This program was given %d arguments\n", argc);
    for (int i = 0; i < argc; i++) {
        char *arg = argv[i];
        printf("The %d argument is %s\n", i, arg);

        size_t len = strlen(arg); // size_t is an unsigned long integer
        for (int j = 0; j < len; j++) {
            printf("%d: character %c = %d\n", j, arg[j], arg[j]);
        }
    }
    return 0;
}
```

Note that `strlen` returns a value of type `size_t` which is defined to be an unsigned integer type for counting bytes (representing sizes in bytes). If you like, you could also explicitly cast it to be an integer, if you know the size must be small (could not be greater than 2^31 - 1):

```
int len = (int)strlen(arg);
```

Here are some of the other codes, if you are interested:

> Codes 0-31 are _control characters_. Some of these are now only rarely used, like Enquiry (number 5). Others are very common, such as the new line (number 10, often written as ‘\\n’), carriage return (number 13, or ‘\\r’), and NULL terminator (number 0, ‘\\0’). Some might surprise you to be ASCII characters, like the backspace (number 8, ‘\\b’).
> 
> Codes 32-47 are a variety of symbols: in order, starting with a space ‘ ‘ and then !”#$%&’()\*+,-./
> 
> Codes 48-57 are the digits: 0123456789

### Note: Command line arguments and the shell

> When you run a program from the command line, for example `cp *.txt folder/` to copy all the txt files in your current directory into “folder”, you aren’t actually _directly_ running the “cp” program. This is because there needs to be some program to look at your command and figure out which program on the hard drive “cp” refers to. This program is called a _shell_, and it also provides many other features to make it easy to run commands and string them together in various ways. The most common shell is called “bash”, the Bourne-Again Shell. If you look at the manual for the “cp” command, you might notice that it never talks about being able to use an asterisk as a wild card to copy multiple files. This is because when you type something like `*.txt` on the command line, your shell performs “wildcard expansion” and actually ends up giving cp a list of files that happened to all end in “.txt”.
> 
> So after the shell has done its work, the command `cp *.txt folder/` might actually look more like this:
> 
> `execv("/bin/cp", (char*[]){"cp", "file1.txt", "file2.txt", "file3.txt", "folder/", NULL });`
> 
> `execv` is the actual name of the Linux _system call_ to run programs. System calls are provided by the operating system and are the lowest level of access between your program and the rest of the computer. For example, all input and output of your program must pass through system calls. If this was used to run your C program, you would have access to these command line arguments.
> 
> A program declared with `int main(int argc, char **argv)` would then have `argc` of 5 and `argv` with the array of strings `"cp", "file1.txt", "file2.txt", "file3.txt", "folder/"`. It is convention that the first command line argument will be the string you wrote to specify the program, here just “cp” even though the actual program is at “/bin/cp”. If we had run `/bin/cp *.txt folder/` instead, then the first command line argument would have also been “/bin/cp”.
> 
> If you don’t want the wildcard expansion or you want spaces to actually appear in a single argument, you can tell the shell to do this by using quotes. `cp "*.txt" folder/` would try to copy a file that literally has an asterisk in its name. And `cp "file1.txt file2.txt" folder/` would try to copy a single file that actually has a space in the middle of it.
> 
> The shell can actually do a _lot_ of useful things. The class scripts “p4r-submit” and friends are all shell scripts, gluing together various simple programs/utilities. One of the core ideas of Linux (and Unix) is that it should be easy to tie single-purpose programs together into sophisticated scripts.

## In-class problem 1: upper

In this problem, your program should capitalize its command line arguments if they are between ‘a’ and ‘z’. Otherwise, your program will print them unmodified. Notice that the spaces between arguments on the command line are not given to your program unless you use quotes! Note that single quotes prevent bash from interpreting special symbols. NOTE: you don’t not need to know anything about pointers for today’s assignments! Think about strings as _arrays_ of characters.

```
./upper
usage: ./upper <text>
./upper hello
HELLO
./upper hello world
HELLOWORLD
./upper "hello world"
HELLO WORLD
./upper "hElLo WoRlD :)"
HELLO WORLD :)
./upper "hello world" "have fun"
HELLO WORLDHAVE FUN
./upper '@!'
@!
```

When the user runs the program without extra arguments (argc is only 1), you should print out some error message saying how to use the program and return an exit code of 1.

## Bitwise operations

For an overview of bitwise operations, how they work, and when they are useful, please see: [https://www.codeproject.com/Articles/2247/An-introduction-to-bitwise-operators](https://www.codeproject.com/Articles/2247/An-introduction-to-bitwise-operators)

### Clicker Questions

Use p4r-clicker to submit your answer

```
1. Do you know what these operators do (Y/N)? &, |, ^, <<, >>
2. 20 & 1 == ?
3. 20 >> 2 == ?
4. (0b11100111 >> 2) & 0x0f == 0b?
5. 0xf1 ^ 0xf2 == 0x?
```

## In-class problem 2: parity

In this problem you will compute the overall _parity_ of some text.

Parity is the number of one-bits modulo 2, and is often described as being “even” or “odd” in the number of one-bits.

So the binary number 0b01000001 (‘A’) has 2 one-bits, and therefor has even parity, which we could indicate with another 0 bit. On the other hand, 0b01100001 (‘a’) has 3 one-bits, odd parity, and could be represented by a parity bit of 1. The string of “Aa” together then has 5 one-bits, and also has odd parity.

If there is no text at all, then the parity will just be 0, as there are 0 one-bits.

Including a parity-bit is very common in simple transmission schemes because it can detect a bit error in the transmission (albeit only one) at the cost of only one extra bit. Many more complicated error detecting and correcting codes are based on generalizations of the idea of parity.

```
./parity
0
./parity A
0
./parity a
1
./parity Aa
1
./parity Too many arguments
usage: ./parity [<text>]
```

### Debugging with GDB

As the next problem is slightly trickier, it may help to have a brief initial introduction to GDB, the GNU debugger. When debugging sometimes you know exactly which variables you need to check, and you can debug very effectively with printf statements. However, sometimes you know something is fishy going on but you aren’t sure what the issue is.

In this kind of situation it can be very helpful to run your code in GDB to test which of your assumptions about your programs operation is wrong. In the debugger you can test many different hypotheses very quickly!

First make sure you have gdb installed, for example with `gdb --version`. If you need to install, on Ubuntu (or WSL Ubuntu) run `sudo apt-get install gdb` and on Mac OS run `brew install gdb`. On Mac OS, you have to follow extra installation instructions to give GDB permissions to work correctly: [https://www.ics.uci.edu/~pattis/common/handouts/macmingweclipse/allexperimental/mac-gdb-install.html](https://www.ics.uci.edu/~pattis/common/handouts/macmingweclipse/allexperimental/mac-gdb-install.html)

In order to use it, you have to add the `-g` to your gcc compile line in your makefile. You might need to `rm` (remove/delete) your old program so that make can compile it from scratch with the new settings (generally it only remakes when the source code file changes).

Several commands in GDB are very useful:

- `q` or `quit` to exit GDB. You can also use Ctrl+D to send an end-of-file signal.
- `r` or `run` to actually run your program. Your programs command line arguments generally come after the run command.
- `p` or `print` to print out a variable or expression
- `break` to set a breakpoint on a line. The program will stop running when it gets to that line.
- `delete` to delete a breakpoint by number, or to delete all breakpoints.
- `n` or `next` to run the next line of code.
- `s` or `step` to run the next line of code _or_ step into the next function’s first line.
- `u` or `until` is like next but doesn’t stop for every iteration through a loop. You can also give it a line number to run until.
- `c` or `continue` to continue running your program until a breakpoint is hit.
- `l` or `list` to show your programs code.
- `where` gives you the nested list of all functions that have been called. If your program crashes calling a function like `fscanf` this will tell you which line of your own program made the call to `fscanf` that crashed.
- `up` and `down` let you travel through the call stack listed by `where`. If you crashed in `fscanf` you can use `up` to get back to your own program code and investigate from there.

```
gdb parity
...
Reading symbols from parity...done.
(gdb) break parity.c:10
Breakpoint 1 at 0x1100: file parity.c, line 10.
(gdb) run "Hello world"
Starting program: .../parity

Breakpoint 1, main (argc=2, argv=0x7fffffffdcc8) at parity.c:10
10	    if (argc > 1) {
(gdb) p argc
$1 = 2
(gdb) p argv[1]
$2 = 0x7fffffffe08a "Hello world"
(gdb) until 12
main (argc=2, argv=0x7fffffffdcc8) at parity.c:12
12	        int i = 0;
(gdb) c
Continuing.
0
[Inferior 1 (process 16815) exited normally]
```

### Seg faults with GDB

Another major use of gdb is to help make debugging segmentation faults easy.

For example, the following program tries to read from a file:

```
#include <stdio.h>

int main(void) {
    FILE *f = fopen("file", "r");
    char line[128];
    fgets(line, 128, f);
    printf("first line is: %s\n", line);
    return 0;
}
```

```
./filetest
Segmentation fault (core dumped)

gdb ./filetest
(gdb) run
Program received signal SIGSEGV, Segmentation fault.
_IO_fgets (buf=0x7fffffffd6f0 "h\242\377\367\377\177", n=128, fp=0x0) at iofgets.c:47
47	iofgets.c: No such file or directory.
(gdb) where
#0  _IO_fgets (buf=0x7fffffffd6f0 "h\242\377\367\377\177", n=128, fp=0x0) at iofgets.c:47
#1  0x0000555555554789 in main () at primes.c:6
(gdb) up
#1  0x0000555555554789 in main () at primes.c:6
6	    fgets(line, 128, f);
(gdb) p f
$1 = (FILE *) 0x0
```

So after we run the program, it automatically breaks when it gets the seg fault. From here we can find the location of the crash with `where` and then move up the call stack with `up` until we get to our own line. Finally, we can investigate this line, and discover that our file open failed because we have a null pointer for our file.

### Helpful gcc flags

There are a lot of options that we can give the gcc compiler to help us out more. We have tried to curate a good set of these to use for the remainder of the class. Essentially, these flags will instruct the compiler to give errors about various potential bugs or bad practices in your code. In addition, the `-fsanitize=address` option is particularly sophisticated in that it can detect many errors relating to memory, addresses, and pointers and give you feedback about what happened. While this tool (the AddressSanitizer) is very useful, it can sometimes clash with other tools such as GDB or Valgrind, so you should know how to disable it (comment out that line with a `#`). We will explore the AddressSanitizer and other tools more in a later class session.

```
CFLAGS = -ggdb3 -std=c11 -Wall -Wunused-parameter -Wstrict-prototypes -Werror -Wextra -Wshadow
CFLAGS += -fsanitize=signed-integer-overflow -Wfloat-conversion
CFLAGS += -Wno-sign-compare -Wno-unused-parameter -Wno-unused-variable
CFLAGS += -fsanitize=address -fsanitize=undefined

tricolor: tricolor.c
	gcc -o $@ $^ $(CFLAGS)
```

In this same way, you could also add other variables to your makefile!

### Clicker Questions

Use p4r-clicker to submit your answer

1. Convert 201 in trinary to decimal.
2. Convert 10 in decimal to trinary.

## In-class problem 3: tricolor

In this problem, we will “decompress” a compressed image of an animal with only three “colors”: “@”, “:”, and “ “.

A single byte (8-bits) can encode 256 possibilities. Five trits (base 3 digits) require 243 possibilities, and can therefore fit into a byte.

A simple (and very fast!) way to manage this translation between bits and trits is to use a lookup table. When your program starts, it calculates a table with 243 entries, and then fills them in one-by-one with the different possible values for the five trits.

So the table would end up looking like this, just counting up in trinary with `' ' == 0`, `':' == 1`, and `'@' == 2`.

```
trit_encodings[0] = "     ";
trit_encodings[1] = ":    ";
trit_encodings[2] = "@    ";
trit_encodings[3] = " :   ";
trit_encodings[4] = "::   ";
trit_encodings[5] = "@:   ";
trit_encodings[6] = " @   ";
trit_encodings[7] = ":@   ";
trit_encodings[8] = "@@   ";
...
trit_encodings[242] = "@@@@@";
```

Once you have made the table, decoding each input byte to 5-characters of trinary ASCII is just a table lookup!

The “image” you need to decode should already be in the class problem folder as `img.bin`. Your program should directly open this image with `fopen("img.bin", "rb")`. You need to specify the “b” for binary mode to ensure that “newlines” in the binary image do not get mangled. Use the `fgetc(f)` function to read the file one byte at a time.

The total decoded image will be 90 by 40 characters. Because each byte composes 5 characters, you will move to the next row every 18 bytes, as `90 / 5 = 18`:

```
for 40 rows of the image {
    for 18 bytes in each row {
        int c = fgetc(f);
        if (c >= 0) {
            print trit_encodings[c]; // use %s with printf to print strings
        }
    }
}
```

Using `fgetc`, we read each character as an _unsigned_ character from 0 to 255. We don’t want to cast to `char` because the `char` type in C is signed, and is almost always a _signed 8-bit integer_ meaning it has values from -127 to 128. If `fgetc` fails for some reason, it will return a negative number, so we can ignore that by checking the value is non-negative.

So that you don’t have to worry about memory, we have provided a little bit of code to get you started. You could set the decoding of byte 0 using indices like so:

```
trit_encodings[0][0] = ' ';
trit_encodings[0][1] = ' ';
trit_encodings[0][2] = ' ';
trit_encodings[0][3] = ' ';
trit_encodings[0][4] = ' ';
```

NOTE: again, you don’t not need to know anything about pointers for today’s assignments! Think about strings as _arrays_ of characters. And think of the table as an array of strings only.

### Note on how to make the table

Think about how you would write code to print out a decimal number digit by digit. If you have the number 123, how do you convert this to the sequence of digits from low to high of 3, 2, 1?

If you have a number, say 123, how do you convert this to a sequence of bits, just 0 or 1?

Now by analogy, do the same thing to convert it to a sequence of trits, 0, 1, or 2. The same math works all three ways! Finally, use ‘ ‘, ‘:’, and ‘@’ in place of the numbers 0, 1, and 2.

You might find it helpful to watch a YouTube video on the topic: [https://www.youtube.com/watch?v=Fpm-E5v6ddc](https://www.youtube.com/watch?v=Fpm-E5v6ddc)

### Note on testing image

I have included a testing file `test_img.bin` that contains only the byte value 5, and so should be decoded to have the following row repeated 40 times:

```
@:   @:   @:   @:   @:   @:   @:   @:   @:   @:   @:   @:   @:   @:   @:   @:   @:   @:   
```

(Note that it does indeed end in some “invisible spaces!”)
