---
title: "ROB 502: Programming for Robotics: Class 9 Clicker Discussion"
date: "2020-10-19"
---

## Clicker Questions

Use p4r-clicker to submit your answer

```
int recursive1(int n) {
    if (n > 0) {
        return 2 + recursive1(n - 1);
    } else if (n < 0) {
        return -2 + recursive1(n + 1);
    }
    return 1;
}

int main(void) {
    printf("%d\n", recursive1(1)); // 1
    printf("%d\n", recursive1(5)); // 2
    printf("%d\n", recursive1(-2)); // 3

    return 0;
}
```

The key to understanding recursion here is that each time the recursive function is called, it is independent of the previous calls to that same function! This is possible because the computer maintains a "stack" of memory, where each entry on the stack contains the local variables for some function. If we recurse down into some function 100 times, then there will be 100 entries on the stack, one for each time that we again called into that function.

When writing a recursive function, you first need to assume that your function already works correctly, and just write a single incremental step in terms of the function already working. Then you set up your base case that allows the recursion to terminate. In this example, the base case is when n == 0, and for anything different than n, we have separate ways of recursing down.

So for `recursive1(1)` we get to `2 + recursive1(n - 1)` and that `recursive1(n - 1)` is just `recursive1(0)` which is 1. So we get 2 + 1 = **3**.

For `recursive1(5)` we can notice that we will always be taking the positive branch of the if statement, and that each value of 1 will get replaced by a plus 2, so we can get right to the answer of 5 \* 2 + 1 (for the base case) = **11**.

For `recursive1(-2)` we have the same basic pattern, but need to recognize that the base case is still _positive_ 1, so we have -2 \* 2 + 1 = **\-3**.

```
int recursive2(int n) {
    if (n % 2 == 0) {
        return 100 + recursive2(n / 2);
    } else if (n > 0) {
        return 1 + recursive2(n - 1);
    }
    return 0;
}

int main(void) {
    printf("%d\n", recursive2(2)); // 4
    printf("%d\n", recursive2(8)); // 5
    printf("%d\n", recursive2(10)); // 6

    return 0;
}
```

In this example, we have separate cases for when n is divisible by 2 (the remainder of a division by 2 is 0), and for any other positive value of n.

For `recursive2(2)`, we have even 2, so we get `100 + recursive2(n / 2)` which is also `100 + recursive2(1)`. `recursive2(1)` is then `1 + recursive2(n - 1)` = `1 + recursive2(0)` = 1. So this overall adds up to **101**..

For `recursive2(8)`, we just have two more levels in addition to the previous case: we also have (for 8) `100 + recursive2(4)` and (for 4) `100 + recursive2(2)`. So this makes a total of 200 + 101 = **301**.

For `recursive2(10)`, we have `100 + recursive2(5)`, `1 + recursive2(4)`, `100 + recursive2(2)`, and then we know `recursive2(2)` is 101, so we have a total of 201 + 101 = **302**.
