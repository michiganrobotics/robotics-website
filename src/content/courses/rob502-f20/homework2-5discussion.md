---
title: "ROB 502: Programming for Robotics: Homework 2.5 Clicker Questions"
date: "2020-10-07"
---

## Clicker Questions

1. How many different values can a bit represent?

A bit is the smallest amount of information that computers can easily use, and can specify true/false or 1/0, a total of **2** different values.

2. How many different values can a single hexadecimal digit represent?

A hexadecimal digit can store **16** different values, 0 through 15. This can be seen in the name "hex" meaning 6 and "deci" meaning 10.

3. How many bits are in a single hexadecmial digit?

Since it can store 16 values and a bit can store 2, and 2 to the 4th power is 16, a hexadecimal digit contains **4 bits**.

4. How many bits are in a byte?

By definition, a byte is **8 bit**s. A byte is the smallest unit that most computers can run operations on directly.

5. How many values can be represented by a single byte?

2 to the 8th power is **256**. For an unsigned bit (`uint8_t`) the values will range from 0 to 255.

6. `0x31 | 0x52 == 0x?`

This is a bitwise OR operation, so each bit of output is a 1 if either of the input bits is 1. With the lower hex digits we have 0x1 and 0x2, which correspond to a 1-bit (2^0) and a 2-bit (2^1), so the output has both, 1+2=3. For the higher hex digit, we have 0x3 and 0x5, which correspond to the 1-bit and 2-bit and then the 1-bit and 4-bit (2^2), so the output has 1-bit, 2-bit, and 4-bit set, for 1+2+4=7. So the result is **0x73**.

#### Least-significant byte first (LSB) or Most-significant byte first (MSB)

When multiple bytes are stored by the computer, they can be stored either in order of least significant first, or most significant first. Modern Intel/AMD x86 processors use the least significant byte first convention. This distinction is also often called endianness, and LSB can also be called little-endian (little end in first), and MSB being called big-endian (big end in first). "First" in this context means a lower memory address/lower index in a buffer.

For example the hexadecimal number 0x11223344 is implicitly written out with the big/most-significant end coming first in the string, similar to how we write decimal numbers with the largest digit-place first. However if a modern Intel x86 (LSB) computer writes this number into a file, we will see the bytes (using `xxd` to see the hex for example) as "44 33 22 11" in order of least to most significant. If the number were 0x12345678, then we would see in the file hexadecimal "78 56 34 12". On the other hand, if it were a MSB/big-endian computer, then we would see the file have hexadecimal bytes "12 34 56 78". Note that this is just a convention for how the bytes are organized and doesn't change the numbers themselves.

You have a file and use `xxd` and see the hexadecimal "10 00 00 10". This file can be represented by the struct (the packed attribute guarantees the compiler will not add padding):

```
typedef struct my_file_struct {
    uint16_t a;
    uint16_t b;
} __attribute__((__packed__)) my_file_t;
```

7. What is the value of a in the file?

The variable a has a type of `uint16_t` meaning it has the size of 2 bytes. The first two bytes in the file are 0x10 and 0x00. The first byte is the least-significant, and the second byte is 0. The least-significant byte is essentially in the 1's place (256^0). That byte 0x10, with a 1 in the hexadecimal 16's place, therefor has a value 0f 16. In the 1's place of the entire number, the entire number has a value of **16**.

8. What is the value of b in the file?

Two bytes again, but in the reverse order of "00 10". So the least-significant byte is 0 and the most-significant byte has a value of 16. Because this second byte is after a whole first byte, it is in the 256's place (256^1), and so the total value is 16 \* 256 = **4096**. If we had a third byte, like "00 10 10" that third byte would be in the 65536's place (256^2).

```
int32_t a;
int32_t b;
uint8_t c;
uint8_t *data = malloc(sizeof(a) + sizeof(b) + sizeof(c));
```

9. How do you determine the amount of memory that `data` points to?

There is no way to get the size of an allocated memory region from the pointer itself. The only way to know how much memory data points to is to remember that value from when we call `malloc` in the first place! So we would do something like this:

```
int32_t a;
int32_t b;
uint8_t c;
size_t data_size = sizeof(a) + sizeof(b) + sizeof(c);
uint8_t *data = malloc(data_size);
```

And now we would have continued access to that `data_size` for the rest of the program.
