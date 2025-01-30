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

  // const p :PrimaryAccess
  // p.anonymous.emailSignup.signupWithMyEmail.apply({}).then(_=>{})
  // p.user.
  // const d: Domain
  // d.personas.anonymous.systems.emailSignup.useCase.signupWithMyEmail.apply
  // d.personas.user.systems.
}
