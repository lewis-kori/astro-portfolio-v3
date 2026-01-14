---
title: Building my new site with gridsome(vue.js)
author: Lewis Kori
tags: ["vue", "growth"]
cover_image: https://res.cloudinary.com/lewiskori/image/upload/v1599397105/blog/tasks_m_klnqnc.png
description: How I built my new site with gridsome and why I highly recommend it
dateCreated: 2020-05-19
---
I'm really excited to finally launch my new website 🥳. It's been a labor of love and in terms of growth, I must say I really enjoyed working on it. For the tech stack, I went out of my comfort zone as I am majorly a backend developer. So I used the opportunity to polish on my frontend skills. I utilized my favorite javascript framework, vue.js. I used their static site generator, gridsome. [Bulma](https://bulma.io/) was used for CSS.
In this article, I'll explain how this decision came to be, what I was using before, and my thoughts on gridsome.

- [What I was using before](#what-i-was-using-before)
- [Why I switched to gridsome](#why-i-switched-to-gridsome)
- [Benefits of gridsome](#benefits-of-gridsome)
  - [Extra features](#extra-features)
- [Challenges of gridsome](#challenges-of-gridsome)
- [Was it worth the switch to gridsome](#was-it-worth-the-switch-to-gridsome)
- [What next](#what-next)
  - [credits](#credits)

### What I was using before

As aforementioned, I am primarily a backend developer, so the first version of my website wasn't up to date with the modern web trends. I did this on purpose because at the time my main aim was to perfect my backend skills and so heavily concentrated on that aspect.

I used Django(python web framework), Postgresql, and a template from colorlib which I extended and modified to suit my needs. With time, I wrapped that with docker and redeployed the entire site. I used that project as a learning opportunity. You can read all about the lessons I learned [here](https://lewiskori.com/blog/lessons-learnt-from-building-and-deploying-a-portfolio-website/).

[Here's version one of the site](https://v-one.lewiskori.com/) for comparison.

### Why I switched to gridsome

So my site was working fine and I absolutely loved it. With time however and as I became more experienced in the backend, that curiosity bug that most developers come shipped with 😅 began nudging at me. Since I'd been learning vue.js and came to love it, I thought this would be a great opportunity to flex my frontend muscles a bit. Besides, what better way to learn than doing?

Other than these reasons, It's important as a developer to keep up to date with the ever-changing tech field.
My old site missed two important features that I really wanted. continuous deployment and better code highlighting in markdown.

I saw netlify as an easy solution to the continuous deployment challenge.
For context, here's a snapshot of my previous syntax highlighting,

![old_code_highlight](https://res.cloudinary.com/lewiskori/image/upload/v1589888452/old-syntax_m5efn6.png)

### Benefits of gridsome

![gridsome_advantages](https://res.cloudinary.com/lewiskori/image/upload/v1589888523/Screenshot_2020-05-19_Modern_Site_Generator_for_Vue_js_-_Gridsome_rlv8my.png)

As highlighted above, gridsome comes with a plethora of advantages. Building on the awesome vue framework, it manages to be simple to understand, their documentation is exceptional, to say the least, and I got to solve the two challenges I had mentioned.

To deploy to netlify, all you have to do is link your GitHub repo to netlify. From there, netlify will monitor for changes and update your site automatically. The [gridsome docs](https://gridsome.org/docs/deploy-to-netlify/) offer more on this.

For code highlighting, I could now embed from various sources including gists and codepen.
As a bonus, the new site has the capabilities to embed Spotify content for music lovers 🕺🏼.
This aside, the basic syntax highlighting came to this

```python
class moviesCrawl(Spider):
    name="movies"

    url_link="https://www.themoviedb.org/movie?page=1"
    page_number=15

    start_urls=['http://api.scraperapi.com/?api_key='+ API_KEY + '&url=' + url_link + '&render=true']
```

#### Extra features

Some additional features that were implemented for the new site are

1. The site is now a PWA! So awesome.
2. Improved SEO by utilizing Vue Meta.
3. Writing content in Markdown.

### Challenges of gridsome

The development process was fairly fun as their documentation was well written and thought out.
However, I lacked some material which is not a bad thing in itself as it forces you to figure stuff on your own.
I'm keen to write a comprehensive tutorial on using gridsome with the lessons I learned. In case you're interested, [subscribe to my newsletter](https://mailchi.mp/c42286076bd8/lewiskori) and you'll get the content as soon as it's out.

### Was it worth the switch to gridsome

Without a shadow of a doubt yes!! The site took me a little over a month. Working tirelessly on my off-work hours. But in the end, the effort was worth it. In the process, I've come to appreciate the modern web and extremely curious to explore graphql which gridsome utilizes.

### What next

This won't be the end as no project is ever complete, I'll be making a few modifications and I'd appreciate any input to the design. In the coming days, I'll make the entire codebase completely open-source for use to anyone who may want such a site.

In terms of content, be sure to [watch out](https://mailchi.mp/c42286076bd8/lewiskori) as I'll double down on more backend tutorials with python and golang.

Thanks for reading this post. Should you have any questions feel free to leave a comment below. My [twitter dm](https://twitter.com/lewis_kihiu/) is always open as well.

#### credits

1. The design was highly inspired by [Brittany Chiang's](https://brittanychiang.com/) Gatsby site.

2. The [gridsome starter blog source code](https://github.com/lewis-kori/gridsome-starter-blog) gave me a lot of insight into where documentation lacked.
