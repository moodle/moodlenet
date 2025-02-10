/* eslint-disable @typescript-eslint/no-namespace */
import '@moodle/lib-types'

declare global {
  namespace moo {
    interface Domain {
      version: '5.0'
      personas: Personas
      models: Models
    }

    // interface Personas {
    //   [personaType: string]: moo.persona<any_>
    // }

    // interface Models {
    //   [modelname: string]: moo.model<any_>
    // }

    type contexts = {
      [personaType_ in personaType]: string & Personas[personaType_]
    } extends infer _
      ? _[keyof _] //| any_other_string
      : never

    type scopes = {
      [personaType_ in personaType]: {
        [ctx in string & keyof Personas[personaType_]]: Personas[personaType_][ctx]
      } extends infer _
        ? string & keyof _[keyof _]
        : never
    } extends infer _
      ? _[keyof _] //| any_other_string
      : never

    type modelName = keyof Models // | any_other_string
    type personaType = keyof Personas // | any_other_string

    type ucModelUcTypes<selectedModelName extends modelName> = {
      [personaType in moo.personaType]: {
        [audience_contextName in keyof moo.Personas[personaType]]: {
          [scopeName in keyof moo.Personas[personaType][audience_contextName]]: {
            [usecaseName in keyof moo.Personas[personaType][audience_contextName][scopeName]]: moo.Personas[personaType][audience_contextName][scopeName][usecaseName] extends infer usecase
              ? usecase extends moo.persona.usecase.withModelTypes
                ? usecase[typeof moo.persona.usecase.modelTypes] extends infer usecaseModels
                  ? usecaseModels extends { [modelName_ in selectedModelName]: infer _ucModelTypes }
                    ? _ucModelTypes
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
