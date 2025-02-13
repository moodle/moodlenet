import { curateMyDrafts } from './curateMyDrafts.scope'

declare module '..' {
  interface Persona {
    mySpace: mySpace
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type mySpace = moo.persona.context<moo<Context>>
export const mySpace: moo.gate.context<mySpace> = {
  curateMyDrafts,
}
