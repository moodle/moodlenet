/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, dmesg_, map, promiseOrValue } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Json } from 'fp-ts/Json'
import { Model, Personas, personaType } from './domain'
import { ModelOpDef, ModelType, ModelTypeTraits, TraitsOps } from './model-type'

export type AccessError = dmesg_<'unauthorized' | 'forbidden' | 'unavailable' | 'invalidMessage'> // | 'notFound' | 'conflict' | 'badRequest' | 'internalError' | 'timeout' | 'unknownError'


export type DefPersona<personaDef extends PersonaDef> = personaDef
type PersonaDef = {
  useCase: {
    [useCase: string]: UseCaseDef
  }
  model: map
}
type UseCaseDef = {
  [useCaseEndpoint: string]: UseCaseEpDef
}
type UseCaseEpDef = [message: any_, outcome: any_]

export type DefUseCase<useCaseDef extends UseCaseDef> = useCaseDef

export type Persona_Impl<personaDef extends PersonaDef> = {
  [useCaseName in keyof personaDef['useCase']]: Either<AccessError, UseCase_Impl<personaDef['useCase'][useCaseName]>>
}

// export type AllPersonas = {
//   [persona_type in personaType]: Either<AccessError, Persona_UseCases_Impl<Personas[persona_type]>>
// }

export type PersonaCtx<personaDef extends PersonaDef> = {
  _: personaDef['model']
  on: <modelTypeRef extends ModelType<ModelTypeTraits>>(
    modelTypeRef: modelTypeRef | undefined,
  ) => ModelTypeRefOpMapImpl<modelTypeRef>
}

export type PersonaCore<persona_type extends personaType> = Personas[persona_type] extends infer personaDef
  ? personaDef extends PersonaDef
    ? (ctx: PersonaCtx<personaDef>) => promiseOrValue<Either<AccessError, Persona_Impl<personaDef>>>
    : never
  : never

type UseCase_Impl<useCaseDef extends UseCaseDef> = {
  [endpointName in keyof useCaseDef]: Either<
    AccessError,
    [
      messageValidator: UseCaseEp_MessageValidator<useCaseDef[endpointName]>,
      epImpl: UseCaseEp_Impl<useCaseDef[endpointName]>,
    ]
  >
}
type UseCaseEp_MessageValidator<ucEpDef extends UseCaseEpDef> = (
  message: unknown,
) => promiseOrValue<Either<Json | void, ucEpDef[0]>>

type UseCaseEp_Impl<ucEpDef extends UseCaseEpDef> = (message: ucEpDef[0]) => promiseOrValue<ucEpDef[1]>

type ModelTypeRefOpMapImpl<modelTypeRef extends ModelType<ModelTypeTraits>> =
  modelTypeRef extends ModelType<infer traits>
    ? traits['ops'] extends infer opTraits
      ? opTraits extends TraitsOps
        ? {
            [k in keyof opTraits]: ModelTypeRefOpImpl<opTraits[k]>
          }
        : never
      : never
    : never

type ModelTypeRefOpImpl<modelOpDef extends ModelOpDef> = modelOpDef[0] extends 'query'
  ? {
      query: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
    }
  : modelOpDef[0] extends 'async' | 'sync'
    ? {
        async: (message: modelOpDef[1]) => Promise<void>
      } & (modelOpDef[0] extends 'sync'
        ? {
            sync: (message: modelOpDef[1]) => Promise<modelOpDef[2]>
          }
        : unknown)
    : never

type UseCaseEp_Primary<ucEpDef extends UseCaseEpDef> = (message: ucEpDef[0]) => Promise<ucEpDef[1]>
export type PrimaryAccess = {
  [persona_type in personaType]: {
    [useCaseName in keyof Personas[persona_type]['useCase']]: {
      [endpointName in keyof Personas[persona_type]['useCase'][useCaseName]]: Personas[persona_type]['useCase'][useCaseName][endpointName] extends infer epDef
        ? epDef extends UseCaseEpDef
          ? UseCaseEp_Primary<epDef>
          : never
        : never
    }
  }
}
