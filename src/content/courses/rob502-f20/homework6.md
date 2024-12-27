---
title: "ROB 502: Programming for Robotics: Homework 6"
date: "2020-07-07"
---

## Introduction

In this homework, we are going to split the different parts of homework 5 _potential_ into three different processes that will communicate with each other through LCM messages.

To prevent conflicts when multiple students submit their code at the same time, we will append our uniqid to the channel names. This way, even if every student submits their code at the same time, their will be no conflicts since every student will be using a set of unique channels.

### LCM Spy

It will be very helpful to be able to have a reliable way to see what messages you are publishing with LCM and what they say. We will use the `lcm-spy` tool for this.

**Briefly review this section now, but it will only be useful to run once you have created some of the LCM files for this homework below and you are trying to debug your programs!**

The program `lcm-spy` was written in Java and needs to have your LCM types compiled to Java in order to be able to decode them for you. While in your project directory, with the `.lcm` files in a folder called `lcmtypes`, run the following commands to generate Java LCM files, compile them, package them into a `lcmtypes.jar` file, and then run `lcm-spy` with them.

```
# Where is the java LCM library? We access it by making a path relative to the lcm-gen tool
lcm_jar=$(dirname $(which lcm-gen))/../share/java/lcm.jar
lcm-gen -j lcmtypes/*.lcm

# The Java compiler needs to use the java LCM library to properly compile these files
javac lcmtypes/*.java -cp $lcm_jar

# Now we take all of the different compiled class files, and loosely compress them together into one lcmtypes.jar file
jar cf lcmtypes.jar lcmtypes/*.class

# lcm-spy, in turn, needs access to this lcmtypes.jar file in order to decode our LCM messages
CLASSPATH=lcmtypes.jar lcm-spy >/dev/null
```

We can make this easier for us by putting this as a couple of entries in make. Notice that we have to make several changes because make _does not inherently use bash_, and we have explicitly ask it to use the shell (bash) in several places.

```
lcm_jar := $(shell dirname $(shell which lcm-gen))/../share/java/lcm.jar

# Just like a C program, we can express how to make the lcmtypes.jar file from a set of .lcm files
lcmtypes.jar: lcmtypes/*.lcm
    lcm-gen -j lcmtypes/*.lcm
    javac lcmtypes/*.java -cp $(value lcm_jar)
    jar cf lcmtypes.jar lcmtypes/*.class

# Running the tool lcm-spy requires this lcmtypes.jar file to exist and be up to date
lcm-spy: lcmtypes.jar
    CLASSPATH=lcmtypes.jar lcm-spy >/dev/null
```

With this setup, however, we can simply run `make lcm-spy` to run the tool, and it will automatically regenerate and recompile the java LCM types as necessary!

Remember that in a makefile you must use a tab for the indentation at the beginning of a line! If you copy and paste, you will have to change the spaces to tabs in your text editor.

### Using make to generate LCM files for C

Just like with using make for the Java LCM files, we can do the same for C:

```
# The '%' is a wild card. To make any lcmtypes .c file, use the corresponding .lcm file
# For organization, we reference and use all these files under a lcmtypes directory
lcmtypes/%_t.c: lcmtypes/%_t.lcm
    lcm-gen -c --c-cpath lcmtypes/ --c-hpath lcmtypes/ $^

LCMTYPES_SOURCE = lcmtypes/settings_t.c lcmtypes/reset_t.c lcmtypes/world_t.c lcmtypes/agent_t.c lcmtypes/action_t.c

# Now instead of listing all the LCM type files individually, we can just add $(LCMTYPES_SOURCE) to any list of .c files
```

### lcm\_handle\_async

When using LCM in a program there are several different approaches you can take to processing the messages.

Some times, you can _start a thread_ to just run:

```
while (true) {
    lcm_handle(state->lcm);
}
```

Unfortunately, if you use this approach you have to worry about race conditions and other threading problems with how your LCM message handler functions run.

It is my personal preference to avoid making new threads whenever possible, because threading problems can be very hard to debug.

I have supplied a function `lcm_handle_async` can help with this. Normally, whenever you run `lcm_handle` that function will wait (like with `nanosleep`) until a message has been received. Then it will call the appropriate message handler you gave when you called `subscribe` on a message type. Then it will return, having processed a single message.

