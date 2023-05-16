import { getPkgEntitiesTool } from '@moodlenet/system-entities/common'
import type { WebUserEntityNames } from '../common/types.mjs'
import { shell } from './shell.mjs'

export const WebUserEntitiesTools = getPkgEntitiesTool<WebUserEntityNames>({
  pkgId: shell.pkgId,
})
