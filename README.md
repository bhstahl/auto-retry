
# auto-retry: automatically retry any function

[![npm package](https://nodei.co/npm/auto-retry.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/auto-retry/)

[![Build Status](https://travis-ci.org/bhstahl/auto-retry.svg?branch=master)](https://travis-ci.org/bhstahl/auto-retry)
[![Coverage Status](https://coveralls.io/repos/github/bhstahl/auto-retry/badge.svg?branch=master)](https://coveralls.io/github/bhstahl/auto-retry?branch=master)

Automatically add exponential retry abilities to any function that returns a promise, only rejecting after the retries fail.

```js
const requestPromise = require('request-promise');
const autoRetry = require('auto-retry');

// Construct a new function with automatic retry capabilites
const requestWithRetry = autoRetry(requestPromise, 3);

// Make a request
requestWithRetry('http://www.vimeo.com')
    .then((response) => {
        // Process html as usual
    })
    .catch((error) => {
        // Only called after 3 failed attempts
    });
```
