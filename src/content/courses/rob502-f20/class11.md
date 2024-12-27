---
title: "ROB 502: Programming for Robotics: Class 11"
date: "2020-07-07"
---

## Results of midterm feedback

### Change to showing-code policy for groups

We will be enacting the proposed change about when showing code is allowed for debugging! This change means it is okay to show code for debugging even if not everyone in the group has gotten to 100% on that specific section. The goal is for classmates to point out errors in your logic/understanding, to debug the code with you, but not to tell you what specific code to write. If you are even further behind on a section yourself, please don't copy from someone else showing their code.

### Let me know if you want to be in a different group

The majority of the class does not want to change the groups up based on survey feedback. Instead, if you want me to move you to a different group, please send me an email!

## Complexity

Today we are going to explore _complexity_, the study of how long it takes a program to run (_time complexity_), and how much memory it needs (_space complexity_).

### How many operations?

We are going to try to analyze several mathematical calculations. In the following, please consider each addition, subtraction, multiplication, division, or comparison as one operation each, and ignore everything else.

```
int foo(int a, int b) {
    return a + b;
}
```

This uses only a single operation.

```
int foo(int a, int b) {
    for (int i = 0; i < b; i++) {
        a++;
    }
    return a;
}
```

Now this function does the same thing, but in a different way. How many operations does it take if `a = 10` and `b = 20`? **11.1 Use p4r-clicker to submit your answer**

How about this one? And this time, assume that `a` and `b` can vary, so give your answer in terms of those numbers.

```
int foo(int a, int b) {
    int c = 0;
    for (int i = 0; i < a; i++) {
        c++;
    }
    for (int i = 0; i < b; i++) {
        c++;
    }
    return c;
}
```

**11.2 Use p4r-clicker to submit your answer**

Now these are all pretty trivial examples because they are just different ways of adding two numbers, but the principle holds that there are always multiple algorithms for any desirable operation.

Let's consider searching for an element in a list. Suppose we have an array of `N` arbitrary integers, and we are looking for the number 42. How many operations will it take to find the number or conclude it isn't in the array? In the best case, the first number you check 42 and you are done, but in the worst case you have to check every number to discover 42 isn't there. What would be reasonable to say is the number of operations in the _average_ case? **11.3 Use p4r-clicker to submit your answer**

Now let's suppose that our array of `N` integers has been sorted in ascending order. Now we can use a binary search to look for our number! Now what is the _worst_ case number of operations? You may want to look at your binary search code to get the numbers right, but the rough number is fine. **11.4 Use p4r-clicker to submit your answer**

## Big-O Notation

It was likely that you found trying to get the exact number of operations in each of these cases to be a little tedious. In many cases, we are interested in how a program or algorithm behaves as its inputs become large; properly bookkeeping an extra 2 operations is not worthwhile. It turns out that the vast majority of useful information about an algorithm can be expressed by only looking at the fastest growing terms in the number of operations, and ignoring coefficients. We only keep multiple terms when they both grow at the same speed. If the largest term is a constant, then we write it as "1". We do not indicate the base of logarithmic functions. To indicate that we have thrown away all these details, we "hide" them in a function called _O_, the capital letter O.

For example:

```
100         -> O(1)
2A+1        -> O(A)
2A+3B       -> O(A+B)
3N^2+log(N) -> O(N^2)
```

Now, using Big-O notation, what is the time complexity of our binary search through N elements for 42? **11.5 Use p4r-clicker to submit your answer**

