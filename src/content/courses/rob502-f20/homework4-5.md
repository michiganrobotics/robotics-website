---
title: "ROB 502: Programming for Robotics: Homework 4.5"
date: "2020-11-09"
---

## Clicker Questions

Use p4r-clicker to submit your answer

1. How many bits are in a `uint8_t`?
2. How many bytes are in a `uint32_t`?
3. The x86-64 architecture (basically all our modern laptops) is little-endian, meaning that the lowest address stores the lowest byte of a number. We have a number `uint16_t val = 0x1122;`. Which byte is stored first in memory, in hexadecimal?
4. Given `uint16_t val = 0x1122;` and `uint8_t *data = (uint8_t *)&val;` what is `data[0]`? Give the result in hexadecimal.
5. Similarly, what is `data[1]`? (in hex)
6. Now let us take `uint16_t val = 600;` and `uint8_t *data = (uint8_t *)&val;` what is `data[0]` in decimal?
7. Similarly, what is `data[1]`? (in decimal)

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

8. Does variable `a` or `b` live longer?
9. Is pointer `h` or `j` valid for longer?
10. Is pointer `argv` or `h` valid for longer?
11. Is pointer `j` valid over its entire lifetime?
12. Does variable `f` or `i` live longer?

I'd also like to remind everyone that the fundamental idea of a hash table is to use arbitrary data as an index in an array. We use two functions to do this, a hash function, and a reduce function. The hash function will return a fixed size value (e.g. 32-bits) and the reducing function will return a value just in the range of valid indices for the array. So if the array is 8192 elements long, then the reducing function will return a value 0-8191. If the hash table grows, the reducing function will reflect the new size of the table.

```
data ->
(hash function) ->
hash ->
(reduce function) ->
index in table
```

In order to count collisions in `hashcomp`, consider yourself as creating a hashtable that maps from byte arrays (entries as we call them) to integers:

```
hashtable = initialized to zeros;
hashtable["hello"] += 1; // this value has come up once.
hashtable["hello"] += 1; // this value has come up twice now
hashtable["does this collide"] += 1; // if we have had a collision, this is now 3
```
