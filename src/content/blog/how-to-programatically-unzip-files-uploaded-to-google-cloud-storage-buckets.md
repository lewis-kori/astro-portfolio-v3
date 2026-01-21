---
title: How to programatically unzip files uploaded to google cloud storage buckets
author: Lewis Kori
tags: ["cloudskills", "googlecloud", "python", "todayilearned"]
cover_image: https://res.cloudinary.com/lewiskori/image/upload/v1627531895/blog/gcloud_g8xnjh.jpg
description: A deep dive into google cloud services and how to unzip files from a google cloud bucket
dateCreated: 2021-07-29
sponsors: ["Scraper API"]
---

I've been using google cloud services over the last year and I thoroughly enjoy their range of services. In this walkthrough, I'll guide you through the process of unzipping files uploaded to Google cloud storage buckets. But first, let me give you some context.

## The problem

Over the course of this week, I've had the challenge of ensuring that zip files uploaded from a web app interface are immediately unzipped once they're uploaded to a storage service. Zip files are a convenient way of uploading bulk data as they're minified, hence save a lot of bandwidth while they're being uploaded.

However, you may need to access individual files located in the zip files once uploaded to your asset holding service. In my case, I needed to access a plethora of pdf statements.

I have been using several services in the google cloud suite in conjunction with [google cloud storage](https://cloud.google.com/storage)
These are:

1. [Google cloud run](https://cloud.google.com/run) - their managed serverless allowing developers to develop and deploy highly scalable containerized applications.
2. [Google cloud secret manager](https://cloud.google.com/secret-manager) - Stores API keys, passwords, certificates, and other sensitive data.
3. [Google cloud databases](https://cloud.google.com/products/databases) mainly Postgres

Having come from using traditional Virtual machines (VMs), I had to change my mindset in regards to hosting each service in the same machine. Having offloaded the storage of objects to the GS bucket, I simply couldn't traverse the local file system and unzip the files directly. After a lot of pain and pulling hair 😂, I finally managed to accomplish this seemingly impossible task.

Let's get to it.

## The solution

For this walkthrough, we'll write some python scripts that'll automate the unzipping process.

If you're not familiar with google cloud services, [this tutorial](https://cloud.google.com/docs) will help you get started with the basics. In case you're feeling extra curious, here's [a complete guide to deploy a django app to cloud run](https://codelabs.developers.google.com/codelabs/cloud-run-django/#0). This will equip you with the knowledge and hands-on experience of most of the services mentioned above.

### Project set up

Since this is a python project, it's recommended to use virtual environments to manage and separate dependencies.

```shell
virtualenv unzipperEnv -p python3.9 // create virtualenv
source unzipperEnv/bin/activate // activate virtualenv

```

Once activated, we'll have to install a few libraries to interact with the google cloud suite.

1. [google-cloud-storage](https://googleapis.dev/python/storage/latest/index.html)
2. [google-auth](https://google-auth.readthedocs.io/en/master/)
3. [django-storages](https://django-storages.readthedocs.io/en/latest/) - just in case you are using Django. We won't necessarily need this here but it's highly useful in a production app.

```shell
pip install google-auth google-cloud-storage

```

Let's jump right to it by creating a directory to house our project. I'll be using Unix commands but you can use the UI or PowerShell in case you're on windows.

```shell
mkdir unzipper && cd unzipper // create and enter a directory
touch storages.py // create a script to house our code
code . // open code editor
```

Great, so far, so good. We'll jump right to the crux of our walkthrough.

## working with google storage buckets

Before getting started, we'll need to create a google cloud storage bucket. I won't cover that today as it has been widely [documented in their official docs](https://cloud.google.com/storage/docs/cloud-console#_creatingbuckets).
Once, you've created a bucket, you'll get a bucket id, we'll need that going forward.

In the process of creating the bucket, ensure you get a service account and download the JSON file provided by Google.
This will help us authenticated the requests while testing locally on our machines. I've saved mine as `credentials.json`

```python
import io
from zipfile import ZipFile, is_zipfile

from google.cloud import storage
from google.oauth2 import service_account

# declare unzipping function

def zipextract(zipfilename_with_path):

    # auth config
    SERVICE_ACCOUNT_FILE = 'credentials.json'
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE)

    bucketname = 'your-bucket-id'

    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.get_bucket(bucketname)

    destination_blob_pathname = zipfilename_with_path

    blob = bucket.blob(destination_blob_pathname)

    zipbytes = io.BytesIO(blob.download_as_string())

    if is_zipfile(zipbytes):
        with ZipFile(zipbytes, 'r') as myzip:
            for contentfilename in myzip.namelist():
                contentfile = myzip.read(contentfilename)

                # unzip pdf files only, leave out if you don't need this.
                if '.pdf' in contentfilename.casefold():

                    output_file = f'./{contentfilename.split("/")[-1]}'
                    outfile = open(output_file, 'wb')
                    outfile.write(contentfile)
                    outfile.close()

                    blob = bucket.blob(
                        f'{zipfilename_with_path.rstrip(".zip")}/{contentfilename}'
                    )
                    with open(output_file, "rb") as my_pdf:
                        blob.upload_from_file(my_pdf)

                    # make the file publicly accessible
                    blob.make_public()
    print('done running function')

if __name__ == '__main__':
    zipfilename_with_path = input('enter the zipfile path: ')
    zipextract(zipfilename_with_path)

```

Looking at the code above, what we're doing is declaring a function that takes in the zipfile location within our bucket. This can be `documents/reports/2021/January.zip`

In order to access our storage buckets in this script, we have to authenticate the request through the `credentials.json` (service account details). Under the hood, the google cloud libraries use the requests module.

[Blobs](https://googleapis.dev/python/storage/latest/blobs.html) are google cloud's concept of an object. This path to the object(zip) is what we provide to our function. From there, we download the zip file as a string and convert its representation to bytes through the io standard python library.

`is_zipfile` checks our byte representation of the zip file to ensure what we want to unzip is an actual zip file.

```python
 with ZipFile(zipbytes, 'r') as myzip:
            for contentfilename in myzip.namelist():
                contentfile = myzip.read(contentfilename)

```

From the snippet above, we'll be reading in the zipbytes and loop through its content.

For my use case, I wanted to unzip pdf files, but you can be creative with this. I used the pattern in the name, checking if there are filenames with `.pdf` extension. It's probably not the best method as the pdf may not be accurate. [This StackOverflow question](https://stackoverflow.com/questions/6186980/determine-if-a-byte-is-a-pdf-file) offers some interesting solutions. In my case, however, I was content with the workaround.

```python
if '.pdf' in contentfilename.casefold():

                    output_file = f'./{contentfilename.split("/")[-1]}'
                    outfile = open(output_file, 'wb')
                    outfile.write(contentfile)
                    outfile.close()

                    blob = bucket.blob(
                        f'{zipfilename_with_path.rstrip(".zip")}/{contentfilename}'
                    )
                    with open(output_file, "rb") as my_pdf:
                        blob.upload_from_file(my_pdf)

                    # make the file publicly accessible
                    blob.make_public()

```

We then extract the bytes and write them to a file within our project directory with the same name as what's available in the bucket. Immediately after, we take this file and upload it to the newly extracted zip folder. The `rstrip()` function ensures the extracted folder doesn't have `.zip` extension in its name.

Finally, we ensure the newly extracted files are publicly accessible via URL so that users can easily download them from an app or website interface.

## conclusion and gotchas

The snippet above is very useful when testing on your own machine, however, if your app is running in any of google's serverless environments, namely, app engine and cloud run, it's recommended to write files to a directory named `/tmp`.
All files in this directory are stored in the instance's RAM, therefore writing to `/tmp` takes up system memory. In addition, files in the `/tmp` directory are only available to the app instance that created the files. When the instance is deleted, the temporary files are deleted. This will ensure the files we're writing and re-uploading are deleted as soon as possible since we no longer need them.

We'll modify our script slighty to accomodate this.

```python
    # change path here 👇🏽
    output_file = f'/tmp/{contentfilename.split("/")[-1]}'
                    outfile = open(output_file, 'wb')
                    outfile.write(contentfile)
                    outfile.close()
```

additionally, we won't be needing the service account credentials in that environment.

```python
"""
this line changes and there's no need for auth module imports
storage_client = storage.Client(credentials=credentials)
"""

# no credential requirements
storage_client = storage.Client()

```

Thanks for your time, if you want more of this, [subscribe to my newsletter](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I make new posts.

That's it from me.

If you have any questions or issues, leave a comment below or contact me via [twitter](https://twitter.com/lewis_kihiu) and I'll get to you as soon as I can.
