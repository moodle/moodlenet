import { ExtDef, ExtId, ExtName, ExtVersion } from '@moodlenet/core'
import { fetch, subRaw } from './xhr-adapter'

export const priHttp = {
  sub: subRaw,
  fetch,
}

export function priHttpFor<Def extends ExtDef>({
  //extId,
  extName,
  extVersion,
}: {
  extId: ExtId<Def>
  extName: ExtName<Def>
  extVersion: ExtVersion<Def>
}):PriHttpFor<Def> {
  return {
    subRaw: subRaw<Def>(extName, extVersion),
    fetch: fetch<Def>(extName, extVersion),
  }
}

export type PriHttpFor<Def extends ExtDef>={
  subRaw: ReturnType<typeof subRaw<Def>>
  fetch: ReturnType<typeof fetch<Def>>
}
export default priHttp
