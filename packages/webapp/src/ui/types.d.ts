export * from './types/formBag'

export type UseProps<T, A = []> = (...args: A) => T
export type UsePropsList<UP extends UseProps<any, any>> = [hook: UP, key: string][]
