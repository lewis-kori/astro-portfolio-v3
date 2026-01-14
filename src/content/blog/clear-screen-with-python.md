---
title: How to clear screen in python terminal
author: Lewis Kori
tags: ["python", "todayilearned", "beginners"]
description: Quick python programming tips
series: Python Quick Tips
dateCreated: 2020-04-09
sponsors: ["Scraper API", "Digital Ocean",]
---

When working with the python interactive shell, you may end up having a cluttered screen. For Windows and Linux users, one can run `cls` or `clear` to clear their screens. But this doesn't seem to cut it while working in the python shell. Here are a few quick tips to achieve this in python.

We need to get into python shell first 😆. To do this, type `python` in your terminal or if you want to access the Django DB shell, `python manage.py shell` will suffice.

### first method

The simplest method is using `ctrl+l` for Linux/OS X terminals.

### second method

Another handy way is by using the [os module](https://docs.python.org/3/library/os.html) that ships with the standard python library. This module provides a portable way of using operating system dependent functionality.

```python
from os import system

clear = lambda: system('clear')
```

We are utilising python's [lambda functions](https://www.w3schools.com/python/python_lambda.asp) to achieve this functionality. By calling on the underlying os `clear` function for UNIX based system and assigning that to our newly created clear function.

This way if we want to clear the screen we can call the function like so `clear()`

for windows systems, the following would work just as well.

```python
from os import system

cls = lambda: system('cls')
```

and call the function in the python shell by running `cls()`

Note that you don't have to declare the function as clear or cls. You can name them whatever you want, as long as you use that name when calling them.

### Other useful tricks you can use with the os module

### Getting the current working directory

```python
import os
os.getcwd()
```

In my case, this returned `'/Users/me/Projects'`

### Changing the current working directory

```python
os.chdir('..')
```

This should work similar to `cd ..` returning `'/Users/me'`

### listing items in a directory

```python
os.listdir('directory_path')
```

similar to the `ls` command.

### get currently logged in user operating the terminal

```python
os.getlogin()
```

For more information on the os module, check out the [documentation](https://docs.python.org/3/library/os.html)

Thanks for reading and feel free to contact me if you have any questions on [twitter](https://twitter.com/lewis_kihiu).
