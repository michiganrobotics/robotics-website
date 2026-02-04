---
title: "ROB 502: Programming for Robotics: Class 0"
date: "2020-08-11"
---

## Linux and the Bash Terminal

Almost everything we do in ROB 502 will be on the Linux command line, or terminal. You can open the terminal by going to “applications” in the top left corner of your screen, typing “terminal”, and hitting enter. The program that actually manages the terminal window is called a “shell”, and the most common shell is called bash (Bourne again shell). While there are many other shells you can install and use, most of the information online is about bash. Including the word “bash” in any online searches will probably help you find relevant results!

The basic philosophy of the Linux command line is to have lots of very simple commands and to make it easy to use these commands together. We can either run these commands directly on the command line, or we can put these commands into a script file and run the whole script in a single command. Whenever we have commands to enter in this document, we will use a “code block” that looks like `this` or:

```
this
```

You can often take this as a cue, that this text can be entered onto the command line, either as a full command or as part of one. If there are multiple lines, you should run them one by one. Be careful because commands often have to be exact and a change in spaces or capitalization can make a command not work! Unlike in most programs, to copy text you need to use Ctrl+Shift+C and to paste you need Ctrl+Shift+V. Actually, Ctrl+C will quit a program!

Many commands will have some amount of output that appears on the screen after the command you enter, but not all will.

In our next class we will really dig into bash commands, how to put them together, and how to write scripts with them. Today, we will mostly just copy and paste commands I have written for you.

## Getting started with the class submission system

We will be using an automated submission system for “in-class” problems and homework. This system will allow you to get instant feedback on the correctness of your solutions, check your grades, check due-dates, and answer “clicker-style” questions during class discussions.

This class system is based on the software Git:

Git is a piece of software for managing code when multiple people are making various changes to that code on multiple computers. Even though you will work on your code for this class by yourself, Git will make it easy for me to access your code for automatic grading and supply you with basic code and resources for assignments. Git will also help prevent you from losing your hard work, because every time you _commit_ your code to gitlab.eecs.umich.edu (which we are using for class instead of github.com), that version of your code will be saved for you.

## Setup based on your operating system

Regardless of whether the computer you use for this class is on Linux, Mac OS, or Windows 10, you should be able to do everything in almost the same way, just with a small amount of different setup right now in the beginning. If you are running Windows 10 or Mac OS, there are additional steps further below to complete _first_ before continuing with the main Ubuntu instructions. Please feel free to ask questions and get help with this setup! The main goal of today is to complete all this setup.

## On Ubuntu/Other Linux

Open up a terminal. You should be in your home directory, indicated by the prompt ending with `~$` (or similar). If you are not, you can get there by running `cd ~`

### Install GCC (GNU Compiler Collection)

Install GCC on Ubuntu like so:

```
sudo apt install gcc
```

This may be different on other flavors of Linux.

### Initial gitlab repository setup

We will be using `git` to work with our code in this class. Git is a version control system, meaning that it helps you keep track of all the changes you make to your code and _commit_ over time. This way you can feel easy about experimenting with your code because old versions of it will be kept safe.

