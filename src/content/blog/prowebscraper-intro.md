---
title: Introduction to no code web scraping with prowebscraper
author: Lewis Kori
tags: ["python", "webscraping","tutorial", "startup"]
series: Web scraping techniques with python
description: Introduction to no code web scraping with prowebscraper.
dateCreated: 2020-12-10
cover_image: https://res.cloudinary.com/lewiskori/image/upload/v1607583532/blog/prowebscraper_f94m5q.png
---

Over the course of the web scraping series, we've covered a number of approaches to scraping the web. The approaches typically involved writing code using python and the various libraries that python has to offer such as BeautifulSoup, selenium and scrapy.

In this walkthrough, we'll tackle web scraping with a radically different approach. No code data mining!

## what is web scraping?

For those who may not fully understand what web scraping is, web scraping is the process of extracting information from a webpage by taking advantage of patterns in the web page's underlying code.

We can use web scraping to gather unstructured data from the internet, process it, and store it in a structured format.
This can be in form of various formats such as CSV, JSON , txt and so on.

## what is prowebscraper?

Prowebscraper is an effortless, scalable [web scraping tool](https://prowebscraper.com/) and service that allows you to build otherwise complex web scrapers with no code at all.

To get started exploring all these goodies 😀, we'll need to set up an account with prowebscraper, head over to their [registration page](https://prowebscraper.com/register) and register a free account with them. Their generous free plan allows up to 1000  scraped web pages. On top of this, the prowebscraper technical and support team will guide you through your first web scraper at no extra charge in case you get stuck.

### setting up our first prowebscraper

![setup_prowebscraper](https://res.cloudinary.com/lewiskori/image/upload/v1607584039/blog/Screenshot_2020-11-26_Job_History_dobfcm.png)

The navbar provides us with the option of creating a new scraper, choosing this will present a dialogue for configuring the scraper. Here we'll provide any webpage url as well as any login credentials for the site should it require authentication. From the selenium post, we discovered that selenium comes in handy when we want to scrape data from javascript generated content from a webpage. That is when the data shows up after many ajax requests. Prowebscraper tackles this challenge elegantly with capability to scrape through sites with multiple levels of navigation such as pagination or content categories.

For this example we'll use our favourite web scraping test site, [quotes to scrape](http://quotes.toscrape.com/js) with javascript enabled so as to test the dynamic content extraction.

![quotes](https://res.cloudinary.com/lewiskori/image/upload/v1607584043/blog/Screenshot_2020-11-26_Extract_webpage_dcta6e.png)

From the get-go, prowebscraper provides tooltips to get you started with your scraper. From our definition of web scraping, we identified that it's the process of extracting information from a webpage by taking advantage of patterns in the web page's underlying code. By hovering the mouse cursor over the HTML elements, these patterns begin to reveal themselves. Highlighted in green all over the web page. These display similar elements.

We'll use these element to define the columns we want to extract.

For this example, the author, quote (as title from the image above) and pagination elements have been selected. These are fully customisable allowing users to name their data columns as they wish.

### Running the scraper

After setting up the prowebscraper, it's time to extract the valuable data. Prowebscraper provides a way to visualise the data before extracting the entire data. This can be done in two ways.

The first one is by switching to the data preview tab (from the image above). This will give a visual highlight of the output of the CSV file.

The second method is by hitting the `sample data` button. This extracts data from a single page in case your scraper has pagination enabled.

Clicking on the save button will open a dialogue that allows us to name and save the scraper for future purposes. A notification can be set up to let us know when the scraper completes its task!

![running_prowebscraper](https://res.cloudinary.com/lewiskori/image/upload/v1607584044/blog/Screenshot_2020-11-26_Extract_webpage_1_vkabsm.png)

### Scheduling web scraping

Bonus feature alert!

After saving the web scraper, we can schedule the web scraper to run periodically. This greatly appealed to me as It relieves me of most of the data mining tasks.

![schedule_prowebscraper](https://res.cloudinary.com/lewiskori/image/upload/v1607584373/blog/Screenshot_2020-11-26_Scheduler_sby92p.png)

Finally we can extract data in form of JSON or CSV from our web scraper once it completes its task.

![extract_data](https://res.cloudinary.com/lewiskori/image/upload/v1607584040/blog/Screenshot_2020-11-26_Job_History_1_gqrnsf.png)

Prowebscraper can also be controlled via API. Everything that can be done through the user interface can be done with the API. For more information on the features, visit the [prowebscraper features page](https://prowebscraper.com/features).

That's it from me, hopefully, now you can web scraper with this amazing tool that will improve your productivity to a whole new level. Should you have any questions, my Twitter dm is always open.

If you enjoyed this post subscribe to my [newsletter](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I write new posts or find me on [Twitter](https://twitter.com/lewis_kihiu) for a chat.

Thanks.
