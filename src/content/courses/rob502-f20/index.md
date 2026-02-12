---
title: "ROB 502: Programming for Robotics | Fall 2020"
date: "2020-07-07"
---

Instructor: Acshi Haggenmiller (acshikh), PhD Candidate  
Mo/We 1:30-4:30pm  
Online/Remote

This whole site is a living document and subject to change.

## Introduction

This class is designed for engineering students who have a basic understanding of programming but haven't majored in computer science or taken a dedicated sequence of programming courses. **The goal of this class** is for students to learn how to 1) write programs from scratch that meet robotic system requirements; 2) organize programs into logical sections; 3) critique program design and implementation choices; 4) use appropriate debugging tools and methodology to efficiently understand and correct program behavior; and 5) use the command line to work with git and other relevant utilities and scripts.

As it is titled _Programming for Robotics_, we have tried to design the in-class problems and homework assignments to be relevant to common robotics situations and algorithms, with the greater goal of demystifying programming and avoiding black-box magic. To be relevant and exciting, we designed the homework assignments around building a robotics simulation environment. While there are many excellent libraries and tools available for this (ROS among them), we will figure it out for ourselves! The best way to learn programming is by programming, so there will not be any quizzes or exams, and algorithms and necessary math will be provided so you can focus on implementation and not derivation.

The class uses the C programming language. C is a relatively simple language that will help us understand the fundamentals of how computer programs works, without the language letting us take complicated features for granted. Although most robotics programming is done in languages like Python and C++, the fundamentals you learn in C will help you to better understand what is happening in those more complicated languages.

"In-class" assignments are intended to require about 2-5 hours to complete, with the first 2-3 hours occurring during the scheduled class block. Homework assignments are intended to require about 4 hours per class session. In general, they will be due 1 week after the end of the topic section they were assigned in. For example, the first homework will be due before class session 5.

## Instructional format in light of COVID-19

ROB 502 will take a hybrid approach between 1) asynchronous videos and work on your own time and 2) synchronous class discussions and clicker questions. Office hours will be provided in both an online remote format and also in-person on campus in a large classroom with the aid of a plexiglass divider. You will need to have a relatively modern (last 10 years) laptop for use with the course. Linux is ideal (though not expected), and I am also supporting Windows 10 and Mac OS. If you don't have a compatible laptop, the university has a [Loaner Laptop Program](https://its.umich.edu/computing/computers-software/sites-at-home) you can use to borrow one.

Each week, we have scheduled two 3-hour blocks of class time. Before these blocks, you will be expected to have watched any relevant introduction videos that will be posted on that day's class page (linked below in the course schedule). We will use either Zoom or BlueJeans for our classes. The first hour or so of these class blocks will consist of group activities, clicker questions, and class discussions. For the remainder of the time, students are encouraged to begin work on that day's "in-class" assignments. These assignments are relatively low-stakes introductions to new concepts that will be further examined on the homework assignments. I (and potentially a GSI) will be available for the remainder of this time to answer questions and provide help in real time.

After the semester starts, we will take a poll to determine additional office hours when I (and potentially a GSI) will hold other synchronous office hours. At any time, students are encouraged to ask questions on the class Piazza where all students will be able to benefit from the answers and where students can also answer the questions of their classmates.

Some class sessions will not have any formally scheduled instruction or problems. Instead, topics will be addressed on an as-needed basis, with the remaining time open for working on the homework assignments with instructor help.

## Class Schedule

### Classes 0-3: Data representation

- Goals: 1) Inspect abstract data (e.g. pictures, text, plans) at the byte and bit level, and understand how changing low-level numbers affects high-level meaning. 2) Use the command line with git and the class submission system to get feedback.
- [**Class 0**: Setting up the ROB 502 command line system](/academics/courses/online-courses/rob502-f20/class0)
- [**Class 1**: Using Linux and bash](/academics/courses/online-courses/rob502-f20/class1)
- [**Class 2**: Using git to commit and submit code; expressing logic](/academics/courses/online-courses/rob502-f20/class2)
- [**Class 3**: Arrays, ASCII, bytes, and GDB](/academics/courses/online-courses/rob502-f20/class3)
- [**Homework 1**: Polygonal collision detection, cryptogram](/academics/courses/online-courses/rob502-f20/homework1)
- There are variety of C concepts that will not be explicitly covered in class! We are providing a [tutorial document](c_review_notes.pdf) to help explain the necessary syntax and basic ideas so we can delve right into the good stuff!
- For an even gentler introduction to C, I highly recommend Harvard's CS50 lectures. Although the whole lectures can be long, they have good tables of contents on each lecture on YouTube, and work well at 2X playing speed. [CS50 on compiling C, make, and compiler errors](https://www.youtube.com/watch?v=wEdvGqxafq8&t=3078s) focuses on compiling C, on using make, and on common compiler errors. [CS50 on the compilation process](https://www.youtube.com/watch?v=u-kH-5JJSgU&t=287s) is on the compilation process. If you want to follow along with their examples, you will need to use their [sandbox](https://sandbox.cs50.io/).

