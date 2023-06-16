import type { EventPayload } from './events/main-event-emitter.mjs'
import { mainEmitter } from './events/main-event-emitter.mjs'
import { mainLogger } from './logger/init-logger.mjs'

mainEmitter.on('event', (payload: EventPayload<any, string>) => {
  mainLogger.log('event', payload)
})
