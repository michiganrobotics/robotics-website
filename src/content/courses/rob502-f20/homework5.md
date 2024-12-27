---
title: "ROB 502: Programming for Robotics: Homework 5"
date: "2020-07-07"
---

## Due Tuesday December 8th, 6:00pm (the last official day of classes); made clarification about "disable" setting 12/1/20 3:27pm

### Clicker Questions

Use p4r-clicker to submit your answer

1. How many bits are in a byte?
2. How many bits are in a single hexadecimal digit?
3. How many values can be represented by a single hexadecimal digit
4. `char msg[] = "taco cat"; msg[3] = '\0'; printf("%s", msg);`
5. `printf("%ld, %ld", sizeof("hello!"), strlen("hello!"));`

You have a 5 by 5 image buffer of 24-bit bgr pixels.

6. How many bytes large is this buffer?
    
7. What is the index of the coordinate (4, 2)?
    
8. What is the big-O time complexity of a search through an unsorted array for a given value?
    
9. What is the big-O time complexity of a binary search through a sorted array for a given value?
    
10. If a calculation takes `2A + 100log(A)` operations, what is the complexity in Big-O notation?
    
11. Suppose I give you a special number `uint32_t value = 7364963;` and promise that it is actually a null-terminated 3-character string! How would you go about printing it out as a string using `printf`?
    
12. The following code example is compiled with the maximum optimizations (`-O3`). Is it guaranteed to terminate?
    

```
bool thread_finished = false;

void *producer_thread(void *user) {
    thread_finished = true;
    return NULL;
}

int main(int argc, char **argv) {
    pthread_t thread;
    pthread_create(&thread, NULL, producer_thread, NULL);

    while (!thread_finished) {
        printf("Still running!\n");
    }

    return 0;
}
```

13. On the other hand, _does_ the example above terminate on the instructor's computer?
    
14. What about this example? Is it guaranteed to terminate?
    

```
volatile bool thread_finished = false;

void *producer_thread(void *user) {
    thread_finished = true;
    return NULL;
}

int main(int argc, char **argv) {
    pthread_t thread;
    pthread_create(&thread, NULL, producer_thread, NULL);

    while (!thread_finished) {
        // do nothing
    }

    return 0;
}
```

## Problem 1: potential

In this problem we will use a potential field controller to chase the runner from homework 3. We will use the same environment and setup as homework 3 except that the chaser will use a new method to calculate its linear and angular velocities. Everything else about the physics of the environment will remain the same! In particular, the runner identical to the runner homework 3. Because some details of homework 3 will be more important now than they originally where, please consider going back to review the homework 3 document!

We will also construct a command line user interface to tune the parameters of the potential field controller. You should copy the terminal and threading setup from class16 that we used for the manual driving problem.

Being able to live-tune the parameters of your robot will be very useful for the ROB 550 Balancebot project because it can make the process of tuning a PID or similar controller relatively trivial compared to the alternative where code needs to be recompiled/uploaded/etc... for every parameter change.