### Classes 4-7: Memory concepts and debugging

- Goals: 1) Determine when dynamic memory is appropriate and how to prevent and detect memory leaks. 2) Determine when pointers are necessary and reason about when they are valid. 3) Use feedback from GDB, Valgrind, and AddressSanitizer to fix memory and other bugs.
- [**Class 4**: Addresses, pointers](/academics/courses/online-courses/rob502-f20/class4)
- [**Class 5**: Malloc/free, debugging errors, and dynamic arrays](/academics/courses/online-courses/rob502-f20/class5)
- [**Class 6**: Linked lists](/academics/courses/online-courses/rob502-f20/class6)
- **Class 7**: As needed
- [**Homework 2**: Rasterizing bitmaps, Braitenberg vehicles](/academics/courses/online-courses/rob502-f20/homework2)
- [CS50 on data storage in memory](https://youtu.be/u-kH-5JJSgU?t=1700) talks about how data is stored in memory. [CS50 on pointers](https://www.youtube.com/watch?v=cC9I3XxkZXw&t=2871s) talks about pointers. [CS50 on malloc and free](https://youtu.be/cC9I3XxkZXw?t=3602) talks about malloc and free. [CS50 on memory addresses and hexadecimal](https://www.youtube.com/watch?v=cC9I3XxkZXw&feature=youtu.be&t=5126) talks about memory addresses and hexadecimal. [CS50 on stack overflows](https://youtu.be/cC9I3XxkZXw?t=7213) is on stack overflows.

### Classes 8-10: Recursion and Search

- Goals: 1) Reason about and write recursive algorithms. 2) Use search algorithms with forward simulation to choose robot actions.
- [**Class 8**: Bisection search, midpoint method, recursion vs iteration](/academics/courses/online-courses/rob502-f20/class8)
- [**Class 9**: Tree search](/academics/courses/online-courses/rob502-f20/class9)
- **Class 10**: As needed
- [CS50 on recursion and the stack](https://www.youtube.com/watch?v=Mv9NEXX1VHc) gives an overview of recursion and how the computer's stack is used to hold multiple versions of the same function in memory.
- [**Homework 3**: Equation parsing, robot chase](/academics/courses/online-courses/rob502-f20/homework3)

### Classes 11-13: Object abstractions

- Goals: 1) Analyze algorithmic complexity and determine when it matters. 2) Choose data structures based on algorithm needs. 3) Separate and hide implementation from specification.
- [**Class 11**: Complexity/Big-O Notation](/academics/courses/online-courses/rob502-f20/class11)
- [**Class 12**: Hash tables](/academics/courses/online-courses/rob502-f20/class12)
- **Class 13**: As needed
- [**Homework 4**: Bigrams](/academics/courses/online-courses/rob502-f20/homework4)

### Classes 14-17: Threading

- Goals: 1) Understand when threading is necessary and how to avoid using it unnecessarily. 2) Determine when variables may be subject to race conditions and how to prevent them. 3) Use threading for terminal input control.
- [**Class 14**: Basic threading](/academics/courses/online-courses/rob502-f20/class14)
- [**Class 15**: Race conditions, deadlock, mutexes](/academics/courses/online-courses/rob502-f20/class15)
- [**Class 16**: Terminal settings, I/O threading, manual robot control](/academics/courses/online-courses/rob502-f20/class16)
- **Class 17**: As needed
- [**Homework 5**: Live-tuning potential fields](/academics/courses/online-courses/rob502-f20/homework5)

### Classes 18-20: Message passing and networking