We will be using the EECS Gitlab at [https://gitlab.eecs.umich.edu](https://gitlab.eecs.umich.edu) to hold and access your git code repository. Make sure you can log in to this website.

Next we need to give your computer automatic access to your gitlab account. We will be using an SSH (secure shell) key to do this. This key is essentially a file that holds a very long password (private key) and another file that holds a very long username (public key).

Below this paragraph we have two commands on separate lines. When you see commands in this font, you should copy and paste the lines one by one into the terminal to run. To paste to the terminal you need to use Ctrl-Shift-V. Replace `uniqid` with your own uniqid and hit enter several times to accept the default options. You don’t want to add a password here because that will make using the key extremely inconvenient.

```
ssh-keygen -t ed25519 -C "uniqid@umich.edu"
```

Then you can run this command to read the _public key_ that was just made:

```
cat ~/.ssh/id_ed25519.pub
```

Use Ctrl-Shift-C to copy the output of the `cat` command. It should start with `ssh-ed25519` and end with your email address. Paste it into the ‘Key’ text box of this page: [https://gitlab.eecs.umich.edu/profile/keys](https://gitlab.eecs.umich.edu/profile/keys) and hit ‘Add key’. Verify that it is working by running:

```
ssh -T git@gitlab.eecs.umich.edu
```

If it doesn’t work the first time, please get someone else to check your steps because if you make more than one or two errors here you will get temporarily blocked!

We are providing a git repository template that will provide a common directory structure for automatic grading of problems and assignments. Clone this repository into your home directory with:

```
cd ~
git clone https://umbrella.eecs.umich.edu/acshikh/p4robotics-templates.git rob502
```

Move into the repository folder with `cd rob502`

Right now this is only a clone of the class template. You need to make it into a real repository of your own on gitlab. We do this by changing the _origin_ (of course, use your own uniqid):

```
git remote set-url origin git@gitlab.eecs.umich.edu:uniqid/rob502.git
```

So that we can still keep track of changes made to the original template, we call it `upstream` and tell git to remember where it is:

```
git remote add upstream https://umbrella.eecs.umich.edu/acshikh/p4robotics-templates.git
```

Now run `git push origin master` and your repository will be created on gitlab!

The repository also includes a configuration script we need to run:

```
bash scripts/p4r-env-setup.sh
source ~/.bashrc
```

We use `source ~/.bashrc` to immediately make the changes to bash’s configuration take effect. This means we will be able to immediately use the class scripts we have installed instead of needing to close and reopen the terminal to have access to them.

For the auto-grade system to work, it needs to have permission to pull from your repository. Navigate to [https://gitlab.eecs.umich.edu/uniqid/rob502/-/project\_members](https://gitlab.eecs.umich.edu/uniqid/rob502/-/project_members) (with your uniqid!) and add `acshikh` as a “reporter”.

### Configure Git

So that Git can correctly mark who you are when you “commit” code, run the following comamnds with your name and email address:

```
git config --global user.name "First Last"
git config --global user.email "uniqid@umich.edu"
```

Also, sometimes Git will need you to write a message to explain why you made certain changes or when something tricky happens. By default, Git will open the text-based editor Vim to request your input. Because Vim is not very beginner friendly, run the following command to tell Git to use the simple nano editor instead:

```
git config --global core.editor nano
```

### Testing the class system

Enter the folder for our next class, and check if you have completed it:

```
cd ~/rob502/class1
p4r-check
```

The system should tell you that you have not submitted anything for it yet, and thus have 0%. Congrats! Your computer is all set up!

## On Windows 10

Windows has an impressive built-in virtualization system for running Linux called the Windows Subsystem for Linux (WSL). Follow Microsoft’s instructions for installing WSL2 here: [https://docs.microsoft.com/en-us/windows/wsl/install-win10](https://docs.microsoft.com/en-us/windows/wsl/install-win10) If you have trouble, try following the extra instructions at [https://cybergav.in/2020/08/28/wsl2-on-windows-10/](https://cybergav.in/2020/08/28/wsl2-on-windows-10/) and download the appropriate Windows update file for your computer, which is probably the x64 with your Windows build version.

If your computer only supports WSL 1, that should also be fine, but won’t be as fast and some commands might not work. You should install the Ubuntu 20.04 distribution from the Microsoft Store.

From Windows PowerShell here are some useful commands:

- To check your version of Windows: `winver`
- To check your version of WSL: `wsl -l -v`
- To change your version from WSL 1 to WSL 2 (with the same version of Ubuntu as listed in `wsl -l -v`): `wsl --set-version Ubuntu-20.04 2`

NOTE: There is a difference between your _Windows_ home directory, with a path like `/mnt/c/Users/UserName` and your _WSL_ home directory, with a path like `/home/username` or abbreviated as `~`. As long as you have WSL2, I recommend using _WSL_ home directory because that is so much more similar to a normal Linux set up. If you ever want to open a WSL folder in Explorer, run `explorer.exe .` (note the dot).

Also install the Windows Terminal from the Microsoft Store. This will give you a much cleaner experience than the older Windows console, such as being able to have multiple tabs open at the same time and a more readable color palette. Tabs in Windows Terminal will open up in the Windows Powershell by default. Just run the command `bash` to enter Ubuntu.

Once you have Ubuntu running, continue the instructions here under Ubuntu/Other Linux.

## On Mac OS

On Mac, you can copy and paste from the terminal directly with Command-C and Command-V, unlike in Linux or Windows.

In order to use the same tools on Mac OS as we do on Linux, we have to install several tools. First, we install a baseline set of developer tools from Apple. Then we install [Homebrew](https://brew.sh/), a tool for installing software normally used on Linux. Then we can install GCC (the compiler and related tools we are using) and Git.

Note that newer distributions of Mac OS have started using `zsh` as the default shell instead of `bash`. You will know because your terminal window will say “zsh” in its title. For most of this class using `zsh` will be just fine, but for class1 on bash, you should make sure to run the command `bash` to switch to it!

### Install Apple’s “XCode Command Line Developer Tools”

Run the following command, which should cause a GUI window to appear giving you several options. Click on the “Install” option and wait for it to complete.

```
xcode-select --install
```

### Install Homebrew

Run the following command and wait for it to install (it might take awhile):

```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

### Install GCC (GNU Compiler Collection) and Git

```
brew install gcc
brew install git
```

First, open a terminal and test whether your computer already has Git installed:

```
git --version
```

If it is already installed (but is older than the current version of about 2.27.0), take note of that version because we will want to make sure the newer version is active after we install it.

By default, Mac OS already has a “gcc” available on the command line, but it is actually a link to a different C compiler generally favored by Apple called Clang. We want to use the real gcc because of certain features we use in this class. To not get in the way of the operating system, Homebrew will install gcc with its version number, for example as `gcc-10`. If you get a different version than GCC 10, just make sure to replace `gcc-10` everywhere below with your actual version.

To make sure that `gcc` points to the version we just installed, we have to make a link that points from `gcc` to `gcc-10` and then make this new `gcc` have priority over the old one. In addition, your computer will likely also have an older version of Git installed, so we will want our new version of Git to also take precedence over the old one. We will change the computer’s _path_ to tell it to look for and use the newer versions we just installed.

First we will make a directory for programs specific to your user:

```
mkdir -p ~/.local/bin
```

Then we will make a link from `gcc-10` that we just installed to `gcc` in our new directory:

```
ln -s /usr/local/bin/gcc-10 ~/.local/bin/gcc
```

Now, to change the path, open up your terminal configuration file `~/.bashrc`:

```
nano ~/.bashrc
```

And paste the following lines into it, pressing Ctrl-X to close and then `y` to save:

```
export PATH=~/.local/bin:/usr/local/bin:$PATH
```

This says that when looking for a program, the computer should first check for it in `~/.local/bin` and then look in `/usr/local/bin` and then it should check whatever it would have before we changed this setting.

Finally, either close and reopen the terminal, or reload those settings by running `source ~/.bashrc`

Now test that you get the correct versions of these running:

```
gcc --version
git --version
```

It should report GCC version 10 or greater and Git version 2.28 or greater.

Finally, continue the instructions above, under Ubuntu/Other Linux. You won’t need to run any `sudo apt install` commands.
