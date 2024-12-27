---
title: "ROB 502: Programming for Robotics: Class 23"
date: "2020-07-07"
---

## Python: a high-level programming language

The Python programming language (named after Monty Python’s Flying Circus) was designed to help programmers write readable code.

In this document we will explore several several key differences between C and Python to help you apply your C skills to Python too. Finally, we will work on a simple Python math program.

### Python 2 vs. Python 3

In this document we will talk about Python 3 which has some small but significant differences from the older Python 2. Python 2 is being deprecated in January of 2020 and should not be used for new projects. Even so, you will likely have to use Python 2 for some projects. It is very important that people default to using Python 3, however, and so we will only talk about Python 3 in this document! The most important differences involve `print` and division. See more details here: [https://sebastianraschka.com/Articles/2014\_python\_2\_3\_key\_diff.html](https://sebastianraschka.com/Articles/2014_python_2_3_key_diff.html)

### Python on the command line

Python is an interpreted language. This means that you can directly run your program without first compiling it. It also means that it supports an _interactive interpreter_ that you can use to experiment with Python directly from the command line. I often use Python as a command line calculator. Try these out in your own terminal!

```
~/rob502/class20$ python3
Python 3.6.9 (default, Nov  7 2019, 10:44:02)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 2+3
5
>>> 10/3
3.3333333333333335
>>> 10//3
3
>> 10.5//3
3
>>> import math
>>> math.sin(0.5)
0.479425538604203
>>> math.pi
3.141592653589793
>>> 2 ** 8
256
>>> "good" if 10 < 20 else "bad"
'good'
```

Some important things to notice in this example:

- Division always returns a floating point number
- The double slash `//` gives C-style floored division, even for floating point numbers
- Many math functions are available in the `math` library, which we have to `import`. After this they can be accessed with the dot operator.
- There is a special power operator `**`
- The ternary operator is quite different from C: “A if condition else B”

### The scripts just run!

Now let’s actually make a python script!

Put the following in a file `test.py`:

```
print("Hello world!")
```

And then run the script with:

```
python3 test.py
```

You can also run the file directly by adding a shebang `#!` line. This is just like what we did when we learned how to write bash scripts!

Change the file to:

```
#!/usr/bin/python3
print("Hello world!")
```

Then mark the file executable and run it:

```
chmod +x ./test.py
./test.py
```

Of course, the `.py` extension is just a convention, and it will work just as well without that extension! Guess what, the `lcm-spy` tool we have used before is actually a Python script that does some setup before starting the actual Java program.

### Indentation and for loops

In Python, blocks of code are started with a colon ‘:’ and are then indicated by increased indentation.

```
for i in range(10):
    print(i)

for c in "Hello world":
    pass # 'pass' is a do nothing command needed when you have no other code in a block
```

Python for loops are based on the structure `for item in iterable`. The “iterable” thing can be a list, a string, a range, or any object that has the special functions `__iter__` and `__next__`. This makes the Python for loop both very flexible and very easy to read! (Whenever you see a function with these double underscores, it means the function has a special meaning to Python.)

### Logical/boolean keywords

The C logical operators `&&`, `||`, `!` do not exist in Python. Instead we use the words `and`, `or`, and `not`.

```
smoothie = "apples bananas oranges"
if "apples" not in smoothie and "bananas" in smoothie:
    print("Great! I don't like apples in my banana smoothies!")
else:
    print("Oh no! An apple-banana smoothie...")
```

### Functions and classes

Although C does not support classes, we have still been trying to use the concepts of abstraction and encapsulation that classes often provide. For example if we were writing our HashTable in python…

```
class HashTableEntry:
    # The special __init__ function is used to create an object of the class.
    # The special first parameter for all class methods is 'self'
    # referring to the object itself
    def __init__(self, key, value):
        self.key = key
        self.value = value

class HashTable:
    # parameters in python can have default values!
    def __init__(self, table_size=128):
        self.table_size = table_size
        self.table = [None] * self.table_size # The table is now has 128 None values!
        self.n_entries = 0

    # starting with an underscore is a _convention_ that a method is meant to be private
    # however, this is _not enforced_ by Python itself
    def _grow_rehash(self):
        ...

    def set(self, key, value):
        if self.n_entries >= self.table_size / 2:
            self._grow_rehash()
        ...
        while True:
            if self.table[hash] is None:
                self.table[hash] = HashTableEntry(key, value)
                break
            ...
        ...


ht = HashTable()
ht.set("foo", 10)
ht.set("bar", "another value")
```

Whenever we had a `state_t` structure and variable in our C code, we would use a class in Python that has all of those data variables in it and that defines all the core functions that need to use it.

### Strings and string formatting

```
value = "a string can be in double quotes"
value = 'or in single quotes'
name = "Acshi"
uniqid = "acshikh"
points = 10
total_points = 11
print(f"Student {name} ({uniqid}) has score {points/total_points:.1f}")
```

One of the coolest features in python is the “f-string” which allows you to put arbitrary python expressions in your string as needed. This makes string formatting simple and easy to read. If you need to format a number, you put a colon after the value and then specify the format similar to how we would in C.

We can also do addition with strings, as an easy way to form new strings.

```
input = "some sentence"

output = ""
for c in input:
    output += c.upper()

# We could also use a list comprehension
# using the join() function to combine strings/characters in a list into one string
output = "".join([c.upper() for c in input])

# Or realize that the upper function already works on full strings
output = input.upper()
```

### Reading a file

Python has excellent support for easily reading files. The “with open” idiom means that the file will be automatically closed at the end of the with block. Files can also be used in for loops to read them line by line:

```
with open("file.txt", "r") as f:
    i = 0
    for line in f:
        print(f"line {i}: '{line}'")
        i += 1
```

### Python data structures

Of course, there is no need to implement a new hash table in Python, because it already has many wonderful data structures available!

Lists:

```
>>> numbers = []
>>> numbers = list() # same thing
>>> numbers.append(1)
>>> numbers.append(2)
>>> numbers += [3] # very similar, but less efficient
>>> numbers += [4]
>>> numbers
[1, 2, 3, 4]
>>> numbers = [1, 2, 3, 4]
>>> len(numbers)
4
```

Dictionaries/hash tables:

```
>>> counts = {}
>>> counts = dict() # same thing
>>> counts['it is'] = 13
>>> counts['is great'] = 20
>>> for key in counts:
...     print(key, counts[key])
...
it is 13
is great 20
>>> counts = {'it is': 13, 'is great': 20}
>>> len(counts)
2
```

Tuples (several values combined together!):

```
def favorite_numbers():
    return (13, 42) # the parentheses are optional

a, b = favorite_numbers()
print(a, b)
```

Technically, the only real difference between a list and a tuple is that a tuple is immutable, meaning that after it has been created, it can not change.

### List comprehensions

One of the coolest features in python is the _list comprehension_, which allows us transform lists of data in complicated ways with only a single line of code.

```
import random
# 10 random integers from 1 to 100
data = [random.randint(1, 100) for i in range(10)]
# now normalize them
mean = sum(data) / len(data)
sigma = math.sqrt(sum([(d - mean) ** 2 for d in data]) / len(data))
# and only keep the normalized value below the mean!
data = [(d - mean) / sigma for d in data if d < mean]
```

The general format for a list comprehension is \[_expression_ for _variable_ in _list_ if _condition_\], where the `if condition` part is optional.

### Matrix and array math in Python

Python has excellent support for matrix math through the `numpy` (numerical python) library.

Installing libraries in python is very easy with the `pip` tool. It also has excellent support for single-user installations, so you don’t need sudo access to install libraries. Install `numpy` for your user:

```
pip3 install numpy --user
```

NumPy has lots of functionality that make the above normalization example a lot easier:

```
# Of course numpy gives some functions that would make this easier...
import numpy as np
data = np.random.randint(1, 101, 10) # high is exclusive, unlike random.randint
mean = np.mean(data)
sigma = np.std(data)
# numpy lets us apply math operators to the whole list at a time
# and it lets us index with a "mask" of True/False values
data = ((data - mean) / sigma)[data < mean]
```

And here is an example of some matrices, using the matrix multiplication operator `@`:

```
>>> import numpy as np
>>> a = np.double([[1, 2, 3], [4, 5, 6]])
>>> a
array([[1., 2., 3.],
       [4., 5., 6.]])
>>> a.shape
(2, 3)
>>> a.T
array([[1., 4.],
       [2., 5.],
       [3., 6.]])
>>> a.T @ a
array([[17., 22., 27.],
       [22., 29., 36.],
       [27., 36., 45.]])
>>> (a.T @ a).shape
(3, 3)
```

### Making figures with matplotlib

Matplotlib (Matrix Plotting Library) is a library for creating figures that works very similar to the plotting features provided by Matlab.

```
pip3 install matplotlib --user
```

To plot some random numbers:

```
import numpy as np
import matplotlib.pyplot as plt

data = np.random.randint(1, 100, 1000)
plt.plot(data)
plt.title("Noise")
plt.xlabel("t (s)")
plt.ylabel("Voltage (V)")
plt.show()
# Instead of show, I could use savefig to make a pdf figure for an academic paper.
# I would have to comment out show() for this to work
plt.tight_layout()
plt.savefig("figure.pdf", bbox_inches = "tight", pad_inches = 0)
```

### What is this \_\_main\_\_ thing I see sometimes?

In code examples you might often see the following:

```
if __name__ == "__main__":
    do_stuff()
```

The special variable `__name__` is the name of the current _module_. For example “numpy” is the name of the numpy module, as specified by the line “import numpy”. However, if the code is not in a module, because it is being directly executed as a script, then `__name__` has the special value of `__main__`.

This means that we can check if our file is being executed as a script, instead of included with an `import` by checking if `__name__ == "__main__"`.

This would be useful if you are writing a library and you want to test your library by running it directly with `python3 ./library.py`. Then you can just use this check to perform your tests without having to worry about your tests happening every time someone does `import library`.

## In-class assignment 1: pygrams.py

The assignment is simply to repeat the homework 4 bigrams assignment, but using Python and the built-in python dictionary instead of our own hashtable!

Although we covered a lot of concepts in this document, you do not need to use them all for this assignment. In particular, you do not need to use any special libraries like numpy or matplotlib, and you do not need to declare any new classes (especially not a hash table class)!

Python does not give us a way to know the number of collisions in the hash table, but to get an idea of how its hash table performs, we can use the `sys.getsizeof` function (use `import sys` to get it) which will give the total size in bytes of the dictionary and all its contents! When this value changes, we will know that a resize has happened! For each resize, report the total byte size of the hash table as well as the length of the hash table.

```
./pygrams.py
Hashtable started with ## bytes at length 0
Hashtable grew to 368 bytes at length ##
Hashtable grew to 648 bytes at length 11
Hashtable grew to ## bytes at length 22
...
Bigram 'in the' has count of 367
Bigram 'of the' has count of 462
...
Total of ### different bigrams recorded
```

Notice that we run your program as `./pygrams.py`. Make sure to mark your program as executable so this works!

### Some useful functions to look up

[`str.join()`](https://docs.python.org/3/library/stdtypes.html#str.join) [`str.isalpha()`](https://docs.python.org/3/library/stdtypes.html#str.isalpha) [`str.split()`](https://docs.python.org/3/library/stdtypes.html#str.split)

Also refer back to the “string” section of this document.

As a note, my solution uses these three functions along with list comprehensions to make a full solution in 37 lines, including several blank lines.
