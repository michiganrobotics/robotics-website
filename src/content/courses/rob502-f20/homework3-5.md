---
title: "ROB 502: Programming for Robotics: Homework 3.5"
date: "2020-10-26"
---

## Take the additional midterm feedback survey on Canvas!

It proposes some changes to the code-viewing policy and to breakout groups

## How to be effective in ROB 502

### Start simple

Start coding an assignment from the simplest version to the most complex. This will often mean running the auto-grader just to see the order of test cases. Start from the first and simplest ones. Don't go on to more complex cases until you pass those easier ones. This will help keep you from going down the wrong path.

### Don't cram; get help

Don't try to cram to finish an assignment in a single day. Recognize when you are not making progress on a problem, and post a piazza question, send me an email, or wait for office hours. Then go work on ROB 501 or another class! If you need extra individual help, ask me for private time outside of office hours. Students have done this already and it has been good!

### Debug efficiently

Start by isolating the simplest test case that generates your program's bad behavior. If on `calc` the input "10 + 20 + 30" results in a segmentation fault (also known as a seg fault or SIGSEGV), what about "10 + 20" or even "1 + 2" or even just "1" or maybe "10"? How simple can you go and still get the error? The difference between the simplest case that crashes and the simpler case that doesn't crash will often tell you which feature of your code is causing the crash. Actually, if you _start simple_ you will often find a bug as soon as it is introduced. Try to not write very much code before testing what you already have.

Figure out how to test each part of your code in isolation, so you can know for sure that one part of the code is at fault and another is not. If you can split the code in half multiple times, determining which half contains the bug, you will quickly find the erroneous code.

Although the auto-grader has lots of great test cases, you can be even more effective at testing your own functions. This is even easier when there is some property that you know the code should hold, such as there being the same number of `malloc`/`calloc` calls as calls to `free`. For example:

```
tst_node_t *node = malloc(sizeof(*node));
printf("malloc for tst_node_t\n");

...

tst_t *tst = calloc(1, sizeof(tst_t));
printf("malloc for tst_t\n");

...

free(node);
printf("free for tst_node_t\n");

...

free(tst);
printf("free for tst_t\n");
```

Now we can count each! Are the counts the same?

```
./program | grep malloc | wc -l
./program | grep free | wc -l
```

### Understand errors/assignment documents/pseudo-code

Please ask, ask, ask! I especially enjoy explaining how to understand error messages. I also appreciate questions to clarify the assignment documents. They have a lot of information! For example, feel free to ask something like: "What does 'move to node->left' really mean in this example? What are we moving?" Or maybe: "I thought we are supposed to make this a recursive solution, but you don't mention that in tst\_add?" Another good approach is to rewrite the pseudo-code in your own words and ask if it is still correct.

## Automatic formatting

The auto-grader principally uses `clang-format` for formatting. You can install this tool on Ubuntu/WSL with:

```
sudo apt-get install clang-format
```

On Mac OS, I think it should already be installed with the developer tools.

Both VSCode and Atom have `clang-format` packages that you can install that will provide automatic formatting using this tool every time you save a source code file. Configuration should not be that hard, but feel free to ask for help if it ends up being harder than I hope!

I am using the following settings in a file `.clang-format` you can put your own copy of this file at `rob502/.clang-format`:

```
BasedOnStyle: LLVM
IndentWidth: 4
SortIncludes: false
ColumnLimit: 0
AlignTrailingComments: false
PointerAlignment: Right
```

### Clicker Questions

Use p4r-clicker to submit your answer

We have a file `words.txt`

```
groan
blue
afterthought
abortive
tenuous
knife
hot
alert
plough
cure
fry
abstracted
```

Feel free to reference the class1 page on bash!

1. `cat words.txt | grep ler`
2. Write a command to put words ending with "e" in a file "e.txt"
3. `tail -n 1 e.txt`
4. Write a command to print out words with both an "a" and an "e" anywhere in the word
5. Write a bash if statement that variable "a" is greater than variable "b".

```
int add_print(int a) {
    a += 1;
    printf("%d, ", a);
    return a;
}

void clicker6(void) {
    if (add_print(6) > 6 || add_print(6) > 7) {
        printf("true\n");
    }
}

void clicker7(void) {
    if ((add_print(6) > 6) | (add_print(6) > 7)) {
        printf("true\n");
    }
}

void clicker8(void) {
    int a = 6;
    if (add_print(a) > 6 && add_print(a) > 7) {
        printf("true\n");
    }
}

void clicker9(void) {
    int a = 6;
    if ((add_print(a) > 6) & (add_print(a) > 7)) {
        printf("true\n");
    }
}

int main(void) {
    clicker6(); // 6
    clicker7(); // 7
    clicker8(); // 8
    clicker9(); // 9

    return 0;
}
```

This next recursive problem is really tricky. Please use a pencil and paper or otherwise take notes to try to figure out how it will run. I don't think it is so easy you can do it in your head, at least I can't!

```
typedef struct state {
    int depth;
    int *value;
} state_t;

int recurse(state_t state) {
    if (state.depth >= 2) {
        return *state.value;
    }
    *state.value += 1;

    state.depth += 1;
    int val1 = recurse(state);

    state.depth += 1;
    int val2 = recurse(state);

    return val1 + val2;
}

int main(void) {
    state_t state = {0};
    state.value = calloc(1, sizeof(int));

    printf("%d\n", recurse(state)); // 10

    printf("%d\n", recurse(state)); // 11

    free(state.value);
    return 0;
}
```
