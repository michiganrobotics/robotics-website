---
title: "ROB 502: Programming for Robotics: Homework 1"
date: "2020-07-07"
---

## Floating-point trickey

This document describes some important nuances of floating point numbers that may be helpful: [https://www.phys.uconn.edu/~rozman/Courses/P2200\_15F/downloads/floating-point-guide-2015-10-15.pdf](https://www.phys.uconn.edu/~rozman/Courses/P2200_15F/downloads/floating-point-guide-2015-10-15.pdf)

### Clicker Questions: double vs int

Note that when doing an operation on two numbers, C needs them to be the same type, and will convert the less general type to the more general one.

Given this common code:

```
#define A 10
#define B 4
#define C 2.0
```

Use p4r-clicker to submit your answer for the output of printf

1. double a = A / C; printf("%.2f", a);
2. double a = A / B; printf("%.2f", a);
3. double a = A / (double)C; printf("%.2f", a);
4. double a = A / (double)B; printf("%.2f", a);
5. double a = (double)A / B; printf("%.2f", a);

Now three more for the three printf lines in the following:

```
double tenth = 0.1;
double one = 0.0;
for (int i = 0; i < 10; i++) {
    one += tenth;
}
printf("%d", (int)one); // 6
printf("%.2f\n", one); // 7
printf("%.16f\n", one); // 8
```

## Use functions!!

As a quick note, both the problems on this homework and future homeworks are generally difficult enough that if you don't start writing your programs by sketching out the different functions you will want to write and use, then it will be difficult to manage the complexity. It is much easier to reason about a single function with three variables input and one output than everything all at once in your main function! In addition, the style checker will not allow you to use any single function larger than 70 lines, and will insist you break it up into smaller functions.

## Problem 1: collision

In this problem you will write a program to detect collision between polygons.

Your program will read in a file `polygons.csv` that will look something like this:

```
x   y   rot n_points x0  x1  x2  x3  y0  y1  y2  y3
0.0 0.0 0.0 4        0.0 0.0 1.0 1.0 0.0 1.0 1.0 0.0
1.0 0.0 0.0 4        0.0 0.0 1.0 1.0 0.0 1.0 1.0 0.0
```

Notice that a "comma separated values" or "csv" often doesn't have any commas at all! Really it would more generally be called a "delimiter separated values" file. Here we are using arbitrary amounts of white space to separate the values.

The first line is a key that your program can ignore, and then each of the next two lines describes a polygon. The first three columns give both the polygon's global location and also the counterclockwise rotation in _degrees_. Remember that in applying this transformation, rotation happens first _and then_ translation. Besides `n_points`, each of these values may be a floating point number. After you read `n_points` you will then know how many x values and then y values to read in, and you can do that with a for loop. If you like, you can check you are doing the proper rotation as shown on this Wikipedia page: [https://en.wikipedia.org/wiki/Rotation\_matrix](https://en.wikipedia.org/wiki/Rotation_matrix)

Add this define to your file for the constant `M_PI` (math pi):

```
#define M_PI 3.14159265358979323846
```

If any of the numbers in the file are invalid, your program must print an error message to `stderr` and exit/return with a status code of 1.

Following this you read in the number of points used by the polygon. For simplicity we will assume the number of points cannot exceed 16, and your program should output an error if there are greater than 16 points. The points of the polygon, with (0, 0) representing the polygon's point of rotation, are then listed. The points are given in a certain order, called a winding order. In the example above, the points are given in clockwise order around the square. This winding order will be important for some of the algorithms we use. Counter-clockwise winding order also works.

1. First your program will output the points of the two polygons, one on each line, after they have been rotated and translated, with labels for each x and y value (see below). NOTE: please do not print spaces at the ends of the lines!
2. Then, your program will print a statement for each pair of lines, specifying those lines and whether there was an intersection or not.
3. You will also print a statement about whether either polygon contains the other. (No statement if they are not contained)
4. Finally, your program will either output `collision!` or `no collision`

For _all_ of the floating point values in the output, use `"%.5f"`, _notice_ that even though we are printing out a floating point number, we want to use _double-precision_ floating point numbers in our code exclusively! In general, do not use the type called `float` (single-precision floating point number) unless you have a very specific reason to!

With this file:

```
x y rot n_points x0 x1 x2 x3 y0 y1 y2 y3
0 0 0   4        0  0  2  2  0  2  2  0
1 0 0   4        0  0  2  2  0  2  2  0
```

You should get:

```
$ ./collision
x0 0.00000 y0 0.00000 x1 0.00000 y1 2.00000 x2 2.00000 y2 2.00000 x3 2.00000 y3 0.00000
x0 1.00000 y0 0.00000 x1 1.00000 y1 2.00000 x2 3.00000 y2 2.00000 x3 3.00000 y3 0.00000
NO line intersection between (0.00000, 0.00000), (0.00000, 2.00000) and (1.00000, 0.00000), (1.00000, 2.00000)
NO line intersection between (0.00000, 0.00000), (0.00000, 2.00000) and (1.00000, 2.00000), (3.00000, 2.00000)
NO line intersection between (0.00000, 0.00000), (0.00000, 2.00000) and (3.00000, 2.00000), (3.00000, 0.00000)
NO line intersection between (0.00000, 0.00000), (0.00000, 2.00000) and (3.00000, 0.00000), (1.00000, 0.00000)
NO line intersection between (0.00000, 2.00000), (2.00000, 2.00000) and (1.00000, 0.00000), (1.00000, 2.00000)
NO line intersection between (0.00000, 2.00000), (2.00000, 2.00000) and (1.00000, 2.00000), (3.00000, 2.00000)
NO line intersection between (0.00000, 2.00000), (2.00000, 2.00000) and (3.00000, 2.00000), (3.00000, 0.00000)
NO line intersection between (0.00000, 2.00000), (2.00000, 2.00000) and (3.00000, 0.00000), (1.00000, 0.00000)
NO line intersection between (2.00000, 2.00000), (2.00000, 0.00000) and (1.00000, 0.00000), (1.00000, 2.00000)
NO line intersection between (2.00000, 2.00000), (2.00000, 0.00000) and (1.00000, 2.00000), (3.00000, 2.00000)
NO line intersection between (2.00000, 2.00000), (2.00000, 0.00000) and (3.00000, 2.00000), (3.00000, 0.00000)
NO line intersection between (2.00000, 2.00000), (2.00000, 0.00000) and (3.00000, 0.00000), (1.00000, 0.00000)
NO line intersection between (2.00000, 0.00000), (0.00000, 0.00000) and (1.00000, 0.00000), (1.00000, 2.00000)
NO line intersection between (2.00000, 0.00000), (0.00000, 0.00000) and (1.00000, 2.00000), (3.00000, 2.00000)
NO line intersection between (2.00000, 0.00000), (0.00000, 0.00000) and (3.00000, 2.00000), (3.00000, 0.00000)
NO line intersection between (2.00000, 0.00000), (0.00000, 0.00000) and (3.00000, 0.00000), (1.00000, 0.00000)
polygon1 contains polygon2
polygon2 contains polygon1
collision!
```

As another example:

```
x y rot n_points x0 x1 x2 x3 y0 y1 y2 y3
1 0.0 45   4        0  0  2  2  0  2  2  0
0 0.5 60   4        0  0  2  2  0  2  2  0
```

Should result in:

```
$ ./collision
x0 1.00000 y0 0.00000 x1 -0.41421 y1 1.41421 x2 1.00000 y2 2.82843 x3 2.41421 y3 1.41421
x0 0.00000 y0 0.50000 x1 -1.73205 y1 1.50000 x2 -0.73205 y2 3.23205 x3 1.00000 y3 2.23205
NO line intersection between (1.00000, 0.00000), (-0.41421, 1.41421) and (0.00000, 0.50000), (-1.73205, 1.50000)
NO line intersection between (1.00000, 0.00000), (-0.41421, 1.41421) and (-1.73205, 1.50000), (-0.73205, 3.23205)
NO line intersection between (1.00000, 0.00000), (-0.41421, 1.41421) and (-0.73205, 3.23205), (1.00000, 2.23205)
line intersection between (1.00000, 0.00000), (-0.41421, 1.41421) and (1.00000, 2.23205), (0.00000, 0.50000)
NO line intersection between (-0.41421, 1.41421), (1.00000, 2.82843) and (0.00000, 0.50000), (-1.73205, 1.50000)
NO line intersection between (-0.41421, 1.41421), (1.00000, 2.82843) and (-1.73205, 1.50000), (-0.73205, 3.23205)
line intersection between (-0.41421, 1.41421), (1.00000, 2.82843) and (-0.73205, 3.23205), (1.00000, 2.23205)
NO line intersection between (-0.41421, 1.41421), (1.00000, 2.82843) and (1.00000, 2.23205), (0.00000, 0.50000)
NO line intersection between (1.00000, 2.82843), (2.41421, 1.41421) and (0.00000, 0.50000), (-1.73205, 1.50000)
NO line intersection between (1.00000, 2.82843), (2.41421, 1.41421) and (-1.73205, 1.50000), (-0.73205, 3.23205)
NO line intersection between (1.00000, 2.82843), (2.41421, 1.41421) and (-0.73205, 3.23205), (1.00000, 2.23205)
NO line intersection between (1.00000, 2.82843), (2.41421, 1.41421) and (1.00000, 2.23205), (0.00000, 0.50000)
NO line intersection between (2.41421, 1.41421), (1.00000, 0.00000) and (0.00000, 0.50000), (-1.73205, 1.50000)
NO line intersection between (2.41421, 1.41421), (1.00000, 0.00000) and (-1.73205, 1.50000), (-0.73205, 3.23205)
NO line intersection between (2.41421, 1.41421), (1.00000, 0.00000) and (-0.73205, 3.23205), (1.00000, 2.23205)
NO line intersection between (2.41421, 1.41421), (1.00000, 0.00000) and (1.00000, 2.23205), (0.00000, 0.50000)
polygon1 contains polygon2
polygon2 contains polygon1
collision!
```

### Polygon collision algorithm

We will implement a simple algorithm based on the cross product:

```
Apply global translations and rotations to all points
for each line l1 in polygon 1 {
    for each line l2 in polygon 2 {
        // do l1 and l2 intersect?
        for each line l in [l1, l2] {
            for each point p in the other line {
                compute the cross product between l and p
            }
            If the two cross products have opposite signs (and are not zero),
                then they were on opposite sides of the line l that extends to infinity
        }
        If both cross product checks above indicated opposite signs,
            then the actual lines (not extending to infinity) intersect
    }
}
```

> Neither a point nor a line are actually vectors per se, so both need to be converted to vectors in order to calculate the cross product. You have three points total. Establish one to be the origin, and then make your vectors both reference that point. Draw it out on paper! That is what I had to do for it to make sense.

However, this algorithm has a failure mode when one polygon completely contains the other. In addition, it won't detect when the polygons are touching each other. So we need to check if either polygon contains the other in some fashion, by checking if any point of one polygon is contained in the other.

```
for each polygon pg in [polygon 1, polygon 2] {
    // compute if pg contains a point p of the other polygon
    for each line l in pg {
        compute the cross product between l and p
    }
    // the sign of each cross product indicates the side the point lies on.
    // the lines in the polygon must have a consistent winding order (clockwise or counter)
    // for the signs to consistently indicate inside or outside of the polygon.
    if all the cross products have the same sign or are zero, then the polygon contains point p
}
```

Most of the automatic tests use a clockwise winding order in the `polygons.csv` file.

Note that even if the polygons only intersect at a point, we still consider this a collision, and it should be detected as a "containment" of that point.

### Cross product

To be clear, in two dimensions, the cross product of two vectors is a scalar pointing either into or out of the page:

```
cross product z = x1 * y2 - x2 * y1;
```

There is an animation on this webpage that makes it clear how the cross product helps us determine which side of a line is a point located on: [https://www.mathsisfun.com/algebra/vectors-cross-product.html](https://www.mathsisfun.com/algebra/vectors-cross-product.html)

### Note on using remainder operator %

You main find it very useful to use the remainder operator to help you find pairs of indices that make up each line of a polygon. Here is simplified example:

```
int values[4] = {10, 20, 30, 40};
for (int i = 0; i < 4; i++) {
    int a = values[i];
    // after adding 1, we get the remainder, which causes 4 to wrap around to 0
    int b = values[(i + 1) % 4];
    printf("Pair of values: %d and %d\n", a, b);
}
```

### Quickly illustrated example

### Structures

You may find it useful in your program to use a structure to represent the polygons. The general syntax for a structure is:

```
struct object {
    int int_value;
    double double_array[16];
    // repeat for as many different elements as you like
};

void test(void) {
    struct object my_object = {0}; // notation for setting value to all zeros
    my_object.int_value = 10;
}
```

However, it is generally more convenient to use a type definition to avoid having to type `struct object` as the type every single time. Then the same code could look like:

```
typedef struct object {
    int int_value;
    double double_array[16];
} object_t;

void test(void) {
    object_t my_object = {0}; // notation for setting value to all zeros
    my_object.int_value = 10;
}
```

It is a convention that new types like this end in a `_t` to signify that they are types and not variables.

### Reading from files

When you open a file, you get a `FILE *` value that holds a position in that file. Every different read function will move you forwards through the file, so characters/words/lines will not repeat. Whenever you are reading from a file, you should always be careful to check if your input is valid/expected, and report an error if it is not.

If you want to read a file character by character, use the `fgetc` function.

If you want to read an entire line of a file, you may find it helpful to use the `fgets` function.

If you want to read different kinds of values separated by white space (spaces, new lines, tabs, etc...), use `fscanf`. Just like the printf function, fscanf uses a format string to describe the number and types of inputs to read from a file. Generally for integers you use `%d` (meaning decimal) and for doubles you use `%lf` (meaning long floating point number). Calling fscanf returns the number of numbers successfully read from the file. You should check that this number is the same as the number you asked for so that you can properly handle invalid input. Notice that since you want fscanf to put a value into certain variables, the variable needs to be prefixed with an `&`. We will get more into what the means later.

For a file `my_file.txt` with the following:

```
10, 1.0, 2.0
10,
1.0,
2.0
10.0    20.0    30.0
```

```
FILE *f = fopen("my_file.txt", "r");
if (!f) {
    // for certain system functions, perror  (print error) will print an explanation.
    // When the file is missing, this prints to stderr:
    // "Could not open my_file.txt: No such file or directory"
    perror("Could not open my_file.txt");
    exit(1);
}

printf("character 0: %c\n", fgetc(f)); // 1
printf("character 1: %c\n", fgetc(f)); // 0
printf("character 2: %c\n", fgetc(f)); // ,

// we can also check for the EOF (end of file) value from fgetc
for (int i = 3; i < 6; i++) {
    int c = fgetc(f);
    if (c == EOF) {
        fprintf(stderr, "unexpected EOF while reading file\n");
        exit(1);
    }

    printf("character %d: %c\n", i, c); // ' ', 1, .
}

char rest_of_line[128];

// use sizeof to not have to repeat 128
if (!fgets(rest_of_line, sizeof(rest_of_line), f)) {
    fprintf(stderr, "failed to read rest of first line\n");
    exit(1);
}
printf("Remainder of that line was: %s\n", rest_of_line); // "0, 2.0"

// use = {0} to initialize the value to zero, which will help avoid
// errors from the style checker
object_t obj = {0};
// fscanf does not care that the rest of the values are on different lines
int args_read = fscanf(f, "%d, %lf, %lf", &obj.int_value,
                       &obj.double_array[0], &obj.double_array[1]);
if (args_read != 3) {
    fprintf(stderr, "could not read all three obj values!\n");
    exit(1);
}

double vals[3] = {0}; // also initialized to zero
// we only need a single space in the format string no matter
// how many spaces are in the file!
int args_read = fscanf(f, "%lf %lf %lf", &vals[0], &vals[1], &vals[2]);
if (args_read != 3) {
    fprintf(stderr, "could not read all three array values!\n");
    exit(1);
}
```

The format with `fscanf` does have to match _exactly_:

```
10 1.0 2.0
```

```
int args_read = fscanf(f, "%d, %lf, %lf", &obj.int_value,
                       &obj.double_array[0], &obj.double_array[1]);
// args_read will be 1 because it can't find the comma requested in the fscanf format string
```

## Problem 2: cryptogram

In this problem you will write a program to "encrypt" and "decrypt" strings of text using a "password". In general, cryptograms are simple ciphers that can often be broken by hand with enough example text, so don't use this for any real security!

The cryptogram will be based on letter rotation, with the password indicating how far each letter of the plain text should be rotated. The letter 'a' rotates by 0, 'b' by 1, 'c' by 2, and so forth. For example, 'z' rotated by 'b' (1) would become 'a' again, since in rotation, 'z' is followed by 'a' again.

For example, if the password is "abc" and the plain text is "aaaaaa", then the encrypted text is "abcabc", with each letter of the password effecting one letter of plain text. The password is just repeated as long as necessary to encrypt all the text.

Only letters should be encrypted, and they should maintain their case. So password "abc" would encrypt 'Hello World!' as 'Hfnlp Yosnd!'.

Passwords are not case-sensitive, and characters in the password that are not letters are ignored/skipped. A blank password leaves the plain text unchanged.

Use the [`strcmp`](http://www.cplusplus.com/reference/cstring/strcmp/) function to determine if the user argument is "encrypt" vs "decrypt" and note that it does not return a boolean value!

You do not need to make a new array to parse the password into. You will need to use the remainder operator `%` a lot, which will be useful for getting an array index (such as the password array) or a value (such as a letter in the alphabet) to loop back around to 0 automatically.

```
./cryptogram
usage: ./cryptogram <encrypt|decrypt> <password> <text>
./cryptogram encrypt abc 'Hello World!'
Hfnlp Yosnd!
./cryptogram encrypt ABC 'Hello World!'
Hfnlp Yosnd!
./cryptogram encrypt 'A!~b~!C' 'Hello World!'
Hfnlp Yosnd!
./cryptogram decrypt abc 'Hfnlp Yosnd!'
Hello World!
./cryptogram encrypt '' 'Hello World!'
Hello World!
./cryptogram enscrypt abc hello
expected command encrypt or decrypt. got 'enscrypt'
```
