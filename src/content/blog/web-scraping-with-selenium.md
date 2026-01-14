---
title: Beginner's guide to web scraping with python's selenium
author: Lewis Kori
tags: ["python", "webscraping","tutorial"]
series: Web scraping techniques with python
description: Beginner's guide to web scraping with python's selenium
dateCreated: 2019-09-04
---
In the first part of this series, we introduced ourselves to the concept of web scraping using two python libraries to achieve this task. Namely, requests and BeautifulSoup. The results were then stored in a JSON file. In this walkthrough, we'll tackle web scraping with a slightly different approach using the selenium python library. We'll then store the results in a CSV file using the pandas library.

The code used in this example is on [github](https://github.com/lewis-kori/webcrawler-tutorial/blob/master/quotes.py).

### Why use selenium

Selenium is a framework which is designed to automate test for web applications.
You can then write a python script to control the browser interactions automatically such as link clicks and form submissions. However, in addition to all this selenium comes in handy when we want to scrape data from javascript generated content from a webpage. That is when the data shows up after many ajax requests. Nonetheless, both BeautifulSoup and [scrapy](https://www.accordbox.com/blog/web-scraping-framework-review-scrapy-vs-selenium/) are perfectly capable of extracting data from a webpage. The choice of library boils down to how the data in that particular webpage is rendered.

Other problems one might encounter while web scraping is the possibility of your IP address being blacklisted. I partnered with scraper API, a startup specializing in strategies that'll ease the worry of your IP address from being blocked while web scraping. They utilize IP rotation so you can avoid detection. Boasting over 20 million IP addresses and unlimited bandwidth.

In addition to this, they provide CAPTCHA handling for you as well as enabling a headless browser so that you'll appear to be a real user and not get detected as a web scraper. For more on its usage, check out my post on web scraping with scrapy. Although you can use it with both BeautifulSoup and selenium.

If you want more info as well as an intro the scrapy library check out [my post on the topic](/blog/web-scraping-managing-proxies-and-captcha-with-scrapy-and-the-scraper-api/).

Using [this scraper api link](https://www.scraperapi.com?_go=korilewis) and the code
lewis10, you'll get a 10% discount off your first purchase!

For additional resources to understand the selenium library and best practices, [this article by towards datascience](https://towardsdatascience.com/web-scraping-a-simple-way-to-start-scrapy-and-selenium-part-i-10367164c6c0) and [accordbox](https://www.accordbox.com/blog/web-scraping-framework-review-scrapy-vs-selenium/).

### Setting up

We'll be using two python libraries. selenium and pandas. To install them simply run `pip install selenium pandas`

In addition to this, you'll need a browser driver to simulate browser sessions.
Since I am on chrome, we'll be using that for the walkthrough.

#### Driver downloads

1. [Chrome](https://sites.google.com/a/chromium.org/chromedriver/).
2. [Firefox gecko driver](https://www.guru99.com/gecko-marionette-driver-selenium.html)

#### Getting started

For this example, we'll be extracting data from [quotes to scrape](http://quotes.toscrape.com/js/page/1/) which is specifically made to practise web scraping on.
We'll then extract all the quotes and their authors and store them in a CSV file.

```python
from selenium.webdriver import Chrome
import pandas as pd

webdriver = "path_to_installed_driver_location"

driver = Chrome(webdriver)
```

The code above is an import of the chrome driver and pandas libraries.
We then make an instance of chrome by using `driver = Chrome(webdriver)`
Note that the webdriver variable will point to the driver executable we downloaded previously for our browser of choice. If you happen to prefer firefox, import like so

```python
from selenium.webdriver import Firefox
```

#### Main script

```python
from selenium.webdriver import Chrome
import pandas as pd

webdriver = "path_to_your_driver"

driver = Chrome(webdriver)

pages = 11

total = []
for page in range(1,pages):

    url = "http://quotes.toscrape.com/js/page/" + str(page) + "/"

    driver.get(url)

    quotes = driver.find_elements_by_class_name("quote")
    for quote in quotes:
        quote_text = quote.find_element_by_class_name('text').text[1:-2]
        author = quote.find_element_by_class_name('author').text
        new = ((quote_text,author))
        total.append(new)

driver.close()
df = pd.DataFrame(total,columns=['quote','author'])
df.to_csv('quoted.csv')
```

On close inspection of the sites URL, we'll notice that the pagination URL is
`Http://quotes.toscrape.com/js/page/{{current_page_number}}/`

where the last part is the current page number. Armed with this information, we can proceed to make a page variable to store the exact number of web pages to scrape data from. In this instance, we'll be extracting data from just 10 web pages in an iterative manner.

The `driver.get(url)` command makes an HTTP get request to our desired webpage.
From here, it's important to know the exact number of items to extract from the webpage.
From our previous walkthrough, we defined web scraping as

> This is the process of extracting information from a webpage by taking advantage of patterns in the web page's underlying code.

We can use web scraping to gather unstructured data from the internet, process it and store it in a structured format.

![quotes_to_scrape](https://res.cloudinary.com/practicaldev/image/fetch/s--S1CHDH_v--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/fae895i7fruij64mys8k.PNG)

On inspecting each quote element, we observe that each quote is enclosed within a div with the class name of quote. By running the directive `driver.get_elements_by_class("quote")`
we get a list of all elements within the page exhibiting this pattern.

#### Final step

```python
        quotes = driver.find_elements_by_class_name("quote")
        for quote in quotes:
            quote_text = quote.find_element_by_class_name('text').text[1:]
            author = quote.find_element_by_class_name('author').text
            new = ((quote_text,author))
            total.append(new)
```

To begin extracting the information from the webpages, we'll take advantage of the aforementioned patterns in the web pages underlying code.

We'll start by iterating over the `quote` elements, this allows us to go over each quote and extract a specific record.
From the picture above we notice that the quote is enclosed within a span of class text and the author within the small tag with a class name of author.

Finally, we store the quote_text and author names variables in a tuple which we proceed to append to the python list by the name total.

```python
driver.close()
df = pd.DataFrame(total,columns=['quote','author'])
df.to_csv('quoted.csv')
```

Using the pandas library, we'll initiate a dataframe to store all the records(total list) and specify the column names as quote and author.
Finally, export the dataframe to a CSV file which we named quoted.csv in this case.

Don't forget to close the chrome driver using driver.close().

### Adittional resources

#### 1. finding elements

You'll notice that I used the find_elements_by_class method in this walkthrough. This is not the only way to find elements. [This tutorial](https://dev.to/razgandeanu/endtest/a-practical-guide-for-finding-elements-with-selenium-4djf) by [Klaus](https://dev.to/razgandeanu) explains in detail how to use other selectors.

#### 2. Video

If you prefer to learn using videos this series by Lucid programming was very useful to me.
<https://www.youtube.com/watch?v=zjo9yFHoUl8>

#### 3. [Best practises while using selenium](https://realpython.com/modern-web-automation-with-python-and-selenium/)

#### 4. [Toptal's guide to modern web scraping with selenium](https://www.toptal.com/python/web-scraping-with-python)

And with that, hopefully, you too can make a simple web scraper using selenium 😎.

If you enjoyed this post subscribe to my [newsletter](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I write new posts.

#### open to collaboration

I recently made a collaborations page on my website. Have an interesting project in mind or want to fill a part-time role?
You can now [book a session](/collaborate) with me directly from my site.

Thanks.
