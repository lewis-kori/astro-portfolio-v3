---
title: web scraping, Managing proxies and Captcha with scrapy and the Scraper API
author: Lewis Kori
tags: ["python", "startup", "webscraping","tutorial"]
series: Web scraping techniques with python
description: How to beat CAPTCHA forms while web scraping using the scraper API.
dateCreated: 2019-09-07
canonical_url: https://dev.to/lewiskori/web-scraping-managing-proxies-and-captcha-with-scrapy-and-the-scraper-api-2c5b
---

In the first and second part of this series, we've introduced ourselves to web scraping and the techniques one can apply to achieve this task. We did so with BeautifulSoup and selenium python libraries. Check them out if you haven't yet.

1. [Introduction to webscraping with beautiful soup](https://dev.to/lewiskori/introduction-to-web-scraping-with-python-24li)
2. [Introduction to web scraping with selenium](https://dev.to/lewiskori/beginner-s-guide-to-web-scraping-with-python-s-selenium-3fl9)

In this final part of the web scraping series, we'll be exploring the scrapy library, the scraper API and gain an understanding of the need for using these tools.

For this walkthrough, we'll scrape data from the [moviedb](https://www.themoviedb.org/movie) website. This is just an example as they provide an API if you want any of their data.Find the code on [github](https://github.com/lewis-kori/movies_scraper).

### **Why scrapy?**

Scrapy is an open-source python library.
Scrapy lets you crawl websites concurrently without having to deal with threads, processes, synchronization or anything else. It handles your requests asynchronously and it is really fast. If you wanted something like this in your custom crawler, you'd have to implement it by yourself or use some async library.

For more details on this topic, check this [post on quora](https://www.quora.com/Why-would-some-use-scrapy-instead-of-just-crawling-with-requests-or-urllib2/answer/Valdir-Stumm-Junior?ch=10&share=6de6f35c&srid=5lfYx).

### **Why Scraper API?**

*Please note that some of the links below are affiliate links and at no additional cost to you. Know that I only recommend products, tools and learning services I've personally used and believe are genuinely helpful. Most of all, I would never advocate for buying something you can't afford or that you aren't ready to implement.*

Scraper API is a startup specializing in strategies that'll ease the worry of your IP address from being blocked while web scraping. They utilize IP rotation so you can avoid detection. Boasting over 20 million IP addresses and unlimited bandwidth.
In addition to this, they provide CAPTCHA handling for you as well as enabling a headless browser so that you'll appear to be a real user and not get detected as a web scraper.
Usage is not limited to scrapy but works with requests, BeautifulSoup and selenium in the python ecosystem. Integration with other popular platforms such as node.js, bash, PHP and ruby is also supported. All you have to do is concatenate your target URL with their API endpoint on the HTTP get request then proceed as you normally would on any web scraper. In this walkthrough, I'll highlight just how to do that😁.

Using [this scraper api link](https://www.scraperapi.com?_go=korilewis) and the promo code lewis10, you'll get a 10% discount on your first purchase!!
You can always start on their generous free plan and upgrade when the need arises.

### **1.Setting up.**

To get started, we need to install the scrapy library. Run `pip install scrapy`

Afterwards, head over to the [scraper API website](https://www.scraperapi.com?_go=korilewis) and get an API key. We'll need this to access their services in a very simple way. So hold on tight.

#### initiating the project

With these two steps done, we should be all set up to make the web crawler.
Run `scrapy startproject projectName`

This will create our project that'll initialize with the following structure.

![folder_structure](https://thepracticaldev.s3.amazonaws.com/i/ahotlcot6rr34d3yvsgh.PNG)

Now for the fun part
we'll create a file in the spider's folder and aptly name it movies.py.
This will house most of the code needed to power our web crawler.

Our entire code will appear like so.

```python
from scrapy import Spider
from ..items import GetmoviesItem
from .config import API_KEY

class moviesCrawl(Spider):
    name="movies"
    page_number=15

    url_link="https://www.themoviedb.org/movie?page=1"
    
    start_urls=['http://api.scraperapi.com/?api_key='+ API_KEY + '&url=' + url_link + '&render=true']

    def parse(self,response):
        movies=response.css("div.item.poster.card")
        items=GetmoviesItem()
        for movie in movies:
            items["title"]=movie.css('.title.result::text').extract()
            items["rating"]=movie.css(".user_score_chart::attr(data-percent)").extract()
            items["description"]=movie.css(".overview::text").extract()
            items["poster_link"]=movie.css('.poster.lazyload.fade::attr(data-src)').extract()

            yield items


        next_page_url = "https://www.themoviedb.org/movie?page="+ str(self.page_number)
        next_page='http://api.scraperapi.com/?api_key='+ API_KEY + '&url='+ next_page_url + '&render=true'

        if self.page_number<=15:
            self.page_number+=1
            yield response.follow(next_page,callback=self.parse)
```

Might look a bit frightening, but we'll go through it line by line.

The first three lines are library imports and items we'll need to effectively create a functioning web crawler.

```python
from scrapy import  Spider
from ..items import GetmoviesItem
from .config import API_KEY
```

For now, don't worry about the GetmoviesItem import, we'll get to that soon.
I created a separate file where I stored any configurations needed. In this case,
it was the API key we got from scraper API.

```python
class moviesCrawl(Spider):
    name="movies"
    
    url_link="https://www.themoviedb.org/movie?page=1"
    page_number=15

    start_urls=['http://api.scraperapi.com/?api_key='+ API_KEY + '&url=' + url_link + '&render=true']

```

This is where things start getting interesting. We first create the moviesCrawl class which inherits from the spider class initially imported at the top of the file. This class will form the basis for our web scraper and we'll specify the behaviour of the web crawler from here.

We first have to give it a name and this is done in the names variable. This name will be used when we want to run the scraper once we are through creating it.

As for the url_link variable, this is just to point to the URL we want to scrape. You'll notice that it's a paginated site and it takes the form

`https://www.themoviedb.org/movie?page={{page_number}}`

This pattern will be utilised by the page_number variable to automatically move the scraper across multiple pages within the target site.

Finally, the start_urls variable is a keyword in scrapy. This a list of URLs where the spider will begin to crawl from when no particular URLs are specified. So, the first pages downloaded will be those listed here.

To enable us to use the scraper API and utilise its full power 😎, all we simply have to do is concatenate our url_link with the scraper API endpoint.

``` http://api.scraperapi.com/?api_key='+ API_KEY + '&url=' + url_link + '&render=true ```

The render=true option simply tells the scraper API to enable javascript rendering and hence allowing a headless browser to run. This is what we covered using [selenium](https://dev.to/lewiskori/beginner-s-guide-to-web-scraping-with-python-s-selenium-3fl9) but in a simplified format.

```python
def parse(self,response):
        movies=response.css("div.item.poster.card")
        items=GetmoviesItem()
        for movie in movies:
            items["title"]=movie.css('.title.result::text').extract()
            items["rating"]=movie.css(".user_score_chart::attr(data-percent)").extract()
            items["description"]=movie.css(".overview::text").extract()
            items["poster_link"]=movie.css('.poster.lazyload.fade::attr(data-src)').extract()

            yield items
```

From scrapy's documentation,

>The parse method is in charge of processing the response and returning scraped data and/or more URLs to follow.

What this means in simple terms, is that using this method, we can manipulate the data received from the target web site we want to scrape. From our last two walkthroughs, we defined web scraping as

>The process of extracting information from a webpage by taking advantage of patterns in the web page's underlying code.
We can use web scraping to gather unstructured data from the internet, process it and store it in a structured format.

once we've identified the patterns in the web page's code, we can automate the data extraction. So let's inspect those DOM elements.

![moviedb](https://thepracticaldev.s3.amazonaws.com/i/1c87rvyhksst4c60g3ct.PNG)

From the image above, we'll notice that each movie item is enclosed in a div of classes item, poster and card.
Armed with this information, we'll instruct the crawler to get all CSS elements exhibiting those attributes.

Before we continue, let's deal with the GetmoviesItem class we imported at the beginning of the script.

```python
from scrapy import Item
class GetmoviesItem(scrapy.Item):
    # define the fields for your item here like:
    title=scrapy.Field()
    rating=scrapy.Field()
    description=scrapy.Field()
    poster_link=scrapy.Field()
```

Once we've crawled the site data, we need to store the data somewhere in a structured format. These items objects are simple containers used to collect the scraped data. They provide a dictionary-like API with a convenient syntax for declaring their available fields.
For more info on this check [here](https://doc.scrapy.org/en/latest/topics/items.html?#module-scrapy.item).

From the code above, what we've defined will act like dictionary keys storing the information we've extracted.

Are we still flowing? Great. Onwards we move.

The items variable will be an instance of the GetmoviesItem. From here, using the same field names defined as our dictionary keys, we can extract and individual attributes from each movie. Case in point, for the rating information. This attribute is stored within an element with a class name user_score_chart. Within this HTML element, we have an attribute "data-percent" and that's why we utilised the attr method to get access to the data stored there. From there using the yield function, we can now get all the data we need.

For the final part of the code,

```python
        next_page_url = "https://www.themoviedb.org/movie?page="+ str(self.page_number)
        next_page='http://api.scraperapi.com/?api_key='+ API_KEY + '&url='+ next_page_url + '&render=true'

        if self.page_number<=15:
            self.page_number+=1
            yield response.follow(next_page,callback=self.parse)
```

we take advantage of the pagination URL to iterate over as many pages as we want. Luckily for us, since we'll be hooking up with the scraper API's endpoint, we run no risk of our IP address being blocked since they have managed proxies for us.
However, I'd caution against sending excessive requests to a target site while web scraping as it can ruin other people's user experience on the platform.

Finally to store the information is a simple as running any of these commands based on the file format you choose.

* `scrapy crawl movies -o filename.csv`
* `scrapy crawl movies -o filename.json`
* `scrapy crawl movies -o filename.xml`

### Feature evaluation

#### proxy feature

I tested out this feature using [httpbin](https://httpbin.org/ip) and on multiple requests, the IP rotations worked superbly.
![proxies](https://thepracticaldev.s3.amazonaws.com/i/gm46njky1ug4nbbx2zut.PNG)
It's important to note that the time of requests will slow down during IP rotation and consequently, your web scraper will run slower than usual.

#### captcha

To test out this feature identify a website with captcha enabled and run the script. A great place to start is [truepeoplesearch](https://www.truepeoplesearch.com/) which immediately pops up a captcha form. You'll find that the scraper API can easily handle this for you allowing you to scrape just as normally as you would.

#### Headless browser

By removing the render=true, run the script on a javascript heavy site and notice the differences.
A great place to start is the [quotes to scrape js powered site](http://quotes.toscrape.com/js).

## conclusion

Hopefully, you too can make a simple web crawler with scrapy and utilise the scraper API.

For more on this head over to their [documentation](https://www.scraperapi.com/documentation) page to see the awesome features, they provide to ease some of the headaches you encounter on web scraping.

[scrapy documentation](http://scrapy.org/).

Thanks for your time.
If you want more of this, subscribe to my [newsletter](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I make new posts. Want to chat? Ping me on [twitter](https://twitter.com/lewis_kihiu).
