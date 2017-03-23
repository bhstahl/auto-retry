export interface RetryOptions {
  backoffBase?: number;
  logRetries?: boolean | string |
               ((retryCount: number, delay: number) => string | void);
  maxRetries?: number;
  retryCount?: number;
}

export default function retryFunctionOnReject<F extends (...args: any[]) => Promise<any>>(
  fn: F,
  options?: RetryOptions,
): F;