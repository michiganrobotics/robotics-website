---
title: "ROB 502: Programming for Robotics: Class 6"
date: "2020-07-07"
---

### Clicker Questions

Use p4r-clicker to submit your answer

```
1. (0b11101101 << 1) & 0x70 == 0b?
2. 0x31 ^ 0x52 == 0x?
3. char msg[] = "taco cat"; msg[3] = '\0'; printf("%s", msg);
4. printf("%ld, %ld", sizeof("hello!"), strlen("hello!"));
5. int vals[] = {5, 15, 25, 35}; printf("%ld", &vals[2] - &vals[0]);
6. int vals[] = {5, 15, 25, 35}; printf("%ld", sizeof(vals));
```

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

Do any of the following sections have a memory error/undefined behavior? Either answer “N” for no, or which line (1 to 4 or whatever) of the code example will first have undefined behavior/memory errors.

```
9.
int vals[] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
for (int i = 0; i < 10; i++) {
    vals[i] *= vals[i];
}

10.
char msg[] = "Walking in the park";
msg[7] = '\0';
printf("%s\n", msg);

11.
char *msg = "Walking in the park";
msg[7] = '\0';
printf("%s\n", msg);

12.
char base_msg[] = "Walking in the park";
char *msg = base_msg;
msg[7] = '\0';
printf("%s\n", msg);

13.
char *msg = malloc(strlen("Walking in the park"));
strcpy(msg, "Walking in the park");
free(msg);
msg = NULL;

14.
int *arr = malloc(sizeof(*arr) * 10);
realloc(arr, sizeof(*arr) * 20);
arr[0] = 10;
free(arr);
```

## In-class problem 1: linked

In this problem we will implement a doubly linked list.

From the wikipedia article:

> A linked list is a linear collection of data elements, whose order is not given by their physical placement in memory. Instead, each element points to the next.

As each node in a linked list is independent in memory, each one will have to be malloc’ed and freed individually. In addition, in a doubly linked list, each node not only maintains a pointer to the next node after it, but also the previous node. In implementing this data structure we have to be very careful to keep all the next and previous pointers consistent.

Each node will have three fields: next, prev, and value.  
The list overall will keep track of both the start and end nodes.

### Graphic illustration

Here are a couple of sketches I made to show three different examples of how all the pointers are going to work! I use `0` to represent a NULL pointer.

![Illustration of three linked lists, one empty, one with a single value 10, and one with the values 10 and 20.](/wp-content/uploads/sites/6/2020/09/linked_lists.svg)

You will likely find it **very useful** to use the PythonTutor/CTutor website to watch how your own program handles the pointers in the linked list in real time! It will be like my illustration, but for your own code and changing line by line! It will also make it very clear what memory is on the heap vs a local variable.

[http://pythontutor.com/c.html](http://pythontutor.com/c.html)

### Operations

We will implement the following operations, although more are possible:

- push\_start
- push\_end
- pop\_start
- pop\_end

In addition, you will also need to implement some mechanism to destroy your list, since we can’t be leaking memory!

We are providing some base code that will read the push and pop commands from a file. And whenever we pop a value off the linked list, we print it out.

If we cannot pop a value because there are none left, print an error message to `stderr` and exit with a non-zero status.

For a file of commands:

```
push_start 1
push_start 2
pop_start
pop_start
```

```
2
1
```

  

And for:

```
push_start 1
push_start 2
pop_end
pop_end
```

```
1
2
```

  

And:

```
push_start 1
push_start 2
push_end 3
push_end 4
push_end 5
pop_start
pop_start
pop_start
pop_end
pop_end
```

```
2
1
3
5
4
```

### Debugging with CTutor

I _highly_ recommend you to use CTutor [http://pythontutor.com/c.html](http://pythontutor.com/c.html) to debug your program. After finding a minimal test case (as few lines as possible!) for your `link_steps.csv` file that causes some bad behavior on your computer, it can help to use the visual CTutor tool for debugging.

Copy over your entire program, but write a new main program because you won’t be reading a file anymore. This new main program might look like this:

```
int main(void) {
    list_t *list = list_create();
    list_push_start(list, 1)l
    list_pop_start(list);
    list_destroy(list);
    return 0;
}
```

You may get some errors with CTutor complaining about the server being busy. Be patient as long as it still indicates that it is trying to run your program. If it gives up, try clicking “Visualize Execution” for a second time, but you also might need to wait until later to try again.

### Debugging with Visual Studio Code

If you are running on Mac OS, I recommend relying on the Visual Studio Code debugging support: [https://code.visualstudio.com/Docs/editor/debugging](https://code.visualstudio.com/Docs/editor/debugging). You might also find this simple video helpful (it talks about C++ and an older version of VSCode, but the differences are relatively minor): [https://www.youtube.com/watch?v=X2tM21nmzfk](https://www.youtube.com/watch?v=X2tM21nmzfk)

Of course, integrated debugging with VSCode can be useful for GDB as well on WSL or Linux! This is just especially important for Mac OS because I can’t help you learn the native Mac OS LLDB debugger, but VSCode does know how to to use it.
