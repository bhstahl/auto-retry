export interface RetryOptions {
  backoffBase?: number;
  logRetries?: boolean;
  maxRetries?: number;
  retryCount?: number;
  onRetry?(retryCount: number, delay: number): void;
}

export default function retryFunctionOnReject<F extends (...args: any[]) => Promise<any>>(
  fn: F,
  options?: RetryOptions,
): F;