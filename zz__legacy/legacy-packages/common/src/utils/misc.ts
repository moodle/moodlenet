export type ValueOf<T extends object, K extends keyof T = keyof T> = T[K]

export const assertNever = (_never: never, more = ''): never => {
  console.error(`assertNever :`, _never)
  throw new Error(`assertNever ${more}`)
}

// const memoResolver = (...args: any[]) => JSON.stringify(args)
// export const memo = <F extends (...args: any) => any>(f: F) => memoize(f, memoResolver)

export const sequencePromiseCalls = <T>(thunks: (() => Promise<T>)[]) => {
  const results: ({ resolved: true; value: T } | { resolved: false; err: any })[] = []
  return thunks
    .map(
      thunk => () =>
        thunk().then(
          (value: T) => results.push({ resolved: true, value }),
          (err: any) => results.push({ resolved: false, err }),
        ),
    )
    .reduce((prev, curr) => () => prev().then(curr))()
    .then(() => results)
}

export const stringUnionList = <K extends string>(_: { [k in K]: any }): K[] => Object.keys(_) as K[]
