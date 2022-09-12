import { ExtDef, ExtId } from '@moodlenet/core'
import { fetch } from './xhr-adapter/fetch'
import { fetchHook, lazyFetchHook } from './xhr-adapter/hooks'
import { rawSub } from './xhr-adapter/raw-sub'

export const priHttp = {
  sub: rawSub,
  fetch,
}

export function priHttpFor<Def extends ExtDef>(
  extId: ExtId<Def>
): PriHttpFor<Def> {
  return {
    subRaw: rawSub<Def>(extId),
    fetch: fetch<Def>(extId),
    useLazyFetch: lazyFetchHook<Def>(extId),
    useFetch: fetchHook<Def>(extId),
  }
}

export default priHttp

export type PriHttpFor<Def extends ExtDef> = {
  subRaw: (ReturnType<typeof rawSub<Def>>)
  fetch: (ReturnType<typeof fetch<Def>>)
  useLazyFetch: (ReturnType<typeof lazyFetchHook<Def>>)
  useFetch: (ReturnType<typeof fetchHook<Def>>)
}

