import test from 'ava';
import autoRetry from '../src/index';

test('autoRetry resolves successfully', (t) => {
    let timesFunctionWasCalled = 0;
    const resolvedFunction = () => {
        timesFunctionWasCalled++;
        return Promise.resolve('success');
    };

    const resolvedFunctionWithRetry = autoRetry(resolvedFunction);
    return resolvedFunctionWithRetry().then((result) => {
        t.true(result === 'success');
        t.true(timesFunctionWasCalled === 1);
        return;
    });
});

test('autoRetry resolves successfully after rejection', (t) => {
    let timesFunctionWasCalled = 0;
    const resolvedFunction = () => {
        timesFunctionWasCalled++;
        if (timesFunctionWasCalled < 2) {
            return Promise.reject('failed');
        }
        return Promise.resolve('success');
    };

    const resolvedFunctionWithRetry = autoRetry(resolvedFunction);
    return resolvedFunctionWithRetry().then((result) => {
        t.true(result === 'success');
        t.true(timesFunctionWasCalled === 2);
        return;
    }).catch(console.warn);
});

test('autoRetry rejects eventually', (t) => {
    let timesFunctionWasCalled = 0;
    const resolvedFunction = () => {
        timesFunctionWasCalled++;
        return Promise.reject('failed');
    };

    const resolvedFunctionWithRetry = autoRetry(resolvedFunction);
    return resolvedFunctionWithRetry().catch((result) => {
        t.true(result === 'failed');
        t.true(timesFunctionWasCalled === 3);
        return;
    });
});


test('autoRetry responds to custom options', (t) => {
    let timesFunctionWasCalled = 0;
    const rejectedFunction = () => {
        timesFunctionWasCalled++;
        return Promise.reject('failed');
    };

    const options = { maxRetries: 1, logRetries: true, backoffBase: 50 };
    const rejectedFunctionWithRetry = autoRetry(rejectedFunction, options);
    return rejectedFunctionWithRetry().catch((result) => {
        t.true(result === 'failed');
        t.true(timesFunctionWasCalled === 2);
    });
});

test.serial('autoRetry logs default message', (t) => {
    const origLog = console.log;

    let logMessage;

    console.log = (message) => {
        logMessage = message;
    };

    const options = { maxRetries: 1, logRetries: true, backoffBase: 50 };
    const rejectedFunction = () => Promise.reject('failed');
    const rejectedFunctionWithRetry = autoRetry(rejectedFunction, options);
    return rejectedFunctionWithRetry().catch(() => {
        t.regex(logMessage, /^\[auto-retry] [a-zA-Z]+ was rejected\. Retrying #1 after \d+ms\.$/);
    }).then(() => {
        console.log = origLog;
        return undefined;
    });
});

test('autoRetry calls onRetry callback', (t) => {
    let timesFunctionWasCalled = 0;
    let callbackRetryCount;
    let callbackDelay;
    const onRetry = (retryCount, delay) => {
        timesFunctionWasCalled++;
        callbackRetryCount = retryCount;
        callbackDelay = delay;
    };

    const options = { maxRetries: 1, backoffBase: 50, onRetry };
    const rejectedFunction = () => Promise.reject('failed');
    const rejectedFunctionWithRetry = autoRetry(rejectedFunction, options);
    return rejectedFunctionWithRetry().catch(() => {
        t.true(timesFunctionWasCalled === 1);
        t.true(callbackRetryCount === 1);
        t.true(typeof callbackDelay === 'number');
    });
});
