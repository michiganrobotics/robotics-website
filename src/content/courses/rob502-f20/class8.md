---
title: "ROB 502: Programming for Robotics: Class 8"
date: "2020-07-07"
---

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
vector_xy_t create_vector_xy(void) { // line 1
    vector_xy_t vec = { 0 };
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

## Some notes on homework2

Remember that color\_bgr\_t is a real type! So you can do this:

```
color_bgr_t white = {255, 255, 255};
bmp->data[p.y * bmp->width + p.x] = white;
```

For your potential enlightenment, this is the contents of my `graphics.h` file:

```
vector_xy_i32_t *gx_rasterize_line(int x0, int y0, int x1, int y1);

void gx_draw_line(bitmap_t *bmp, color_bgr_t color, int x0, int y0, int x1, int y1);

void gx_draw(bitmap_t *bmp, color_bgr_t color, vector_xy_t *points);

void gx_fill(bitmap_t *bmp, color_bgr_t color, vector_xy_t *points);

void gx_clear(bitmap_t *bmp, color_bgr_t color);

vector_xy_t *gx_rect(double width, double height);

vector_xy_t *gx_robot(double dim);

vector_xy_t *gx_rot(double theta, vector_xy_t *points);

vector_xy_t *gx_trans(double x, double y, vector_xy_t *points);
```

`vector_xy_t` stores a vector of (double, double) pairs, while `vector_xy_i32_t` is a vector of (int32\_t, int32\_t) pairs.

And here is how I perform test case 9 of rasterize:

```
vector_xy_t *shape = gx_trans(400, 400, gx_rot(M_PI / 6, gx_robot(20)));
gx_fill(&bmp, white, shape);
vector_xy_destroy(shape);
```

Notice how by thinking about how to use your functions, each one can have a simple easy-to-test function and then they can work well together! If you spend a little extra time to think about your code organization, it _will_ save you time in the long run!

## In-class problem 1: bisection

In this problem we will implement a simple form of search on a continuous function, the [bisection root-finding method](https://en.wikipedia.org/wiki/Bisection_method). The algorithm is very simple: we start with two points, x0 and x1, that have function values of opposite sign. This means that a zero (or _root_) of the function must lie in between x0 and x1.

We find that root/zero by repeatedly evaluating the midpoint between our lower and upper bounds on x, tightening the bound until the width of our bounds on x passes below a threshold. That is, at each step we replace either the lower or upper bound of x with that midpoint x value, depending on the sign of y at that midpoint x.

Your program will find the different roots of `2x - 20x^2 + 20x^3 - 4x^4`, and we will use a threshold of `1e-6`. That is, continue the loop as long as `x_high - x_low > 1e-6`. Your program will take as input the lower and upper bounds to search. You should print your numbers with `%11.4e`.

```
./bisection
usage: ./bisection <low> <high>
./bisection -1 0.1
x_mid: -4.5000e-01 y_mid: -6.9365e+00
x_mid: -1.7500e-01 y_mid: -1.0734e+00
x_mid: -3.7500e-02 y_mid: -1.0419e-01
x_mid:  3.1250e-02 y_mid:  4.3575e-02
x_mid: -3.1250e-03 y_mid: -6.4459e-03
x_mid:  1.4063e-02 y_mid:  2.4225e-02
x_mid:  5.4688e-03 y_mid:  1.0343e-02
x_mid:  1.1719e-03 y_mid:  2.3163e-03
x_mid: -9.7656e-04 y_mid: -1.9722e-03
x_mid:  9.7656e-05 y_mid:  1.9512e-04
x_mid: -4.3945e-04 y_mid: -8.8277e-04
x_mid: -1.7090e-04 y_mid: -3.4238e-04
x_mid: -3.6621e-05 y_mid: -7.3269e-05
x_mid:  3.0518e-05 y_mid:  6.1017e-05
x_mid: -3.0518e-06 y_mid: -6.1037e-06
x_mid:  1.3733e-05 y_mid:  2.7462e-05
x_mid:  5.3406e-06 y_mid:  1.0681e-05
x_mid:  1.1444e-06 y_mid:  2.2888e-06
x_mid: -9.5367e-07 y_mid: -1.9074e-06
x_mid:  9.5367e-08 y_mid:  1.9073e-07
x_mid: -4.2915e-07 y_mid: -8.5831e-07
```

## In-class problem 2: binarysearch

[Binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm) is the discrete equivalent of the bisection method.

Quoted from the Wikipedia page just linked is the following pseudocode for finding the left-most instance of a target number in a sorted list:

```
function binary_search_leftmost(A, n, T):
    L := 0
    R := n
    while L < R:
        m := floor((L + R) / 2)
        if A[m] < T:
            L := m + 1
        else:
            R := m
    return L
```

Your program will perform this binary search to find the target element, but first we need some data to search! The function `rand()` in C returns a random non-negative number between 0 and `RAND_MAX`. It is easy to get the value into some useful range (like 0 to 9) by using the remainder operator, e.g. `value from rand % 10`, So, first use malloc to get space for 1000 integers, and then fill them with random numbers from **0 to 999** (inclusive). By default `rand` will give the same sequence of random numbers on any given computer, and this makes testing programs with rand possible! However, across different computers, this property doesn't hold.

Now we have some random numbers, but binary search needs them to be sorted! Here we will use the C [`qsort` function](http://www.cplusplus.com/reference/cstdlib/qsort/), which implements the [quick sort algorithm](https://en.wikipedia.org/wiki/Quicksort). Because `qsort` is general and can sort elements of any type, it needs to be told a couple of things about the data it is sorting. It needs to now the size of the data elements (from `sizeof`) and also it needs a function that can compare them.

Use the following comparison function:

```
int int_compare(const void *a, const void *b) {
    int val_a = *(int*)a;
    int val_b = *(int*)b;
    return val_a - val_b;
}
```

Notice that because it is very general, it is giving a pointer to each element of our data. We cast this pointer to the right type (pointer to integer) and then follow the pointer/dereference the pointer to get the integers back out.

You can then call `qsort` like so:

```
qsort(vals, N, sizeof(int), int_compare);
```

On each iteration of the binary search, your program should print out the middle index, `m` in the pseudocode above. When it finds the target value, it should print out its index. If it doesn't find it, it should print nothing.

```
./binarysearch 0
mid_i: 500
mid_i: 250
mid_i: 125
mid_i: 62
mid_i: 31
mid_i: 15
mid_i: 7
mid_i: 3
mid_i: 1
mid_i: 0
0
./binarysearch 1
mid_i: 500
mid_i: 250
mid_i: 125
mid_i: 62
mid_i: 31
mid_i: 15
mid_i: 7
mid_i: 3
mid_i: 1
mid_i: 2
```

Because rand may behave differently on your computer than on the auto-grading server, your code may not give this exact same output on your computer and yet still be correct!

## In-class problem 3: fibonacci

Calculating Fibonacci numbers is a classic problem for introducing recursion. It is, however, a quite terrible way to calculate them, as we shall see in this problem.

### Classic recursion

Recursion is where a function invokes itself as part of its calculation. In order for the function to ever finish, the inner function call needs to have less work to do, such that eventually, each inner call can finish.

Here is an example of a recursive function for calculating an integer power:

```
// calculates a^x for non-negative x
int power(int a, int x) {
    if (x <= 0) {
        return 1;
    }
    return a * power(a, x - 1);
}
```

The main benefit of recursion is that you can think about solving your problem inductively. First you check for your base cases and supply the answers for those, and then you specify your recurrence relation, assuming that your function will work for smaller/simpler inputs.

On the other hand, for many problems, you could also just use a loop for an iterative solution:

```
// calculates a^x for non-negative x
int power(int a, int x) {
    int result = 1;
    for (int i = 0; i < x; i++) {
        result *= a;
    }
    return result;
}
```

Depending on the type of problem, one of these formulations might be simpler or easier to understand than the other.

### Timing your code

Whenever we are curious about the performance of our code, it can be handy to add timing information so the program can self-report. There are many functions in C that can give information about the time or date: here we will use `clock()` which gives the number of "ticks" since the computer started up. The number of "ticks" in a second is defined as `CLOCKS_PER_SEC`. Note that you _must_ explicitly convert between ticks and seconds using the `CLOCKS_PER_SEC` or your code will not work!!

```
#include <time.h>

int main(void) {
    clock_t start = clock();
    complex_calculation();
    double elapsed = (clock() - start) / (double)CLOCKS_PER_SEC;
    printf("complex_calculation() took %.2f seconds\n", elapsed);
    return 0;
}
```

Write a program to calculate the _i_'th Fibonacci number using recursion as in the power example above. In half a second of compute time, which is the highest _i_ you can calculate the Fibonacci number of?

### Faster Fibonacci

Now have your program calculate the _i_'th Fibonacci number without using recursion, but iteratively with a loop (see the iterative example calculating an integer power). Since your code will be so much faster now, we have to start worrying about the Fibonacci numbers becoming very large. Use `uint64_t` as your return type. Compute time will not be a problem, so instead we want to see which is the highest _i_ you can calculate the Fibonacci number of without overflowing the `uint64_t`! You will know that you have gone too far when the next Fibonacci number is somehow _less_ than the previous one.

### An in-between solution

One of the downsides of using a loop to calculate something like Fibonacci is that the recurrence relation is not nearly as obvious as it was before, and we have to explicitly remember the right number of previous Fibonacci values.

One alternative way to solve the problem is with something called _memoization_, which is a specific kind of caching. Memoization is essentially just when a function "remembers" what it's result is for certain inputs and returns that result directly if it can. This is very easy for us to use because Fibonacci numbers are all indexed from zero just like an array. Memoization can also be useful for arbitrary inputs, though, where you may not know beforehand what the input space is. Some languages (like Python) have [cool libraries](https://docs.python.org/3/library/functools.html#functools.lru_cache) that let you mark a function and have it automatically use memoization. Let's implement memoization ourselves by using a dynamic array, (go ahead and copy one over from class5 or homework2). Essentially, if the Fibonacci number is already contained in the array, return it directly, if not, just use the recurrence relation.

```
memozied_fibonacci(n) {
    if n in memoization_cache {
        return memoization_cache[n]
    }
    val = value from either base case or recursive relation, calling memozied_fibonacci()
    append(memoization_cache, val)
    return val
}

main() {
    ...
    initialize memoization_cache
    ...
}
```

The benefit here, is that our code will look a lot more like the recursive solution, but most of the time it will not be recursing, and instead will just perform table look-ups. In addition, especially for more complex problems, this solution will also be faster (over the long-term) than the loop-based solution. The downside is that memoization may use significantly more memory.

### Evaluation

Finally, for submitting, your code should evaluate the time it takes to calculate:

- fib(38) using the recursive method
- fib(90) using the loop method
- fib(90) using memoization

We want to know the times to a high precision, and with some of the faster methods, each call of the function takes almost no time at all. The following code will continue to run `fib(90)` in batches of 100 iterations until at least half a second has passed. We use batches of 100 iterations because when our function of interest is very fast, it is possible that calls to `clock()` will dominate the execution time. Make sure to properly keep track of units and perform the appropriate unit conversions here!! Because the recursive solution is so slow, do not execute it in batches of 100 iterations like this, and instead call it only a single time per loop.

```
#include <time.h>
...

start = clock();
iterations = 0;
while (clock() - start < half a second) {
    call fib(90) 100 times
    iterations += 100;
}
elapsed = (clock() - start) / (double)iterations / CLOCKS_PER_SEC;
```

Your program should report the mean number of milliseconds each method takes, down to 6 decimal places (`"%.6f"`). We should note that the memoized version is kinda cheating because every call after the first is just returning the cached value.

By default the compiler does not optimize your code very much. The idea is that for most programming you want your code to be fast to compile so you can easily make changes. Optimized code can also harder to debug. To make a fair comparison of the Fibonacci calculating methods, we should enable optimizations. Look at the differences in timings without optimizations (default) and then with the options `-O1`, `-O2`, and then `-O3` added to the end of your gcc compilation line in the makefile. There is also the `-Og` option which does as much optimization as the compiler thinks won't hurt debugging in GDB. For submission, use `-O3`. Please note this is a capital letter O for optimization, not a zero! Also, make sure to have the AddressSanitizer enabled in your makefile, because otherwise the valgrind check is unlikely to pass because of all the recursion in fib1. The AddressSanitizer is more efficient at checking the memory correctness of recursion.

One difficulty with timing optimized code is that sometimes the compiler will optimize your code to nothing if the compiler can prove the results of the computation aren't used. That is part of why we make sure to print out the result of the computation at the very end.

Your output should look something like this (just make sure the time in milliseconds is in the 6th column for the auto-grader):

```
fib1(38) got 39088169 and took ###.###### ms per iteration
fib2(90) got 2880067194370816120 and took ###.###### ms per iteration
fib3(90) got 2880067194370816120 and took ###.###### ms per iteration
```
