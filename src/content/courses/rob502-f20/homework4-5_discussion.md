---
title: "ROB 502: Programming for Robotics: Homework 4.5 Discussion"
date: "2020-11-10"
---

### Clicker Questions

Use p4r-clicker to submit your answer

1. How many bits are in a `uint8_t`? Fundamentally, a bit is the unit of information distinguishing two states, 0 and 1. C marks the integer types by the number of bits, so a `uint8_t` has **8** bits.
    
2. How many bytes are in a `uint32_t`? 32 bits / (8 bits / byte) = **4** bytes
    
3. The x86-64 architecture (basically all our modern laptops) is little-endian, meaning that the lowest address stores the lowest byte of a number. We have a number `uint16_t val = 0x1122;`. Which byte is stored first in memory, in hexadecimal? Since the lower byte is stored first, the lower byte of 0x1122 is **0x22**. We remember that two hexadecimal digits make a byte, and that a `uint16_t` is two bytes.
    
4. Given `uint16_t val = 0x1122;` and `uint8_t *data = (uint8_t *)&val;` what is `data[0]`? Give the result in hexadecimal. This is just the same question phrased with more C code. The first/low byte is **0x22**.
    
5. Similarly, what is `data[1]`? (in hex) By the same logic, the second lowest byte is the high byte **0x11**.
    
6. Now let us take `uint16_t val = 600;` and `uint8_t *data = (uint8_t *)&val;` what is `data[0]` in decimal? First we have to divide the number 600 into two bytes: a low byte will be in the 1's place and a high byte will be in the 256's place. We see that 600 can go into 256 twice with a remainder of 88. So the high byte will have a value of 2 and the low byte **88**.
    
7. Similarly, what is `data[1]`? (in decimal) The high byte, following above, has a value of **2**. Although it is in the 256's place, a byte still has a value from 0-255, regardless of what it might mean in some greater context.
    

In order for a pointer to be valid, it has to point at some memory that will exist for at least as long as that pointer value. We can say that the lifetime of the memory has to match or exceed the lifetime of the pointer value.

```

int a = 10;

int add(int b, int c) {
    return b + c;
}

void add_to(int *d, int *e) {
    *d += *e;
}

int main(int argc, char **argv) {
    int f = 10;
    int *g = &f;
    int *h = malloc(sizeof(*h));
    *h = 20;

    for (int i = 0; i < 10; i++) {
        int *j = &i;
        add_to(h, j);
        int k = add(a, f);
        printf("%d, %d\n", *h, k);
    }

    // we don't call free(h)

    return 0;
}
```

8. Does variable `a` or `b` live longer? **a** is a global variable that lives for the whole program while `b` only lives for the duration of function add, each time it is called.
    
9. Is pointer `h` or `j` valid for longer? **h** is on the heap and is never freed, so it lives for the entire program until the program exits and the operating system reclaims the memory. `j` is only valid in the for loop, while it exists.
    
10. Is pointer `argv` or `h` valid for longer? Both of these live for basically the whole program time! Probably `argv` goes out of scope at some point before the program actually quits. Because is it never freed (it will be a memory leak), **h** should live longer!
    
11. Is pointer `j` valid over its entire lifetime? **Yes**, `j` will be valid for its entire lifetime, because `i` exists for the whole for loop, while `j` only exists for the inside block of the for loop.
    
12. Does variable `f` or `i` live longer? **f** lives for the entire block of main, while `i` just lives inside the for loop.
