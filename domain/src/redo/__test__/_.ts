/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as moo from 'moodle-domain'
declare module 'moodle-domain' {
  interface Personas {
    ciccioPersona: CiccioPersona
  }
  interface Systems {
    ciccioSystem: DefSystem<{
      model: CiccioModel
    }>
  }
}

export type CiccioPersona = moo.DefPersona<{
  context: never
  systems: moo.DefPersonaSystems<{
    // userAccount:never
    // moodlenet:never
    // emailSignup:never
    ciccioSystem: moo.DefSystemAccess<{
      useCase: {
        some: {
          epx: [void, { x: string }, { epx_a: number }]
          ep1: [{ a: number }, { x: string }, { ep1_a: string }]
          ep2: [{ b: number }, { c: boolean }, { ep2_a: boolean }]
        }
      }
    }>
  }>
  //model: CiccioModel
}>

export type CiccioModel = moo.DefModel<{
  stEp: moo.Endpoint<['query', { aNumber: number }, { res: string }]>
  stCosa: moo.StaticData<'w', { statica: string }>
  b: {
    c: {
      buEp: moo.Endpoint<['async', { aNumber: number }, { res: string }]>
    }
    basEp: moo.Endpoint<['query', { aNumber: number }, { res: string }]>
    bsEp: moo.Endpoint<['sync', { aNumber: number }, { res: string }]>
  }
  aIdsm: moo.IdSpaceMap<{
    // asset: Asset<{ optional: true }>
    // a_bFile: FsFile
    a_ep: moo.Endpoint<['async', { aNumber: number }, { res: string }]>
    // a_info: DataEntity<{ name: string }, { conditions: { isAdmin: boolean } }>
    a_sub: moo.IdSpaceMap<{
      a_subCosa: moo.EntityData<'w', { lolo: string }, { conditions: { x: number } }>
    }>
  }>
}>
