import type { EntityCollectionDef } from '@moodlenet/system-entities/server'
import { registerEntities } from '@moodlenet/system-entities/server'
import type { CollectionEntityNames } from '../../common/types.mjs'
import { shell } from '../shell.mjs'
import type { CollectionDataType } from '../types.mjs'

export const { Collection } = await shell.call(registerEntities)<
  {
    Collection: EntityCollectionDef<CollectionDataType>
  },
  CollectionEntityNames
>({
  Collection: {},
})
