---
title: Deploying Next.js apps to a VPS using Github actions and  Docker
author: Lewis Kori
tags: ["github", "javascript", "nextjs", "todayilearned"]
cover_image: https://res.cloudinary.com/lewiskori/image/upload/v1639724215/next-actions_2_eh22o2.png
description: A deep dive into setting up a continuous delivery pipeline to digital ocean for next.js apps with github actions
dateCreated: 2021-12-17
sponsors: ["Digital Ocean","Scraper API"]
---

Recently, I had to deploy a project to a DigitalOcean droplet. One of the features I really wanted for this particular project was a Continuous Delivery pipeline.

The continuous delivery website defines this as the ability to get changes of all types—including new features, configuration changes, bug fixes and experiments—into production, or into the hands of users, safely and quickly in a sustainable way.

The goal is to make deployments—whether of a large-scale distributed system, a complex production environment, an embedded system, or an app—predictable, routine affairs that can be performed on demand.

For my case I wanted the web app to auto-deploy to the VPS whenever I pushed changes to the main Github branch. This would consequently save a lot of development time.

## Alternative solutions

There are alternative and hustle-free solutions to this such as [Vercel](https://vercel.com/) and [DigitalOcean app platform](https://www.digitalocean.com/products/app-platform/). However one may take my route if:

 1. You want to better understand Github actions.
 2. Learn more about docker.
 3. For Vercel's case, your client or organization may want to keep their apps in a central platform for easier management.

## Prerequisites

Please note that some of the links below are affiliate links and at no additional cost to you. Know that I only recommend products, tools and learning services I've personally used and believe are genuinely helpful. Most of all, I would never advocate for buying something you can't afford or that you aren't ready to implement.

1. A [Github account](https://github.com)
2. A virtual private server. I used a DigitalOcean droplet running Ubuntu 20.04 LTS. Sign up with [my referral link](https://www.digitalocean.com/?refcode=2282403be01f&utm_campaign=Referral_Invite&utm_medium=Referral_Program) and get $100 in credit valid for 60 days.

## Create next.js app

We'll use npx to create a standard next.js app

```sh
npx create-next-app meta-news && cd meta-news
```

Once we're inside the project directory, we'll install a few dependencies for demonstration purposes

```sh
yarn add @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^4 axios
```

We'll also declare environment variables inside the `.env.local` file. We can then reference these variables from our app like so `process.env.NEXT_PUBLIC_VARIABLE_NAME`

```sh
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api
NEXT_PUBLIC_META_API_KEY=your_api_key
```

These variables are for demonstration purposes only. So we won't really be referencing them within our app. An example of a place you'd call them is when instantiating an axios instance or setting a google analytics id and you don't want to commit that to the version control system.

Let's do a quick test run. The app should be running on `localhost:3000` if everything is setup properly.

```sh
yarn start
```

## Dockerizing the app

Docker is an open-source tool that automates the deployment of an application inside a software container. which are like virtual machines, only more portable, more resource-friendly, and more dependent on the host operating system. for detailed information on the workings of docker, I'd recommend reading [this article](https://dev.to/django_stars/what-is-docker-and-how-to-use-it-with-python-tutorial-87a) and for those not comfortable reading long posts, [this tutorial series on youtube](https://www.youtube.com/playlist?list=PLhW3qG5bs-L99pQsZ74f-LC-tOEsBp2rK) was especially useful in introducing me to the concepts of docker.

We'll add a Dockerfile to the project root by running
`touch Dockerfile` within the CLI.

```dockerfile
# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat && apk add git
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --immutable


# Rebuild the source code only when needed
FROM node:alpine AS builder
# add environment variables to client code
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_META_API_KEY


ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_META_API_KEY=$NEXT_PUBLIC_META_API_KEY

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ARG NODE_ENV=production
RUN echo ${NODE_ENV}
RUN NODE_ENV=${NODE_ENV} yarn build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration. 
# Copy all necessary files used by nex.config as well otherwise the build will fail.
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pages ./pages

USER nextjs

# Expose
EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1
CMD ["yarn", "start"]
```

We're running a [multi-stage build](https://docs.docker.com/develop/develop-images/multistage-build/) for this deployment.
Notice the ARG and ENV keywords? That's how we pass our environment variables to the client code since we won't have access to any `.env` files within the container. More on this later.

We'll then build and tag our image

```sh
docker build --build-arg NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api --build-arg NEXT_PUBLIC_META_API_KEY=your_api_key -t meta-news .
```

This may take a while depending on your internet connection and hardware specs.
Once everything checks out run the container

```sh
docker run -p 3000:3000 meta-news
```

Launch your browser and your app should be accessible at 'http://localhost:3000' 🎉

## Set up Github actions

GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline. You can create workflows that build and test every pull request to your repository, or deploy merged pull requests to production.

For more about this wonderful platform, head over to their [official tutorial page](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)

We'll create our first workflow by running the following commands in the CLI. You can use the GUI if you aren't comfortable with the command line 🤗.

```sh
mkdir .github && mkdir ./github/workflow && touch ./github/workflows/deploy.yml && nano ./github/workflows/deploy.yml
```

Populate the deploy.yml file with the following values.

```yaml
name: Build and Deploy

# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the main branch
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      logLevel:
        description: 'Log level'
        required: true
        default: 'warning'

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    container: node:14

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - name: Build and Publish to Github Packages Registry
        uses: elgohr/Publish-Docker-Github-Action@master
        env:
          NEXT_PUBLIC_BACKEND_URL: ${{ secrets.APP_NEXT_PUBLIC_BACKEND_URL }}
          NEXT_PUBLIC_META_API_KEY: ${{ secrets.APP_NEXT_PUBLIC_META_API_KEY }}
        with:
          name: my_github_username/my_repository_name/my_image_name
          registry: ghcr.io
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets. GITHUB_TOKEN }}
          dockerfile: Dockerfile
          buildargs: NEXT_PUBLIC_BACKEND_URL,NEXT_PUBLIC_META_API_KEY
          tags: latest

      - name: Deploy package to digitalocean
        uses: appleboy/ssh-action@master
        env:
          GITHUB_USERNAME: ${{ secrets.USERNAME }}
          GITHUB_TOKEN: ${{ secrets. GITHUB_TOKEN }}
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          port: ${{ secrets.DEPLOY_PORT }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          envs: GITHUB_USERNAME, GITHUB_TOKEN
          script: |
            docker login ghcr.io -u $GITHUB_USERNAME -p $GITHUB_TOKEN
            docker pull ghcr.io/my_github_username/my_repository_name/my_image_name:latest
            docker stop containername
            docker system prune -f
            docker run --name containername -dit -p 3000:3000 ghcr.io/my_github_username/my_repository_name/my_image_name:latest

```

You may have noticed our actions are very secretive 😂. Worry not, this is deliberately done to protect your sensitive information from prying eyes. They're encrypted environment variables that you(repo owner) creates for a repo that uses Github actions.

> One thing to note is that the `GITHUB_TOKEN` secret is [automatically created](https://docs.github.com/en/actions/security-guides/automatic-token-authentication) for us when running the action.

To create secrets go to your repository > settings > left-sidebar > secrets
![secrets_creation](https://docs.github.com/assets/cb-21851/images/help/repository/repo-actions-settings.png)

For an in-depth walkthrough, see [this guide](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

The expected Github secrets are

```sh
  APP_NEXT_PUBLIC_BACKEND_URL - live backend server url
  APP_NEXT_PUBLIC_META_API_KEY - prod api key to thirdparty integration
  DEPLOY_HOST - IP to Digital Ocean (DO) droplet
  DEPLOY_KEY - SSH secret (pbcopy < ~/.ssh/id_rsa) and the public key should be added to `.ssh/authorized_keys` in server
  DEPLOY_PORT - SSH port (22)
  DEPLOY_USER  - User on droplet
  USERNAME - Your Github username
```

### Lift Off 🚀

Push to the main branch

```sh
git add -A
git commit -m "Initial commit"
git push origin main
```

If everything runs as expected, you should see a green checkmark in your repository with the build steps complete.

![Github_actions_deploy](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ts6y2zrz339m3vlenqsj.png)

From there, you can setup a reverse proxy such as nginx within your server and point the host to "http://localhost:3000".

Yay!🥳 we have successfully created a continuous delivery pipeline and hopefully, now you'll concentrate on code instead of infrastructure.

Should you have any questions, please do not hesitate to reach out to me on [Twitter](https://twitter.com/lewis_kihiu).
Comment below if you have feedback or additional input.
