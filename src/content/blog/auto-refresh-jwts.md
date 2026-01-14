---
title: How to auto-refresh jwts using Axios interceptors.
author: Lewis Kori
tags: ["javascript", "vue", "tutorial"]
cover_image: https://res.cloudinary.com/lewiskori/image/upload/v1612583647/blog/axios_eonjx1.jpg
description: A deep dive into axios interceptors and how you can efficiently use them in jwt authentication.
dateCreated: 2021-02-06
sponsors: ["Scraper API", "Digital Ocean"]
---

I've covered JWT authentication in some of my previous posts. For a quick recap, I'll briefly go over what JWTs are.

JSON Web Token (JWT) is an Internet standard for creating JSON-based access tokens that assert some number of claims. For example, a server could generate a token that has the flag "logged in as admin" or "logged in like this user" and provide that to a client. The client could then use that token to prove that it is logged in as admin. The tokens are signed by one party's private key (usually the server's) so that both parties can verify that the token is legitimate. The tokens are designed to be compact, URL-safe, and usable especially in a web-browser single-sign-on (SSO) context. JWT claims can be typically used to pass the identity of authenticated users between an identity provider and a service provider.
Unlike token-based authentication, JWTs are not stored in the application's database. This is in effect makes them stateless.

JWT authentication typically involves two tokens. These are an access token and refresh token. The access token authenticates HTTP requests to the API and for protected resources must be provided in the request headers.

The token is usually shortlived to enhance security and therefore to avoid users or applications from logging in every few minutes, the refresh token provides a way to retrieve a newer access token. The refresh token typically has a longer expiry period than the access token.

In my previous posts, I used [Django to implement JWT authentication](/blog/user-registration-and-authorization-on-a-django-api-with-djoser-and-json-web-tokens/) but this can be achieved in most backend frameworks.

In this walkthrough, we'll be using Axios which is a popular promise-based HTTP client which is written in JavaScript to perform HTTP communications. It has a powerful feature called interceptors. Interceptors allow you to modify the request/response before the request/response reaches its final destination.

We'll use vuex for global state management but you can just as easily implement the config in any javascript framework or method you choose.

## project initialization

Since this is a Vue project, we'll first need to initialize a Vue project. Check out the [vue.js installation guide for more information.](https://cli.vuejs.org/guide/installation.html)

```
vue create interceptorApp
```

After initializing the project we'll need to install vuex and a neat library called [vuex-persistedstate](https://www.npmjs.com/package/vuex-persistedstate). This will persist our state to local storage as the store data is cleared on the browser tab refresh.

```
yarn add vuex vuex-persistedstate
```

## setting up the store

To initialize the vuex store, we'll have to create a store folder in the `src` directory. In the store folder, create an index.js file and fill it with the following content.

```jsx
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import router from "../router"; // our vue router instance

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {},
  mutations: {},
  actions: {},
  getters: {}
});

```

We'll leave this as it is for now. We'll populate the various sections later on. For now, we'll register the store in the main.js file.

```jsx
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
```

## state and mutations

The only way to actually change state in a Vuex store is by committing a mutation. Vuex mutations are very similar to events: each mutation has a string type and a handler. The handler function is where we perform actual state modifications, and it will receive the state as the first argument.

Our application will have a few state objects and mutations.

```jsx
  state: {
    refresh_token: "",
    access_token: "",
    loggedInUser: {},
    isAuthenticated: false
  },
  mutations: {
    setRefreshToken: function(state, refreshToken) {
      state.refresh_token = refreshToken;
    },
    setAccessToken: function(state, accessToken) {
      state.access_token = accessToken;
    },
    // sets state with user information and toggles 
    // isAuthenticated from false to true
    setLoggedInUser: function(state, user) {
      state.loggedInUser = user;
      state.isAuthenticated = true;
    },
    // delete all auth and user information from the state
    clearUserData: function(state) {
      state.refresh_token = "";
      state.access_token = "";
      state.loggedInUser = {};
      state.isAuthenticated = false;
    }
  },
```

The code is so far pretty self-explanatory, the mutations are updating our state values with relevant information, but where is this data coming from? Enter actions.

## Vuex Actions

Actions are similar to mutations, the differences being that:

- Instead of mutating the state, actions commit mutations.
- Actions can contain arbitrary asynchronous operations.

This means that actions call the mutation methods which will then update the state. Actions can also be asynchronous allowing us to make backend API calls.

```jsx
  actions: {
    logIn: async ({ commit, dispatch }, payload) => {
      const loginUrl = "v1/auth/jwt/create/";
      try {
        await axios.post(loginUrl, payload).then(response => {
          if (response.status === 200) {
            commit("setRefreshToken", response.data.refresh);
            commit("setAccessToken", response.data.access);
            dispatch("fetchUser");
            // redirect to the home page
            router.push({ name: "home" });
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    refreshToken: async ({ state, commit }) => {
      const refreshUrl = "v1/auth/jwt/refresh/";
      try {
        await axios
          .post(refreshUrl, { refresh: state.refresh_token })
          .then(response => {
            if (response.status === 200) {
              commit("setAccessToken", response.data.access);
            }
          });
      } catch (e) {
        console.log(e.response);
      }
    },
    fetchUser: async ({ commit }) => {
      const currentUserUrl = "v1/auth/users/me/";
      try {
        await axios.get(currentUserUrl).then(response => {
          if (response.status === 200) {
            commit("setLoggedInUser", response.data);
          }
        });
      } catch (e) {
        console.log(e.response);
      }
    }
  },
```

