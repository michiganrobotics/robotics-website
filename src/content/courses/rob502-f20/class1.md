---
title: "ROB 502: Programming for Robotics: Class 1"
date: "2020-07-07"
---

## Linux and the Bash Terminal

We will start by talking about the most common commands and features and eventually make our way to writing full scripts.

Again, many commands will have some amount of output that appears on the screen after the command you enter, but not all will.

### Basic Commands - Directories

The command line is always in some directory, and that directory serves as a reference point for commands and files. Just like when you open your file manager and it starts out in your “home” directory, the command line often opens in the home directory as well.

- `pwd` (print working directory) shows the path to your current directory.
- `cd` (change directory) moves to another directory, which may be absolute (starting with `/`) or relative to the current directory.
- `ls` (list files/folders) lists out all the files and folders in your current directory.

There are also several special names you should now:

- `~` This tilde is short for the path to your home directory. The home directory is very useful because it lets programs be specific to the current user.
- `.` The single dot means “the current directory”. Most of the time, you don’t need this because it is implied, but it has important uses.
- `..` The double dots mean “the parent directory”, and this lets you move back up out of the current directory to the one before it.
- `/` The forward slash separates directories, including the special directory names `~`, `.`, and `..`
- `/` As a full path the single forward slash is the “root” directory, which by definition contains all files through some path of folders.

Many commands can do more advanced things when you give them “arguments” or extra information.

For example, `ls -l` lists files and folders each on their own line with additional information. `ls -a` lists all files, including files that are normally hidden because their names start with a `.` (dot). You can also combine both, so `ls -la` lists all files and folders with detailed information. You can also specify a path so that it shows files in a different folder than the one you are in, like with `ls /etc`.

Run these commands!

```
pwd
ls
cd .
pwd
cd ..
pwd
ls
cd /
pwd
ls
cd ~
pwd
cd ././././
pwd
ls -l
ls -a
ls -la
ls -l /
```

### Basic Commands - Files

In this section we will show how we can make files and folders, write to them, and read from them.

- `cat` (shows file contents; short for “concatenate”, although that is an uncommon use) outputs the contents of a file.
- `touch` creates an empty file.
- `rm` (remove) deletes a file. `rm -r` (recursive) deletes a whole folder. Be careful! There is no undo for `rm`. Once a file is gone, it is gone.
- `mkdir` (make directory) creates a new directory.
- `nano` is a very tiny text editor that can create and modify files. When it says to press `^X` to exit, the carrot (`^`) means control, so `^X` means Ctrl+X. Nano is simple to use because it shows all of its shortcuts on the screen when you use it.
- `mv` (move) moves a file or folder.
- `cp` (copy) copies a file. `cp -r` (recursive) copies a folder.

Run these commands to see how they work!

```
cd ~
mkdir tmpdir
cd tmpdir
touch file1
cat file1
# Anything after a # is a comment and is ignored!
# You can still copy these comments and run them!
nano file2 # put something like "hello world" in the file, save, and exit
cat file2
cp file2 file1 # overwrites file1 with file2
cat file1
mv file1 file3
ls
cd ../
rm tmpdir # this won't work
rm tmpdir/file3
rm -r tmpdir # the -r means "recursive" and will remove the directory and everything in it
ls tmpdir # it is gone now
```

> On Linux, there is this principle that “everything is a file”. Your hard drive, keyboard, earphone jack, cpu, and the current programs on your computer all have files that represent them. Many of these are under `/dev` or `/proc`.

### Basic Commands - Output redirection

Commands become a lot more interesting when we can do more with their output than just look at it on the screen. We can use the “right arrow” `>` to send the output of one program to a file, instead of the screen. One thing to notice is that programs have two kinds of output: the normal output, and the error output. Because these are so common they are called standard output and standard error. They are abbreviated as `stdout` and `stderr`. If we want to redirect stderr we have to use `2>` instead of `>`.

We can redirect to the special file `/dev/null` if we want the output to be ignored.

The `echo` command can be useful with redirection.

- `echo` repeats/outputs its own command line arguments.

Try this out and experiment with more:

```
cd ~
echo "hi mom"
echo "hi mom" > /dev/null
echo "hi mom" > file
cat file
ls /
ls / > filelist
cat filelist
ls /bad_file # this file is not supposed to exist!
ls /bad_file > filelist
cat filelist
ls /bad_file >filelist 2>errors
cat filelist
cat errors
```

There is also a standard input or `stdin`. When we run `nano`, the program stays open and it reads everything we write through this standard input.

