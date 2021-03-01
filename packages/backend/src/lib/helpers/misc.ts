export type ValueOf<T extends object, K extends keyof T = keyof T> = T[K]

export const never = (more = '') => {
  throw new Error(`never ${more}`)
}

export const once = <F extends Function>(f: F): F => {
  const placeholder = Symbol()
  let ret: any = placeholder
  const fOnce = (((...args: any) => {
    if (ret === placeholder) {
      ret = f(...args)
    }
    return ret
  }) as any) as F
  return fOnce
}

export const sequencePromiseCalls = <T>(thunks: (() => Promise<T>)[]) => {
  const results: ({ resolved: true; value: T } | { resolved: false; err: any })[] = []
  return thunks
    .map(thunk => () =>
      thunk().then(
        (value: T) => results.push({ resolved: true, value }),
        (err: any) => results.push({ resolved: false, err }),
      ),
    )
    .reduce((prev, curr) => () => prev().then(curr))()
    .then(() => results)
}
