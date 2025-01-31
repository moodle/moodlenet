/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { promiseOrValue } from '@moodle/lib-types'

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
    [persona_type in keyof Personas]?: promiseOrValue<CoreSystems_Impl<Personas[persona_type]>>
  }

  type CoreSystems_Impl<personaDef extends PersonaDef> = {
    [system_name in keyof personaDef['systems']]: personaDef['systems'][system_name] extends SystemAccessDef
      ? CoreSystemAccess_Impl<personaDef['systems'][system_name]>
      : unknown
  }

  type CoreSystemAccess_Impl<systemAccessDef extends SystemAccessDef> = {
    [useCaseName in keyof systemAccessDef['useCase']]: CoreUseCase_Impl<systemAccessDef['useCase'][useCaseName]>
  }

  // type AllPersonas = {
  //   [persona_type in personaType]:  Persona_UseCases_Impl<Personas[persona_type]>
  // }

  type CoreUseCase_Impl<useCaseDef extends UseCaseDef> = {
    [endpointName in keyof useCaseDef]: [
      endpointGuard: CoreUseCaseEp_EndpointGuard<useCaseDef[endpointName]>,
      epImpl: CoreUseCaseEp_Impl<useCaseDef[endpointName]>,
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
