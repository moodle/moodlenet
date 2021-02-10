export function throwOnNever(shouldBeNever: never, details = 'no details'): never {
  throw new Error(`Didn't expect to get here never:[${shouldBeNever}]: ${details}`)
}
