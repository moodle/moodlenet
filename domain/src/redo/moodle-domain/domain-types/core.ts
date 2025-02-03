/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { promiseOrValue } from '@moodle/lib-types'

declare module 'moodle-domain' {
  // type PersonaCtx<personaDef extends PersonaDef> = {
  // _: personaDef['model']
  type CoreCtx = {
    _: Model
    on: <typeModelRef extends TypeModel<TypeModelTraits>>(
      typeModelRef: typeModelRef | undefined,
    ) => TypeModelRefOpMap_Impl<typeModelRef>
  }

  type Core = (ctx: CoreCtx /* <personaDef> */) => promiseOrValue<CorePersonas_Impl>

  type CorePersonas_Impl = {
    [personaType in keyof Personas]?: promiseOrValue<CoreScopes_Impl<Personas[personaType]>>
  }

  type CoreScopes_Impl<personaDef extends PersonaDef> = {
    [scopeName in keyof personaDef['scope']]: personaDef['scope'][scopeName] extends ScopeDef
      ? CoreScope_Impl<personaDef['scope'][scopeName]>
      : unknown
  }

  type CoreScope_Impl<scopeDef extends ScopeDef> = {
    [useCaseName in keyof scopeDef['useCase']]: CoreUseCase_Impl<scopeDef['useCase'][useCaseName]>
  }

  // type AllPersonas = {
  //   [persona_type in personaType]:  Persona_UseCases_Impl<Personas[persona_type]>
  // }

  type CoreUseCase_Impl<useCaseDef extends UseCaseDef> = {
    [endpointName in keyof useCaseDef['endpoint']]: [
      endpointGuard: CoreUseCaseEp_EndpointGuard<useCaseDef['endpoint'][endpointName]>,
      epImpl: CoreUseCaseEp_Impl<useCaseDef['endpoint'][endpointName]>,
    ]
  }
  type CoreUseCaseEp_EndpointGuard<ucEpDef extends UseCaseEpDef> = (message: unknown) => promiseOrValue<ucEpDef[0]>

  type CoreUseCaseEp_Impl<ucEpDef extends UseCaseEpDef> = (message: ucEpDef[0]) => promiseOrValue<ucEpDef[1]>

  type TypeModelRefOpMap_Impl<typeModelRef extends TypeModel<TypeModelTraits>> =
    typeModelRef extends TypeModel<infer traits>
      ? traits['ops'] extends infer opTraits
        ? opTraits extends TraitsOps
          ? {
              [k in keyof opTraits]: TypeModelRefOp_Impl<opTraits[k]>
            }
          : never
        : never
      : never

  type TypeModelRefOp_Impl<modelOpDef extends ModelOpDef> = modelOpDef[0] extends 'query'
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
}
