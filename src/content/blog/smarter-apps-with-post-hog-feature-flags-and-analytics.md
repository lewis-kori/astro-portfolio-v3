---
title: "Smarter Apps with PostHog: Feature Flags & Analytics"
author: Lewis Kori
tags: ["python", "django", "posthog", "feature flags", "product analytics", "saas", "multi-tenant", "tutorial"]
series: Intro to multi-tenant apps with django
description: Learn how to integrate PostHog into a production Django application. This tutorial covers setting up a robust singleton client, identifying users and groups via middleware, and implementing robust, plan-based feature flags for a multi-tenant SaaS.
dateCreated: 2025-09-11
sponsors: ["Scraper API"]
---

Building an app, whether it's a quick side project or a full-fledged SaaS solution, is an exciting adventure. You eagerly ship a new feature, hoping for enthusiastic feedback, but often find yourself waiting in silence. The reality is, without clear insights, we often fly blind. We move fast, but sometimes we end up going in circles.

That's where analytics and feature flags come in. They aren't just for the major players anymore. These tools are essential for understanding what's working, what's not, and how users are *truly* engaging with your product.

#### Why Django Developers Should Care

As a Django developer, I love the "batteries-included" philosophy. It lets us build robust, secure backends at incredible speed. But when it comes to product-led growth—understanding user behaviour, rolling out features safely, and running experiments—we often have to piece together solutions. Integrating separate analytics packages, building a feature toggle system from scratch... it can feel like a puzzle.

This is why I've been so impressed with [PostHog](https://posthog.com/). It’s a platform built for product engineers that combines analytics, feature flags, and session replay into a single, cohesive solution. For a Django developer, this means you can spend less time integrating tools and more time building what matters, backed by real data.

Let’s dive into how PostHog can make your Django app smarter, safer and more data-driven.

-----

### Pre-requisites

Before following along, make sure you have the basics in place:

