import { CONFIG } from '../types'

export const getLatestConfigQ = () => `
  FOR cfg IN ${CONFIG}
    SORT cfg.createdAt desc
    LIMIT 1
  RETURN cfg
`
