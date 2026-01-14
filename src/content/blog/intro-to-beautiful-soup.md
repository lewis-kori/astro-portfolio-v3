---
title: Introduction to web scraping with python
author: Lewis Kori
tags: ["python", "webscraping","tutorial"]
series: Web scraping techniques with python
description: An introduction to the beautiful soup python library for web scraping
dateCreated: 2019-08-23
---
### What is web scraping

This is the process of extracting information from a webpage by taking advantage of patterns in the web page's underlying code.
We can use web scraping to gather unstructured data from the internet, process it and store it in a structured format.
In this walkthrough, we'll be storing our data in a JSON file.

### Alternatives to web scraping

Though web scraping is a useful tool in extracting data from a website,
it's not the only means to achieve this task.
Before starting to web scrape, find out if the page you seek to extract data from provides an API.

#### robots.txt file

Ensure that you check the robots.txt file of a website before making your scrapper. This file tells if the website allows scraping or if they do not.
To check for the file, simply type the base URL followed by "/robots.txt"
An example is, "mysite.com/robots.txt".
For more about robots.txt files [this post](https://varvy.com/robottxt.html) should provide better incite.

#### Other potential problems

Other problems one might encounter while web scraping is the possibility of your IP address being blacklisted. I partnered with scraper API, a startup specializing in strategies that'll ease the worry of your IP address from being blocked while web scraping. They utilize IP rotation so you can avoid detection. Boasting over 20 million IP addresses and unlimited bandwidth.

In addition to this, they provide CAPTCHA handling for you as well as enabling a headless browser so that you'll appear to be a real user and not get detected as a web scraper. For more on its usage, check out my post on [web scraping with scrapy](/blog/web-scraping-managing-proxies-and-captcha-with-scrapy-and-the-scraper-api/). Although you can use it with both BeautifulSoup and selenium.

Using [this scraper api link](https://www.scraperapi.com?_go=korilewis) and the code
lewis10, you'll get a 10% discount off your first purchase!

 <a href="https://www.scraperapi.com?fpr=lewiskori" target="_blank" style="outline:none;border:none;"><img src="https://d2gdx5nv84sdx2.cloudfront.net/uploads/ssvxh57a/marketing_asset/banner/2665/069-ScraperAPI-B-GIF-336x280-v1.gif" alt="scraperapi" border="0"/></a>

### **Getting started**

In this tutorial, we'll be extracting data from [books to scrape
](http://books.toscrape.com/) which you can use to practise your web scraping.
We'll extract the title, rating, link to more information about the book and the cover image of the book.

Find the code on [github](https://github.com/lewis-kori/webcrawler-tutorial).

### 1. Importing libraries

```python
import requests
import json
from bs4 import BeautifulSoup
```

The python libraries perform the following tasks.

1. requests - will be used to make Http requests to the webpage.
2. json - we'll use this to store the extracted information to a JSON file.
3. BeautifulSoup - for parsing HTML.

### 2. walkthrough

```python
header = {'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'}

base_url = "http://books.toscrape.com/"

r = requests.get(base_url,headers=header)
```

We're initializing three variables here.

1. header-HTTP headers provide additional parameters to HTTP transactions. By sending the appropriate HTTP headers, one can access the response data in a different [format](http://go-colly.org/articles/scraping_related_http_headers/).  

2. base_url - is the webpage we want to scrape since we'll be needing the URL quite often, it's good to have a single initialization and reuse this variable going forward.

3. r - this is the response object returned by the get method. Here, we pass the base_url and header as parameters.

```python
if r.status_code == 200:
  soup = BeautifulSoup(r.text, 'html.parser')
  books = soup.find_all('li',attrs={"class":"col-xs-6 col-sm-4 col-md-3 col-lg-3"})
  result=[]
  for book in books:
    title=book.find('h3').text
    link=base_url +book.find('a')['href']
    stars = str(len(book.find_all('i',attrs=  {"class":"icon-star"}))) + " out of 5"
    price="$"+book.find('p',attrs={'class':'price_color'}).text[2:]
    picture = base_url + book.find('img')['src']
    single ={'title':title,'stars':stars,'price':price,'link':link,'picture':picture}
    result.append(single)
    with open('books.json','w') as f:
      json.dump(result,f,indent=4)
else:
  print(r.status_code)
```

To ensure our scraper runs when the http response is ok we'll use the if statement as a check. The number 200 is the status code for Ok. To get a list of all codes and their meanings [check out this resource](https://www.restapitutorial.com/httpstatuscodes.html).
We'll then parse the response object using the BeautifulSoup method and store the new object to a variable called soup.

From the aforementioned definition,
>Web scraping the process of extracting information from a webpage by taking advantage of patterns in the web page's underlying code.

Let's take a look at a single record from our webpage to identify the patterns. Once we can see the page, we'll loop through every record in the page as they contain similar traits.
![toscrape.com](https://res.cloudinary.com/practicaldev/image/fetch/s--0vJGh1fH--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/pdfw0kcge1v8le01c1q5.PNG)
From the image above, we'll notice that all books are contained within a list item with the class ```col-xs-6 col-sm-4 col-md-3 col-lg-3```
By using the find_all() method, we can find all references of this HTML tag in the webpage. we pass the tag as the first argument and then using the attrs argument which takes in a python dictionary, we can specify attributes of the HTML tag selected. In this case, it was a class indicated above, but you can even use id as an attribute.

Store the result in a variable, I chose the name books.

```python
title=book.find('h3').text
link=base_url +book.find('a')['href']
```

If we observe keenly, we'll notice that each of the elements we want to extract is nested within the list item tag are all contained in similar tags, in the example above. The title of the book is between h3 tags.
The find() method returns the first matching tag.
text will simply return any text found within the tags specified.
For the anchor tags, we'll be extracting the hyper reference link.
As opposed to h3 tag, the href element is within anchor tags in HTML. Like so
`<a href="somelink.com"></a>`
In this case, the returned object will behave like a dictionary where we have a `dictionary_name[key]`

We do this iteratively for all the values we seek to extract because we are taking advantage of the pattern in the underlying code of the webpage. Hence the use of the python for loop.

```python
single ={'title':title,'stars':stars,'price':price,'link':link,'picture':picture}
result.append(single)
with open('books.json','w') as f:
    json.dump(result,f,indent=4)
```

The extracted elements are then stored in respective variables which we'll put in a dictionary. With this information, we can then comfortably append the dictionary object to the initialized result list set before our for loop.

Finally, store the python list in a JSON file by the name "books.json" with an indent of 4 for readability purposes.

With that, you have your simple web scraper up and running. For more on web scrapers, read the documentation for the libraries or on youtube.

If you liked this walkthrough, [subscribe to my mailing list](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I make new posts.

Thanks.
