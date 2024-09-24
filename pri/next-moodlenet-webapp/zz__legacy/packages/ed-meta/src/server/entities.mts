import { getPkgEntitiesTool } from '@moodlenet/system-entities/common'
import type { EdMetaEntityNames } from '../common/types.mjs'
import { shell } from './shell.mjs'

export const EdMetaEntitiesTools = getPkgEntitiesTool<EdMetaEntityNames>({
  pkgId: shell.myId,
})
