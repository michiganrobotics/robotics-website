---
title: "ROB 502: Programming for Robotics: Homework 3"
date: "2020-10-22"
---

### Clicker Questions

Use p4r-clicker to submit your answer

```
int val1 = 10;
int val2 = 20;
int *b = &val1; // b points to val1
int *c = b; // c copies the value of b, so it also points to val1
int **d = &b; // points to b
```

There is nothing all the special about taking a pointer to a pointer. Just like `val1` is a local variable, `b` is also a local variable, and the pointers for them both work basically the same. The difference is that there is now one more level of indirection. So `d` points to `b`, which _currently_ points to `val1`.

```
printf("%d\n", **d); // 1
```

Since `d` points to `b` which points to `val1`, the answer is **10**. The important thing to notice is that the types _do work_. The type definition `int **d` means any one of the following:

1. `int** d`: `d` is a pointer to a pointer to an integer, the value actually stored in `d`.
2. `int* *d`: `*d` is a pointer to an integer, and that would be `b`, since `d` points to `b`.
3. `int **d`: `**d` is an integer, and that would be 10, since `d` points to `b` which points to `val1` which has the value 10.

```
*b = 1; // b points to val1, so now val1 = 1, and val1 does not equal 10 anymore!
b = &val2; // b NOW points to val2, and does not point to val1 anymore!
```

When we modify `*b` this doesn't change `b`, it changes `val1`. When we modify `b` we are changing _only_ the value of `b` and it will work as a pointer to something else now.

```
printf("%d\n", *b); // 2
```

This is a tricky one since we just did so many things with `b`. The important thing is that `*b = 1` actually was a change to `val1`, and not to `b`. Then `b = &val2` actually causes `b` to point to `val2`, which has a value of **20**, and it doesn't really matter what we did before.

```
printf("%d\n", *c); // 3
```

Since the beginning, `c` has been a pointer to `val1`, and it still is! Right now `val1` has a value of **1**, which was set when `b` pointed to `val1`.

```
printf("%d\n", **d); // 4
```

`d` is a pointer to `b` and `b` is a pointer to `val2`, so again we get a value of **20**.

```
*d = &val1; // d points to b, so now b is a pointer to val1 again!

printf("%d\n", *b); // 5
```

Since we just used `d` to make `b` point to `val1`, we get the value of `val1`: **1**.

```
printf("%d\n", *c); // 6
```

`c` really hasn't changed at all! It is still a pointer to `val1` and so again we get **1**.

```
printf("%d\n", **d); // 7
```

`d` still points to `b` which still points to `val1`: **1**.

If you have would like to see this all a bit more visually, I encourage you to run this example with [CTutor](http://pythontutor.com/c.html).
