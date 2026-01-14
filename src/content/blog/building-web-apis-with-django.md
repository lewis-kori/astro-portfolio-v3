---
title: Building web APIs with django
author: Lewis Kori
tags: ["python", "django", "tutorial"]
series: REST APIs with django
cover_image: https://res.cloudinary.com/practicaldev/image/fetch/s--LMRJS1Sq--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://res.cloudinary.com/practicaldev/image/fetch/s--k8um9boO--/c_imagga_scale%2Cf_auto%2Cfl_progressive%2Ch_420%2Cq_auto%2Cw_1000/https://thepracticaldev.s3.amazonaws.com/i/joznyhq1xf1yg8gj44g9.jpg
description: An introduction to Rest APIs with python and django
dateCreated: 2019-11-14
sponsors: ["Scraper API", "Digital Ocean"]
---

Hey there, I'd like to introduce you to making web APIs with the popular python web framework, Django.

You've probably heard that the best way to learn is by doing. So in this walkthrough, we'll be building a RESTful API with Django and the django rest framework. The project will be an event scheduler application, sort of like a mini version of Eventbrite or meetup.com.

Key features will be users to create events and other registered users can mark attendance to the created events. We'll also explore how to review an event, putting in place checks to ensure only those members who attended the event can review any given event. Hopefully, by the end of the series, you too can apply some of the concepts here to build your own REST APIs with Django.

You'll find the project's code on [github](https://github.com/lewis-kori/event-scheduler).

The walkthrough will be divided into three major parts for ease of readability so as not to boggle you down with too many concepts at the same time.

 1. Introduction and project setup(You are here).
 2. User registration,authetication and authorization with djoser and JSON web tokens(JWTs).
 3. Events creation and attendance endpoints.

I'll try to follow a similar structure in each post. This will mainly involve:

1. Model creation.
2. Serializers, API views and modifying them to suit our needs.
3. Creating permission classes for our endpoints.
4. Writing automated unit tests for the endpoints.
5. Demo with postman.

## Project setup

For this project, we'll need to have python 3+  installed. You can find the necessary steps [here](https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-local-programming-environment-on-ubuntu-16-04).
Next, we'll need to make virtual environments for installing project dependencies.

### Install virtualenv

   `pip install virtualenv`

#### Create a new virtualenv

   ```virtualenv yourenvname -p python3.6```

#### Activate virtual environment

   ```source yourenvname/bin/activate```
 Run this command within the directory the virtual environment was created in.

Once your virtual environment is activated, there's a number of dependencies we'll be needing for the project:

 1. Django and the [Django rest framework](https://www.django-rest-framework.org/)
  ``` pip install django djangorestframework ```

 2. [Djoser](https://djoser.readthedocs.io/en/latest/introduction.html): REST implementation of Django authentication system. The Djoser library provides a set of Django Rest Framework views and endpoints to handle basic actions such as registration, login, logout, password reset, and account activation. You could build out the features yourself but this has most of the features you may end up building.
  ```pip install djoser```

 3. [django-rest-framework-simplejwt](https://github.com/davesque/django-rest-framework-simplejwt): provides a JSON Web Token authentication backend for the Django REST Framework.
  `pip install djangorestframework_simplejwt`

Typically, if you have a lot of project dependencies in python, it's advisable to put them in a requirements.txt file and install them with one command.
  `pip install -r requirements.txt`

To kick off the new django project, run the following once you've activated the previously created virtual environment.
  `django-admin startproject eventScheduler`

Now to start with the first app that we'll be requiring for the next section:

```bash
cd eventScheduler
python manage.py startapp accounts
```

So far so good I hope.
If you've followed the steps along, our app should now be having its structure as

```bash
./eventScheduler
├── accounts
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations
│   │   └── __init__.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── eventScheduler
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-35.pyc
│   │   └── settings.cpython-35.pyc
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── manage.py
```

Over the next few days, we'll go over the various ways of implementing RESTful APIs with Django, filling in the different sections Indindicated previously.

In case you have any questions, leave a comment below or contact me on [twitter](https://twitter.com/lewis_kihiu) and I'll get back to you as soon as possible.

Thanks.
