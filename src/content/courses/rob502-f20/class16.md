---
title: "ROB 502: Programming for Robotics: Class 16"
date: "2020-07-07"
---

## Due date: Tuesday December 1st, 6:00pm, updated 11/18/20 4:58pm for left/right polarity, 8:45pm to make the 40ms sleep explicit.

### Clicker Questions

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

2. In practice, what do you think are the most likely results? (if you have more than one, put them in order from most to least likely)

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

4. For this file, at the end of the program, how many more calls to `malloc` need to have been made than to `free`? In other words, how many blocks of memory do we need to still have accessible?

```
0 1 2 3 4 5 6 7 8 9
```

5. And for this file?

```
0 1 2 3 4 5 6 7 8 9
0 1 2 3 4 5 6 7 8 9
```

## Terminal settings

When you run your program in the terminal, it turns out that you can actually modify a lot of the settings that determine how the terminal itself works. What you see normally in bash is mostly this default behavior that will also extend to your program, but you can change it!

For example, the default behavior that you see in bash is that you can start typing a command, use the arrow keys and delete and backspace to change it, and finally run it by hitting the enter key. On the other hand, if you want to respond immediately to every key the user presses, you can turn off "canonical mode" to get characters one by one as the user types them. If you do this, you also won't be able to use backspace to undo anything you have typed, and the arrow keys will not work either without special effort from your program.

As another example, when you enter a password from the command line, you will often notice that nothing appears on the screen, not even asterisks! (the \* symbol). This is because the program turned the terminal's echo setting off for while the user was typing their password.

## ANSI escape codes

While the ASCII standard contains control characters for things like backspace or new line, it does not have any characters for special keys like the arrow keys or home or page down keys. ASCII does however have a special "escape" control code that can form a sequences of characters that together indicate these special keys.

This escape code character is number 27, and when printed to the screen it is often represented as `^[`. You can represent it in your code as the character `'\e'` in a C-style escape code!

[This table](http://ascii-table.com/ansi-escape-sequences.php) shows escape code sequences that represent various input keys and output effects for the terminal.

[This additional table](http://ascii-table.com/ansi-escape-sequences-vt-100.php) shows escape sequences you can send to the terminal (through printf) to control various aspects of the output, like the colors used.

## In-class assignment 1: manual

In this program we will use the arrow keys to manually drive a robot through the maze environment of homework3.

We will configure the terminal to both turn off canonical mode and echo, so that our program can actually detect when the arrow keys are pressed and so that they also don't show up in the terminal as a bunch of strange symbols.

Start by copying over your homework3 assignment, and deleting all the code that had to do with the robot search or the second robot you were trying to catch. When you finish you should have a stationary red robot in the middle of the screen that no longer moves.

Now create a new thread, `io_thread`, to manage keyboard control. Use the following code:

```
#include <stdlib.h>
#include <termios.h>

struct termios original_termios;
void reset_terminal(void) {
    tcsetattr(STDIN_FILENO, TCSANOW, &original_termios);
}

void *io_thread(void *user) {
    state_t *state = user; // assuming you pass a state_t * as the last argument of pthread_start

    // we need to return the terminal to its original state when our program quits
    // if we don't the terminal will not behave correctly
    tcgetattr(STDIN_FILENO, &original_termios);
    atexit(reset_terminal);

    // we start with the old settings, since we are only changing a few things
    struct termios new_termios;
    memcpy(&new_termios, &original_termios, sizeof(new_termios));

    // we turn off the bits for echo (show typed characters on the screen)
    // and canonical mode, which waits until you press newline to give the program input
    new_termios.c_lflag &= ~(ECHO | ICANON);
    // we are modifying the input settings, (standard in, stdin)
    // and we want the changes to take effect right now!
    tcsetattr(STDIN_FILENO, TCSANOW, &new_termios);

    while (true) {
        // put the rest of your code here!
        // read characters with getc(stdin)
    }
}
```

Please note that if the main thread exits, the entire program will exit, regardless of the io thread.

Start off with this code by exploring what characters/numbers you get when you type various things. Pay attention in particular to what you get for pressing the arrow keys and for your keyboard's 'escape' key (wow, escape can mean a lot of different things!).

Try out examining both the number and character representations:

```
int c = getc(stdin);
printf("%c: %d\n", c, c);
```

Since the arrow key sequences are longer than a single character, you should make repeated calls to `getc` to parse them.

Whenever you read an up, left, or right key, your program should set some value in your `state` variable. I use the integer variable `state->user_action` and I set it to `1` for up, `2` for left, and `3` for right. When the main thread of the program has executed this action during the time step, it sets `user_action` back to `0`, indicating the action is complete. It is very important that _only the main thread_ actually modifies the state of the robot.

If you type a letter 'q', have your program quit with `exit(0)`.

Each time the main thread of the program runs your function to update movement, it should do the following based on `state->user_action`:

- For 'up', increase the velocity of the robot by 4.0, capped at 12.0 just like in the homework 3.
- For 'left', add -PI / 32 to the robot's angular velocity
- For 'right', add PI / 32 to the robot's angular velocity

All of the physics and collisions remain unchanged from homework 3, and should still happen in the main function under the main thread. This includes the 40ms sleep in-between timesteps.

On each time step, your code should print out the robot's velocity and angular velocity, with the format string `"%.2f %.2f\n"`.

Your program should take one optional command line argument to disable use of the image server.

```
./manual
0.00 0.00
0.00 0.00
0.00 0.00
4.00 0.00 // pressed up

./manual disable
0.00 0.00
0.00 0.00
0.00 0.00
4.00 0.00 // runs at same speed as normal, but image server isn't started
```

Notice that the disabling the image server does not change how fast the code runs!
