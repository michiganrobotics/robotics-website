---
title: "ROB 502: Programming for Robotics: Class 14 Discussion"
date: "2020-11-11"
---

## Clicker Questions

Use p4r-clicker to submit your answer

1. Suppose I give you a special number `uint32_t value = 7364963;` and promise that it is actually a null-terminated 3-character string! How would you go about printing it out as a string using `printf`? In order to cast pointers, first we need to have a pointer at all! So we can get a pointer to the value by writing `&value`. Next, we want to treat this as a string, so we want to cast to type pointer to char `char *`, so we will write `(char *)&value` and finally, we use `printf` with the string specifier: **`printf("%s\n", (char *)&value);`**
    
2. Knowing how to look up an ASCII table online, and that each byte will be either in a 1's place, 256's place, or 65536's place, can you figure out what one of the characters in the message is? Choose any one character to try to manually decode. In order to know what characters are represented by the number 7364963, we first need to split this value into separate bytes. An easy way to do this is by searching for "7364963 in hexadecimal"! That might give us "7,364,963 = 0x706163"
    

We can also do it a bit more manually, such as like this in Python:

```
>>> 7364963 % 256
99
>>> 7364963 / 256 % 256
97.38671875
>>> 7364963 / 256 / 256 % 256
112.38041687011719
```

Either way, since an x86-64 computer is little-endian, the low byte of the number will be the lowest address of the string, and hence the first character to print out. The rest of the bytes then go in that order. Using an ASCII table, (search online for one!) we find that:

```
99 = 0x63 = 'c'
97 = 0x61 = 'a'
112 = 0x70 = 'p'
```

So the word is **"cap"** and any one of these three characters is good!
