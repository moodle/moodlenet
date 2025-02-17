import { ignoreReports } from './ignoreReports.endpoint'
import { viewList } from './viewList.endpoint'

declare module '..' {
  interface Scope {
    contributors: contributors
  }
}

export type contributors = moo.persona.usecase<{
  viewList: viewList
  ignoreReports: ignoreReports
}>
export const contributors: moo.gate.provider.usecase<contributors> = {
  viewList,
  ignoreReports,
}
