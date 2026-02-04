---
title: "ROB 502: Programming for Robotics: Homework 2.5 Clicker Questions"
date: "2020-10-07"
---

## Clicker Questions

1. How many different values can a bit represent?
2. How many different values can a single hexadecimal digit represent?
3. How many bits are in a single hexadecmial digit?
4. How many bits are in a byte?
5. How many values can be represented by a single byte?
6. `0x31 | 0x52 == 0x?`

### Least-significant byte first (LSB) or Most-significant byte first (MSB)

When multiple bytes are stored by the computer, they can be stored either in order of least significant first, or most significant first. Modern Intel/AMD x86 processors use the least significant byte first convention. This distinction is also often called endianness, and LSB can also be called little-endian (little end in first), and MSB being called big-endian (big end in first). "First" in this context means a lower memory address/lower index in a buffer.

For example the hexadecimal number 0x11223344 is implicitly written out with the big/most-significant end coming first in the string, similar to how we write decimal numbers with the largest digit-place first. However if a modern Intel x86 (LSB) computer writes this number into a file, we will see the bytes (using `xxd` to see the hex for example) as "44 33 22 11" in order of least to most significant. If the number were 0x12345678, then we would see in the file "78 56 34 12". On the other hand, if it were a MSB/big-endian computer, then we would see the file have bytes "12 34 56 78". Note that this is just a convention for how the bytes are organized and doesn't change the numbers themselves.

You have a file and use `xxd` and see the hexadecimal "10 00 00 10". This file can be represented by the struct:

```
typedef struct my_file_struct {
    uint16_t a;
    uint16_t b;
} my_file_t;
```

7. What is the value of a in the file?
8. What is the value of b in the file?

```
int32_t a;
int32_t b;
uint8_t c;
uint8_t *data = malloc(sizeof(a) + sizeof(b) + sizeof(c));
```

9. How do you determine the amount of memory that `data` points to?
