declare module 'moodle-domain' {
  interface Domain {
    version: '5.0'
    personas: Personas
    systems: Systems
  }

  interface Personas {
    [personaType: string]: PersonaDef
  }

  interface Systems {
    [systemName: string]: SystemDef
  }

  // const p :Primary
  // p.anonymous?.emailSignup?.signupWithMyEmail?.apply?.call({}).then(_=>{})
  // p.ciccioPersona?.ciccioSystem?.some?.ep1?.call({a:1}).then(_=>{})
  // p.ciccioPersona?.ciccioSystem?.some?.ep2?.directives
  // const d: Domain
  // d.personas.anonymous.systems.emailSignup.useCase.signupWithMyEmail.apply
  // d.personas.ciccioPersona.systems.ciccioSystem
}
