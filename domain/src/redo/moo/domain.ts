/* eslint-disable @typescript-eslint/no-namespace */
import '@moodle/lib-types'

declare global {
  namespace moo {
    interface Domain {
      version: '5.0'
      personas: Personas
      services: Services
    }

    // interface Personas {
    //   [personaType: string]: moo.persona<any_>
    // }

    // interface Services {
    //   [servicename: string]: moo.service<any_>
    // }

    type Model = {
      [serviceName in keyof Services]: Services[serviceName]['model']
    }

    type contexts = {
      [personaType in keyof Personas]: string & keyof Personas[personaType]
    } extends infer _
      ? _[keyof _] //| any_other_string
      : never

    type scopes = {
      [personaType in keyof Personas]: {
        [ctx in string & keyof Personas[personaType]]: keyof Personas[personaType][ctx]
      } extends infer _
        ? string & keyof _[keyof _]
        : never
    } extends infer _
      ? _[keyof _] //| any_other_string
      : never

    type services = keyof Services // | any_other_string

    type ucServiceTypes<serviceName extends services> = {
      [personaType in keyof moo.Personas]: {
        [audience_contextName in keyof moo.Personas[personaType]]: {
          [scopeName in keyof moo.Personas[personaType][audience_contextName]]: {
            [usecaseName in keyof moo.Personas[personaType][audience_contextName][scopeName]]: moo.Personas[personaType][audience_contextName][scopeName][usecaseName] extends infer usecase
              ? usecase extends moo.persona.usecase.withServices
                ? usecase[typeof moo.persona.usecase.services] extends infer usecaseServices
                  ? usecaseServices extends { [srvName in serviceName]: infer _ucServiceTypes }
                    ? _ucServiceTypes
                    : never
                  : never
                : never
              : never
          }
        }
      }
    }
  }
}
