import type { Issuer } from '@moodlenet/core-domain/resource'

export type IssuerProvider = (
  creator: ['current-resource-creator-id', string] | ['creator', boolean],
) => Promise<Issuer>

export type Providers = {
  getIssuer: IssuerProvider
}
const providers: Providers = {
  getIssuer: unimplemented as any,
}
export default providers

export function setProviders(setProviders: Partial<Providers>) {
  for (const k in providers) {
    const providerKey = k as keyof Providers
    providers[providerKey] = setProviders[providerKey] ?? (providers[providerKey] as any)
  }
}

function unimplemented() {
  throw new Error('unimplemented')
}
