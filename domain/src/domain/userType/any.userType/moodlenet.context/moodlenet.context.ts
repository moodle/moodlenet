import { viewPublicContent } from './viewPublicContent.scope/viewPublicContent.scope'

export interface Moodlenet {
  viewPublicContent: viewPublicContent
}

export type moodlenet = moo.def.userType.context<moo<Moodlenet>>
export const moodlenet: moo.def.gate.provider.context<moodlenet> = {
  viewPublicContent,
}
