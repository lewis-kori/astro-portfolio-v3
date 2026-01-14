---
title: How to set up a new Django project
author: Lewis Kori
tags: ["python", "django", "tutorial"]
series: Intro to multi-tenant apps with django
description: Comprehensive intro to setting up django for multi-tenancy
dateCreated: 2020-12-01
sponsors: ["Scraper API", "Digital Ocean"]
---

This post is a continuation of the [django multi-tenancy series](/series/intro-to-multi-tenant-apps-with-django/). In this part, we'll begin to implement the backend of the multitenant Django app. We'll be setting up a Django project from scratch.

The project source code up until this point is available on the [github setup branch](https://github.com/lewis-kori/budgeting-app/tree/setup).

The project's final outcome can be explored using this [live demo](https://defyne.lewiskori.com/).

![defynetech](https://res.cloudinary.com/lewiskori/image/upload/v1598773348/Screenshot_2020-08-30_vue-django-multitenant_wlrpcz.png)

## Installing project dependencies

For this project, we'll need to have python 3+ installed. You can find the necessary steps in [this digital ocean post](https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-local-programming-environment-on-ubuntu-16-04). Next, we'll need to make virtual environments for installing project dependencies.

### Install virtualenv

`pip install virtualenv`

### Create a new virtualenv

`virtualenv yourenvname -p python3.8`

### Activate virtual environment

`source yourenvname/bin/activate`

Run this command within the directory the virtual environment was created in.

Once your virtual environment is activated, there's a number of dependencies we'll be needing for the project:

- Django and the djangorestframework: for an extensive introduction on how to use these libraries, check out my previous post on [building web apis with django](/blog/building-web-ap-is-with-django/).
- Djoser: REST implementation of Django authentication system. The Djoser library provides a set of Django Rest Framework views and endpoints to handle basic actions such as registration, login, logout, password reset, and account activation
- django-rest-framework-simplejwt: provides a JSON Web Token authentication backend for the Django REST Framework.

My previous post on setting up Django APIs with JWT authentication should get you started on what JWTs are and how to implement them in Django. 😃

- python-decouple: Decouple helps you to organize your settings so that you can change parameters without having to redeploy your app. These settings can be stored in parameters in ini or .env files. The library also allows the definition of comprehensive default values. Case in point;

```python
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG=config('DEBUG', cast=bool, default=False)
```

The repository has a requirements.txt and you can mass install all the dependencies by running `pip install -r requirements.txt`

> Curious on some of the popular dependencies I use with Django? This post has some [handy tools and resources for python programmers.](/blog/handy-resources-and-tools-for-python-and-django-developers/)

To kick off the new Django project, run the following once you've activated the previously created virtual environment.

`django-admin startproject budgeting`

Now to start with the first app that we'll require for the next section:

```text
cd budgeting
python manage.py startapp users
```

`users` will be our first app for this project and we'll put all the authentication logic here.

Next up, we'll cover user authentication in a multi-tenant app powered by django.🤠

### **open to collaboration**

I recently made a collaborations page on my website. Have an interesting project in mind or want to fill a part-time role? You can now [book a session](/collaborate) with me directly from my site.
