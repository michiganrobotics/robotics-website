---
title: "ROB 502: Programming for Robotics: Homework 3.5 Discussion"
date: "2020-10-26"
---

### Clicker Questions

Use p4r-clicker to submit your answer

We have a file `words.txt`

```
groan
blue
afterthought
abortive
tenuous
knife
hot
alert
plough
cure
fry
abstracted
```

Feel free to reference the class1 page on bash!

1. `cat words.txt | grep ler` By default, `grep` will print out again any line that matches with its search expression. There is exactly one word that contains "ler" and that is **alert**! `grep` will not care about the other characters around "ler" unless we explicitly tell it to.
    
2. Write a command to put words ending with "e" in a file "e.txt" We can start with the full list of words by running `cat words.txt` and then we can give that to `grep`. We can use `$` to mark the end of the line, and then `'e$'` to specify an "e" that is immediately followed by the end of the line. We use single quotes to make sure that the dollar sign is not interpreted by bash as a variable expansion. Finally, we can write the output to a file by using `>` to do a redirection of the output. We get, in some, **`cat words.txt | grep 'e$' > e.txt`**
    
3. `tail -n 1 e.txt` This invocation of `tail` will give us the last line in `e.txt`, which will correspond to the last word in `words.txt` that ends in an "e": **cure**
    
4. Write a command to print out words with both an "a" and an "e" anywhere in the word Again, we can start with `cat words.txt` and then filter it down. We can call `grep a` to get just those words that contain an "a" and then call `grep e` again to get just those words that contain an "e", given that we have already filtered the words down once: **`cat words.txt | grep a | grep e`**
    
5. Write a bash if statement that variable "a" is greater than variable "b". First off, if we want to do a comparison in a bash if statement, then we can use the square bracket notation, which will implicitly use the `test` command: `if [ condition ] ; then`. Since bash uses the symbols `<` and `>` for input/output/file redirection, we can't use those to specify greater than or lesser than operations. Instead, `test` uses "-lt" and "-gt". Next, we need to remember that in bash in order to access a variable, we need to use `$` to expand it. So we get a total of **`if [ $a -gt $b ] ; then`**
    

```
int add_print(int a) {
    a += 1;
    printf("%d, ", a);
    return a;
}

void clicker6(void) {
    if (add_print(6) > 6 || add_print(6) > 7) {
        printf("true\n");
    }
}
```

The `||` operator performs logical or, meaning that it treats its arguments as being "true" or "false" values and will also result in boolean value. As a logical operator, it is also "short-circuiting" meaning that as soon as it knows the answer, by looking at the left operand, it can stop computing, and just not evaluate the right operand at all. So in this case, it calls `add_print(6)` for the first time, which gives a value of 7, which is greater then 6. This means the left operand has a value of true. Since we have true, the value "true || false" and "true || true" turn out the same, so we do not even call `add_print` a second time. The total output is **"7, true"**

```
void clicker7(void) {
    if ((add_print(6) > 6) | (add_print(6) > 7)) {
        printf("true\n");
    }
}
```

This is a misuse of the bitwise OR operator, but it still mostly works the same. The main difference is that it no longer short-circuits, and it will call `add_print` both times in order to get the result of the bitwise or. Really, it doesn't make much sense to use the bitwise operation here, when this is clearly a boolean logic situation not dealing with individual bits. So we get **"7, 7, true"**

Because of the combination of comparison operators and bitwise operations, this code is highly likely for the style checker to just not understand, and so it might never be satisfied with the formatting. The root issue is the style checker gets confused because this code is so surprising to it.

```
void clicker8(void) {
    int a = 6;
    if (add_print(a) > 6 && add_print(a) > 7) {
        printf("true\n");
    }
}
```

As a logical and operation, we can short-circuit. With and, we will skip evaluating the right operand if the left operand is false, because "false && false" and "false && true" is false either way! This is really useful when you are dealing with null pointers, e.g. `if (node && node->value == 10)`. This allows us to avoid a null dereference error by first checking that node is not null before trying to access through it with the arrow operator! In this example, we get true on the left, so we also have to evaluate the right side, which ends up being false from `7 > 7`, so we print out just **"7, 7, "**

```
void clicker9(void) {
    int a = 6;
    if ((add_print(a) > 6) & (add_print(a) > 7)) {
        printf("true\n");
    }
}
```

This final case with the bitwise and, ends up just like the logical and, because there is no short-circuiting in either case. We get **"7, 7, "**. Now, there actually are good examples of when to use a bitwise and in an if statement. For example, if we need to execute something only if the highest bit of a byte is set, we could do `if (byte_value & 0x80)` and this would be reasonable.

```
int main(void) {
    clicker6(); // 6
    clicker7(); // 7
    clicker8(); // 8
    clicker9(); // 9

    return 0;
}
```

This next recursive problem is really tricky. Please use a pencil and paper or otherwise take notes to try to figure out how it will run. I don't think it is so easy you can do it in your head, at least I can't!

```
typedef struct state {
    int depth;
    int *value;
} state_t;

int recurse(state_t state) {
    if (state.depth >= 2) {
        return *state.value;
    }
    *state.value += 1;

    state.depth += 1;
    int val1 = recurse(state);

    state.depth += 1;
    int val2 = recurse(state);

    return val1 + val2;
}

int main(void) {
    state_t state = {0};
    state.value = calloc(1, sizeof(int));

    printf("%d\n", recurse(state)); // 10

    printf("%d\n", recurse(state)); // 11

    free(state.value);
    return 0;
}
```

The key to understanding this is that A) we are passing the `state` by value, so each time `recurse` is called, it gets its own local variable copy of the state, and B) state contains a pointer to a location in memory for the `value`, and since we only called `calloc` once, this memory location is absolutely unique, no matter what level of recursion we are in!

The next thing we should do is draw out what the recursion will look like. We can see that `recurse` has two ways of running. Either it will immediately return a value (a leaf node in the tree), or it will make two additional calls to `recurse`.

Depth starts at 0 since we initialize state with `{0}`, recursion will stop when depth is greater than or equal to 2. So our call tree will look like (annotated by the `depth` value):

```
        0
      /   \
     1     2
   /  \
  2    3
```

Because we always finish executing a function before moving to the next one, we will traverse this tree from in depth-first fashion, meaning we always take the left-branch before taking the right-branch, and we have to get to the bottom of the tree before coming up.

So we will start at 0, take the left branch to 1, take the left branch to 2, then return and take the right branch to 3, then return all the way to the top and take the right branch to 2.

In the code for `recurse`, `*value` starts at 0 (because of `calloc`) and increments by 1 every time that we `recurse` recurses instead of immediately returning. This happens twice in our total tree: once when we split to make nodes 1 and 2, and then a second time when we split to make nodes 2 and 3. So when we get to the bottom left node "2", `*value` has been incremented twice, and has a value of 2. So we return a value of 2. The other two leaf nodes (3 and then the final 2), also return that same value of 2. So the total sum and result is **6**.

```
                0
   value of 1 /   \
             1     2
value of 2 /  \  +  (2)
          2    3
        (2) +  (2)
```

In the second run of the same code, everything is the same except that `*value` starts with a value of 2 instead of 0. It gets incremented to 4 and then each of the three leaves returns 4 for a total of **12**.

```
                0
   value of 3 /   \
             1     2
value of 4 /  \  +  (4)
          2    3
        (4) +  (4)
```
