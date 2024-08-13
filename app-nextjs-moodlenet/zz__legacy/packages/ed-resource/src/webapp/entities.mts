import { getPkgEntitiesTool } from '@moodlenet/system-entities/common'
import type { EdResourceEntityNames } from '../common/types.mjs'
import { shell } from './shell.mjs'

export const EdResourceEntitiesTools = getPkgEntitiesTool<EdResourceEntityNames>({
  pkgId: shell.pkgId,
})