- Goals: 1) Divide robotic systems into independent parts. 2) Coordinate program communication across network nodes. 3) Use logging and playback features to debug specific modules.
- [**Class 18**: LCM/ROS basics, hybrid architectures](/academics/courses/online-courses/rob502-f20/class18)
- [**Class 19**: Networking](/academics/courses/online-courses/rob502-f20/class19)
- **Class 20**: As needed
- [**Homework 6**: Split project into communicating processes](/academics/courses/online-courses/rob502-f20/homework6)

### Classes 21-23: Special topics

- **Class 21**: Coding interviews
- **Class 22**: Code reviews
- [**Class 23**: Introduction to Python](/academics/courses/online-courses/rob502-f20/class23)

## Grading

Grades will be 3% course feedback, 7% class participation, 5% office hours participation, 30% in-class assignments, and 55% homework assignments (evenly split between all the homework assignments). In-class assignments will be 50% correctness and 50% participation (awarded for at least 50% correctness). Assignments will report their percentage completion through the auto-grader, with points given for completing objectives and points taken away for things like memory errors or inconsistent style. Final grades will be curved if necessary.

_Please notice_ that homework assignments are worth far more than in-class assignments, and if you get behind, prioritize your time accordingly!

### Course feedback

Several times over the semester, we will ask students to submit their feedback on the course. As a relatively new course, we want to gauge the effectiveness of the course setup, assignments, and teaching style.

### Class participation

During most class sessions we will have some "clicker"-type questions. We want everyone to participate in class so that you can get to know and support your classmates. Although assignments are individual and you shouldn't write code for anyone else, the class will be better for everyone if we can give advice and support and aid to each other. Also, if you get ahead of the in-class assignments, please start working on the homework!

### Office hours participation

I want to get to know my students! I also want students to be comfortable with getting help on the many challenging assignments in this course. While you may certainly may be able to work longer to finish assignments, I want everyone to work smarter by getting help at the right time. Part of your grade will be signing up for and showing up at office hours on at least 4 separate days.

### Late Policy

For in-class work, the two lowest scores for individual in-class assignment problems will be dropped. If you anticipate missing a class day, you are encouraged to complete that day's assignments beforehand.

For homework, over all the homework assignment problems, 48 total cumulative hours of tardiness are "free". After this, each hour an assignment is late (rounded up by ceiling) will reduce its maximum score by one percentage point (so 80% completion of an assignment 10 hours late would be 80% \* 90% = 72%). The auto-grader will report these percentage calculations and keep your highest final score from any submission. The 48 free hours of allowed homework tardiness will be applied _at the end of the semester_ to maximize your final grade.

At any point, run `p4r-check` in a problem folder to see the highest score the auto-grader has recorded for you. Keep in mind that it doesn't take into account your free late hours for homework.

## Academic Honesty

The programs you submit, for both in-class and homework assignments, must be your own work, and significant similarity to other submissions will be considered highly suspect. Ultimately, though, the basic guideline is to be reasonable.

While working on problems, you are encouraged to search the internet to learn how to perform specific functions or techniques. In general, if you find a trivial one-liner on StackOverflow, you do not need to cite this. If you are copying a full algorithm, say for quicksort, you would need to cite this (or just use the standard library function qsort!). If that algorithm is a core objective of the assignment, however, then this would not be appropriate regardless of citation. Especially when you implement trickier algorithms or mathematical calculations that you found somewhere online, it can be wise to include a link to the original description of that method in a comment. This makes it easier to check or resume your work later.

You are especially encouraged to get help from your peers! This means that after trying to figure out a problem or fix your code, please talk to other students. If you want them to look at your code, only show the part you are trying to debug. Ask them for pointers about where the error is or what concepts or techniques to review, especially debugging techniques. Keep the conversation high-level and don't give or receive guided instructions on exactly what code to write. The most useful thing would be to point out flawed logic and allow the other student to come up with the fix themselves. For earlier brainstorming of problem solutions, discuss problems using a whiteboard or a sheet of paper so that everyone can still write their code for themselves. **You should not show your own working code to another student who is struggling to complete theirs.**

If on the homework you get significant help from your peers, please consider adding a comment in your code at the top of the file saying who you collaborated with and what information was shared. This may help avoid potential confusion in similar solutions. However, since sharing of code is not permitted, we still expect the small details to be significantly different.

If it has been determined that students have flagrantly violated this policy, we reserve the right to respond severely.
