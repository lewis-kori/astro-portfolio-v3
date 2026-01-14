---
title: Deploying a python/django app using docker
author: Lewis Kori
tags: ["django", "python", "docker"]
cover_image: https://res.cloudinary.com/practicaldev/image/fetch/s--cg6jWyUt--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://res.cloudinary.com/practicaldev/image/fetch/s--VPjJbZ8D--/c_imagga_scale%2Cf_auto%2Cfl_progressive%2Ch_420%2Cq_auto%2Cw_1000/https://thepracticaldev.s3.amazonaws.com/i/9cvwld7xetx11mfzvx41.jpg
description: Introduction to docker and django
dateCreated: 2019-08-04
sponsors: ["Webisoft", "Scraper API", "Digital Ocean"]
---

Hey there I was inspired to write this post based on my experience trying to move my deployments to use docker, particularly for django applications and couldn't get a comprehensive place/article that covered what I needed.Hopefully this article will help anyone out there who is feeling as stuck as I was.

A lot of you might have already heard this phrase being thrown around almost everywhere you turn. You probably googled the term docker up and even tried experimenting with it but might have given up along the way. Heck, to be honest I did hold up on it one or two times before taking a full dive. It can be a little intimidating at first, but oh boy! Once you start using docker, there's no going back. The ease of moving from production to development environment is simply mind blowing to say the least!!
so enough rumbling, let's get started.

### what is docker

Docker is an open-source tool that automates the deployment of an application inside a software container. which are like virtual machines, only more portable, more resource-friendly, and more dependent on the host operating system.
for detailed information on the workings of docker, I'd recommend reading [this article](https://dev.to/djangostars/what-is-docker-and-how-to-use-it-with-python-tutorial-87a) and for those not comfortable reading long posts, this [tutorial series on youtube](https://www.youtube.com/playlist?list=PLhW3qG5bs-L99pQsZ74f-LC-tOEsBp2rK) was especially useful in introducing me to the concepts of docker.

### Installing docker

In case you don't have docker installed on your machine follow the detailed steps below as per your operating system.
Going forwards, I've assumed you already had an existing django application, so this tutorial will just be a guide on how to containerize it.

