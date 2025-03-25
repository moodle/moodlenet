import { contributors } from './contributors.usecase'

declare module '..' {
  interface Context {
    manageReports: manageReports
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type manageReports = moo.persona.scope<moo<Scope>>
export const manageReports: moo.gate.provider.scope<manageReports> = {
  contributors,
}
