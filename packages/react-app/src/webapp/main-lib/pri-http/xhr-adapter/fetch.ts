import { ExtDef, ExtId, SubcriptionPaths } from '@moodlenet/core'
import { RawSubOpts } from '@moodlenet/http-server'
import { EmptyError, firstValueFrom } from 'rxjs'
import { rawSub } from './raw-sub'

export const fetch =
  <Def extends ExtDef>(extId: ExtId<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    type HttpSubType = RawSubOpts<Def, Path>
    return async (req: HttpSubType['req']) => {
      const data = await firstValueFrom(rawSub<Def>(extId)<Path>(path)(req, { limit: 1 })).catch(e => {
        throw e instanceof EmptyError ? new Error('Empty response from server') : e
      })
      return data
    }
  }
