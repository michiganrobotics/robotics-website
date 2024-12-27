---
title: "ROB 502: Programming for Robotics: Class 6 Clicker Discussion"
date: "2020-09-30"
---

## Class 6 clicker question answers and commentary

1. `(0b11101101 << 1) & 0x70 == 0b?` Again, the trick here is being able to figure out the bits of the hexadecimal 0x70. 7 = 4 + 2 + 1 = 0b0111, so that is the lower 3 bits of that hex digit. Now we take the binary and shift left by one to get 0b1\_1101\_1010, then zero out the lower 4 bits because of our lower hex digit 0 to get 0b1\_1101\_0000, then zero out bits other than those 3 bits of the upper digit to get 0b0\_0101\_0000 = 0b0101\_0000 = **0b01010000**.
2. `0x31 ^ 0x52 == 0x?` We start by decomposing these to bits: 0x31 ^ 0x52 = 0b0011\_0001 ^ 0b0101\_0010 = 0b0110\_0011 = **0x63**. Decomposing to bits gets easier the more we get familiar with how 1, 2, 4, and 8 add up!
3. `char msg[] = "taco cat"; msg[3] = '\0'; printf("%s", msg);` Here we count to index 3 in “taco cat”, \[0\] = t, \[1\] = a, \[2\] = c, \[3\] is now the null terminator, so all that gets printed is “**tac**”;
4. `printf("%ld, %ld", sizeof("hello!"), strlen("hello!"));` sizeof gives the number of bytes used for some type. The type of “hello!” is char\[7\], because that has enough space for the 6 characters and the 1 null terminator character. The length of the string is 6 characters, so we get “**7, 6**”.
5. `int vals[] = {5, 15, 25, 35}; printf("%ld", &vals[2] - &vals[0]);` Because of the “&” we are working with addresses/pointers, and doing pointer arithmetic. This simplifies to (vals + 2) - (vals + 0) = 2 - 0 = **2**. If we did not have the “&”, only then would we be getting the values from the array itself, and do 25 - 5 = 20. If we instead cast to long, (long)&vals\[2\] - (long)&vals\[0\], then we would not do pointer arithmetic, but would directly compare the actual pointer values, which are in bytes. Then, because sizeof(int) is 4, we would get 8 bytes.
6. `int vals[] = {5, 15, 25, 35}; printf("%ld", sizeof(vals));` vals is a constant literal array, so the type is actually inferred to be `int vals[4]`. So sizeof(int) \* 4 = **16**

```
typedef struct collection {
    int a;
    int b;
    char *c;
} collection_t;

collection_t coll = {0};
coll.a = 10;
coll.b = 20;
coll.c = malloc(sizeof(*coll.c) * 64);

printf("%ld", sizeof(coll.c)); // 7
printf("%ld", sizeof(coll)); // 8

free(coll.c);
coll.c = NULL;
```

Okay, so the key here is remembering that `sizeof` can only look at the explicit type of what you give it! So what is the type of `coll.c`? It is `char *c` which is a pointer and hence has a size of **8** bytes (on 64-bit computers)! It _does not matter_ that we use malloc to get `coll.c` to _point_ to a larger amount of memory. Fundamentally, `coll.c` is still just a pointer.

Then, the total size of `coll` is determined by its type of `collection_t`, which contains two ints and a pointer. So that size will be sizeof(int) \* 2 + sizeof a pointer = **16**, right? As it happens, the compiler might choose to make it larger by adding some extra space between the fields of the structure, because in some cases that will make loading it to memory faster. So really, the size of this is _greater than or equal to_ 16.

Do any of the following sections have a memory error/undefined behavior? Either answer “N” for no, or which line (1 to 4 or whatever) of the code example will first have undefined behavior/memory errors.

```
9.
int vals[] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
for (int i = 0; i < 10; i++) {
    vals[i] *= vals[i];
}
```

There is a memory error on line **3**, because vals has valid indices from 0 to 8, but i goes from 0 to 9, and so vals\[9\] will be an invalid access.

```
10.
char msg[] = "Walking in the park";
msg[7] = '\0';
printf("%s\n", msg);
```

**N**o problems here! We declare msg as an array of characters on the stack/as a local variable, and they start off with the string and we are able to modify it just fine like we have in many clicker questions!

```
11.
char *msg = "Walking in the park";
msg[7] = '\0';
printf("%s\n", msg);
```

This one is not very obvious! However, the important thing is that msg is _just a pointer_ and hence cannot store the actual characters of the string. So where does the string live? If we print out various pointers like we did in the `addresses` problem, you will notice that the string is actually in global/static memory! However, the compiler has also marked it as a constant to the computer, so the processor is protecting it from modification! Hence, get will crash on line **2**. Line 2 is almost like trying to modify another constant, like by saying that `0 = 2` or in a slightly more believable way, `int *a = &0; *a = 10;` but while the compiler will refuse to give us a pointer to an integer constant, that is exactly how string constants needs to work! We have to be able to get a pointer to them! But trying to change a constant through a pointer is just as invalid if that constant is a string as when it is an integer.

```
12.
char base_msg[] = "Walking in the park";
char *msg = base_msg;
msg[7] = '\0';
printf("%s\n", msg);
```

**N**o errors here! The issue with 11. is that the string we were trying to change was constant. Here, however, we have a local character array base\_msg that is initialized to the constant string. Modifying that local variable is perfectly fine.

```
13.
char *msg = malloc(strlen("Walking in the park"));
strcpy(msg, "Walking in the park");
free(msg);
msg = NULL;
```

Here we malloc just enough bytes for each of the characters in the string, but NOT for the null terminator character! When strcpy on line **2** tries to copy the string, it of course also tries to copy the null terminator, and this results in an invalid memory access.

```
14.
int *arr = malloc(sizeof(*arr) * 10);
realloc(arr, sizeof(*arr) * 20);
arr[0] = 10;
free(arr);
```

When we call realloc, we forget to reassign the return value to arr, as in `arr = realloc(arr, sizeof(*arr) * 20);` Why is this a problem? Well, when you call realloc, it might be able to increase the size of your memory in-place, just by getting more at the end of it. But that also might not be possible, in which case it will malloc new memory somewhere else, copy the memory over, and free the old location. So after calling malloc, you do not know if the original `arr` pointer is still valid or if it has been freed! That is why we need to save the return value from realloc, which will always be valid. The error does not happen until line **3** when we try to use the possibly invalid old arr value.
