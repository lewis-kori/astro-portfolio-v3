---
title: User authentication with JWTS in a Django and vue.js multi-tenant app
author: Lewis Kori
tags: ["python", "django", "vue", "tutorial"]
series: Intro to multi-tenant apps with django
description: How to connect a django backend to a vue.js frontend and authenticate with JSON Web Tokens
dateCreated: 2020-12-28
sponsors: ["Scraper API", "Digital Ocean"]
cover_image: https://res.cloudinary.com/practicaldev/image/fetch/s--7SgQOA_K--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/ut9klyik0yzcrsswdzhj.jpg
---

On the last post of the [Django multi-tenant series](/series/intro-to-multi-tenant-apps-with-django/), we set up a Django project from scratch.
In this part, we'll set up the authentication system using JWTs and connect the API to a vue.js frontend. By the end of the post, you'll hopefully understand:

1. What JWTs are and how to implement them using Django.
2. Querying different database schemas using custom Django middleware.
3. Auto refreshing JWTs on expiry using Axios interceptors.

## Overview

The project's source code is open-source and available on [Github](https://github.com/lewis-kori/budgeting-app/tree/users). We'll be working on different branches and building features on top of these branches until the project is complete.

## What are JWTs?

JSON Web Token (JWT) is an Internet standard for creating JSON-based access tokens that assert some number of claims. For example, a server could generate a token that has the flag "logged in as admin" or "logged in like this user" and provide that to a client. The client could then use that token to prove that it is logged in as admin. The tokens are signed by one party's private key (usually the server's) so that both parties can verify that the token is legitimate. The tokens are designed to be compact, URL-safe, and usable especially in a web-browser single-sign-on (SSO) context. JWT claims can be typically used to pass the identity of authenticated users between an identity provider and a service provider.
Unlike token-based authentication, JWTs are not stored in the application's database. This is in effect makes them stateless, unlike the popular rest_auth tokens that are also available in Django.

For an in-depth explanation of how these work, [check out my previous post on user registration and authentication with jwts in django apis](/blog/user-registration-and-authorization-on-a-django-api-with-djoser-and-json-web-tokens/).

## Project set up

We'll start by creating a django app by the name `tenants`, this will house all the logic involved in creating and maintaining the different our app expects to host.

`python manage.py startapp tenant`

From this step, we'll structure our database as follows.

```python
from django.db import models


class CommonInfo(models.Model):
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']
        abstract = True

# table housing the organizations (multiple tenants)
class Tenant(CommonInfo):
    name = models.CharField(max_length=255, unique=True)
    business_phone_number = models.CharField(max_length=250)
    business_email = models.EmailField()
    is_active = models.BooleanField(default=True)
    schema = models.CharField(max_length=255)
    subdomain = models.CharField(max_length=255)
    tenant_id = models.SlugField(blank=True)

    def __str__(self):
        return self.name

# organizational departments db table
class Department(CommonInfo):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        self.name
```

We'll keep the database as simple as possible and for the purpose of keeping the code DRY(Don't Repeat Yourself), we've initialized a CommonInfo class which is abstract. It's here we define the timestamps to use across our models. This class will then be inherited by all models in our project. We could always override the meta options such as ordering on a need basis.

The tenant table will have some data such as the business name, emails, phone number and so on. We'll get to the subdomain and schemas fields later on.

Next up, we'll create a users app by running `python manage.py createapp users` using the CLI. This will house all the user logic including authentication.

The user database tables will have the following structure

```python
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

from tenants.models import Department, Tenant

USER_ROLES = [('Admin', 'Admin'), ('Staff', 'Staff')]


# Define a custom user manager
class UserAccountManager(UserManager):

    # override create user method to accept email as username
    def create_user(self, email=None, password=None, **extra_fields):
        return super().create_user(email,
                                   email=email,
                                   password=password,
                                   **extra_fields)

    # override createsuperuser method to accept email as username
    def create_superuser(self, email=None, password=None, **extra_fields):
        return super().create_superuser(email,
                                        email=email,
                                        password=password,
                                        **extra_fields)


# define our custom user model
class UserAccount(AbstractUser):
    # link user to a tenant
    organization = models.ForeignKey(Tenant,
                                     related_name='users',
                                     on_delete=models.CASCADE,
                                     null=True,
                                     blank=True)
    # tenants can attach their users to different departments
    department = models.ForeignKey(Department,
                                   related_name='users',
                                   on_delete=models.PROTECT,
                                   null=True,
                                   blank=True)
    email = models.EmailField(unique=True)
    photo = models.ImageField(upload_to='users/photos', null=True, blank=True)
    employee_id = models.CharField(max_length=255)
    role = models.CharField(max_length=40, choices=USER_ROLES, default='Staff')

    USERNAME_FIELD = 'email'


    REQUIRED_FIELDS = ['first_name', 'last_name',]

    objects = UserAccountManager()

    class Meta:
        ordering = ['-date_joined']
```

