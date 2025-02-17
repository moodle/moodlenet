import { contributor } from './contributor.endpoint'

declare module '..' {
  interface Scope {
    report: report
  }
}

export type report = moo.persona.usecase<{
  contributor: contributor
}>
export const report: moo.gate.provider.usecase<report> = {
  contributor,
}
