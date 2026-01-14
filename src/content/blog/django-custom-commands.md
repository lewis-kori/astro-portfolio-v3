---
title: How to create custom commands in django
author: Lewis Kori
tags: ["tutorial", "django", "python"]
description: How to write custom django command line commands
sponsors: ["Scraper API", "Digital Ocean"]
dateCreated: 2020-09-15
---

When developing django projects, there comes a need to write one-off scripts that automate a particular task. Here are some use cases I've found myself applying before we continue with the implementation.

1. Cleaning up faulty data columns en masse.
2. Migrating multiple schemas in a [multitenant application](/series/intro-to-multi-tenant-apps-with-django/)

There are two ways we can go about running these types of commands in django. Write a normal python script which you can then call by running `python file_name.py`, and the other is by utilizing django-admin commands. These are run by calling `python manage.py command_name`.

For this post, I'll demonstrate with a blog app having just 3 database tables, User, Category, and Post.
I've assumed you are comfortable initializing a django project, but in case you aren't, [this post](/blog/building-web-ap-is-with-django/) should help you out.

The source code for this post can be found [here](https://github.com/lewis-kori/django-commands).

## Normal python script method

For the first example, we'll try to list all system users with the script below

```python
from django.contrib.auth import get_user_model

User = get_user_model()

# retrieve all users
users = User.objects.all()

# loop through all users
for user in users:
    print(f'user is {user.get_full_name()} and their username is {user.get_username()}')
```

You can name the script list_users.py and run it by `python list_users.py`

Immediately you run this, you'll be met with an error,

```text
django.core.exceptions.ImproperlyConfigured: Requested setting AUTH_USER_MODEL, but settings are not configured. You must either define the environment variable DJANGO_SETTINGS_MODULE or call settings.configure() before accessing settings.
```

One would have assumed that since you are in django's project directory, the script would run with no problem.
However, this is not the case. This is because the script is not aware of which project the script is to apply to. You could have multiple projects in a single machine or virtual environment. So it's important to give the script some context.

We'll do this by slightly modifying our script.

```python
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projectname.settings')

import django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

users = User.objects.all()

for user in users:
    print(f'user is {user.get_full_name()} and their username is {user.get_username()}')
```

Here, we specify the project's settings and not only that, call `django.setup()` method. The method configures the settings, logging and populates the app registry. In short, we are making the script aware of our project context.

In case you're curious about the os module, my [previous post](/blog/how-to-clear-screen-in-python-terminal/) provides more insight.

**Note that the order of import is important and must remain like so.**

If we run the script again, all our users should be printed to the terminal 👯‍♂️.

Next up we'll initialize an app called posts by running `django-admin startapp posts`.

The app will house our blog posts models.

<https://gist.github.com/lewis-kori/0c8f81397b1b0fc7a059c3f17a8e2bcf>

For this example, we'll create an instance of a blog post from the command line. Initialize a script and name it `create_post.py`

```python
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'commands.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from posts.models import Category, Post

User = get_user_model()

def select_category():
    # retrieve categories. (You can create some examples from the django admin)
    categories = Category.objects.all().order_by('created_at')
    print('Please select a category for your post: ')
    for category in categories:
        print(f'{category.id}: {category}')
    category_id = input()
    category = Category.objects.get(id=category_id)
    return category


def select_author():
    # retrieve all users
    users = User.objects.all()
    print('Please select an author for your post: ')
    for user in users:
        print(f'{user.id}: {user}')
    user_id = input()
    user = User.objects.get(id=user_id)
    return user



def create_post():
    title = input("Title of your post: ")
    content = input("Long post content: ")
    category = select_category()
    author = select_author()
    Post(**locals()).save()
    print('Post created successfully!')

if __name__ == "__main__":
    create_post()
```

Here, we are creating an instance of a blog post. Notice how we handle the ForeignKey relations? Ensure that you assign an object instance of the relevant DB table to that field.

By running python create_post.py, we are then prompted for some input.

## Writing custom django management commands method

As aforementioned, django-admin commands are executed by running `python manage.py command_name` an example of these are `runserver, migrate and collectstatic`. To get a list of available commands run `python manage.py help`.
This displays a list of the available commands as well as the django app folder in which they're housed.

To register a custom admin command, add a `management\commands` directory in your django app folder.
In our case, it's going to be in posts\management\commands.

Once this is set up, we can then initialize our custom scripts in the commands folder. For the first example, we'll write a command that flags the blog posts created before as published.

To do this create a file and name it `publish_post.py`

```python
from django.core.management.base import BaseCommand, CommandError
from posts.models import Category, Post

class Command(BaseCommand):
    help = 'Marks the specified blog post as published.'

    # allows for command line args
    def add_arguments(self, parser):
        parser.add_argument('post_id', type=int)

    def handle(self, *args, **options):
        try:
            post = Post.objects.get(id=options['post_id'])
        except Post.DoesNotExist:
            raise CommandError(f'Post with id {options["post_id"]} does not exist')
        if post.published:
            self.stdout.write(self.style.ERROR(f'Post: {post.title} was already published'))
        else:
            post.published = True
            post.save()
            self.stdout.write(self.style.SUCCESS(f'Post: {post.title} successfully published'))
```

Django management command is composed of a class named Command which inherits from BaseCommand.

To handle arguments, the class utilizes [argparse](https://docs.python.org/3/library/argparse.html). The method `add_arguments` allows our function to receive arguments.

In our case, the function is expecting an argument that will be assigned the key `post_id`

The `handle()` function then evaluates the input and executes our logic.

In the example above, the kind of argument expected is called a positional argument and must be provided for the function to run.
To do this, we run `python manage.py publish_post 1 (or any post primary key)`

Another type of argument called Optional argument can be applied to the methods, as the name implies, the lack of these will not hinder the function execution.

An example is provided below. We'll initialize a file and name it `edit_post.py`. Populating it with the code below.

```python
from django.core.management.base import BaseCommand, CommandError
from posts.models import Category, Post

class Command(BaseCommand):
    help = 'Edits the specified blog post.'

    def add_arguments(self, parser):
        parser.add_argument('post_id', type=int)

        # optional arguments
        parser.add_argument('-t', '--title',type=str, help='Indicate new name of the blog post.')
        parser.add_argument('-c', '--content',type=str, help='Indicate new blog post content.')

    def handle(self, *args, **options):
        title = options['title']
        content = options['content']
        try:
            post = Post.objects.get(id=options['post_id'])
        except Post.DoesNotExist:
            raise CommandError(f'Post with id {options["post_id"]} does not exist')

        if title or content:
            if title:
                old_title = post.title
                post.title = title
                post.save()
                self.stdout.write(self.style.SUCCESS(f'Post: {old_title} has been update with a new title, {post.title}'))
            if content:
                post.content = content
                post.save()
                self.stdout.write(self.style.SUCCESS('Post: has been update with new text content.'))
        else:
            self.stdout.write(self.style.NOTICE('Post content remains the same as no arguments were given.'))
```

Here we are just editing a blog post title or content.
To do this we can run `python manage.py edit_post 2 -t "new title"` to edit just the title

or `python manage.py edit_post -c "new content"`
to edit just the content.
We can provide both arguments should we wish to edit both title and content by `python manage.py edit_post 2 -t "new title again" -c "new content again".

### Extra resources

1. [Django docs](https://docs.djangoproject.com/en/3.1/howto/custom-management-commands/)
2. [Simple is better than complex](https://simpleisbetterthancomplex.com/tutorial/2018/08/27/how-to-create-custom-django-management-commands.html#cron-job)

If you have any questions, feel free to leave a comment. My [Twitter dm](https://twitter.com/lewis_kihiu) is always open and If you liked this walkthrough, [subscribe to my mailing list](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I make new posts.

### open to collaboration

I recently made a collaborations page on my website. Have an interesting project in mind or want to fill a part-time role?
You can now [book a session](/collaborate) with me directly from my site.