[These slides](https://cs.gmu.edu/%7Ekosecka/cs685/cs685-potential-fields.pdf) may provide some useful background and illustration for potential field methods.

[This website](https://www.cs.mcgill.ca/~hsafad/robotics/) illustrates a student project on potential fields. The report describes one way to overcome the local minima problems that basic potential field methods can get caught in.

[This table](http://ascii-table.com/ansi-escape-sequences.php) shows escape code sequences that represent various input keys and output effects for the terminal.

[This additional table](http://ascii-table.com/ansi-escape-sequences-vt-100.php) shows escape sequences you can send to the terminal (through printf) to control various aspects of the output, like the colors used.

### Potential field control

The essential idea of a potential field controller is that the robot is "acted on" by various forces in its environment. The controller sums up these forces to get a vector that indicates which way the robot should move and possibly also the desired speed.

In the basic navigation scenario, some of these forces will be pushing the robot towards its goal, and some of these forces will be pushing the robot away from obstacles.

The direction of the forces will almost always be along a vector either toward or away from the goal or obstacles. The magnitude of the forces will generally be some constant factor times a power of the distance between the robot and the goal or obstacle.

A typical choice might be to have the goal-seeking potential be a constant factor towards the goal (so distance to the power of zero) and have the obstacle-avoiding potentials use an inverse-square factor (so distance to the power of -2). To prevent an explosion of the magnitude to infinity as the distance to an obstacle approaches zero, we generally cap the minimum distance at a small value. We also generally calculate obstacle distance between the edges of the robot and the edges of the obstacle, since we are trying to prevent collisions!

Once we have calculated the force vector acting on the robot, we have to decide how the robot will act to follow this force vector, especially since any real robot has limitations in how fast it can accelerate and turn. We will use a proportional control for the robot's angular velocity, meaning we will calculate our robot's angular velocity as a constant factor times the robot's heading error (target theta of the force vector minus robot's theta). The robot will also accelerate as fast as possible to achieve a certain target linear velocity.

### Implementing the potential field controller

Write a new function to set the chaser's velocity and angular velocity based on the following potential field pseudo code. This will entirely replace the previous tree search and action choices for the chaser. We are using variables for many of the parameters so that we can adjust them throughout execution of the program. The list of these tunable parameters and their default values is given in the next section.

```
// circle approximation radius of the robot
robot_r = sqrt((robot_width / 2)^2 + (robot_height / 2)^2)
// circle approximation radius of a wall block
wall_r = block_width / sqrt(2)

fx = 0.0 // forces on the robot
fy = 0.0

to_goal = unit vector from the chaser to the runner
to_goal_dist = distance from the chaser to the runner (center to center)
fx, fy += to_goal * to_goal_magnitude * pow(to_goal_dist, to_goal_power)

for each wall block {
    to_chaser = unit vector from the wall block to the chaser
    to_obs_dist = space between the wall block and the chaser, approximating them as circles (center-to-center distance minus radii)
    to_obs_dist = fmax(0.1, to_obs_dist)
    fx, fy += to_chaser * avoid_obs_magnitude * pow(to_obs_dist, avoid_obs_power)
}

target_theta = theta of fx, fy vector, calculated with atan2
theta_error = target_theta - robot theta, wrapped around to be in the range [-pi, pi]
ang_velocity = 0.4 * theta_error, constrained to range [-pi / 16, pi / 16]

velocity = fmin(target_vel, velocity + 2.0)
```

So that this potential field controller is comparable to our earlier tree-search-based controller, you will notice that we limited the angular velocity and the acceleration to the maximum values of any action from homework 3 chase.

After calculating the angular and linear velocities like this for the chaser, we will use the same standard code as before to move the robot forward.

### Live-tuning user interface

We will allow the user to modify the following values from the command line while the program runs. We use an equals sign to specify the default value for each parameter.

- `initial_runner_idx = 17`, constrained to valid starting locations (not in a wall block)
- `delay_every = 1`, the value must be `>= 1`
- `to_goal_magnitude = 50.0`
- `to_goal_power = 0`, constrained to the range `[-3, 3]`
- `avoid_obs_magnitude = 1.0`
- `avoid_obs_power = -2`, constrained to the range `[-3, 3]`
- `target_vel = 12`, constrained to the range `[1, 12]`

The `initial_runner_idx` is where the runner starts on each iteration of the chase. Unlike before, whenever the chaser catches the runner, the simulation will reset and this is location that the runner will reset to.

The parameter `delay_every` controls the speed of the simulation and animation. Every `delay_every` timesteps, we will update the graphics and then delay by 40 milliseconds. When the image server is disabled, (see below), you should skip the graphics, but must still keep the delay!

The last five parameters are all as we described in the algorithm section above.

At any point in time, one of these seven parameters will be selected, starting with the first one, `initial_runner_idx`. If the user presses the right arrow key, we will move to the next parameter according to the above list. If the user presses the left arrow key, we will move to the previous parameter.

If the user presses the up arrow key, we will increase the value of the selected parameter. The two magnitude parameters will double (50 to 100, 100 to 200, etc...). The `initial_runner_idx` will increase to the next possible starting location. The rest of the parameters will increase by 1.

If the user presses the down arrow key, we will perform the inverse of the above operations (halve the value, decrement by 1, etc...).

If the user presses the `r` key, the simulation should reset (see more details below).

If the user presses the `q` key, the program should exit.

### Displaying the live-tuning interface

On each time step we will output an updated version of the user interface to the screen. Instead of putting this on a newline, however, we will actually overwrite the previous line instead. This will give our program a much cleaner look.

We can overwrite the previous line by writing a carriage return `"\r"` as our first character of output. This character means to move our output back to the beginning of the line, just like how a type-writer is able to move its typing carriage back to the beginning of the line on a page. We also make sure to _not_ end our output with a new line character!

By not writing a new line character at the end, we actually run into a problem, because generally `printf` actually waits for a new line character before it actually send the text to your terminal output! So to force your `printf` text to actually show up on the screen, we also have to call `fflush(stdout)` to _flush_ the text we have written to standard output from our program's internal buffer to the actual terminal. Although it can be an inconvenience, this internal output buffer actually makes functions like `printf` way faster than they would otherwise be, by combining sections of text before sending them in bulk to the terminal.

There are a couple of more tricks we can use to improve the usability and appearance of our interface!

It would be really great if we had a convenient way of knowing which parameter is selected at any time, and it turns out there is an easy way for use to "highlight" text! If we output the control code `"\e[7m"` we turn on inverse mode, that inverts the foreground and background colors of the text, highlighting it! We can then output `"\e[0m"` to clear this text effect.

So if we are using `"%8.2f"` to format the goal magnitude, we can highlight this value by using `"\e[7m%8.2f\e[0m"` instead! If it makes it clearer to write, you can also use defines and "%s" to make things clearer. Furthermore, you can also then use a ternary expression to only turn on the highlight sometimes.

```
#define HIGHLIGHT "\e[7m"
#define CLEAR_HIGHLIGHT "\e[0m"

printf("%s%8.2f%s", HIGHLIGHT, to_goal_magnitude, CLEAR_HIGHLIGHT);

// or conditional highlighting with boolean goal_mag_selected
printf("%s%8.2f%s", goal_mag_selected ? HIGHLIGHT : "", to_goal_magnitude, CLEAR_HIGHLIGHT);
```

A second trick we can use to improve the appearance of our interface is turning off the default blinking cursor. At the beginning of the io thread, print out a `"\e[?25l"` and the cursor will turn off. Also make sure to output a `"\e[?25h"` in your `reset_terminal` function to turn the cursor back on when your program exits!

### Resetting the simulation

When the program first runs, when the chaser catches the runner, or whenever the user presses the `r` key, you should reset the simulation. It should look something like this:

```
srand(0); // reset the random number generator so it works the same every time
reset runner position to initial_runner_idx
reset chaser to middle of board
reset runner and chaser angular and linear velocities and thetas to zero
reset any other important variable you might have added
```

### Evaluation

Your program will be evaluated by checking the number of time steps required to catch the runner for various parameter settings. Therefore, each time the chaser catches the runner, you should output the following text: `"\e[2K\rRunner caught on step %d\n"`.

The `"\e[2K"` clears the entire current line of all text, which would have been the user interface text. The carriage return `\r` returns our output to the beginning of the line so we can write the message. Finally, we end with a new line character because we don't want this line about the runner being caught to get overwritten by the user interface lines!

Just like in class16 manual, your program should run with either no parameters, or with a single parameter that indicates the image server should be disabled. **Even if the image server is disabled, you still need to follow the `delay_every` parameter timing!**

It will be much easier to pass all the tests if you work on them one by one in order of difficulty. The easiest test has the default settings but starts the runner at location 89, and catches the runner on step 5 (meaning 6 total steps).

With all default settings, the runner should be caught on time step 101. With the only change being that the goal magnitude is 100 instead of 50, the runner should take only 75 time steps to catch.

Run the submit script at least just to get the list of tests in rough order of difficulty!
