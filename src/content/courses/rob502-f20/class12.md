---
title: "ROB 502: Programming for Robotics: Class 12"
date: "2020-07-07"
---

## Due Tuesday, November 10 10:00PM, updated 11/10/20 6:46pm

### Clicker Questions

Use p4r-clicker to submit your answer

1. If a calculation takes `2N + 10` operations, what is the complexity in Big-O notation?
2. If a calculation takes `2A + B^2` operations, what is the complexity in Big-O notation?
3. If a calculation takes `2A + 100log(A)` operations, what is the complexity in Big-O notation?
4. What is the complexity of adding an element to a static array?
5. What is the complexity of adding an element to a dynamic array?
6. What is the complexity of deleting an element from an arbitrary position in an array, and maintaining the order of all the other elements?
7. What is the complexity of finding an element in an unsorted array by value?
8. What is the complexity of finding a number in a sorted array by value?
9. What is the complexity of finding an element in a hash table?

## Hash tables

Today we are going to begin implementing a hash table. We will implement and compare various hash functions and reducing methods and compare their performance. In the homework, you will finish the hash table implementation.

The "table" part of hash table means that ultimately, our data is stored in a dynamic array. In order for us to get average-case O(1) time to find data in our table, however, we somehow need to know where to look in the hash table without having even looked there!

With an ordinary array, we can get this fast O(1) look-up time for elements only when we directly use their index. The clever idea of a hash table is to somehow map the data itself, whether a string or floating point number or both together, into that index, telling us where to look in the table.

```
table = create_hashtable();

// a hash table let's us use a value like a string or floating point
// number in the place of a normal index:
table["hello world"] = 10;

// somehow we need to translate "hello world" into a number index!
// e.g. if somehow "hello world" corresponds to the index 9476, we get:
table[9476] = 10;
```

![Illustration of a string, double, and array all getting hashed to three indices of a table](/wp-content/uploads/sites/6/2020/11/hashtable_intro.svg)

The mapping between the data and the index is through a [_hash function_](https://en.wikipedia.org/wiki/Hash_function). Hash functions are able to map arbitrary amounts of data to a fixed-size, which we then manipulate to fit the size of our table. When used for a hash table, the fixed-size from the hash function is generally 32 or 64 bits. If our hash table currently only needs to store up to around 500 entries, we would then reduce the hash to be 10 bits, allowing us to map 1024 values.

In order to be effective, the hash function will optimally be very fast and have as uniform a distribution of outputs as possible. A consequence of pursuing uniformly distributed outputs is that any single bit flip in the input should be equally likely to flip every bit of the output. If our hash table encounters collisions (where different data map to the same index), that may slow it down significantly. If the number of elements in the table grows to the point that there are many collisions, we will want to grow the table and redistribute all the items in the new table so that they are more uniformly distributed again. This process is called rehashing and it represents one of the main drawbacks to hash tables.

## In-class problem 1: hash

In this problem we will implement several hash functions and then evaluate their usefulness to our hash table based on the above criteria.

Your program will take in a string from standard input and print out the 32/64-bit hash as hexadecimal. Although the input will be printable characters, a hash function can take in raw bytes of any kind, regardless what those bytes represent (decimal/floating point numbers, characters, images, etc...).

### Do nothing!

If our input data already fits directly into the hash, we don't have to (and shouldn't) perform any calculations. We won't implement this case here, but it can be an important optimization for specific use cases, like integer ID's or indices.

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

While very simple and fast and succeeding in using all the input data to make the fixed-size output, adding an 8-bit number only ever has a high chance of changing the lowest 8 bits of the 32. In addition, if the order of input bytes is changed, the output stays the same. "bat" and "tab" will have the same hash. This is an awful hash function.

```
./hash add dot
0x147
./hash add tod
0x147
```

Which of the following inputs will hash to the same value as "mat"?

1. "tam"
2. "tbm"
3. "tbn"
4. "tzn"
5. "tbl"
6. "tcl"
7. "amt"

**12.1 Use p4r-clicker to submit your answer**

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

While this is still very fast, it also still has the problem that it is invariant to input order.

```
./hash table_a dot
0xac569518
./hash table_a tod
0xac569518
```

Which of the following inputs will hash to the same value as "mat"?

1. "tam"
2. "tbm"
3. "tbn"
4. "tzn"
5. "tbl"
6. "tcl"
7. "amt"

**12.2 Use p4r-clicker to submit your answer**

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

