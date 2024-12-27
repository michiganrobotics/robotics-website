---
title: "ROB 502: Programming for Robotics: Class 18"
date: "2020-07-07"
---

## Due Monday December 7th, 6:00pm; added instructions for LCM installation added 12/2/20 3:29pm

### Clicker Questions

Use p4r-clicker to submit your answer

Assume we have the following code already defined for all the following questions:

```
typedef struct xy {
    double x;
    double y;
} xy_t;

typedef struct vector_xy {
    size_t size;
    size_t capacity;
    xy_t *data;
} vector_xy_t;
```

For each example, please either respond with "N" for no undefined behavior/memory errors/memory leaks, or the line number on which the first invalid memory access/undefined behavior happens (if it does) and the first memory leak happens (if it does), for at most two line numbers per example.

```
vector_xy_t create_vector_xy(void) { // line 1
    vector_xy_t vec = *malloc(sizeof(vec));
    vec.size = 0;
    vec.capacity = 4;
    vec.data = malloc(vec.capacity * sizeof(*vec.data));
    return vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
}
int main(void) { // line 11
    vector_xy_t v = create_vector_xy();
    destroy_vector_xy(&v);
}
```

```
vector_xy_t *create_vector_xy(void) { // line 1
    vector_xy_t *vec = malloc(sizeof(vector_xy_t));
    vec->size = 0;
    vec->capacity = 4;
    vec->data = malloc(vec->capacity * sizeof(*vec->data));
    return vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
    free(vec);
}
int main(void) { // line 11
    vector_xy_t v = *create_vector_xy();
    destroy_vector_xy(&v);
}
```

```
vector_xy_t *create_vector_xy(void) { // line 1
    vector_xy_t vec = { 0 };
    vec.size = 0;
    vec.capacity = 4;
    vec.data = malloc(vec.capacity * sizeof(*vec.data));
    return &vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
}
int main(void) { // line 11
    vector_xy_t *v = create_vector_xy();
    destroy_vector_xy(v);
}
```

```
vector_xy_t *create_vector_xy(void) { // line 1
    vector_xy_t *vec = malloc(sizeof(vec));
    vec->size = 0;
    vec->capacity = 4;
    vec->data = malloc(vec->capacity * sizeof(*vec->data));
    return vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
    free(vec);
}
int main(void) { // line 11
    vector_xy_t *v = create_vector_xy();
    destroy_vector_xy(v);
}
```

## Robot architectures

Most robotic systems software has many components all working together, including for perception and interfacing with various sensors, reasoning about the combined sensor inputs and performing sensor fusion, and then performing high-level motion planning and also low-level control to follow those plans.

Suppose you are working in a research lab and each graduate student has been tasked to write a separate component of the robot's software, some for perception, some for reasoning, and some for control. How would do you go about combining or interfacing the different pieces of code together into one system? (Try to make your idea short) **18.1 Use p4r-clicker to submit your answer**

### Hierarchical

The hierarchical model is the rather naive idea of performing each step in strict sequence: 1) first perceive the world and build a model of it, 2) then form a plan of how to act in the world, and 3) finally act and perform a step of that plan. Unfortunately, we can only do a small amount of acting, because generally either the world or our view of it will have changed significantly since our last perception of it, and then we repeat the three steps above.

This architecture can result in a sort of "look and lurch" feel, that has classically been attributed to the Stanford Research Institute's "Shakey" robot [https://youtu.be/GmU7SimFkpU?t=223](https://youtu.be/GmU7SimFkpU?t=223), the perhaps first robot to combine perception, reasoning, and action with a physical robot.

Although a great starting point, this hierarchical/sequential model does not allow a robot to quickly react to unexpected changes in its environment.

### Reactive

The reactive model is the opposite of the hierarchical model, and is well demonstrated by the Braitenberg vehicles that we programmed in homework 2. The Braitenberg vehicles did not have a "planning" stage. Instead, they were based around a mapping between their sensor inputs (light on each eye) and their controls (the left and right motor speeds).

Reactive robots are able to instantly respond to changes in their environment and can exhibit fairly complex-looking behaviors. Unfortunately, they have trouble handling tasks that require long-term planning, because they don't take into account information that isn't currently being sensed.

The potential field robot from homework 5 is another example of a reactive robot that isn't doing long-term planning, but manages to complete its goals fairly well.

Another idea in the domain of reactive systems is _subsumption_, where one module _subsumes_ or overrides the outputs of another module. For example, in the potential fields problem, we could have had an entirely different controller that kicks in under certain circumstances. For example, if we detect that an obstacle is directly between our robot and our target, we could switch to an entirely different strategy that doesn't try to make progress to the target but instead tries to navigate around the obstacle. Under these special conditions, the new controller would override or _subsume_ the more general potential field controller.

