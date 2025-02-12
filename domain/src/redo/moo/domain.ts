/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */
import '@moodle/lib-types'
import { any_, primitive } from '@moodle/lib-types'

declare global {
  namespace moo {
    interface Domain {
      version: '5.0'
      personas: Personas
      models: Models
    }

    interface Personas {}
    interface Models {}

    type typ<iface> = {
      [k in keyof iface]: iface[k] extends primitive | void | any_[] | never ? iface[k] : typ<iface[k]>
    }
    type contexts = {
      [personaType_ in personaType]: string & keyof Personas[personaType_]
    } extends infer _
      ? _[keyof _] //| any_other_string
      : never

    type scopeNames = {
      [personaType_ in personaType]: {
        [ctx in string & keyof Personas[personaType_]]: Personas[personaType_][ctx]
      } extends infer _
        ? string & keyof _[keyof _]
        : never
    } extends infer _
      ? _[keyof _] //| any_other_string
      : never

    type fullScopes = {
      [personaType_ in personaType]: {
        [ctx in string & keyof Personas[personaType_]]: Personas[personaType_][ctx]
      } extends infer _
        ? keyof _ extends infer ctxName
          ? ctxName extends string
            ? ctxName extends keyof _
              ? `${ctxName}.${string & keyof _[ctxName]}`
              : never
            : never
          : never
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
              ? usecase extends { [moo.persona.usecase.modelTypes]: infer usecaseModels }
                ? usecaseModels extends { [modelName_ in selectedModelName]: infer _ucModelTypes }
                  ? _ucModelTypes
                  : never
                : never
              : never
          }
        }
      }
    }
  }
}

