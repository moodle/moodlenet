import type { Document } from '@moodlenet/arangodb/server'
import EventEmitter from 'events'
import type { SomeEntityDataType } from '../common/types.mjs'
import type { EntityDocFullData, SystemUser } from './types.mjs'

export const SysEntitiesEvents = new EventEmitter() as TypedEvents

type Events = {
  'created-new'(_: {
    newEntity: Document<EntityDocFullData<SomeEntityDataType>>
    creator: SystemUser
  }): void
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type TypedEvents = import('typed-emitter').default<Events>
