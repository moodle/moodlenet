declare module 'promise-retry' {
  export type PromiseRetryOpts = {
    retries: number
    factor: number
    minTimeout: number
    maxTimeout: number
    randomize: boolean
  }

  export type RetryFn<T> = (retry: (err: any) => unknown, number: number) => Promise<T>

  interface PromiseRetry {
    <T>(fn: RetryFn<T>, opts?: Partial<PromiseRetryOpts>): Promise<T>
    <T>(opts: Partial<PromiseRetryOpts>, fn: RetryFn<T>): Promise<T>
  }

  const promiseRetry: PromiseRetry

  export default promiseRetry
}
