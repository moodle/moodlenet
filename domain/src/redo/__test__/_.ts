/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address_schema, redacted } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
declare module 'moodle-domain' {
  interface Personas {
    fooPersona: FooPersona
  }
  interface Services {
    fooService: DefService<{
      v: '1'
      model: FooModel
      tokens: never
    }>
  }
}

declare module '../moodle-domain/persona/anonymous/signupToTheSystem.scope' {
  export interface SignupToTheSystemUseCases {
    fooSignup: {
      directives: { a: string }
      endpoint: {
        zupsigup: [{ a: number }, { x: string }, { ep1_a: string }]
      }
    }
  }
}
export type FooPersona = moo.DefPersona<{
  directives: null
  scope: moo.DefPersonaScopes<{
    // userAccount:never
    // moodlenet:never
    // emailSignup:never
    fooscope: moo.DefScope<{
      directives: null
      useCase: {
        some: {
          directives: null
          endpoint: {
            epx: [void, { x: string }, { epx_a: number }]
            ep1: [{ a: number }, { x: string }, { ep1_a: string }]
            ep2: [{ b: number }, { c: boolean }, { ep2_a: boolean }]
          }
        }
      }
    }>
  }>
  //model: FooModel
}>

export type FooModel = moo.DefModel<{
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

declare const p: moo.Primary
p.anonymous?.signupToTheSystem?.signupWithMyEmail?.submitSignup
  ?.call({ password: redacted(''), displayName: '', email: email_address_schema.parse('') })
  .then(_ => _._tag)
p.fooPersona?.fooscope?.some?.ep1?.call({ a: 1 }).then(_ => _.x)
p.fooPersona?.fooscope?.some?.ep2?.directives
p.anonymous?.signupToTheSystem?.fooSignup?.zupsigup?.call({ a: 1 })

declare const d: moo.Domain
d.personas.anonymous.directives
d.personas.fooPersona.scope.fooscope.useCase.some.endpoint.epx
