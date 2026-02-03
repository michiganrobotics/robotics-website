---
title: "ROB 502: Programming for Robotics: Class 8.5 Clicker Questions"
date: "2020-10-14"
---

## Clicker Questions

1. How many bits are in a byte? There are **8** bits in a byte! A byte is the smallest amount of data that the computer can easily work with. So for example, if you have 8 boolean values, the fastest way to work with them is to have 8 `bool` types which are each 1 byte large. It is possible to use the bits individually with bitwise operations, but that is going to be slower, because again, a byte is the smallest data type the computer can perform operations on!
    
2. How many bytes are in a `uint16_t`? There are 16 bits in a `uint16_t` (hence the name!) and there are **2 bytes**.
    
3. What is 164 in hexadecimal? In hexadecimal, we have two digits, the 16's place and the 1's place. With this number, it should be immediately apparent that 160 is just 10 in the 16's place. 10 as a hexadecimal digit is 'a' because 'a' comes after '9'. Then there is a remainder of 4 in the 1's place, so the full number is **0xA4**.
    
4. What is 87 in hexadecimal? Similar to above, but now we have 80, which is a 5 in the 16's place! The remainder is then 7, so the hexadecimal is **0x57**. (5 \* 16 + 7 = 87).
    

You have a 5 by 5 image buffer of 24-bit bgr pixels.

5. How many bytes large is this buffer? There are a total of 25 pixels, and each pixel is 3 bytes large (24 bits / (8 bits / pixel)), so there are 25 \* 3 = **75** bytes total!
    
6. What is the index of the coordinate (4, 2)? The formula for index in a 2-dimensional buffer is, in general, y \* width + x, so by that formula, 2 \* 5 + 4 = **14**. The buffer is going to look like this, by the indices:
    

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

7. What is the index of the coordinate (2, 4)? As above, the formula gives us 4 \* 5 + 2 = **22** and we can verify this with the above table.
    
8. If the buffer had type `uint8_t` instead of "24-bit bgr pixel", what would be the index of the blue component of the pixel at (4, 2)? If the buffer is of _bytes_ and not 24-bit pixels, then each pixel will take up three byes and hence three indices of this buffer. With each taking up three bytes then this means that the _base indices_ for each pixel are the same as the indices before, but multiplied by 3. So the overall pixel indices are now:
    

```
0   3   6   9   12
15  18  21  24  27
30  33  36  39  42
45  48  51  54  57
60  63  66  69  72
```

Because these are "bgr" pixels, that means that the bytes of each pixel start with the blue, then have the green, and finally the red component. So these indices are also the indices of the _blue_ values for each pixel. If we shift each by +1, then they will correspond to the _green_ values, and by +2 for the _red_.

We just want the blue component for (4, 2), which the table shows is **42**, which is also (2 \* 5 + 4) \* 3.

9. If the buffer had type `uint8_t` instead of "24-bit bgr pixel", what would be the index of the red component of the pixel at (2, 4)? The formula and same reasoning as above gives us (4 \* 5 + 2) \* 3 + 2 = **68**, first getting the base address of the pixel and then +2 to access the red component.
    
10. On a _32-bit computer_, what is `sizeof(uint64_t *)`? The difference between 32 and 64-bits computers is the size of the pointers being either 32 or 64 bits! So 32/8 = **4** bytes for a 32-bit computer.
    
11. On a _32-bit computer_, what is `sizeof(uint64_t)`? This type, `uint64_t` always has 64 bits no matter what computer or processor it runs on! And so 64/8 = **8** bytes! Even if you run this code on an 8-bit Arduino, this will be a 64-bit integer. If an Arduino has to do a 64-bit addition `a + b` however, it will be slow because it will have to spend 8 instructions for loading each of the bytes for `a`, another 8 for each of the bytes of `b`, 8 separate addition operations (most of them with the carry from the previous addition), and then another 8 store operations for the resulting answer, for a total of 32 operations for just this one addition. An Arduino isn't particularly fast either, so this is a big slowdown. On a modern 64-bit computer, that will be just one operation, running very fast!
