---
title: Introduction to multi-tenant apps with django
author: Lewis Kori
tags: ["python", "django", "tutorial","intermediate"]
series: Intro to multi-tenant apps with django
cover_image: https://dev-to-uploads.s3.amazonaws.com/i/sjy4g3w65jk57lp7nmkw.png
description: An introduction to building multi-tenant applications with Django and vue.js
dateCreated: 2020-09-06
---

## What are multi-tenant apps

Multi-tenancy is an architecture in which a single instance of a software application serves multiple customers.

But then you might be wondering, "Don't all apps do this? What makes this so special?"

The answer to this lies in the fact that multi-tenant applications allow you to serve multiple customers with one install of the application. Each customer has their data completely isolated in such an architecture. Each customer is called a tenant.

Tenants may be given the ability to customize some parts of the application, such as the color of the user interface (UI) or business rules, but they cannot customize the application's code.

## Approaches to multitenancy

There are various approaches to multi-tenancy. Key among them are:

1. Shared database with a shared schema.
2. Shared database with isolated schemas.
3. Isolated database with an isolated schema.
4. Completely isolated tenants.

For this series, we'll be going by the `Shared database with isolated schemas` approach.
Should you wish to know more about the rest, [check out this awesome book](https://books.agiliq.com/projects/django-multi-tenant/en/latest/index.html) by [agiliq](https://github.com/agiliq).

## Shared database with isolated schemas

In this method, a single database instance keeps the tenant's records. As opposed to linking every tenant's data by a foreign key, as we would normally do, this is common in method 1 indicated previously`Shared database with a shared schema`,
we create a new schema for every new tenant.

## Advantages of multi-tenancy

Multi-tenant applications are especially useful when it comes to building Software As A Service(SAAS) products.
Using this approach instead of single-tenancy, a number of advantages present themselves. Key among them:

1. Affordable cost: Having multiple customers means that the cost of the environment(hosting, databases, and dev time) is shared. Those savings in turn are typically transferred to the cost of the Software.
2. Adding a new customer is easier: in single-tenant apps, a fresh installation of the app is required every time a new customer comes on to the platform. With multi-tenancy, it happens in a matter of seconds using an API call.
3. Convenience in maintaining a single application: As mentioned above, using the single-tenant approach means having multiple instances of the same application. You can imagine the nightmare of maintaining and updating all those instances as your customers grow. Good problems to have of course since you are obviously doing something right 😄, but nonetheless, it will result in a lot of time and resource wastage.

### Live Demo

![defynetech](https://res.cloudinary.com/lewiskori/image/upload/v1598773348/Screenshot_2020-08-30_vue-django-multitenant_wlrpcz.png)

We'll be working towards building a multi-organizational expense tracker. The live demo can be found [here](https://defyne.lewiskori.com/).

#### [Backend code repo](https://github.com/lewis-kori/budgeting-app)

The backend code is written in python(django) and deployed using docker-compose.

The repo has multiple branches representing the application at various stages. We'll move step by step to avoid information overload.

### [Frontend Code repo](https://github.com/lewis-kori/vue-django-multitenant)

The frontend was built with vue.js, specifically nuxt.js, and deployed using [pm2](https://pm2.io/)

In the coming posts, we'll get hands-on by building the functional full-stack application. By the end of the series, hopefully, you should be able to build similar systems.

If you have any questions, feel free to leave a comment. My [Twitter dm](https://twitter.com/lewis_kihiu) is always open and If you liked this walkthrough, [subscribe to my mailing list](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I make new posts.

### open to collaboration

I recently made a collaborations page on my website. Have an interesting project in mind or want to fill a part-time role?
You can now [book a session](/collaborate) with me directly from my site.
