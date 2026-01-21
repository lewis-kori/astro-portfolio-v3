---
title: Handy resources and tools for python and django developers
author: Lewis Kori
tags: ["career", "resources", "python", "django"]
description: handy resources for python and django developers
dateCreated: 2020-11-13
sponsors: ["Scraper API", "Digital Ocean"]
canonical_url: https://dev.to/lewiskori/handy-resources-and-tools-for-python-and-django-developers-ecg
---

I've been developing software using Django for a while now and over the years, there's a couple of resources and Libraries that I've come to depend on. They're tried and tested and can be easily extended to suit my needs.

I did another post [highlighting resources for junior devs](/blog/list-of-resources-for-junior-developers/). You can check it out if you're interested.

I'll start the list with some technical content creators who have been invaluable to the success I've had in Django development.

## Content Creators

### Simple is better than complex

[This is a blog](https://simpleisbetterthancomplex.com/) run by Vitor Freitas that provides Django technical knowledge and tips.
I highly recommend it.

### Real Python

Yet another [long running blog](https://realpython.com/). Every python developer has at least encountered the platform once or twice while doing research for their projects.

### thegreencodes

This a [blog](https://marvinkweyu.thegreencodes.com/articles/) run by [Marvin Kweyu](https://twitter.com/marvinus_j) a Kenyan Software developer who describes himself as a Djangonaout. The articles are well researched and written articulately.

### Corey Schaefer

The [youtube channel](https://www.youtube.com/user/schafer5) has a plethora of resources. These are not limited to [django development](https://www.youtube.com/playlist?list=PL-osiE80TeTtoQCKZ03TU5fNfx2UY6U4p) but also python programming in general. His passion and dedication can be felt in every video and you're sure to learn a lot from there.

### The New Boston

This was my [first stop](https://www.youtube.com/playlist?list=PL6gx4Cwl9DGBlmzzFcLgDhKTTfNLfX1IK) while doing web dev and Bucky's contribution to the software world cannot be understated.
Glad to see [he's back to content creation](https://www.youtube.com/watch?v=D-3i1g5YFik) after a long hiatus.

### Talk python FM

[talkpython.fm](https://talkpython.fm/) is a Podcast hosted my Michael Kennedy where they discuss various issues in the python-dev world.
One of their episodes on [django development best Practises](https://talkpython.fm/episodes/show/277/10-tips-every-django-developer-should-know) was particularly useful and eye-opening.

## Online communities

In as much as the content creators have provided information, they may not always be available when you need some pressing questions answered. This is where online communities come in to fill in the gap. These are platforms of like-minded individuals who you can reach out to and in most cases, answer your questions or help you to grow in one way or another.

### dev.to python tag

[dev.to](https://dev.to/) is a community of software developers and people interested in software development.
It organizes their content in form of tags. One of my favourite ones is the [#python](https://dev.to/t/python) tag where people from across the globe regularly post their content here. Be it questions or technical blog posts/podcasts.

### Indiehackers django group

An indie hacker according to the platform is:

1. person building an online project that can generate revenue.

2. person seeking financial independence, creative freedom, and the ability to work on their own schedule.

[indiehackers.com](https://www.indiehackers.com/) is exactly that, a community of online people seeking to build online projects that generate income and enable them to attain financial freedom. Django being one of the biggest software dev frameworks is an enabler of such dreams. So it's only fitting that the platform should have a [dedicated Django group](https://www.indiehackers.com/group/django) for the hundreds of entrepreneurs that trust the framework to turn their dreams into reality.

### PythonKe telegram group

Being a software developer based in Nairobi, Kenya the [telegram group](https://t.me/pythonKE) keeps me informed and grounded on issues affecting devs in my area as well as providing a place I can quickly get my questions answered.

## Software Libraries

### Djangorestframework

[Django REST framework](https://www.django-rest-framework.org/) is a powerful and flexible toolkit for building Web APIs with Django. Django in itself has support for JSON serialization but DRF makes the process so easy.
The API development approach makes it easy to build solutions that enable you to create Frontends with modern javascript frameworks like react, angular and Vue. The possibilities are endless.

### Django cors headers

[django-cors-headers](https://pypi.org/project/django-cors-headers/) Django App that adds Cross-Origin Resource Sharing (CORS) headers to responses. This allows in-browser requests to your Django application from other origins.
Adding CORS headers allows your resources to be accessed on other domains. However, It’s important you understand the implications before adding the headers since you could be unintentionally opening up your site’s private data to others. The cors-headers-site provides a number of resources to help you understand these implications.

### Djoser

The [Djoser](https://djoser.readthedocs.io/en/latest/introduction.html) library provides a set of Django Rest Framework views and endpoints to handle basic actions such as registration, login, logout, password reset, and account activation. You could build out the features yourself but this has most of the features you may end up building.

My previous post highlights [user authentication and authorization with jwts](/blog/user-registration-and-authorization-on-a-django-api-with-djoser-and-json-web-tokens/).
All powered by Djoser.

### Django storages

[Django-storages](https://django-storages.readthedocs.io/en/latest/) is a collection of custom storage backends for Django. The library allows you to configure django to store static and media files to various platforms such as amazon s3, [digital ocean](https://m.do.co/c/2282403be01f), google cloud and Dropbox.

### django channels and djangochannelsrestframework

[djangochannelsrestframework](https://pypi.org/project/djangochannelsrestframework/) provides a DRF like interface for building channels-v2 WebSocket consumers. The library leverages on the power of [djangorestframework](#djangorestframework) and [django-channels](https://channels.readthedocs.io/en/stable/) to provide seamless integration of the two.

Other notable libraries are:

1. [django-allauth](https://django-allauth.readthedocs.io/en/latest/installation.html)
2. [django-filter](https://django-filter.readthedocs.io/en/stable/)
3. [python-decouple](https://pypi.org/project/python-decouple/)

> looking for your next python role? are you in need of qualified python developers?
checkout [recruitment's resource guide.](https://recruitment.com/recommendations/hire-python-developers)

### Conclusion

That's it from me. If you have any additional resources drop them in the comments. I'm curious to see what tools you use.

#### open to collaboration

I recently made a collaborations page on my website. Have an interesting project in mind or want to fill a part-time role?
You can now [book a session](/collaborate) with me directly from my site.
