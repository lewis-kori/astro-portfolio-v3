---
title: User registration and authorization on a django API with djoser and JSON web tokens.
author: Lewis Kori
tags: ["python", "django", "tutorial"]
series: REST APIs with django
cover_image: https://res.cloudinary.com/practicaldev/image/fetch/s--LMRJS1Sq--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://res.cloudinary.com/practicaldev/image/fetch/s--k8um9boO--/c_imagga_scale%2Cf_auto%2Cfl_progressive%2Ch_420%2Cq_auto%2Cw_1000/https://thepracticaldev.s3.amazonaws.com/i/joznyhq1xf1yg8gj44g9.jpg
description: user authentication using django restframework,djoser and json web token authorization
dateCreated: 2019-11-17
sponsors: ["Scraper API", "Digital Ocean"]
---

In the [first part](https://dev.to/lewiskori/building-web-apis-with-django-lb4) of the intro django rest framework, we set up the project and did an overview of what the project is all about. Check it out if you haven't yet.

## Overview

In this section, we'll be going through user registration with the django rest framework and utilizing JSON web tokens for authorization. We'll also be extending the default User model that ships with django so as to allow us to capture more details about our system's users.

The project is available on [github](https://github.com/lewis-kori/event-scheduler).

### What is a JSON Web token

JSON Web Token (JWT) is an Internet standard for creating JSON-based access tokens that assert some number of claims. For example, a server could generate a token that has the flag "logged in as admin" or "logged in like this user" and provide that to a client. The client could then use that token to prove that it is logged in as admin. The tokens are signed by one party's private key (usually the server's) so that both parties can verify that the token is legitimate. The tokens are designed to be compact, URL-safe, and usable especially in a web-browser single-sign-on (SSO) context. JWT claims can be typically used to pass the identity of authenticated users between an identity provider and a service provider.
Unlike token-based authentication, JWTs are not stored in the application's database. For a more in-depth explanation of how the JWTs work, check out this awesome video.

<https://www.youtube.com/watch?v=7Q17ubqLfaM>

### Project set up

Before proceeding, let's take a look at some of the endpoints we'll be utilizing in this section.

| **Endpoint**                | **Description**                                                           |
| --------------------------- | ------------------------------------------------------------------------- |
| /auth/users/                | Register a new user                                                       |
| /auth/users/me/             | retrieve/update the currently logged in user                              |
| /auth/jwt/create/           | create a JWT by passing a valid user in the post request to this endpoint |
| /auth/jwt/refresh/          | get a new JWT once the lifetime of the previously generated one expires   |
| /api/accounts/all-profiles/ | get all user profiles and create a new one                                |
| /api/accounts/profile/id/   | detail view of a user's profile                                           |

Those may seem like a handful but the good news is that djoser has done most of the heavy lifting for us. All the endpoints starting with *auth* are djoser generated.

Getting back to the first part of the series, we installed some python packages. We'll need to add those packages to the project's settings.py file so as to utilize them in our django project.

<https://gist.github.com/lewis-kori/43f2555ceaea386a5602c1d42074e230>

Don't forget to change the authentication settings for DRF to reflect the usage of JWTS.

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

With this system set up, it's important to register routes for the endpoints that'll be used within the project. By registering the paths to the project's main urls.py file we can access the different endpoints we'll need later on.

<https://gist.github.com/lewis-kori/937d34b8e81944a784760e83ad50d9f6>

### User profile model

Django ships with a default user model with fields like username, passwords and email input, in some cases, however, these fields may not be enough prompting us to extend the model or create your custom user model. In this case, we'll be extending the user model because we need to have a way to differentiate users. There'll be two user types. Those that can organize events and those that just want to attend events.

```python
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class userProfile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="profile")
    description=models.TextField(blank=True,null=True)
    location=models.CharField(max_length=30,blank=True)
    date_joined=models.DateTimeField(auto_now_add=True)
    updated_on=models.DateTimeField(auto_now=True)
    is_organizer=models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
```

We'll also create a post_save signal to automatically create the user profile for new users that register to the platform.
For this, create a signals.py file and write the code below.

```python
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import userProfile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        userProfile.objects.create(user=instance)
```

For a detailed explanation on how signals work, [this](https://docs.djangoproject.com/en/2.2/topics/signals/) is a good starting place
Don't forget to register the signal in your app.py file like so:

```python
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        import accounts.signals
```

### Serializers

With the basic set up out of the way, let's get to the API implementation.
If you are new to django, serializers allow complex data such as querysets and model instances to be converted to native python data types that can be easily rendered to formats like JSON. This is called serialization. They also allow deserialization after first validating incoming request data.

Within the app's directory, we'll initiate a serializers.py file and input the code below:

```python
from rest_framework import serializers
from .models import userProfile
class userProfileSerializer(serializers.ModelSerializer):
    user=serializers.StringRelatedField(read_only=True)
    class Meta:
        model=userProfile
        fields='__all__'
```

Going line by line, what we did is import the *serializers* class from rest_framework as well as the model we want to serialize. In this case, it's the userProfile model.

Our first serializer is userProfileSerializer. This will inherit from the ModelSerializer class in django. As you noted before, the userProfile model was linked to the default user model in django. We'll indicate this field as read_only. This means that the field will be included in the APIs output but won't be included during Create or Update operations on the endpoint. To populate this field, we'll create a method to automatically fill the field with the request user.

There are other serializer types in rest_framework such as ListSerializer and HyperlinkedModelSerializer. For a comprehensive guide on the serializers, the rest framework [docs](https://www.django-rest-framework.org/api-guide/serializers/) are a great place to start.

## API views

To access data in an API, we use endpoints. This are basically URL routes. How django works is that each url is linked to a controller called a view. The controllers can either be class based or function based.
After routing has determined which controller to use for a request, your controller is responsible for making sense of the request and producing the appropriate output.

One implementation of this controller in rest framework are the [generic views](https://www.django-rest-framework.org/api-guide/generic-views/). These were developed as a shortcut for common usage patterns. They take certain common idioms and patterns found in view development and abstract them so that you can quickly write common views of data without having to repeat yourself.
Some of these views are CreateAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView and the list goes on.

We'll implement the ListCreateAPIView and RetrieveUpdateDestroyAPIView.

```python
from rest_framework.generics import (ListCreateAPIView,RetrieveUpdateDestroyAPIView,)
from rest_framework.permissions import IsAuthenticated
from .models import userProfile
from .permissions import IsOwnerProfileOrReadOnly
from .serializers import userProfileSerializer

# Create your views here.

class UserProfileListCreateView(ListCreateAPIView):
    queryset=userProfile.objects.all()
    serializer_class=userProfileSerializer
    permission_classes=[IsAuthenticated]

    def perform_create(self, serializer):
        user=self.request.user
        serializer.save(user=user)


class userProfileDetailView(RetrieveUpdateDestroyAPIView):
    queryset=userProfile.objects.all()
    serializer_class=userProfileSerializer
    permission_classes=[IsOwnerProfileOrReadOnly,IsAuthenticated]
```

Each API view is linked to the serializer class we had previously created.
One thing we notice is the `perform_create` method in the *UserProfileListCreateView* class. This is how we indicate how we want to create the serializer. In this case, we wanted to populate the read_only user field with the requesting user then populate the serializer with this value.

The views are then linked to a URL endpoint in the app's urls.py file:

```python
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import UserProfileListCreateView, userProfileDetailView

urlpatterns = [
    #gets all user profiles and create a new profile
    path("all-profiles",UserProfileListCreateView.as_view(),name="all-profiles"),
   # retrieves profile details of the currently logged in user
    path("profile/<int:pk>",userProfileDetailView.as_view(),name="profile"),
]

```

### Permissions

Permissions determine whether a request should be granted or denied access.
Django rest framework ships with several. I won't get into those as it's [documentation](https://www.django-rest-framework.org/api-guide/permissions/) is quite comprehensive about them. However, let's draw our attention to the ``` IsOwnerProfileOrReadOnly ``` permission class.

This is a custom permission implementation. We'll initialize a permission.py file and populate it with the code below:

```python
from rest_framework.permissions import BasePermission,SAFE_METHODS

class IsOwnerProfileOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user==request.user

```

By overriding the BasePermission class, we can create our own permission. This class has two methods that we can override.

`.has_permission() and .has_object_permission()`

Both must return True if a request is to be granted and False if the request is denied. SAFE_METHODS are GET, OPTIONS, and HEAD.

In our custom permission class, we are checking if the requesting user is similar to the object's user field. This will ensure that a profile owner is the only one that can change their information.

## API tests

Almost done now 🤣. We'll write some tests to ensure our endpoints are working as required.

```python
class userProfileTestCase(APITestCase):
    profile_list_url=reverse('all-profiles')
    def setUp(self):
        # create a new user making a post request to djoser endpoint
        self.user=self.client.post('/auth/users/',data={'username':'mario','password':'i-keep-jumping'})
        # obtain a json web token for the newly created user
        response=self.client.post('/auth/jwt/create/',data={'username':'mario','password':'i-keep-jumping'})
        self.token=response.data['access']
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer '+self.token)

    # retrieve a list of all user profiles while the request user is authenticated
    def test_userprofile_list_authenticated(self):
        response=self.client.get(self.profile_list_url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

    # retrieve a list of all user profiles while the request user is unauthenticated
    def test_userprofile_list_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response=self.client.get(self.profile_list_url)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)

    # check to retrieve the profile details of the authenticated user
    def test_userprofile_detail_retrieve(self):
        response=self.client.get(reverse('profile',kwargs={'pk':1}))
        # print(response.data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)


    # populate the user profile that was automatically created using the signals
    def test_userprofile_profile(self):
        profile_data={'description':'I am a very famous game character','location':'nintendo world','is_creator':'true',}
        response=self.client.put(reverse('profile',kwargs={'pk':1}),data=profile_data)
        print(response.data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
```

To run the tests, run the command `python manage.py test` in your terminal.

If you are feeling a bit confused, here's the project structure up to this point.

```bash
eventScheduler  
├── accounts
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations
│   │   └── __init__.py
│   ├── models.py
│   ├── permissions.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
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

## Demo with postman

### User registration

![user_registration](https://thepracticaldev.s3.amazonaws.com/i/gjmbvikwd2qrcbaf7b2a.PNG)

### Get access token

 ![AccessToken](https://thepracticaldev.s3.amazonaws.com/i/6ylvefv3kcgjji4fd8vw.PNG)

### Retrieve/update the authenticated user

We'll be passing the get request as the user `Batman`. To do this, every post request must have a JWT to identify the user as a valid user. In post man, we can place the token in the auth section and indicating you want to use a Bearer token. You'll then paste in the access token generated above.
![CurrentUser](https://thepracticaldev.s3.amazonaws.com/i/uro3pc910wtqrutp6hov.PNG)

### Get all user Profiles

This will be through a GET request.
![Profiles](https://thepracticaldev.s3.amazonaws.com/i/q2g3hdbvii6sur5vthey.PNG)

### Update authenticated User

Through a PUT request
![Update Profile](https://thepracticaldev.s3.amazonaws.com/i/nq3ym5f5oneixpeuvrq8.PNG)

## Additional resources

1. [Official django rest framework docs](https://www.django-rest-framework.org/).
2. [djoser documenentation](https://djoser.readthedocs.io/en).
3. [Michele Saba's Udemy course](https://www.udemy.com/course/the-complete-guide-to-django-rest-framework-and-vue-js/)

That's the end of this looong post 👀. I hope with this information you too can make your own RESTful API with django.
If you have any questions, feel free to leave a comment.

### open to collaboration

I recently made a collaborations page on my website. Have an interesting project in mind or want to fill a part-time role?
You can now [book a session](/collaborate) with me directly from my site.