You may find this one-page discussion of complexity useful: [https://cs50.harvard.edu/ap/2020/assets/pdfs/computational\_complexity.pdf](https://cs50.harvard.edu/ap/2020/assets/pdfs/computational_complexity.pdf)

## Choosing a data structure

When a program needs to run efficiently, it is important to consider how the data are going to be stored. The data structures you use will determine both how complicated your program is to write and also what algorithms are available to you.

In choosing the data structures, you need to consider what operations on your data will be most common:

- How many elements will your data structure have to contain?
- Will you continually add new values?
- Does you data structure stay constant after it is created?
- Does the order of your data matter? Does order even have a meaning to it?
- How often do data get removed/deleted?
- Do you continuously perform any special operations on your data? Like taking the minimum/maximum, perform k-nearest neighbors, etc?
- When you access the data, do you access all the values, or just certain ones?

Depending on these questions, you may come to very different conclusions:

### Static array

If I have a constant number of elements that I will process in order, I use a static array.

```
int rand_nums[10] = {0};
for (int i = 0; i < 10; i++) {
    rand_nums[i] = rand() % 100;
}
```

### Dynamic array

If I have few elements (say less than 100 total over time) a [_dynamic array/vector_](https://en.wikipedia.org/wiki/Dynamic_array) is often the most efficient choice, because the constant factors hidden by Big-O notation will likely dominate cost. Vectors are ideal when the most common operation is performing some function on every element.

- Appending and removing elements from the end of the array are both O(1) time.
- If I need to maintain specific element order, inserting and deleting elements from arbitrary locations each take O(n) time.
- If I do not care about element order, adding and deleting elements each take O(1) time. We can perform an arbitrary delete by swapping an element with the last element, and then deleting the last element.
- Regardless, finding an element takes O(n) time.

```
vector_int_t *vec = vector_int_create();
for (int i = 0; i < 10; i++) {
    vector_int_append(vec, i);
}

vector_int_remove(5); // O(n) operation
vector_int_swap_remove(5); // O(1) operation

for (int i = 0; i < vec->size; i++) {
    printf("%d, ", vec->data[i]);
}
printf("\n");

vector_int_destroy(vec);
```

Prints out: `0, 1, 2, 3, 4, 9, 7, 8,`

### Stacks, queues, and double-ended queues

If I have continuous data to process in the order it arrives, e.g. network traffic, a [_queue_](https://en.wikipedia.org/wiki/Queue_\(abstract_data_type\)) such as a [_circular buffer_](https://en.wikipedia.org/wiki/Circular_buffer) can push elements to the back and pop them from the front in O(1) time.

If I might receive a lot of values at the same time, but need to process the most recent one first, then I should use a [_stack_](https://en.wikipedia.org/wiki/Stack_\(abstract_data_type\)), which also pushes and pops in O(1) time, but will only allow popping and pushing from the same end, like a stack of plates.

A [_deque_](https://en.wikipedia.org/wiki/Double-ended_queue) (pronounced deck, short for double-ended queue) can push and pop from both front and back in O(1) time, so it essentially combines the functionality of the queue and stack.

```
# Here is an example in Python3
from collections import deque

q = deque()
for i in range(4):
    q.appendleft(i) # append element at the front
    q.append(4 - i) # append element at the back

while len(q) > 0:
    val = q.popleft() # remove from the front
    print(val)
```

Prints out:

```
3
2
1
0
4
3
2
1
```

See this video for additional details: [https://www.youtube.com/watch?v=idrrIMXXeHM](https://www.youtube.com/watch?v=idrrIMXXeHM)

### Hash table

If I want to determine which words are most frequent in a corpus of text, or look up data through some kind of "key", a [_hash table_](https://en.wikipedia.org/wiki/Hash_table) can lookup entries/words by name or any other key in O(1) time. Even when performance does not matter, hash tables can be very convenient when you want to associate one form of data to another. They can also be called _hash maps_, _associative arrays_, or _dictionaries_.

```
# Here is an example in Python3
table = dict() # empty hash table
table["a"] = 10
table["b"] = 20
table["c"] = 30
# different types for keys can be okay! (at least in languages like python and javascript)
table[1.1] = "Hello 1.1!"
table[1.2] = "Hello 1.2!"
table[0] = "Hello 0!"
table[1000] = "Hello 1000!"
table[10000] = "Hello 10000!"

for key in table:
    value = table[key]
    print(str(key) + ": " + str(value))
```

As of Python3.7+ (and the often also Python3.6), extra work is done to maintain the insertion order. They might be doing this by storing an extra list of the keys in the order they were inserted:

```
a: 10
b: 20
c: 30
1.1: Hello 1.1!
1.2: Hello 1.2!
0: Hello 0!
1000: Hello 1000!
10000: Hello 10000!
```

However, in any earlier version of Python, we get the arbitrary order we expected: (here w/ Python3.5):

```
0: Hello 0!
1.2: Hello 1.2!
c: 30
10000: Hello 10000!
1.1: Hello 1.1!
1000: Hello 1000!
a: 10
b: 20
```

We will be going into a lot more depth about hash tables in the next class and homework. They are the most useful "complicated" data structure you should ever need to use!

### Set

If I want to keep track of which unique features I have found in an image or document, or keep track of a set of arbitrary elements, a _set_, often implemented as a _hash set_ (a hash table that doesn't store values) can insert elements to that set, check if an element is contained in the set, and remove items from the set in O(1) time.

```
# Here is an example in Python3
ids = set([100, 1, 2, 3, 4])
for i in range(5):
    ids.add(i)

for id in ids:
    print(id)
```

The low numbers manage to end up (arbitrarily) in ascending order, but 100 clearly isn't!

```
0
1
2
3
100
4
```

### B-tree

If I need to keep elements in sorted order so that I can iterate through sorted ranges of values or find a desired element by value/key quickly, a [_B-tree_](https://en.wikipedia.org/wiki/B-tree) can insert, delete, and find elements in O(log n) time. B-trees are famously used in file systems and databases.

The B-tree and hash tables are alternatives because they can both quickly insert, delete, and find by key values. In general hash tables are faster, but don't support fast iteration. In addition, hash tables can not maintain any order, so iteration is non-deterministic. A B-tree is necessary to quickly iterate through a range of values. Although I think they are super cool, B-trees are not a default data structure in most programming languages.

See this video for additional details: [https://www.youtube.com/watch?v=C\_q5ccN84C8](https://www.youtube.com/watch?v=C_q5ccN84C8)

### Priority queue

If I want to implement the A\* search algorithm, I need to process and remove the smallest element at each step. A [_priority queue_](https://en.wikipedia.org/wiki/Priority_queue) implemented with a [_binary heap_](https://en.wikipedia.org/wiki/Binary_heap) maintains elements in a quasi-sorted order, giving us the minimum _or_ the maximum element (but no others) in O(1) time, and allowing us to both remove that minimum/maximum element as well as add an entirely new element, in O(log n) time.

This example is roughly based on what you would write to implement A\* in Python:

```
# In python3, these heap functions allow us to work with a binary min heap
from heapq import heappush, heappop

nodes_to_expand = [] # Python uses a normal list (dynamic array) to store the binary heap

heappush(nodes_to_expand, (10.0, nodes[0])) # 10.0 is the cost/priority of the node
heappush(nodes_to_expand, (5.0, nodes[1]))
heappush(nodes_to_expand, (cost_of_node(nodes[2]), nodes[2])) # Maybe we write a function to calculate the cost/priority

# Process all the nodes in order of priority!
while len(nodes_to_expand) > 0:
    item = heappop(nodes_to_expand)
    priority = item[0]
    node = item[1]
    print(f"Processing node {node} with priority {priority}")
    # The processing we do might result in more nodes getting added to nodes_to_expand
    # And they might have lower priorities than what is still waiting on the heap at this point
    process_node(node)
```

One possible output from this might be:

```
Processing node node2 with priority 2.0
Processing node node3 with priority 1.0
Processing node node1 with priority 5.0
Processing node node0 with priority 10.0
```

See this video for additional details: [https://www.youtube.com/watch?v=wptevk0bshY](https://www.youtube.com/watch?v=wptevk0bshY)

### Linked list (don't use them!)

- Although they are a fun exercise for learning about pointers, [_linked lists_](https://en.wikipedia.org/wiki/Linked_list) are only very rarely a good choice of data structure. They suffer from memory fragmentation, high memory overhead, frequent memory allocations, and a lack of random access. Some of their true uses include concurrent lock-free data structures and kernel programming. Those are very niche and advanced use-cases!

### Special-purpose data structures

There are many other data structures that have interesting properties for very specific applications, such as the ternary search tree we implemented for encoding a spell check dictionary. One of the data structures above (except for linked lists), will be an excellent fit for something like 99% of use cases.

As an example, computing [k-nearest neighbors](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) in high dimensions is a common task for path planning algorithms such as the [rapidly exploring random tree](https://en.wikipedia.org/wiki/Rapidly-exploring_random_tree) (RRT). The [_k-d tree_](https://en.wikipedia.org/wiki/K-d_tree) is a specialized data structure for computing k-nearest neighbors efficiently with up to about 20 dimensions.

### Choose the simplest structure

Whenever you have a data structure that must handle relatively large numbers of elements, choose the simplest data structure that makes your most common operations take constant O(1) time. In general, the more complex the data structure or algorithm, the more overhead involved.

### "Quiz": Choosing a data structure

Choices:

1. Static array
2. Dynamic array
3. Queue
4. Hash Map
5. B-tree
6. Priority queue
7. Linked list

Suppose that your robot has a lidar sensor it is using to _localize_, or find its location. The lidar provides a full scan at 20hz. Each scan contains 16 scan lines coming from the sensor at different vertical angles. Each scan line itself is composed of 900 ranges. Processing lidar data is relatively slow and may occur either faster or slower than 20hz depending on the scan and the accuracy of the robot's prior on its location. Which data structure(s) do you use to hold this information? **11.6 Use p4r-clicker to submit your answer**

Now suppose your robot is trying to determine if its lidar is broken. It is looking to see if there is consistency between the location estimates from its lidar and with its other sensors (odometry and visual landmarks). It does this by constructing a _factor graph_ with nodes at locations of the robot (e.g. after the robot moves another meter, it creates a new node) and x-y-theta transformations on the edges between those nodes. These transformations come from the various sensors. Any cycle in this graph should have a total x-y-theta transformation of unity (no difference), and this will indicate that the sensors agree with each other.

In summary, there are nodes and there are edges. What data structure(s) can we use to efficiently look for cycles? **11.7 Use p4r-clicker to submit your answer**