Subsumption thus allows the reactive robot to exhibit more complex and robust behavior.

### Hybrid

For any real robot, we generally use a combination of these two paradigms. The hybrid model is based around the idea that we can have both high-level hierarchical processing and planning and also low-level reactive control of the physical robot.

Imagine programming an autonomous car. We have various high-level hierarchical processes determining which lane we should be in, when we should turn, where other cars and pedestrians are, and according to all of these, what the nominal path we should follow is. We also need to have a low-level reactive controller determining how to actuate the motors and steering to actually follow that path, and that can compensate for disturbances like potholes, strong winds, or even a sudden difference in the cars ability to accelerate or break, such as when the car drives over an icy bridge.

The overall idea is that a robotic system's software should be decomposed into separate independent modules, each of which can operate at an appropriate timescale. A reactive low-level controller might update commands to the motors at 100 Hz while a higher-level motion planner might update at 1 Hz, updating the target trajectory the low-level controller is trying to follow, based on the locations of over cars on the road. An even higher-level controller might plan when to perform lane-change maneuvers.

If one of these systems has a failure of some kind, this _should not_ compromise the safety of the other controllers. If the path planner crashes and stops giving updates to the reactive controller, it should find some principled way to safely stop the vehicle. Autonomous cars will likely have a lot more redundancy and fail safes, but the robots in my lab will simply stop the motors if this happens.

