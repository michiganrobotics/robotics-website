---
title: "ROB 502: Programming for Robotics: Class 11 Discussion"
date: "2020-10-29"
---

```
int foo(int a, int b) {
    for (int i = 0; i < b; i++) {
        a++;
    }
    return a;
}
```

Now this function does the same thing, but in a different way. How many operations does it take if `a = 10` and `b = 20`? **11.1 Use p4r-clicker to submit your answer**

> Each time through the loop, we have to check i < b, perform a++, and then i++. The very last time through the loop, we check i < b and it is false, and we exit the loop. This results in 20 \* 3 + 1 = **61** operations.

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

> Very similar to before, except now we get A \* 3 + 1 for the first loop, and B \* 3 + 1 for the second loop, for a total of **3a + 3b + 2** operations

Let's consider searching for an element in a list. Suppose we have an array of `N` arbitrary integers, and we are looking for the number 42. How many operations will it take to find the number or conclude it isn't in the array? In the best case, the first number you check 42 and you are done, but in the worst case you have to check every number to discover 42 isn't there. What would be reasonable to say is the number of operations in the _average_ case? **11.3 Use p4r-clicker to submit your answer**

> In the best case scenario, we enter into a loop, check the index (i < N) and then check the number (array\[i\] == 42), for a total of 2 operations. In the worst case scenario, we complete the full 3N + 1 operations like before. In the average we have to check half the elements, which here is like averaging the best and worst case scenarios, for (2 + 3N + 1) / 2 = **1.5N + 1.5** operations.

Now let's suppose that our array of `N` integers has been sorted in ascending order. Now we can use a binary search to look for our number! Now what is the _worst_ case number of operations? You may want to look at your binary search code to get the numbers right, but the rough number is fine. **11.4 Use p4r-clicker to submit your answer**

> Each iteration of the binary search we manage to divide the total space in half. This means we will need at worst a log2(N) iterations to find our number. In each iteration, my code for binary search checks a while loop condition (low\_i < high\_i) for 1 operation, calculates the next index to check ()(low\_i + high\_i) / 2) for 2 more operations, checks the value (vals\[mid\_i\] >= search\_num) for 1 more operation, and in the worst case has to also check (vals\[mid\_i\] < search\_num) for another operation, and finally set low\_i = mid\_i + 1, for 1 last operation. This makes a total of 6 operations per iteration. Finally, after exiting the loop, I have 2 more operations to check if we actually found anything. This makes for a total of **6 \* log2(N) + 2** operations, although your own code could have a different result. As a binary search, though, the **log2(N)** part is important. Finally, I want to note that in the linear array search we have a leading constant of 3 operations for each iteration, but for this more complex binary search we have 6 operations per iteration. This is a common general trend, where more complex algorithms can run faster when N is large, but may actually run slower for smaller N.

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

> The binary search for my code takes a worst case 6 \* log2(N) + 2 operations. Dropping all the constants, including the implicit constant in the logarithm being base-2, we get **log(N)** as the complexity.

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

> Each scan from the lidar has 16 scan lines of 900 ranges. This is a constant size and so is best expressed with static arrays. If we can't keep up with the speed at which the scans come in, we need to store them and process them as best we can. Because we want to localize, we need to process them in order of first-in first-out, which we can do with a queue. So we choose options **1,3**.

Now suppose your robot is trying to determine if its lidar is broken. It is looking to see if there is consistency between the location estimates from its lidar and with its other sensors (odometry and visual landmarks). It does this by constructing a _factor graph_ with nodes at locations of the robot (e.g. after the robot moves another meter, it creates a new node) and x-y-theta transformations on the edges between those nodes. These transformations come from the various sensors. Any cycle in this graph should have a total x-y-theta transformation of unity (no difference), and this will indicate that the sensors agree with each other.

In summary, there are nodes and there are edges. What data structure(s) can we use to efficiently look for cycles? **11.7 Use p4r-clicker to submit your answer**

> If I want to traverse a graph structure where the nodes and edges are continually being created and destroyed, I want to have an efficient way to associate the edges with my nodes. This is most easily done with either a hash table or a b-tree (either would work just fine!). I can have some relatively unknown number of edges for each node, and so I would store those with a dynamic array. So I would make a hash table associating the nodes with a dynamic array of edges, for choices **4 (or 5) and 2**
