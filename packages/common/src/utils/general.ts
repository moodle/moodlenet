export function throwOnNever(shouldBeNever: never, details = 'no details'): never {
  throw new Error(`Didn't expect to get here never:[${shouldBeNever}]: ${details}`)
}

type DomainAddr = string
export const validateDomainString = (domainStr: string): domainStr is DomainAddr => {
  // FIXME: tb implemented
  return typeof domainStr === 'string'
}
