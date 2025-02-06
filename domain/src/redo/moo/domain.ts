/* eslint-disable @typescript-eslint/no-namespace */
import type { any_other_string } from '@moodle/lib-types'

declare global {
  namespace moo {
    interface Domain {
      version: '5.0'
      personas: Personas
      services: Services
    }

    interface Personas {
      [personaType: string]: moo.persona
    }

    interface Services {
      [servicename: string]: moo.service
    }

    type Model = {
      [serviceName in keyof Services]: Services[serviceName]['model']
    }

    type contexts = {
      [personaType in keyof Personas]: persona.keysof<Personas[personaType]>
    } extends infer _
      ? _[keyof _] | any_other_string
      : never

    type scopes = {
      [personaType in keyof Personas]: {
        [ctx in persona.keysof<Personas[personaType]>]: keyof Personas[personaType][ctx]
      } extends infer _
        ? persona.keysof<_[keyof _]>
        : never
    } extends infer _
      ? _[keyof _] | any_other_string
      : never

    type services = any_other_string | keyof Services
  }
}