## Users API

In the last part of the series, we installed a number of libraries. Key among them was Djoser and django-rest-framework-simplejwt. We'll be utilizing these for this phase of the project.

In the project's main urls.py include the following URLs.

```python
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),

    # third party apps urls
    path('api/v1/auth/', include('djoser.urls')),
    path('api/v1/auth/', include('djoser.urls.jwt')),
]

# enables django to know location of static and media files
urlpatterns += static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
```

This essentially registers Djoser URLs in our app.
The beauty of it all is that the URLs come shipped with Djoser. We'll only modify our serializer to accept some extra custom fields.

|**Endpoint** | **Description**|
|---|---|
|/auth/users/| Register a new user |
| /auth/users/me/ | retrieve/update the currently logged in user |
| /auth/jwt/create/| create a JWT by passing a valid user in the post request to this endpoint|
|/auth/jwt/refresh/ | get a new JWT once the lifetime of the previously generated one expires |

This is a lot of configuration, but we're almost done.
We'll need to change Django settings.py to reflect the changes.

```python
STATIC_URL = '/static/'
STATIC_ROOT = 'static'

MEDIA_URL = '/media/'
MEDIA_ROOT = 'media'

# api configuration

# disable browsable api in production
DEFAULT_RENDERER_CLASSES = (
    'rest_framework.renderers.JSONRenderer',
)

if DEBUG:
    DEFAULT_RENDERER_CLASSES = DEFAULT_RENDERER_CLASSES + (
        'rest_framework.renderers.BrowsableAPIRenderer',
    )

# REST framework configuration
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        "rest_framework.authentication.SessionAuthentication",
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': DEFAULT_RENDERER_CLASSES
}

DJOSER = {
    "SERIALIZERS": {
        "user_create": "users.apiV1.serializers.users.UserCreateSerializer",
        "user": "users.apiV1.serializers.users.UserSerializer",
        "current_user": "users.apiV1.serializers.users.UserSerializer",
    },
    "LOGIN_FIELD": "email",
    "PASSWORD_RESET_CONFIRM_URL": "auth/password/reset/{uid}/{token}",
}

SIMPLE_JWT = {
    'JWT_ALLOW_REFRESH': True,
    'JWT_EXPIRATION_DELTA': timedelta(minutes=2),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
}
```

For context, we're instructing Django restframework to accept jwt authentication as well as session authentication. In SIMPLE_JWT dictionary, we're enabling refreshing of the tokens and setting an expiration period of 7 days for the refresh token and 2 minutes for the main access token.

Djoser is then given a number of instructions such as overriding the login field from username to email as well as overriding the default serializer to ones that custom made by us, the developers. We'll define these serializers shortly.

### Defining custom user serializers

In the users Django app, we'll create a folder called apiV1 which will be a python package, so don't forget to add an `__init__.py` file here. Then a serializers python package within this folder. Finally, a users.py which will have the following data.

```python
from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# override djoser's user registration serializer
class UserCreateSerializer(UserCreateSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'photo',
            'organization',
            'department',
            'employee_id',
            'role',
            'password',
        )


# override user details serializer
class UserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'photo',
            'organization',
            'department',
            'employee_id',
            'role',
            'is_active',
        )
```

## Adding multi-tenant support

From this part of the post, we can switch to the [multitenants git branch](https://github.com/lewis-kori/budgeting-app/tree/multitenants)

We'll be implementing custom middleware. Our approach to multi-tenancy is one of a shared database with multiple schemas. Therefore, we'll be creating new DB schemas for each new tenant. We'll then need a way of querying the correct schema based on the requesting user and host.
This will be achieved by enabling Django to have wildcard domains. This means having URLs like, `subdomain1.project.com, subdomain2.project.com etc`
For this, we'll set up a number of things.

1. Custom Django commands to auto migrate new schemas.
2. Custom middleware to route traffic to the relevant database schema based on request-host.

### writing custom Django commands

The post is getting lengthy, we'll pick up from here next time :)
To get you familiar with Django custom commands and how to write them, check out my [post on creating custom commands with django](/blog/how-to-create-custom-commands-in-django/).

That's the end of this long post 👀. Thanks for your time.
If you want more of this, subscribe to my [newsletter](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I make new posts. Want to chat? Ping me on [Twitter](https://twitter.com/lewis_kihiu).

### **open to collaboration**

I recently made a collaborations page on my website. Have an interesting project in mind or want to fill a part-time role? You can now [book a session](/collaborate) with me directly from my site.
