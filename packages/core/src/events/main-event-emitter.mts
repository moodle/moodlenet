import EventEmitter from 'events'
import { inspect } from 'util'
import { PHASE } from '../ignite.mjs'
import { mainLogger } from '../logger/init-logger.mjs'
import type { PkgIdentifier } from '../types.mjs'

const _event_ = `event`
export const mainEmitter = new EventEmitter()

mainEmitter.on(_event_, payload => {
  mainLogger.log('event', inspect(payload, true, 5, true), { pkgId: payload.pkgId })
})

export type EventPayload<EventTypeMap, Name extends keyof EventTypeMap> = {
  pkgId: PkgIdentifier
  event: Name
  data: EventTypeMap[Name]
  at: string
}
export function pkgEmitter<EventTypeMap>(pkgId: PkgIdentifier) {
  return {
    emit,
    on,
    any,
  }

  function emit<Type extends keyof EventTypeMap>(event: Type, data: EventTypeMap[Type]) {
    if (PHASE !== 'running') {
      return
    }
    const payload: EventPayload<EventTypeMap, Type> = {
      pkgId,
      event,
      data,
      at: new Date(Date.now()).toISOString(),
    }
    mainEmitter.emit(_event_, payload)
  }
  function on<Name extends keyof EventTypeMap>(
    eventName: Name,
    listener: (payload: EventPayload<EventTypeMap, Name>) => void,
  ) {
    return any(
      payload =>
        payload.event === eventName && listener(payload as EventPayload<EventTypeMap, Name>),
    )
  }
  function any(listener: (payload: EventPayload<EventTypeMap, keyof EventTypeMap>) => void) {
    mainEmitter.on(_event_, listener)
    return () => mainEmitter.off(_event_, listener)
  }
}
