# Micro-Locator 

![Build Status](https://api.travis-ci.org/JeremyLikness/micro-locator.svg?branch=master)

A service locator for microservices. 

## Reference 

```TypeScript 
import { Locator } from 'micro-locator';

// do this when you bootstrap your app 
let loc = new Locator(); 
loc.configure({...});

// use this throughout your app
let locate = (sig: string) => loc.resolve(sig);
```

## Quick Start 

Most front-end web applications either hard-code calls to Web APIs or configure a base URL, something like: 

`http://localost:1234/someapi` 

The goal of micro-locator is to make it simple and easy to follow a standard convention for calling APIs throughout your app, and then override the actual end points as needed. For example, consider the following end points: 

`/api/accounting/func1`

`/api/accounting/func2`

`/api/billing/func3`

`/api/billing/func4` 

These may be hosted in a local build and the relative syntax is fine. In production, however, a dedicated webserver hosts the end points on a domain:

`http://api.myapp.com/api...` 

With micro-locator, you change a call like this: 

`$http.get('/api/accounting/func1')`

to this: 

`$http.get(locate('/api/accounting/func1'))` 

If you do nothing, the endpoint is simply reflected back. For production, just configure the locator like this: 

`locator.rebase('/', 'http://api.myapp.com/)` 

Now all urls will resolve like this: 

`/api/accounting/func1 -> http://api.myapp.com/api/accounting/func1` 

You can choose to truncate the path you rebase (for example, rebase `/api` to `http://api.myapp.com/` and remove the `/api` prefix) and replace specific end points. 

The `configure` function enables simple, one-pass configuration when you bootstrap your app, and you can simply register the locator function with your dependency injection to hide any implementation details of the micro-services locator itself. 

