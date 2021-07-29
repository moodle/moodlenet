import { UserAuthConfig } from '@moodlenet/common/lib/user-auth/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { CONFIG } from '../types'

export const getLatestConfigQ = () =>
  aq<UserAuthConfig>(`
  FOR cfg IN ${CONFIG}
    SORT cfg._key desc
    LIMIT 1
  RETURN cfg
`)

export const saveConfigQ = (cfg: UserAuthConfig) =>
  aq<null>(`
  INSERT MERGE(
      ${aqlstr(cfg)},
      { 
        _key:${aqlstr(newKey())} 
      }
    ) INTO ${CONFIG}
  RETURN null
`)

const newKey = () => `${new Date().valueOf()}`
