
/**
 * Higher order function that makes any promise-returning-function
 * retryable with a jittr'd exponential backoff.
 *
 * @param  {Function} fn            Function to be made retryable.
 * @param  {Number}   maxRetries    Total number of retries.
 * @param  {Number}   retryCount    Current retry count.
 * @return {Function}
 */
export default function retryFunctionOnReject(fn, maxRetries = 2, retryCount = 0) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args)
            .then(resolve)
            .catch((error) => {
                const count = retryCount + 1;
                if (count > maxRetries) {
                    return reject(error);
                }
                const delay = (Math.pow(2, count) * 1000) + (Math.round(Math.random() * 1000));
                const nextFn = retryFunctionOnReject(fn, maxRetries, count);
                return setTimeout(() => {
                    nextFn(...args).then(resolve).catch(reject);
                }, delay);
            });
        });
    };
}
