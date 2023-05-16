import { getPkgEntitiesTool } from '@moodlenet/system-entities/common'
import type { CollectionEntityNames } from '../common/types.mjs'
import { shell } from './shell.mjs'

export const CollectionEntitiesTools = getPkgEntitiesTool<CollectionEntityNames>({
  pkgId: shell.myId,
})
