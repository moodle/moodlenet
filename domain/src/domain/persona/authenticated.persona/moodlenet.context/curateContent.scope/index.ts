import { bookmark } from './bookmark.usecase'
import { follow } from './follow.usecase'
import { like } from './like.usecase'
import { report } from './report.usecase'

declare module '..' {
  interface Context {
    curateContent: curateContent
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type curateContent = moo.persona.scope<moo<Scope>>
export const curateContent: moo.gate.provider.scope<curateContent> = {
  follow,
  bookmark,
  like,
  report,
}
