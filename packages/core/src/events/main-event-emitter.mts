import EventEmitter from 'events'
import type { PkgIdentifier } from '../types.mjs'

export const mainEmitter = new EventEmitter()

export type EventPayload<Events, Type extends keyof Events> = {
  pkgId: PkgIdentifier
  event: Type
  data: Events[Type]
  at: string
}
export function pkgEmitter<Events>(pkgId: PkgIdentifier) {
  const pkgEventName = `${pkgId.name}::event`
  return {
    emit<Type extends keyof Events>(event: Type, data: Events[Type]) {
      const payload: EventPayload<Events, Type> = {
        pkgId,
        event,
        data,
        at: new Date(Date.now()).toISOString(),
      }
      mainEmitter.emit(pkgEventName, payload)
    },
    on<Type extends keyof Events>(event: Type, listener: (data: Events[Type]) => void) {
      mainEmitter.on(pkgEventName, _listener)
      return () => mainEmitter.off(pkgEventName, _listener)

      function _listener(payload: EventPayload<Events, Type>) {
        if (payload.event !== event) return
        listener(payload.data)
      }
    },
  }
}