* **Python 3.10+** and **Django 4.0+** (the examples assume a modern Django stack).
* A working **multi-tenant setup** (e.g. using [django-tenants](https://django-tenants.readthedocs.io/) or a similar package), since group identification is demonstrated with `request.tenant`. - Optional
* An existing **PostHog account** with a project API key. You can sign up for free at [posthog.com](https://posthog.com/).
* Familiarity with **Django middleware** and how to add custom classes to the `MIDDLEWARE` list.
* Optional but recommended: **Docker** if you prefer to self-host PostHog instead of using their cloud service.

With these in place, you’ll be able to plug in PostHog confidently and follow every step without hitting blockers.

### Getting Started: A Production-Ready Setup

Before you can use feature flags or track events, you need to get PostHog configured. Instead of using global variables, let's build a robust, [singleton client](https://refactoring.guru/design-patterns/singleton) and a [context-aware middleware](https://docs.djangoproject.com/en/5.2/topics/http/middleware/). This pattern is safer for concurrent requests and much easier to manage.

**Step 1: Install the Library**
First, add the official Python library to your project:

```bash
pip install posthog
```

**Step 2: Configure Your `settings.py`**
Add your PostHog API key to your Django settings. It's best practice to load this from an environment variable.

```python
# in settings.py
POSTHOG_API_KEY = env("POSTHOG_API_KEY", default=None)
POSTHOG_HOST = env("POSTHOG_HOST", default="https://app.posthog.com")
POSTHOG_ENABLED = env("POSTHOG_ENABLED", default=True)
```

**Step 3: Create a Centralised PostHog Client**
This is the core of a robust integration. A [singleton client](https://refactoring.guru/design-patterns/singleton) encapsulates the setup logic and ensures the client is initialised only once for your entire application. Create a new file for it.

```python
# In a new file, e.g., myapp/integrations/posthog_client.py
import logging

import posthog
from django.conf import settings

logger = logging.getLogger(__name__)

class PostHogClient:
    """
    A singleton client for PostHog to provide a central, configured
    instance for the entire application.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PostHogClient, cls).__new__(cls)
            api_key = getattr(settings, "POSTHOG_API_KEY", None)
            if not api_key:
                logger.warning("POSTHOG_API_KEY not found. PostHog will be disabled.")
                cls._instance.client = None
            else:
                cls._instance.client = posthog.Client(
                    project_api_key=api_key,
                    host=getattr(settings, "POSTHOG_HOST", "https://app.posthog.com"),
                )
        return cls._instance

    def is_feature_enabled(self, feature_name: str, user, group=None) -> bool:
        if not self.client:
            return False
        
        groups = {"organization": str(group.id)} if group else {}
        group_properties = {"organization": {"name": group.name, "plan": group.plan}} if group else {}

        try:
            return self.client.feature_enabled(
                key=feature_name,
                distinct_id=str(user.id),
                groups=groups,
                group_properties=group_properties
            )
        except Exception as e:
            logger.error(f"Failed to check PostHog feature flag '{feature_name}': {e}")
            return False

# Create the shared singleton instance for your project to import
posthog_client = PostHogClient()
```

**Step 4: Create the Identification Middleware**
For PostHog to work correctly, it needs to know who the user is on every request. This middleware uses our new client and wraps each request in a `new_context` to ensure user data doesn't leak between concurrent requests.

```python
# In a new file, e.g., myapp/integrations/posthog_middleware.py
from .posthog_client import posthog_client

class PostHogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.client = posthog_client.client

    def __call__(self, request):
        if not self.client:
            return self.get_response(request)

        # Use a new context for each request to ensure thread-safety
        with self.client.new_context():
            if hasattr(request, "user") and request.user.is_authenticated:
                user = request.user
                organization = getattr(request, "tenant", None)

                self.client.set(
                    distinct_id=str(user.id),
                    properties={'email': user.email, 'name': user.get_full_name()}
                )
                # Optionally attach group (e.g., tenant/organization)
                if organization:
                    self.client.group_identify(
                        group_type="organization",
                        group_key=str(organization.id),
                        properties={'name': organization.name, 'plan': organization.plan}
                    )
            
            response = self.get_response(request)
        return response
```

**Step 5: Activate the Middleware**
Finally, add the middleware to your `settings.py`. It must come **after** Django's `AuthenticationMiddleware`.

```python
# in settings.py
MIDDLEWARE = [
    # ... other middleware ...
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'myapp.integrations.posthog_middleware.PostHogMiddleware',
    # ... other middleware ...
]
```

With this setup complete, your integration is now robust, safe, and ready for advanced use cases.

-----

#### Use Case 1: Rolling Out Features with Smarter Feature Flags

While you can target individual users, the real power in a SaaS app comes from targeting **groups**.

**The Pro-Level Use Case: Gating Features by Subscription Plan**

Imagine you have different plans (`BASIC`, `PRO`) and want to give a company on the `BASIC` plan a free trial of a `PRO` feature.

**Step 1: The Centralised Feature Checker**

Create a central function that first checks your app's internal logic (the plan) and then asks PostHog for any overrides.

```python
# In a central permissions.py file
from .integrations.posthog_client import posthog_client

FEATURE_AI_SEARCH = "ai_search"
PLAN_FEATURES = {"BASIC": set(), "PRO": {FEATURE_AI_SEARCH}}

def has_feature_access(organization, user, feature_name: str) -> bool:
    # 1. Check the plan first (fast, local check)
    if feature_name in PLAN_FEATURES.get(organization.plan, set()):
        return True
    # 2. If not, ask PostHog for an override using our client.
    return posthog_client.is_feature_enabled(feature_name, user, group=organization)
```

**Step 2: Protecting Your Views**

Now, you can protect your views cleanly using a custom mixin.

```python
from .permissions import has_feature_access, FEATURE_AI_SEARCH

class FeatureFlagMixin:
    feature_name = None
    def dispatch(self, request, *args, **kwargs):
        if self.feature_name:
            if not has_feature_access(request.tenant, request.user, self.feature_name):
                raise PermissionDenied("This feature is not enabled for your account.")
        return super().dispatch(request, *args, **kwargs)

class AiSearchView(FeatureFlagMixin, TemplateView):
    feature_name = FEATURE_AI_SEARCH
    template_name = "ai_search.html"
```

This pattern lets you manage base permissions with your subscription plans and use PostHog to dynamically grant trial access, driving upgrades.

#### **Use Case 2: Understanding Behavior with Proper Identification**

The middleware we set up handles identification automatically, ensuring every event is correctly associated with the user and their organization.

When you capture a custom event from the backend, it's now context-aware:

```python
# In a view, after a user uploads an article
posthog_client.client.capture(
    distinct_id=request.user.id,
    event='article_listed', 
    properties={'article_id': new_article.id, 'category': new_article.category.name},
    groups={'organization': str(request.tenant.id)}
)
```

#### **Bonus: Session Replay**

Want to see exactly how users interact with your app? Enable [session replay](https://posthog.com/docs/session-replay) in PostHog. Watching real user sessions is one of the fastest ways to find UI bugs and UX friction points—it’s like looking over your user's shoulder.

#### **Best Practices & Lessons Learned**

* **Think in Groups, Not Just Users:** For any SaaS or multi-tenant app, group analytics are more powerful than user analytics. Always identify the company, team or organization the user belongs to.
* **Centralise Your Logic:** Don't sprinkle PostHog calls all over your codebase. Create a central client singleton and use middleware for identification.
* **Keep Flags Tidy:** Feature flags are powerful but can become technical debt. Regularly review and remove flags for features that are fully rolled out.

#### **Conclusion: The Swiss Army Knife for Django Product Teams**

With PostHog, you’re not just tracking clicks—you’re building a feedback loop. Feature flags de-risk your deployments, analytics tell you what’s working, and session replay shows you the "why" behind the numbers. For Django developers looking to build smarter, safer, and more responsive applications, it's an essential tool. You can finally ship, learn and improve—without flying blind.