Because `lcm_handle` will wait for an unpredictable amount of time, it is not convenient to use when your program needs to be processing data at a regular rate.

As an alternative `lcm_handle_async` will immediately process any and all messages that have already been received, but will not wait if there are not any available. This means we could write code that looks like this (relevant to the `world` problem):

```
while (true) {
    lcm_handle_async(state->lcm);
    update motion
    update collisions
    publish lcm messages
    wait long enough to run at exactly 25 Hz
}
```

And when we are run the update methods, we can know that we have all the up to date information from the recent LCM messages.

## Problem 1: gui

In this problem, we will isolate the features of `potential` that are unique to the user interface: keyboard inputs and image server outputs.

At a rate of 25 Hz (every 40 milliseconds), you should publish an LCM settings message on the channel `SETTINGS_uniqid`:

```
struct settings_t {
    int32_t initial_runner_idx;
    int32_t delay_every;
    double to_goal_magnitude;
    int32_t to_goal_power;
    double avoid_obs_magnitude;
    int32_t avoid_obs_power;
    double max_vel;
}
```

Put this into a file named `lcmtypes/settings_t.lcm`, and put all the other LCM types into similarly named files. The LCM types I give in this document need to be copied verbatim or you will get errors decoding them!

You should use `seconds_now()` and `nanosleep` together so that you can publish at a consistent rate. With `seconds_now` you can time how long it takes run `lcm_handle_async` and `update_graphics` and to publish messages, and then only wait 40 milliseconds _minus_ however long those functions already took.

Whenever the user presses the `r` key, you should publish a `reset_t` LCM message on the `RESET_uniqid` channel:

```
struct reset_t {
    int32_t initial_runner_idx;
}
```

You may also find it convenient to send a reset message when you first run `gui` as well, to facilitate debugging, but this is not tested.

You should also subscribe to the `WORLD_uniqid` channel (see below) so that you can know where to draw the runner and chaser for the image server.

From the terminal, the `gui` program should behave just like `potential` originally did, except that it will not report the runner getting caught.

## Problem 2: world

In this problem, we will implement those features that correspond to the physics of our simulated world: the runner’s random movement, movement of the chaser based on its velocity and angular velocity, and collisions.

You should subscribe to the `SETTINGS_uniqid` (you only need the `delay_every` variable) and `RESET_uniqid` channels. When you receive a reset message, you should immediately reset the simulation.

You should also subscribe to a new `ACTION_uniqid` channel that is used to communicate the chaser’s action:

```
struct action_t {
    double vel;
    double ang_vel;
}
```

When you read in the velocity and angular velocity from this action message, you still have to constrain the chaser to its maximum possible action limits. Velocity can only increase by 2.0 per timestep, and angular velocity is limited in magnitude to PI / 16.

Instead of sleeping for 40 milliseconds every `delay_every` time steps, divide the 40 milliseconds evenly, sleeping for `40 / delay_every` milliseconds every time step. For example, if `delay_every` is 10. Before we would sleep for 40 milliseconds every 10 time steps. Now we will just sleep for 4 milliseconds every time step. This will allow the chaser time to choose and communicate its choice of action back to the world process.

Every time step, you should compute the movement of the agents and resolve all collisions. If the runner is caught, you should report which time step this happened on, and then reset the simulation, just like with `potential`. The time step numbers should be the same as before.

After these calculations, you should publish the new states of the agents to the `WORLD_uniqid` channel, composed of two LCM types:

```
struct world_t {
    agent_t runner;
    agent_t chaser;
}
```

```
struct agent_t {
    boolean is_runner;
    double x;
    double y;
    double theta;
    double vel;
    double ang_vel;
}
```

## Problem 3: controller

In this problem, we will implement the chaser’s potential field motion controller.

You should subscribe to the `SETTINGS_uniqid` and `WORLD_uniqid` channels. Whenever you receive a message on the `WORLD_uniqid` channel, you should immediately compute the chaser’s appropriate action and then publish the result to the `ACTION_uniqid` channel.

You should start with all the default settings from homework 5, even if you don’t receive a new settings message.

This means you can actually use just a single `lcm_handle` loop, because you only ever do anything when you receive a world message:

```
while (true) {
    lcm_handle(state->lcm);
}
```
