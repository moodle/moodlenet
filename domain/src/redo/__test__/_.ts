/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address_schema, redacted } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
declare module '----moodle-domain' {
  interface Personas {
    fooPersona: FooPersona
  }
  interface Services {
    fooService: DefService<{
      model: FooModel
      tokens: never
    }>
  }
}

declare module '---../moodle-domain/persona/anonymous/signupToTheSystem.scope' {
  export interface SignupToTheSystemUseCases {
    fooSignup: moo.persona.usecase<
      {
        zupsigup: [{ a: number }, { x: string }, { ep1_a: string }]
      },
      { a: string }
    >
  }
}
export type FooPersona = moo.persona<{
  // userAccount:never
  // moodlenet:never
  // emailSignup:never
  fooscope: moo.persona.scope<{
    some: moo.persona.usecase<{
      epx: [void, { x: string }, { epx_a: number }]
      ep1: [{ a: number }, { x: string }, { ep1_a: string }]
      ep2: [{ b: number }, { c: boolean }, { ep2_a: boolean }]
    }>
  }>
}>

export type FooModel = moo.model<{
  stEp: moo.model.type.endpoint<['query', { aNumber: number }, { res: string }]>
  stCosa: moo.model.type.staticData<'w', { statica: string }>
  b: {
    c: {
      buEp: moo.model.type.endpoint<['async', { aNumber: number }, { res: string }]>
    }
    basEp: moo.model.type.endpoint<['query', { aNumber: number }, { res: string }]>
    bsEp: moo.model.type.endpoint<['sync', { aNumber: number }, { res: string }]>
  }
  aIdsm: moo.model.type.idSpaceMap<{
    // asset: Asset<{ optional: true }>
    // a_bFile: FsFile
    a_ep: moo.model.type.endpoint<['async', { aNumber: number }, { res: string }]>
    // a_info: DataEntity<{ name: string }, { conditions: { isAdmin: boolean } }>
    a_sub: moo.model.type.idSpaceMap<{
      a_subCosa: moo.model.type.entityData<'w', { lolo: string }, { conditions: { x: number } }>
    }>
  }>
}>

declare const p: moo.Primary
p.anonymous?.signupToTheSystem?.signupWithMyEmail?.submitSignup
  ?.call({ password: redacted(''), displayName: '', email: email_address_schema.parse('') })
  .then(_ => _._tag)
p.fooPersona?.fooscope?.some?.ep1?.call({ a: 1 }).then(_ => _.x)
p.fooPersona?.fooscope?.some?.ep2
p.anonymous?.signupToTheSystem?.fooSignup?.zupsigup?.call({ a: 1 })

declare const d: moo.Domain
d.personas.anonymous.signupToTheSystem
d.personas.fooPersona.scope.fooscope.useCase.some.endpoint.epx