1. [windows 10 pro](https://docs.docker.com/docker-for-windows/install/)
2. [windows 10 that's not pro](https://docs.docker.com/toolbox/toolbox_install_windows/)
3. [ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)

### Getting started

For deploying a typical django application you would need the following services in order to get it running.

1. Nginx - to serve static files and webserver
2. Postgres/any database of your choice
3. python with gunicorn installed

To launch each of these services, you'll need a dockerfile. This is basically a text document highlighting all the commands on the cli and steps you would normally take to assemble an image.

#### 1.Python image

```yaml
FROM python:3.6

RUN mkdir /code
WORKDIR /code

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


COPY . .
```

1. The first line has to start with the **FROM** keyword. It tells docker, from which base image you want to base your image from. In this case, we are creating an image from the python 3.6 image.

2. The second line is the command **RUN** is used to run instructions on the image, in this case we are creating a directory by the name ***code.*** After this the ***WORKDIR*** sets the code directory as the working directory so that any further instructions on the dockerfile occur within this directory.
3. ***COPY*** command copies specific files from the host machine to the image we are creating. The requirements.txt file will be copied into the working directory set previously. After this RUN the pip install command to install the python packages needed for your project.
4. Finally COPY your current working directory's project files from the host machine onto the docker image.

In order to build this image run the simple command
```docker build .``` on the current dockerfile location directory.
For our use case we'll be having multiple images and running this command for every image will be tiresome. Hence the need for docker-compose, More on that as we finalize.

#### 2. Nginx image

```yaml
FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY mysite.conf /etc/nginx/conf.d
```

the commands are the same as for python only specific to nginx
in this case we use the nginx base image, delete the default configuration file that ships with nginx and replace it with our custom config file.
which might look something like this

```python
upstream my_site {
    server web:8080;
}

server {


    listen 80;
    charset utf-8;
    server_name  127.0.0.1;


    client_max_body_size 4G;
    access_log /code/logs/nginx-access.log;
    error_log /code/logs/nginx-error.log;


    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
        if (!-f $request_filename) {
            proxy_pass http://my_site;
            break;
        }
    }

    location /static/ {
        autoindex on;
        alias /code/static_cdn/;
    }

    location /media/ {
        autoindex on;
        alias /code/media_cdn/;
    }

}
```

the file locations will of course be relative to your own configurations.

#### 3. postgres

And lastly we get to the database, in this use case, I used postgres.

```yml
FROM postgres:latest

COPY ./init/01-db_setup.sh /docker-entrypoint-initdb.d/01-db-setup.sh
```

 and now you're thinking
>But Lewis, what's this init file?

for context let's take a look at the postgres directory within our project

postgres
├── postgres/Dockerfile
└── postgres/init
    └── postgres/init/01-db_setup.sh

this is a shell script(docker entry point) specifying what commands to run on the database container, things like creating the database, users and granting privileges to the said user.

```bash
#!/bin/sh

psql -U postgres -c "CREATE USER $POSTGRES_USER PASSWORD '$POSTGRES_PASSWORD'"
psql -U postgres -c "CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER"
```

note: when you create this file, don't forget to make it executable by running
```sudo chmod u+x filename.sh```

#### 4. wrapping things up with docker-compose

at this point, you've probably noticed that we have a lot of dockerfiles,
with docker-compose, we can conveniently build all this images using 
the command
``` docker-compose build . ```
First off, we'll need to create a docker-compose.yml file within our project directory. we'll specify the services needed for our webapp to run within this file.

```yaml
version: '3'
services:

  web:

      build: .
      container_name: great
      volumes: 
      - .:/code
      - static:/code/static_cdn
      - media:/code/media_cdn
      depends_on: 
          - postgres
      expose: 
        - 8080
      command: bash -c "python manage.py collectstatic --no-input && python manage.py makemigrations && python manage.py migrate && gunicorn --workers=3 projectname.wsgi -b 0.0.0.0:8080"

  postgres:
      build: ./postgres
      restart: unless-stopped
      expose:
        - "5432"
      environment:   # will be used by the init script
            LC_ALL: C.UTF-8
            POSTGRES_USER: myuser
            POSTGRES_PASSWORD: mypassowrd.
            POSTGRES_DB: mydb
      volumes:
          - pgdata:/var/lib/postgresql/data/  

  nginx:
      restart: always
      build: ./nginx/
      volumes: 
        - ./nginx/:/etc/nginx/conf.d
        - ./logs/:/code/logs
        - static:/code/static_cdn
        - media:/code/media_cdn
      ports: 
        - "1221:80"
      links:
        - web  
volumes:
  pgdata:
  media:
  static:  
```

Going through this commands line by line:

1. version - specifies the syntax version of docker-compose we'll be using
2. services - from this point, we'll highlight the different services we'll be launching. As specified above, these will be nginx,python and postgres, and name them as we want. In my case i've named them nginx, web and postgres.
3. build - remember all those dockerfiles we spent time writing? Good.using the build command you can specify the location of each individual dockerfile and based on the commands on these files, an image will be build.
4. container_name - this gives the container the name you specified once, the containers are up and running.
5. Volumes - this is a way of sharing data between the docker-containers and the host machine. They also allow persistence of data even after the docker-containers are destroyed and recreated again as this is something you'll find yourself doing often.for more on volumes and how to use them check out [this article.](https://stephenafamo.com/blog/docker-volumes-introduction/)
6. ports - this is to specify which ports from the docker containers are mapped to the host machine, taking the nginx service for example, the container's port 80 is mapped to the host machine's port 1221.
7. expose - Exposing a port makes the port accessible to linked services, but not from the host machine.
8. restart - specifies the behavior of the containers in case of unforeseen shutdown
9. command - instructs the containers which commands to run before starting, in this case the chained commands in the web service are for checking for changes in the database and binding the web service to the port 8080.

#### 5. final steps

To build the images, it's now a matter of simply running
```docker-compose build```
This might take a few minutes to build as the base images are downloading in case you didn't have them locally,

To start the various service containers, simply run
```docker-compose up```

or if you want to specify which compose file to run in case of multiple docker-compose files within one directory
```docker-compose -f filename.yml up```

***DISCLAIMER***: Don't forget to set the Debug = False and allowed hosts, in the settings.py file of django to reflect the domain name or ip-address you'll be using.
In addition to this, change the database from the default sqlite3 that comes with django to reflect the database and usernames we specified
in the environment section of the postgres service like so

```python
DATABASES = {
'default': {
'ENGINE': 'django.db.backends.postgresql_psycopg2',
'NAME': 'mydb',
'USER': 'myuser',
'PASSWORD': 'mypassword',
'HOST': 'postgres',
'PORT': 5432,
}
}
```

and that's it.
To view the running site, run

1. localhost:1221
2. virtual-box-machine-ip:1221(for those using docker-toolbox)

in case you want to stop the containers
```docker-compose stop```

to start the stopped containers
```docker-compose start```

to destroy the containers
```docker-compose down```

you made changes to the docker-files and need those changes applied
```docker-compose down && docker-compose build && docker-compose up```

Now to get the site up and running on the web, simply create a configuration file for your local machines nginx(or apache) on the web server and simply point it to the docker-container running your django app. In this case you'll point it to the nginx container.
127.0.0.1:1221

To get a list of common commands you'll need for docker, read this [concise post](https://dev.to/aduranil/10-docker-compose-and-docker-commands-that-are-useful-for-active-development-22f9)

for laravel developers
[here's something](https://balysnotes.com/single_post/Brian_Baliach/051032437815811656) to get you started with docker

Thank you very much for your time and I hope this article was useful. If you want more of this , feel free to [contact me](https://lewiskori.com/#contact/)

Don't forget to Like, share and [subscribe](https://mailchi.mp/c42286076bd8/lewiskori). If you simply have more to add,drop a comment below.

thanks.
