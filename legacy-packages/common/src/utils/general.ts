export function throwOnNever(shouldBeNever: never, details = 'no details'): never {
  throw new Error(`Didn't expect to get here never:[${shouldBeNever}]: ${details}`)
}

type DomainAddr = string
export const validateDomainString = (domainStr: string): domainStr is DomainAddr => {
  // FIXME: tb implemented
  return typeof domainStr === 'string'
}

export const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/ //https://regexr.com/3e6m0
