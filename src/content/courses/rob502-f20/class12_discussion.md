---
title: "ROB 502: Programming for Robotics: Class 12 Discussion"
date: "2020-11-03"
---

## Clicker Questions

Use p4r-clicker to submit your answer

1. If a calculation takes `2N + 10` operations, what is the complexity in Big-O notation? The idea of Big-O notation is to hide away constants as insignificant and focus on just the "big picture" of what happens when the problem size becomes "large". In this case, we just have a linear increase, so we write **O(N)**. The idea is that the times `2` and the `+ 10` get hidden by the O.
    
2. If a calculation takes `2A + B^2` operations, what is the complexity in Big-O notation? Here `A` and `B` are independent, so we have to treat them separately. If they were not independent, we would first need to get them to use the same variable. Like this, then, the only thing we can drop is the scalar constant 2, so we get **O(A + B^2)**.
    
3. If a calculation takes `2A + 100log(A)` operations, what is the complexity in Big-O notation? Dropping the constants, we have a linear term and a logarithmic term. For large A, the linear term grows faster so the result is just **O(A)**.
    
4. What is the complexity of adding an element to a static array? With a static array, we either have space for an element at the end, or we don't! Either way is a constant operation like `arr[i] = 10;` and so is **O(1)** constant time.
    
5. What is the complexity of adding an element to a dynamic array? As long as when we call `realloc` to resize the array we grow it at a geometric rate (e.g. double the size of the array each time), then on average it takes just constant time **O(1)** to add to the array. If, however, we reallocate the array for _every addition_ (or some constant number of additions), then this will be O(N) time, since it will take N operations to copy over all the elements from the old array to the resized one.
    
6. What is the complexity of deleting an element from an arbitrary position in an array, and maintaining the order of all the other elements? If we need to maintain order, then deleting an element requires shifting all the following elements over by one to fill in that spot:
    

```
int len = 6;
int arr[6] = {0, 5, 10, 15, 20, 25};
// to delete at index 2
for (int i = 2; i + 1 < 6; i++) {
    arr[i] = arr[i + 1];
}
len--;
// now arr has len 5 and is {0, 5, 15, 20, 25}
```

Which results in time of **O(N)**.

7. What is the complexity of finding an element in an unsorted array by value? If we have an unsorted array, the best we can do is just check each element and stop when we find the right one! Checking each element is **O(N)**.
    
8. What is the complexity of finding a number in a sorted array by value? If the array is already sorted, then we can do a binary search! Cutting the space in half at each step leads to logarithmic time **O(log N)**. If we have unsorted data, most sorting algorithms use O(N log N) time, and so it is only worth doing the sorting if we will need to find things in the array more than N times (or something like that).
    
9. What is the complexity of finding an element in a hash table? Hash table's use a key as their index! This beautiful circumstance allows them to take **O(1)** constant time for finding a specific element by key. Hash tables can also store a value as well that is different from the key, but the idea is to choose the key so that you only look things up by keys. If you have a mapping relationship and need to go in both directions, you could just make two hash tables, one for mapping from A -> B, and the other for mapping back from B -> A.
    

### Naive "add" hash

Probably the simplest (and worst) "hash" function we can imagine just adds the bytes together.

```
uint32_t add_hash(uint8_t *data, int n) {
    uint32_t hash = 0;
    for (int i = 0; i < n; i++) {
        hash += *data;
        data++;
    }
    return hash;
}
```

Which of the following inputs will hash to the same value as "mat"?

1. "tam"
2. "tbm"
3. "tbn"
4. "tzn"
5. "tbl"
6. "tcl"
7. "amt"

**1, 5, and 7** all work! 1 and 7 are just the same letters in a different order, and then 5 has `b` = `a + 1` and `l` = `m - 1`, so `b + l = a + m`.

### Naive table hash

One clever way to continually change all 32 bits is to use a random/pseudo-random/specially designed look-up table to map our input bytes directly to 32-bit numbers.

```
uint32_t table_hash_keys[256];
void setup_table_hash(void) {
    for (int i = 0; i < 256; i++) {
        table_hash_keys[i] = rand();
    }
}

uint32_t table_a_hash(uint8_t *data, int n) {
    uint32_t hash = 0;
    for (int i = 0; i < n; i++) {
        hash += table_hash_keys[*data];
        data++;
    }
    return hash;
}
```

Which of the following inputs will hash to the same value as "mat"?

1. "tam"
2. "tbm"
3. "tbn"
4. "tzn"
5. "tbl"
6. "tcl"
7. "amt"

Thanks to the random numbers introduced by the table, example 5 no longer causes problems as `b + l != a + m` anymore. On the other hand, **1 and 7** still give the same result as "mat" since order of characters still doesn't matter.

### Better table hash

We can improve this function by doing more than just adding the input. If we first _shift_ the current hash three bits to the left (essentially equivalent to multiplying by 8, but very fast) before integrating the new byte, then the order of the inputs will matter. We can also use an exclusive or, to mix the bits better than adding would.

```
hash = (hash << 3) ^ table_hash_keys[*data];
```

And we get...

```
./hash table_b dot
0xd7f8ee9
./hash table_b tod
0xc9775e1b
```

What is the algorithmic complexity (Big O notation) of the three preceding hash functions?

Each of these hash functions has to process every character of their input, and does so only once, so we have linear time **O(N)**. Notice that when we say a hash table spends O(1) time to perform a lookup, we are saying that _in reference to the size of the hash table_, not to the size of the keys. If we wanted to be more full and comprehensive, we could say a hash table lookup takes time O(K) where K is the average size of the keys. If we ignore the keys, or consider them to always be "small" then this reduces to just O(1).
