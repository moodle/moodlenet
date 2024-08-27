import { accessCtrl, sessionAccess } from '@moodle/core/domain'

export type factories = {
  sessionAccess: (cfg: string) => Promise<sessionAccess<any>>
  ctrl: (cfg: string) => Promise<(accessCtrl: accessCtrl<any>) => Promise<unknown>>
  // secondary: (cfg:string) => Promise<secAccess<moodle_domain>>
  // emitter: (cfg:string) => Promise<modEmitter<moodle_domain>>
}
export type transport_layer = keyof factories
