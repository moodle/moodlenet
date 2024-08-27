import { accessCtrl, sessionAccess } from '@moodle/core/domain'

export type factories = {
  sessionAccess: (cfg: string) => Promise<sessionAccess>
  ctrl: (cfg: string) => Promise<(accessCtrl: accessCtrl) => Promise<unknown>>
  // secondary: (cfg:string) => Promise<secAccess<moodle_domain>>
  // emitter: (cfg:string) => Promise<modEmitter<moodle_domain>>
}
export type trans_kind = keyof factories