What is the algorithmic complexity (Big O notation) of the three preceding hash functions? **12.3 Use p4r-clicker to submit your answer**

### DJB2a

Now we can move onto several real hash functions, and see parallels with the basic elements we have already introduced.

The [DJB2a](http://www.cse.yorku.ca/~oz/hash.html) hash is also very simple and fast. It starts with a fixed value of 5381 instead of 0 and it involves multiplication by 33 and exclusive or (XOR) to incorporate new bytes. It uses a 5-bit left shift and an add to get the multiplication by 33.

```
hash = ((hash << 5) + hash) ^ *data;
```

```
./hash djb2a dot
0xb871f3a
```

### FNV1a

The [FNV1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) hash is very similar, again because it is trying to be very fast to compute. Like DJB2a, it also has a non-zero starting value, which it calls an offset. In each step, the running hash is XOR'ed with the new byte and then the whole result is multiplied by a special constant prime number. Write the code for FNV1a using the Wikipedia page linked and the constants for the 32-bit version.

```
./hash fnv1a dot
0xd3689f20
```

### Fxhash

The [Fxhash](https://github.com/cbreeden/fxhash) is used for some _internal_ operations by the Firefox web browser. Fxhash aims to be faster than other hash functions by processing 4 or 8 bytes at a time. In each step, it starts by rotating the running hash by 5 bits. A rotation is like a shift, except the highest bit wraps around to the bottom. After the rotation, the new value is XOR'ed in, and finally the whole quantity is multiplied by a special constant.

Because the data are incorporated in chunks of 4 or 8 bytes, if there are fewer than that many bytes left, the remaining bytes are incorporated in only one byte at a time. You should use `memcpy` to copy bytes from the data into your 4 or 8 byte number, like so:

```
uint32_t number;
memcpy(&number, data, sizeof(number));
```

The multiplication constant to use depends on whether you are using the 32 or 64-bit version of fxhash:

```
// will be optimized by the compiler to the appropriate single
// rotate left processor instruction
// only technically valid for counts in [0, 31]
uint32_t rotate_left(uint32_t value, uint32_t count) {
    return value << count | value >> (32 - count);
}

uint32_t fxhash32_step(uint32_t hash, uint32_t value) {
    const uint32_t key = 0x27220a95;
    // const uint64_t key = 0x517cc1b727220a95;
    return (rotate_left(hash, 5) ^ value) * key;
}

uint32_t fxhash32(uint8_t *data, int n) {
    uint32_t hash = 0;
    for each block of 4/8 bytes in data {
        uint32_t number;
        memcpy(&number, pointer to those letters in data, sizeof(number));
        hash = fxhash32_step(hash, number);
    }

    for each remaining letter in data {
        hash = fxhash32_step(hash, that letter);
    }

    return hash;
}
```

Write only the 32-bit version of fxhash.

```
./hash fxhash32 dot
0xe9343db1
./hash fxhash32 dotted
0x9ec4824a
```

> None of the hash functions we have talked about so far are intended for web or internet-accessible applications because a malicious user could design a series of inputs that always collide in the hash table. This is called a hash table denial of service attack, because it could make a web server very slow if all the elements in a hash table are in collision with each other.

## In-class problem 2: hashcomp

Now we want to compare these hash functions to see how they will perform in our hash table. How fast are they and do we get many collisions?

### Hash range reduction/mapping to our table

Since our hash table will be much smaller than 2^32 or 2^64 elements in size, we first have to map the hashes down to the "current" size of our table. We will arbitrarily decide on a table with 8192 entries, so our reduced hashes will all have 13 bits.

#### Integer modulo base 2

The easiest choice to map the full 32/64-bit hash to 13-bits is to compute `hash % 8192`. This is equivalent to throwing away all the bits of our hash besides the bottom 13. This means we can implement this as a bit operation instead of a division. We can just write `hash & ((1 << 13) - 1)`. To understand why we can do this:

```
1 << 13 = 0b10000000000000 (1-bit followed by 13 0-bits)
(1 << 13) - 1 = 0b1111111111111 (13 1-bits)
hash & ((1 << 13) - 1) = the bit-wise 'and' operation sets all the higher bits to 0
```

More realistically, we ensure our table size is always a power of two, and then we can write:

```
hash & (table_size - 1)
```

#### Integer modulo a prime

Earlier in this document we mentioned that when our input data already fits in our hash, we can avoid doing any calculations at all. A problem with integer module base 2 is that it throws away the high bits. If the numbers we are hashing only have changes in those high bits, then they will all collide with each other. We can avoid this problem by performing the modulo operation with a prime number. The problem is that the modulo operation is essentially the same as division, and that is one of the slowest arithmetic operations for a computer to perform.

The prime 8191 is very close to 8192, so lets use it for this case: `hash % 8191`.

#### Fibonacci "hashing"

The name of this method is a slight misnomer, as this isn't really a hash function. The idea of Fibonacci hashing is to use the [golden ratio](https://en.wikipedia.org/wiki/Golden_ratio) phi (`(1 + sqrt(5))/2`, or approximately 1.618) to evenly disperse consecutive input values among the possible output values. For a 32-bit input, we multiply our input hash by (2^32 / phi), rounded to an odd integer, and then we select the n-highest bits to get our output. We can do this selection of high bits with a right bit-shift. For a 64-bit input, we would use (2^64 / phi) rounded to odd. These numbers turn out to be:

```
const uint64_t factor64 = 2^64 / phi ~= 11400714819323198485;
const uint32_t factor32 = 2^32 / phi ~= 2654435769;
```

```
(uint32_t)(hash * factor32) >> (32 - bits of output needed)
```

This method combines the benefits of the prior two: it is fast and makes use of all the input bits in determining the output. Notice that we have to perform a cast after the multiplication, because we want the result as a 32-bit number and not as a 64-bit number, which C tries to give us.

See this blog post for more information about the significance of Fibonacci hashing: [https://probablydance.com/2018/06/16/fibonacci-hashing-the-optimization-that-the-world-forgot-or-a-better-alternative-to-integer-modulo/](https://probablydance.com/2018/06/16/fibonacci-hashing-the-optimization-that-the-world-forgot-or-a-better-alternative-to-integer-modulo/)

### The analysis

> We have provided some starter code to help with setting this section up. Please use it! In order to evaluate all the combinations of hash and reduction functions, we are using _function pointers_, and because they can be tricky, we are providing that section of code for you.

First build up an array of testing data, 4096 entries long. For each entry, this testing data should contain the number of bytes in the entry and the data itself. The first 1000 entries will be the numbers 0 to 999 inclusive, represented with 2 bytes each. The remaining entries will be taken from the first lines of `book.txt`, one entry per line, including the newline character at the end, but _not_ including the null character (after all, the null character is not present in the `book.txt` file). This is so you can just use `fgets` to read the lines directly! Note that each entry holds a pointer to the entry data, but that data needs to live somewhere! Make sure you have a clear understanding of where the specific data for each of those 4096 entries will actually live over the length of the program.

For each hash function and for each hash reduction method, compute the final 13-bit table index for each of entry of testing data. Use a table of size 8192, one entry per possible hash value, to count the number of collisions you get by counting the number of times each hash value comes up. Also determine the average time to perform a single hash and reduce in each configuration. In order to do this accurately, spend 0.5 seconds on each configuration, performing as many loops through the 4096 entries of testing data as necessary.

Since there are 8192 buckets (`n`) and 4096 insertions (`m`) into the table, the expected number of collisions follows the formula:

```
m * (1 - (1 - 1 / n) ^ (n - 1)) ~=  873
```

See [https://math.stackexchange.com/questions/35791/birthday-problem-expected-number-of-collisions](https://math.stackexchange.com/questions/35791/birthday-problem-expected-number-of-collisions)

Your final output should follow this format, with the 6 hash functions evaluated in order. Each group of three represents the three different reducing functions, also in order:

```
100.00ns per iteration, with 873 collisions
100.00ns per iteration, with 873 collisions
100.00ns per iteration, with 873 collisions

100.00ns per iteration, with 873 collisions
100.00ns per iteration, with 873 collisions
100.00ns per iteration, with 873 collisions

... etc ...
```

Make sure to use `-O3` optimization and to disable _all_ the sanitizer (including the signed-integer-overflow one) options in order to get accurate timings! In addition, be careful that you don't include the zero-initialization of the collision-counting array in the timing loop, because for an array of 8192 4-byte quantities, setting that 32KB of data to zero will take a significant period of time.

### Additional Information

A separate analysis of a collection of hash functions and their collision properties can be had in this StackExchange post: [https://softwareengineering.stackexchange.com/questions/49550/which-hashing-algorithm-is-best-for-uniqueness-and-speed/](https://softwareengineering.stackexchange.com/questions/49550/which-hashing-algorithm-is-best-for-uniqueness-and-speed/)
