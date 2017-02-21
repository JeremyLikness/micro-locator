# Micro-Locator 

![Build Status](https://api.travis-ci.org/JeremyLikness/micro-locator.svg?branch=master) [![npm](https://img.shields.io/npm/dt/micro-locator.svg)](https://www.npmjs.com/package/micro-locator)

A service locator for microservices. 

Originally written by [Jeremy Likness](https://twitter.com/jeremylikness).

Contact me on Twitter or via [my blog](https://csharperimage.jeremylikness.com).

## Reference 

Install: `npm -i micro-locator --save`

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

You can choose to truncate the path you rebase (for example, rebase `/api` to `http://api.myapp.com/` and remove the `/api` prefix) and replace specific end points. You may configure as many rebases and replacements at any level you like, allowing micro-locator to scale to large applications.

The `configure` function enables simple, one-pass configuration when you bootstrap your app, and you can simply register the locator function with your dependency injection to hide any implementation details of the micro-services locator itself. 

## Examples 

Based on [these test scenarios](https://github.com/JeremyLikness/micro-locator/blob/master/test/microLocator.scenarios.spec.ts):

### Rebase all calls 

```TypeScript
loc.rebase('/', 'http://production'); // everything
loc.resolve('/api/accounting/func1'); 
// http://production/api/accounting/func1
```

### Rebase to new path 

```TypeScript
loc.rebase('/api/billing', 'http://billing.production/');
// everything under /api/billing 
loc.resolve('/api/billing/func3');
// http://billing.production/api/billing/func3
```

### Rebase and truncate the path 

```TypeScript 
loc.rebase('/api/billing', 'http://billing.production').truncate();
// everything under /api/billing 
loc.resolve('/api/billing/func3');
// http://billing.production/func3 
```

### Replace a node 

```TypeScript 
loc.replace('/api/accounting/func2', 'http://experimental/func');
// only for the specific /api/accounting/func2 request
loc.resolve('/api/accounting/func2');
// http://experimental/func 
```

### Configuration syntax for bootstrapping 

```TypeScript 
loc.configure([{
    rebase: ['/', 'http://production']
}, {
    rebase: ['/api/billing', 'http://billing.production/'],
    truncate: true
}, {
    replace: ['/api/accounting/func2', 'http://experimental/func']
}]);
```
