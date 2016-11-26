import test from 'ava';
import autoRetry from '../src/index';

test('autoRetry retries on rejection', (t) => {
    let timesFunctionWasCalled = 0;
    const rejectedFunction = () => {
        timesFunctionWasCalled++;
        return Promise.reject('failed');
    };

    const rejectedFunctionWithRetry = autoRetry(rejectedFunction, 1);
    return rejectedFunctionWithRetry().catch((result) => {
        t.true(result === 'failed');
        t.true(timesFunctionWasCalled === 2);
    });
});

test('autoRetry resolves successfully', (t) => {
    let timesFunctionWasCalled = 0;
    const resolvedFunction = () => {
        timesFunctionWasCalled++;
        return Promise.resolve('success');
    };

    const resolvedFunctionWithRetry = autoRetry(resolvedFunction, 1);
    return resolvedFunctionWithRetry().then((result) => {
        t.true(result === 'success');
        t.true(timesFunctionWasCalled === 1);
        return;
    });
});

test('autoRetry responds to default parameters', (t) => {
    let timesFunctionWasCalled = 0;
    const rejectedFunction = () => {
        timesFunctionWasCalled++;
        return Promise.reject('failed');
    };

    const resolvedFunctionWithRetry = autoRetry(rejectedFunction);
    return resolvedFunctionWithRetry().catch((result) => {
        t.true(result === 'failed');
        t.true(timesFunctionWasCalled === 3);
        return;
    });
});

test('autoRetry responds to custom parmeters', (t) => {
    let timesFunctionWasCalled = 0;
    const rejectedFunction = () => {
        timesFunctionWasCalled++;
        return Promise.reject('failed');
    };

    const rejectedFunctionWithRetry = autoRetry(rejectedFunction, 3, 2);
    return rejectedFunctionWithRetry().catch((result) => {
        t.true(result === 'failed');
        t.true(timesFunctionWasCalled === 2);
    });
});
