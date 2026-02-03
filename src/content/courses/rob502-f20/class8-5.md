---
title: "ROB 502: Programming for Robotics: Class 8.5 Clicker Questions"
date: "2020-10-14"
---

## Clicker Questions

1. How many bits are in a byte?
2. How many bytes are in a `uint16_t`?
3. What is 164 in hexadecimal?
4. What is 87 in hexadecimal?

You have a 5 by 5 image buffer of 24-bit bgr pixels.

5. How many bytes large is this buffer?
6. What is the index of the coordinate (4, 2)?
7. What is the index of the coordinate (2, 4)?
8. If the buffer had type `uint8_t` instead of "24-bit bgr pixel", what would be the index of the blue component of the pixel at (4, 2)?
9. If the buffer had type `uint8_t` instead of "24-bit bgr pixel", what would be the index of the red component of the pixel at (2, 4)?
10. On a _32-bit computer_, what is `sizeof(uint64_t *)`?
11. On a _32-bit computer_, what is `sizeof(uint64_t)`?

### Homework 2 note

I have added a note to the document about how I organize my collision code!

```
// slightly modified from homework 1, they provide a single function
// bool check_collides(vector_xy_t *pg1, vector_xy_t *pg2);
collision.c
collision.h
```

I also want to give a shout out for a recent post on piazza:

> In debugging braitenberg so far, gdb has been invaluable. Here's a link to the 10 minute CS50 video I watched to learn how to use it better. I promise it is well worth the time.
> 
> https://www.youtube.com/watch?v=sCtY--xRUyI&ab\_channel=loveuala