Redirection from one program to another program (instead of a file) is also extremely useful. This is done with the `|` pipe. This redirects the standard output of one process to the standard input of the next. It is more useful with some of the commands in the next section.

You can also use the “left arrow” `<` to direct the contents of a file to a program’s standard input!

### Basic Commands - Filtering output

Linux keeps a dictionary of about 100,000 “words” in the file `/usr/share/dict/words`.

If you are using Windows 10 and WSL or Mac OS, first check that this file exists with `ls /usr/share/dict/words` If it does not, on WSL try installing it with `sudo apt-get install --reinstall wamerican`. Alternatively, try searching around for a copy online, it doesn’t matter exactly what version you get. Then you will need to copy it over with sudo. For example, from the download directory (from the explorer, use the menu option to open a powershell and then run bash) I’d run `sudo cp words /usr/share/dict/words` to copy over the file I downloaded.

This is such a big file that if we want to work with it, it will be helpful to filter it down in some way. Here are some commands to help us examine it. Most of these commands can either take a file listed as an argument (e.g. `wc -l file`) or read from standard input (e.g. `cat file | wc -l`).

- `wc` (word count) counts the number of lines (`wc -l`) or words (`wc -w`).
- `head` outputs/prints the first 10 lines. `head -n 5` is more flexible and outputs the first 5 lines.
- `tail` outputs the last 10 lines. `tail -n 5` is more flexible and outputs the last 5 lines.
- `grep`\* (convoluted etymology) searches for and outputs lines that contain some string or that match a [_regular expression_](https://ryanstutorials.net/regular-expressions-tutorial/).
- `sort` sorts the input lines alphabetically.
- `uniq` removes adjacent duplicate lines. We generally sort the input before using this.
- `tr -d` deletes specific characters from its input and outputs the rest.
- `ps aux` prints a list of all currently running processes and information about them.
- `awk` is a powerful but simple programming language that is great at working with data in columns. `awk '{print $1}'` prints out only the first column of data. `awk '{print $1 " - " $2}'` prints the first two columns with \` - \` in-between them.

Try these commands and experiment with more:

```
wc -l # (press Ctrl+D to make an end-of-file (EOF) character and exit)
wc -l /usr/share/dict/words
cat /usr/share/dict/words | wc -l
wc -l < /usr/share/dict/words
echo "hi mom"
echo "hi mom" | wc -w
head /usr/share/dict/words
tail -n 4 /usr/share/dict/words
grep john /usr/share/dict/words
cat /usr/share/dict/words | tr -d "aeiouAEIOU'" | head
cat /usr/share/dict/words | tr -d "aeiouAEIOU'" | tail
cat /usr/share/dict/words | tr -d "aeiouAEIOU'" | sort | head
cat /usr/share/dict/words | tr -d "aeiouAEIOU'" | sort | tail
cat /usr/share/dict/words | tr -d "aeiouAEIOU'" | sort | uniq | head
cat /usr/share/dict/words | tr -d "aeiouAEIOU'" | sort | uniq | tail
ps aux
ps aux | grep firefox # are you running firefox?
ps aux | grep firefox | wc -l # how many processes is it using?
```

### Basic Commands - Processes

The `ps aux` command shows all the currently running commands. Here are some more useful commands you may need.

- `top` (table of processes) opens a real-time view of the currently running processes. Press ‘q’ to quit.
- `killall` force quits all processes with a certain name.
- `kill` quits a program with a specific program ID (PID). These PID’s are among the columns listed by both `top` and `ps`. `kill -9` is the most forceful way to destroy a process.
- `fg` (foreground) resumes a process that has been stopped by pressing Ctrl+Z. Important to know because I do this by accident all the time.
- `sleep` waits a given number of seconds.
- `xargs` redirects its standard input to the arguments of another command. This can be necessary because some commands don’t normally use standard input at all.

In addition, if you put an ampersand `&` at the end of a command, it will cause it to run in the background, meaning you will be able to enter a new command even if that one hasn’t finished yet..

Also, we can also enter multiple commands on a single line if we put a semicolon `;` between them.

Try this:

```
sleep 1
sleep 1 ; echo hi mom
sleep 1 &
sleep 10 # now press Ctrl+Z to stop the process
fg # You can press Ctrl+C to quit the sleep early
killall firefox # just make sure you are okay with this
firefox & # start it up again
ps aux | grep firefox | awk '{print $2}' # Process ID's (PID's) for firefox
ps aux | grep firefox | awk '{print $2}' | kill # doesn't work
ps aux | grep firefox | awk '{print $2}' | xargs kill # works!
```

### Scripting - Basics

Everything that we can do directly on the command line we can also put in a script file. On the other hand, some bash functions are mostly only useful in scripts.

Make a file called `test.sh`. The `.sh` extension is not actually important because Linux does not use extensions, but it is a helpful convention to know that this is a (bash) shell script.

Put some commands in the file:

```
echo "Hello! Your current directory is:"
pwd
echo "And the files in this directory are:"
ls
```

Now you can run this script with:

```
bash test.sh
```

We can also make this script directly executable so we don’t have to ask bash to run it every time.

We can use a “shebang” `#!` directive as the first line of the script to inform Linux of how to run the program, giving it the full path to the bash executable. Then we will mark the file as executable.

These two commands will help:

- `which` gives the full path to a command’s executable file
- `chmod` (change mode) sets file permissions/modes. `chmod +x` marks a file as executable.

Run `which bash` to get the full bath to the bash executable. It will likely be `/bin/bash` or `/usr/bin/bash`.

Then add the shebang line to the script. The script, test.sh, will look like this:

```
#!/bin/bash
echo "Hello! Your current directory is:"
pwd
echo "And the files in this directory are:"
ls
```

Now we can mark the file as executable:

```
# to run a file in the current directory, we have to use "." to say current directory
# otherwise bash will think it is a command from somewhere else
test.sh # doesn't work
./test.sh # this won't work yet
chmod +x test.sh
./test.sh # now it works
```

### Scripting - Variables

Just like other commands, you can give extra information or “command line arguments” to your script when you run it. These arguments are available through some special variables.

- `$#` is the number of arguments supplied
- `$0` is the “zero” argument, which is the name that the script was run with
- `$1`to `$9` are the actual arguments given

Put the following in a file called `args.sh` and make it executable with `chmod +x`.

```
#!/bin/bash
echo "You have given me $# arguments"
echo "The zero one is: $0"
echo "The first one is: $1"
```

Now try it out:

```
./args.sh
./args.sh one
./args.sh one two
bash args.sh is this different
./././args.sh and how about this one
```

You can also assign your own variables with the `=` equal operator. Be careful, because you can’t have any spaces on either side of the equal sign! When a variable is inside a string with double quotes (e.g. `"Hi I'm a $variable"`), then it is _expanded_, or replaced by the value of the variable, but not if the string is with single quotes. Again, although we are talking about scripting now, everything that follows can also still be tested on the command line:

```
one=1
echo $one
another="a long string"
echo $another
echo "$another"
echo '$another'
```

You can also assign the output of a command to a variable by using `$( command )`:

```
files=$( ls )
echo $files
```

Another special variable is `$?` which lets you get the “status” or “exit” code of the last command. This is helpful for you to know if the last command succeeded or not. Because it changes with every command, most of the time you need to assign it to a variable so you can remember the value. In general, 0 means success, and anything else is some form of error.

```
ls
echo $?
ls /file/that/doesnt/exist
echo $?
echo $? # 0 again because the echo worked
ls /file/that/doesnt/exist
err=$?
echo $err
```

### Scripting - If statements

The bash if statement has several different forms. Here we talk about one form using square brackets. The elif (else if) and else parts are optional. The spaces are important, so please pay attention to them.

```
if [ condition ] ; then
    echo 'It was true!'
elif [ condition ] ; then
    echo 'Something else was true!'
else
    echo 'Neither was true!'
fi
```

The contents between the square brackets are actually given to special command called `test` and then `test` itself determines if they are true or not. When writing an if statement, it may be useful to first try getting the condition to work correctly with the `test` command before actually putting that condition into `if [ ... ] ;`.

The following conditions (and many more) are supported by test (and therefor in an if statement):

- `A = B` tests if strings are equal
- `A != B` tests if strings are not equal
- `-z A` tests if a string is zero length (empty)
- `-n A` tests if a string is not zero length
- `A -eq B` tests if numbers are equal
- `A -ne B` tests if numbers are not equal
- `A -gt B` tests if `A` is greater than `B`
- `A -lt B` tests if `A` is less than `B`
- `-e A` tests if a file or directory exists
- `-f A` tests if a file exists
- `-d A` tests if a directory exists
- `! condition` is the negation of the rest of the statement/condition

You can try these out on the command line directly with `test`:

```
test -f asd.txt # is asd.txt a file?
echo $? # If you have created a file asd.txt, this will show 0 (no error) and if asd.txt does not exist it will show 1 (error: not a file)
test ! -d ./ # is the current directory _not_ a directory?
echo $? # definitely false! We print error code 1
test 10 -eq 10
echo $? # definitely true! No error, so status is 0
```

Bash itself also provides `&&` (and) and `||` (or). Because they are provided by Bash instead of test, they appear on the outside of the square brackets:

```
if [ 1 -eq 1 ] && [ "String" = "String" ] ; then
    echo 'True!'
fi
```

These operators from bash (`&&` and `||`) can also be used in ordinary bash commands. When using `&&`, a second bash command is run only if the first command is true (no error). With `||`, a second command is run only if the first command is false (has an error). In addition, the semicolon `;` can be placed between commands to run both regardless of status codes. The final status/error code for each of these combined commands comes from the last command to run.

```
ls /doesnt/exist && echo hi # does not say hi
ls ./ && echo hi # does say hi
mkdir ./ || echo "Could not make directory"
mkdir ./ 2>/dev/null || echo "Could not make directory" # redirect the normal error away
test -e ./asd ; echo "We don't know here if file asd exists"
test ! -e ./asd ; echo "We don't know here if file asd exists"
```

### Scripting - For loops

The for loop comes with several useful forms:

```
# parenthesis define an array
list=(Apples Bananas Cherries)

# This will only echo the first element
echo $list

# this gives you the whole array
echo ${list[@]}

# and this gives you the second element
echo ${list[1]}

# We can iterate through the whole array like so
for var in ${list[@]} ; do
    echo "Processing $var"
done

# or we can specify the items directly
for var in Apples Bananas Cherries ; do
    echo "Processing $var"
done

# for a range between numbers
for var in {1..10} ; do
    echo "Processing $var"
done

# You can't put it in a variable, though
list={1..10}
for var in $list ; do
    echo "Processing $var" # Processing {1..10}. This doesn't work!
done

# you can also go in high to low!
for var in {10..1} ; do
    echo "Processing $var"
done

# we can go by 2's or any other increment (may not work on Mac OS, no big deal!)
for var in {10..1..2} ; do
    echo "Processing $var"
done

# or go through the output lines of another program
for var in $(ls) ; do
    echo "Processing $var"
done

# or directly go through files based on a wildcard pattern
for var in *.txt ; do
    echo "Processing $var"
done
```

### Additional information

We have tried to present a concise summary of the most important Linux and Bash concepts in this document. Far more detail is available on the web.

The following tutorials informed this document and are also excellent guides:

- [https://ryanstutorials.net/linuxtutorial/](https://ryanstutorials.net/linuxtutorial/)
- [https://ryanstutorials.net/bash-scripting-tutorial/](https://ryanstutorials.net/bash-scripting-tutorial/)

And for learning more about regular expressions, please refer to:

- [https://ryanstutorials.net/regular-expressions-tutorial/](https://ryanstutorials.net/regular-expressions-tutorial/)

## In-class assignment: letters.sh

Write a script `letters.sh` to divide the dictionary file at `/usr/share/dict/words` such that a new file `a.txt` contains only words that start with lowercase ‘a’, `b.txt` words starting with lowercase ‘b’, and so on all the way to `z.txt`. Output the letter that has the most words in the file along with that number of words. Also output the top 20 words from that file. Use the exact phrasing given here:

```
The letter '*' begins with the largest number of words: ####
WORD
WORD
...
WORD
```

In the next class we will learn how to use class auto-grader to submit and test your solution.

### Regular expressions

A useful way to match patterns like “words that start with the letter a”, is by using a [_regular expression_](https://ryanstutorials.net/regular-expressions-tutorial/) with the `grep` command. Regular expressions (regex) can quickly become very complicated, so here we only present what you need to know for this problem. You can use the website [https://regex101.com/](https://regex101.com/) to experiment with writing regular expressions. Note that if you use more advanced features of regular expressions, you may need to either escape them (e.g. use `\?` for the special meaning instead of `?`, which is just a question mark) or use the `egrep` version which makes the opposite assumption of grep (so `?` has the special meaning and the ‘\\?’ is the normal question mark).

In a regular expression, certain symbols have special meanings, while most letters represent themselves. A pattern “apple” will match that sequence of five letters regardless of where they appear in an input string (e.g. they could be in the middle of another word).

- `^` represents the start of a line, and it would go at the start of a regular expression (regex) pattern
- `$` represents the end of a line, and it would go at the end of a regular expression (regex) pattern

So, “^apple” will match any line that begins with “apple”, although it may end with anything. And “apple$” will match any line that ends with “apple”, regardless of what it starts with. Try out the following commands:

```
echo "I have an apple" | grep apple # matches
echo "I have an apple" | grep ^apple # does not match
echo "I have an apple" | grep apple$ # matches
```
