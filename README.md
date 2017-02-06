
# auto-retry

[![npm package](https://nodei.co/npm/auto-retry.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/auto-retry/)

[![Build Status](https://travis-ci.org/bhstahl/auto-retry.svg?branch=master)](https://travis-ci.org/bhstahl/auto-retry)
[![Coverage Status](https://coveralls.io/repos/github/bhstahl/auto-retry/badge.svg?branch=master)](https://coveralls.io/github/bhstahl/auto-retry?branch=master)

## Description

Automatically add exponential retry abilities to any function that returns a promise, only rejecting after the retries fail.

## Installation

```sh
$ npm install auto-retry
```

## Example

```js
const requestPromise = require('request-promise');
const autoRetry = require('auto-retry');

// Construct a new function with automatic retry capabilities
const requestWithRetry = autoRetry(requestPromise);

// Make a request
requestWithRetry('http://www.vimeo.com')
    .then((response) => {
        // Process html as usual
    })
    .catch((error) => {
        // Only called after 3 failed attempts
    });
```

## Documentation

#### autoRetry(fn, options) ⇒ <code>function</code>
Higher order function that makes any promise-returning-function
retryable with a jittr'd exponential backoff.

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to be made retryable. |
| options | <code>Object</code> | Configuration. |
| options.maxRetries | <code>Number</code> | Total number of retries. |
| options.retryCount | <code>Number</code> | Current retry count. |
| options.backoffBase | <code>Number</code> | Base interval for backoff wait time (in ms). |


```js
// Construct a new function to only retry once
const requestWithRetry = autoRetry(requestPromise, { maxRetries: 1 });


// Set a minimum backoff interval to 2 seconds
const requestWithRetry = autoRetry(requestPromise, { backoffBase: 2000 });
```