It can also important in an hybrid architecture to be able to switch out similar components (e.g. one object detector with another) or insert a new level (e.g. a safety monitor that will automatically shutdown the robot's motors if a person gets too close) between existing modules.

For more information of robot architectures, please refer to [http://cs.brown.edu/people/tdean/courses/cs148/02/architectures.html](http://cs.brown.edu/people/tdean/courses/cs148/02/architectures.html)

## Message passing

In order to implement hybrid robot architectures that can safely handle components crashing or allow components to be swapped out easily, the robotics community has settled on an idea called _message passing_. The principle idea of message passing is that each component of the system operates as an independent process, and communicates with the other processes over various strongly typed _channels_.

For example, in my lab our robots have a process that communicates with the lidar sensor and _publishes_ the raw lidar data on a "raw lidar" channel. Any other process running on the robot can get this information by _subscribing_ to that "raw lidar" channel. Another process subscribes to that raw lidar channel and produces a 2D map with labels for which pixels are obstacles and which pixels should be reliable for performing SLAM, and it publishes this new 2D map on another channel.

### So what does this have to do with ROS?

ROS is a software package that combines the following parts:

- A message passing library
- Standard types for things like images, lidar, coordinate transformations, etc...
- Standard components ("ROS nodes") and libraries for...
    - popular robotics algorithms
    - hardware drivers
    - visualization tools
    - managing coordinate frames and transformations
- Development tools for writing your own components/ROS nodes that communicate with message passing
- Tools for recording and replaying messages for debugging

Unfortunately, ROS doesn't support C, so I guess we'll have to use something else!

### LCM: Lightweight Communications and Marshalling

[LCM](https://lcm-proj.github.io/) is a message passing library that includes just several tools for recording and replaying messages. Although it doesn't include all the bells and whistles of ROS, its lightweight nature makes it faster and easier to install than ROS. The principles behind message passing, however, are exactly the same regardless of whether you use ROS or LCM.

#### Installing LCM

On Ubuntu/WSL:

```
sudo apt-get install cmake g++ libglib2.0-dev
```

On Mac OS:

```
brew install glib pkg-config cmake
```

Then on either OS:

```
cd ~
git clone https://github.com/lcm-proj/lcm
cd lcm

cmake .
sudo make install
```

Make sure it is correctly installed by trying to run:

```
lcm-gen --version
```

If it prints out the version number, you are good to go!

And then you would only need to add `-llcm` to your makefile since gcc will already be able to find the header and library files. You wouldn't need to modify your path either, because the sudo install will put your executable files in a folder already contained in the `PATH`.

If, when compiling you get an error from the linker `ld` about not being able to link with `-llcm`, try adding the following to your gcc line in the makefile before `-llcm`:

```
-L/usr/local/lib
```

And if you also get an error about not being able to `lcm/lcm.h`, also add to your gcc line in your makefile:

```
-I/usr/local/include
```

If, when you try to run your program, you get the error:

```
error while loading shared libraries: liblcm.so.1: cannot open shared object file: No such file or directory
```

Then you should add the following line to your `~/.bashrc` file:

```
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
```

And then load the changes with:

```
source ~/.bashrc
```

#### Using LCM

The first thing we need to do to use LCM, is to define a data type that we can use to send and receive messages.

In my lab, we have a type called `l2g_t` which communicates the localization of our robot in terms of a transformation between local and global coordinates. We define the type using LCM's C-like syntax.

Make a new file `l2g_t.lcm`:

```
struct l2g_t {
    int64_t utime;
    double l2g[3];
}
```

In addition to the three double values, indicating an x-y-theta transformation, the type also includes a timestamp in microseconds. This timestamp is used because not only can LCM (and ROS) be used to communicate between processes on a single computer/robot but it can also be used to communicate with other robots! Unfortunately, when robots communicate across a network, it is also possible that messages will get delayed or even get out of order, so it can be important to include a timestamp so that you don't accidentally mistake an old delayed message for a new one. In our case, with only a single computer, we don't need to worry about delayed, out-of-order, or missing messages.

Next we use a tool called `lcm-gen` to "compile" this lcm type into two files, `l2g_t.c` and `l2g_t.h` that will let our code publish and subscribe to messages of this type. (Make sure to git commit both the `.lcm` and the `.c` and `.h` files for LCM types).

```
lcm-gen -c l2g_t.lcm
```

## In-class assignment 1: message

In this problem we will use LCM to subscribe to a channel and also publish to that same channel, to get a simple idea of how LCM works.

Start with the `l2g_t.lcm` file from above and the generated `l2g_t.c` and `l2g_t.h` files.

We start with the following includes and structure:

```
#include <lcm/lcm.h>
#include "l2g_t.h"

int main(void) {
    // we could also pass in a string of settings for special LCM configuration
    // and that would be helpful to configure a multi-robot communication scenario
    lcm_t *lcm = lcm_create(NULL);

    // everything else

    lcm_destroy(lcm);
    return 0;
}
```

The first thing we want to do is to _subscribe_ to a _channel_ of type `l2g_t`.

We can do that with a line like so:

```
l2g_t_subscription_t *l2g_sub = l2g_t_subscribe(lcm, <channel name string>, <function to handle messages>, <user pointer>);
```

The parameters here are actually pretty similar to the ones we saw with `pthread_create`. Notice that we also have to specify a function to be called and that we also get to specify an arbitrary pointer that will be passed on when that function is called. The channel string you use can be arbitrary and it often makes sense to mirror the type being used. You could use `"L2G"`, for example.

The function you specify also has to have a specific signature or set of return and argument types:

```
void on_l2g(const lcm_recv_buf_t *rbuf, const char *channel,
            const l2g_t *msg, void *userdata);
```

The name of this function is arbitrary, but something along the lines of `on_l2g` or `handle_l2g` would make sense given the type we are receiving and the channel name. Generally, the `rbuf` and `channel` parameters are only helpful for more advanced scenarios. Our own scenarios will only involve reading the message `msg` and then incorporating it into whatever state variable we happened to pass through the `userdata` pointer.

At the end of the program we will have to free memory from the subscription by calling:

```
l2g_t_unsubscribe(lcm, l2g_sub);
```

Write the contents of the `on_l2g` function so that you print out a line with the `l2g[3]` values formatted with `"%.2f %.2f %.2f"`.

Next construct a value of type `l2g_t` with `utime` set to 0 (or anything really, because we aren't using it here) and with `l2g` set to `(1.0, 2.0, 3.0)`.

Then publish this value with:

```
l2g_t_publish(lcm, <channel>, &l2g);
```

And use the same channel string as you used when you subscribed to the channel.

Finally, we have to give LCM control of our program to process messages it has received. The very general way would be to call the function `lcm_handle(lcm)` in a `while(true)` loop, and each call will wait as long as necessary for a single message to handle, run the appropriate function, and then return. In a while loop, this will continually wait for messages to handle.

For this problem, however, we want the program to listen for messages for only half a second and then to quit. To do this we will use `lcm_handle_timeout(lcm, 100)` which is like `lcm_handle` but will also return if it waits for longer than `100` milliseconds. Put this in a while loop and use the `seconds_now` function from earlier to make sure the while loop exits after a half second has passed.

### Evaluation

Due to a strange bug(?) in a library LCM uses, Valgrind is likely to think your program has a memory leak. Fortunately, the Address Sanitizer will correctly report that your program does not have a memory leak. So to pass the valgrind test, make sure the Address Sanitizer is enabled in your makefile.

ALSO, please commit and include your `l2g_t.lcm` file so the style checker understands you are not responsible for the style in the auto-generated `l2g_t.c`.
