import { app, apps } from './app'
import { _ddp } from './map'

type kind_pusher<_apps extends apps, kind extends keyof app<any>> = <
  app_name extends _apps[_ddp],
  ch_name extends (_apps & {
    [n in _ddp]: app_name
  })[kind][_ddp],
  ev_name extends (((_apps & {
    [n in _ddp]: app_name
  })[kind] & {
    [n in _ddp]: ch_name
  })['msg'] & {
    op: {
      t: kind
    }
  })[_ddp],
  ev extends ((_apps & {
    [n in _ddp]: app_name
  })[kind] & {
    [n in _ddp]: ch_name
  })['msg'] & {
    [n in _ddp]: ev_name
  },
>(
  app: app_name,
  ch: ch_name,
  ev: ev_name,
  // tgt: ev['op']['t'] ,
  payload: ev['payload'],
) => Promise<ev['reply']>

export type pusher<_apps extends apps> = <kind extends keyof app<any>>(
  k: kind,
) => kind_pusher<_apps, kind>
export type priAccess<_apps extends apps> = kind_pusher<_apps, 'receives'>
export type secAccess<_apps extends apps> = kind_pusher<_apps, 'sends'>
export type appEmitter<_apps extends apps> = kind_pusher<_apps, 'emits'>

export abstract class AccessError extends Error {
  cause?: Error
  constructor(message: string) {
    super(message)
  }
}
export class UnauthorizedError extends AccessError {
  constructor(message: string) {
    super(message)
  }
}
export class NotFoundError extends AccessError {
  constructor(message: string) {
    super(message)
  }
}
