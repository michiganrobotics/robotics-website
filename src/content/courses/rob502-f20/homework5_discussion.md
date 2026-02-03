---
title: "ROB 502: Programming for Robotics: Homework 5"
date: "2020-11-30"
---

## Clicker Questions

Use p4r-clicker to submit your answer

1. How many bits are in a byte? There are **8** bits in a byte! A byte is the smallest amount of data that the computer can easily work with. So for example, if you have 8 boolean values, the fastest way to work with them is to have 8 `bool` types which are each 1 byte large. It is possible to use the bits individually with bitwise operations, but that is going to be slower, because again, a byte is the smallest data type the computer can perform operations on!
    
2. How many bits are in a single hexadecimal digit? There are two hexadecimal digits in a byte, so the 8 bits divided in 2 give **4 bits** for each hex digit!
    
3. How many values can be represented by a single hexadecimal digit So the very word hexadecimal has the answer in it! "hex" means 6 and "deci" means 10, so 6+10=16 different values in hexadecimal. We can also get this answer by knowing that a hex digit has 4 bits, and each bit can encode 2 different values, so 2 to the 4th power `2^4 = 16`. **16** different values are possible.
    
4. `char msg[] = "taco cat"; msg[3] = '\0'; printf("%s", msg);` Here we count to index 3 in "taco cat", \[0\] = t, \[1\] = a, \[2\] = c, \[3\] is now the null terminator, so all that gets printed is "**tac**";
    
5. `printf("%ld, %ld", sizeof("hello!"), strlen("hello!"));` `sizeof` gives the number of bytes used for some type. The type of "hello!" is `char[7]`, because that has enough space for the 6 characters and the 1 null terminator character. The length of the string is 6 characters, so we get "**7, 6**".
    

You have a 5 by 5 image buffer of 24-bit bgr pixels.

6. How many bytes large is this buffer? There are a total of 25 pixels, and each pixel is 3 bytes large (24 bits / (8 bits / pixel)), so there are 25 \* 3 = **75** bytes total!
    
7. What is the index of the coordinate (4, 2)? The formula for index in a 2-dimensional buffer is, in general, y \* width + x, so by that formula, 2 \* 5 + 4 = **14**. The buffer is going to look like this, by the indices:
    

```
0   1   2   3   4
5   6   7   8   9
10  11  12  13  14
15  16  17  18  19
20  21  22  23  24
```

But of course in actual memory, that will all be linear:

```
0   1   2   3   4   5   6   7   8   9   10  11  12  13  14   15  16  17  18  19   20  21  22  23  24
```

8. What is the big-O time complexity of a search through an unsorted array for a given value? On average we will have to check half of all the elements, so we would have N/2 \* some constant number of operations for each check. Dropping all the constants we get **`O(N)`**.
    
9. What is the big-O time complexity of a binary search through a sorted array for a given value? Each iteration of the binary search lets us cut the search space in half, so for N=8 we need log2(8)=4 iterations, for N=32 we need log2(32)=6 iterations, and so on. We can drop the constant factor from the base 2, though and just get **`O(log N)`**.
    
10. If a calculation takes `2A + 100log(A)` operations, what is the complexity in Big-O notation? Dropping the constants, we have a linear term and a logarithmic term. For large A, the linear term grows faster so the result is just **`O(A)`**.
    
11. Suppose I give you a special number `uint32_t value = 7364963;` and promise that it is actually a null-terminated 3-character string! How would you go about printing it out as a string using `printf`? In order to cast pointers, first we need to have a pointer at all! So we can get a pointer to the value by writing `&value`. Next, we want to treat this as a string, so we want to cast to type pointer to char `char *`, so we will write `(char *)&value` and finally, we use `printf` with the string specifier: **`printf("%s\n", (char *)&value);`**
    
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

So **no**, it isn't guaranteed to terminate, because `thread_finished` is only modified in a separate thread, and the C language and compiler do not actually know about the concept of threads: they are introduced with an external library called `pthread`. So as far as the compiler is concerned, `thread_finished` at the start of the while loop in main is `false` and so the while loop might as well just read `while (!false)` or `while (true)` and the program would never exit! Whether compiler makes that optimization or not is a different question, but _it is allowed_ to do so! 13. On the other hand, _does_ the example above terminate on the instructor's computer? So in actual fact, the example above still **does terminate** on my computer, and it is because of the `printf` statement. Remove that `printf` and it will make an infinite loop. The reason (I am fairly sure) that this happens is because the `printf` function was written, as best as possible, to be thread-safe. This means that if you call `printf` from different threads you won't see the lines get all garbled together, like getting "Hello frHello fromom thread1from thread2!!" instead of "Hello from thread1! Hello from thread2!". Now, I suspect that the measures that `printf` uses to make itself thread-safe also ends up extending to our while loop, preventing the optimization of `while (!thread_finished)` in a way that will not be valid with another thread modifying that value.

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

**Yup!** Now that we have `thread_finished` properly marked as `volatile`, the compiler knows it is not allowed to optimize `thread_finished` in any way, and must always reload the variable from memory, making sure that we always get the most up-to-date value from it, and don't loop forever.
