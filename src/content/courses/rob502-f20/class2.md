---
title: "ROB 502: Programming for Robotics: Class 2"
date: "2020-07-07"
---

### Clicker Questions

Use p4r-clicker to submit your answer

Assume you have the following file `words.txt`:

```
soup
shrug
distinct
rate
distance
imperfect
shivering
smoggy
```

What is the result of the following commands? (one at a time) 1. cat words.txt | grep s | wc -l 2. cat words.txt | grep i | grep e | wc -l 3. cat words.txt | grep i | grep e | tr -d 'ie' | head -n 1

## Using git to submit your work

In this class, you will solve three simple problems in C, using git to track changes to your code and provide it to the auto-grader. While we will only be using the most basic features of git for this class most of the time, you might run into problems (especially if you edit your code on more than one computer or with the web interface). Because of this, I highly recommend you to take a look at this online Git tutorial for a much broader introduction to what Git is and how it works: [https://www.atlassian.com/git/tutorials/what-is-version-control](https://www.atlassian.com/git/tutorials/what-is-version-control). This is a comprehensive and detailed tutorial, so feel free to skim the material and find the sections most relevant to you. And remember to use it as a reference later when you have more questions. Git is one of the most-used pieces of software in the programming world.

## Starting the class2 assignments: helloworld

In this problem we will write the classic "helloworld" program to demonstrate the workflow we will be using for all the assignments in this class:

1. Write your code and makefile
2. Compile and test it on your computer
3. Use git to add and commit your files
4. Use git to push your code online
5. Use p4r-submit to evaluate your code
6. Repeat back to 1 until you are satisfied with your score

We will first walk you through all of the minute steps for this first problem:

- Change into the class2 folder of the repository with `cd class2`
- Your prompt should look something like `~/rob502/class2$`
- Open the class2 directory in your choice of code editor. I recommend either [Visual Studio Code](https://code.visualstudio.com/) or [Atom](https://atom.io/), but you can use whichever editor you like! Both Visual Studio Code and Atom are already available on the CAEN computers.
- Make a file called `helloworld.c` and enter the following:

```
int main(void) {
    return 0;
}
```

- Make a file called `makefile` and enter the following. Note that the indentation (at the _beginning_ of a line) in makefiles _must_ use tabs and not spaces. You can't copy a tab character from this online page, so you will have to type it yourself. This makefile is specifying how to make a file called `helloworld`. The first line says that our program `helloworld` has one source code file: `helloworld.c`. The second line says that to compile our code, we should run `gcc -o helloworld helloworld.c -std=c11`. We are using the `gcc` compiler, and the `-o` option tells gcc that our program will be called `helloworld`. The `-std=c11` tells the compiler we are using modern C. The remainder of the line are the source code files to compile.

```
helloworld: helloworld.c
    gcc -o helloworld helloworld.c -std=c11
```

And again, with the important tab character pointed out:

```
helloworld: helloworld.c
    gcc -o helloworld helloworld.c -std=c11
^^^^ A single tab character needs to be right there before "gcc".
```

- Run `make helloworld`. This creates (i.e. 'makes') an executable `helloworld` from your code. Run `./helloworld` to confirm it has been made. It shouldn't actually do anything when run.
- In order to submit your problem solution, we have to use git:
    - Run `git add helloworld.c makefile` to add these new files to your repository. (you can list as many files as you like).
    - Run `git status` to see that these two files are now ready "to be committed".
    - Run `git commit -m "helloworld basic code files"` (or with whatever message you like) to commit this code to your own local git repository. You can put whatever message you want, but you do need to include a message.
    - Run `git status` again and notice that your files are no longer mentioned as modified or needing to be committed.
    - Run `git push` to send your commits up to the eecs gitlab repository we made earlier.
- We have installed a script called `p4r-submit` to make submission and evaluation of code easy. Run `p4r-submit helloworld` to ask the class server to pull your github repository and evaluate the helloworld problem. It knows which class or homework problem set to evaluate by checking the current directory of your terminal. If you just run `p4r-submit` without specifying a problem, it will evaluate all the problems in the current assignment.
- You should get a response from `p4r-submit` about how much of the problem solution was correct. It should say you had the correct exit/status code of 0, but that it failed to output the correct string, which is `"hello world\n"` (`\n` is a new line character). It should also note that you have passed a Valgrind test, which checks for memory violations, and a style check, which enforces a class coding style.
- Fix your program so that it prints out `"hello world\n"`. You can refer to this [tutorial document](/wp-content/uploads/sites/6/2019/07/c_review_notes.pdf) for a review of the C programming language.
- Run `git status`. You should see that it recognizes your `helloworld.c` file has been modified.
- Run `git add -u` to add all the files that `git status` had listed as modified.
- Run commit (with `git commit -m "your message"`), push (`git push`), and resubmit (`p4r-submit helloworld`). You should now get full points for this problem.

## In-class problem 2: fizzbuzz

This is a classic beginner problem: output the numbers 1 to 100, one number on each line. If the number is divisible by 3, instead output `fizz`. If the number is divisible by 5, instead output `buzz`. If divisible by both, output `fizzbuzz`. The last character of output should be a new line.

Starting like so:

```
1
2
fizz
4
buzz
...
```

If your source file is called `fizzbuzz.c` you can actually run `make fizzbuzz` to compile it to an executable called `fizzbuzz` without having to change your makefile! This is because make has certain default "rules" about how to compile c code. However, it is much better to be explicit. One thing we can do to make editing the make file simpler, is to use certain make variables. `$@` will be replaced with the name of the "target" (what comes before the colon), and `$^` will be replaced with the list of dependencies (that come after the colon). So we only need to add the following to our makefile:

```
fizzbuzz: fizzbuzz.c
    gcc -o $@ $^ -std=c11
```

which means the whole file will look like:

```
helloworld: helloworld.c
    gcc -o helloworld helloworld.c -std=c11

fizzbuzz: fizzbuzz.c
    gcc -o $@ $^ -std=c11
```

## In-class problem 3: primes

In this problem, your program will prompt the user to enter a number. Your program will then print out "Prime factors:" and the prime factors of that number in ascending order, one on each line, including repeats. For example, the full output from one run where the user typed `30` might look like the following:

```
Enter a number to factorize:
30
Prime factors:
2
3
5
```

We have provided a stub program that reads the number in from the user, so you just need to implement the algorithm. Make sure to write an efficient solution!

If you choose to use any math functions such as `sqrt` in your code (and you should use the square root!), you will notice that even when your code seems to _compile_ it fails to _link_, saying something about "undefined references". If this happens, you may need to instruct the compiler to link your program with a math library that provides the actual code for those functions. You can do this by adding `-lm` to the _end_ of one of your gcc commands. `-l` stands for link and `m` for math.

## Class 1's problem: letters.sh

Now that you have learned how the auto-grader works, go back to class1, and submit your `letters.sh` solution.

If you get an error about "permission denied" from the auto-grader, check the section of the class1 document about the shebang line and using `chmod` on your script to make it executable.