We'll go over the methods one by one.
The login function does exactly what it's called. This will make a backend call to our jwt creation endpoint. We expect the response to contain a refresh and access token pair.
Depending on your configuration this can change. So, implement the method accordingly.
We then call the mutations that'll set the access and refresh tokens to state. If successful, we'll call the `fetchUser` action by using the dispatch keyword. This is a way of calling actions from within vuex.

The `refreshToken` sends an HTTP POST request to our backend with the current refresh token and if valid, receives a new access token, this then replaces the expired token.

## Getters

Finally, we'll expose our state data through getters so as to make it easy to reference this data.

```jsx
  getters: {
    loggedInUser: state => state.loggedInUser,
    isAuthenticated: state => state.isAuthenticated,
    accessToken: state => state.access_token,
    refreshToken: state => state.refresh_token
  }
```

## Axios interceptors

So far so good. The most difficult part has been covered!
To set up the interceptors we'll create a helpers folder in our src directory and create a file called `axios.js`

This will contain the following code.

```jsx
import axios from "axios";
import store from "../store";
import router from "../router";

export default function axiosSetUp() {
  // point to your API endpoint
  axios.defaults.baseURL = "<http://127.0.0.1:8000/api/>";
  // Add a request interceptor
  axios.interceptors.request.use(
    function(config) {
      // Do something before request is sent
      const token = store.getters.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function(response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    async function(error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url.includes("auth/jwt/refresh/")
      ) {
        store.commit("clearUserData");
        router.push("/login");
        return Promise.reject(error);
      } else if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await store.dispatch("refreshToken");
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
}
```

From the code above, we'll be importing axios and configuring it inside the `axiosSetup` method. The first thing we'll do is declaring the baseURL for this particular axios instance. You can point this to your backend URL. The configuration will make it easier when making API calls as we won't have to explicitly type the entire URL on each HTTP request.

### request interceptor

Our first interceptor will be a request interceptor. We'll modify each request coming from our frontend by appending authorization headers to the request. This is where we'll be utilizing the access token.

```jsx
// Add a request interceptor
  axios.interceptors.request.use(
    function(config) {
      // Do something before request is sent
      // use getters to retrieve the access token from vuex 
      // store
      const token = store.getters.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
```

What we're doing is checking if there's an access token in store and if it's available, modifying our Authorization header so as to utilize this token on each and every request.
In case the token isn't available, the headers won't contain the Authorization key.

### response interceptor

We'll be extracting the [axios config](https://github.com/axios/axios#request-config) for this section. Kindly check out their documentation for more insight on what it contains.

```jsx
// Add a response interceptor
  axios.interceptors.response.use(
    function(response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    // remember to make this async as the store action will 
    // need to be awaited
    async function(error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url.includes("auth/jwt/refresh/")
      ) {
        store.commit("clearUserData");
        router.push("/login");
        return Promise.reject(error);
      } else if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // await execution of the store async action before 
        // return
        await store.dispatch("refreshToken");
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
```

We have two callbacks in the response interceptors. One gets executed when we have a response from the HTTP call and another one gets executed when we have an error.
We will return our response when there is no error. We’ll handle the error if there is any.

The first if statement checks whether the request received a 401(unauthorized) error which is what happens when we try and pass invalid credentials to our backend and whether our original request's URL was to the refresh endpoint.
If this was the case, it means that our refresh token is also expired and hence, we'll log out the user and clear their store data. We'll then redirect the user to the login page so as to retrieve new access credentials.

In the second block(else if), we'll check again if the request has failed with status code 401(unauthorized) and this time if it failed again.
In case it's not a retry, we'll dispatch the `refreshToken` action and retry our original HTTP request.

Finally, for all other failed requests whose status falls outside the range of 2xx, we'll return the rejected promise which can be handled else in our app.

## making axios globally available in our vue app

With the interceptors all set up, we'll need a way for our to access axios and utilize all these goodies!
To do that, we'll import the `axiosSetup` method in our main.js file.

```jsx
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import axiosSetup from "./helpers/interceptors";

// call the axios setup method here
axiosSetup()

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
```

That's it!! we've set up Axios interceptors and they're globally available on our app. Every Axios call will implement them be it in components or Vuex!

I hope you found the content helpful!
If you have any questions, feel free to leave a comment. My [Twitter dm](https://twitter.com/lewis_kihiu) is always open and If you liked this walkthrough, [subscribe to my mailing list](https://mailchi.mp/c42286076bd8/lewiskori) to get notified whenever I make new posts.

### open to collaboration

I recently made a collaborations page on my website. Have an interesting project in mind or want to fill a part-time role?
You can now [book a session](/collaborate) with me directly from my site.
