import { aqlstr } from '../../../../lib/helpers/arango'
import { CONFIG, UserAuthConfig } from '../types'

export const getLatestConfigQ = () => `
  FOR cfg IN ${CONFIG}
    SORT cfg._key desc
    LIMIT 1
  RETURN cfg
`

export const saveConfigQ = (cfg: UserAuthConfig) => `
  INSERT INTO ${CONFIG}
    MERGE(
      ${aqlstr(cfg)},
      { 
        _key:${aqlstr(new Date().valueOf())} 
      }
    }
  RETURN null
`
