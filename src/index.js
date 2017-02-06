/**
 * Higher order function that makes any promise-returning-function
 * retryable with a jitter'd exponential backoff.
 *
 * @param  {Function} fn                    Function to be made retryable.
 * @param  {Object}   options               Configuration.
 * @param  {Number}   options.backoffBase   Base interval for backoff wait time (in ms).
 * @param  {Boolean}  options.logRetries    Log retry attempts to the console.
 * @param  {Number}   options.maxRetries    Total number of retries.
 * @param  {Number}   options.retryCount    Current retry count.
 * @return {Function}
 */
export default function retryFunctionOnReject(fn, options) {
    const DEFAULTS = {
        backoffBase: 1000,
        logRetries: false,
        maxRetries: 2,
        retryCount: 0
    };

    options = Object.assign(DEFAULTS, options);
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args)
            .then(resolve)
            .catch((error) => {
                options.retryCount++;
                if (options.retryCount > options.maxRetries) {
                    return reject(error);
                }

                // Spread out retries with jitter
                // https://www.awsarchitectureblog.com/2015/03/backoff.html
                const jitter = (Math.round(Math.random() * options.backoffBase));
                const backoff = (Math.pow(2, options.retryCount) * options.backoffBase);
                const delay = jitter + backoff;

                if (options.logRetries) {
                    console.log(`[auto-retry] ${fn.name || 'function'} was rejected. Retrying #${options.retryCount} after ${delay}ms.`);
                }

                const nextFn = retryFunctionOnReject(fn, options);
                return setTimeout(() => {
                    nextFn(...args).then(resolve).catch(reject);
                }, delay);
            });
        });
    };
}
