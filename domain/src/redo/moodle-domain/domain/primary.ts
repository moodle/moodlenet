/* eslint-disable @typescript-eslint/no-invalid-void-type */

declare module 'moodle-domain' {
  type Primary = {
    [persona_type in keyof Personas]: Personas[persona_type] extends infer personaDef
      ? personaDef extends PersonaDef
        ? {
            [system_name in keyof personaDef['systems']]: personaDef['systems'][system_name] extends SystemAccessDef
              ? PrimarySystem_Impl<personaDef['systems'][system_name]>
              : never
          }
        : never
      : never
  }

  type PrimarySystem_Impl<systemAccessDef extends SystemAccessDef> = {
    [useCaseName in keyof systemAccessDef['useCase']]: PrymaryUseCase_impl<systemAccessDef['useCase'][useCaseName]>
  }

  type PrymaryUseCase_impl<useCase extends UseCaseDef> = {
    [endpointName in keyof useCase]: useCase[endpointName] extends infer epDef
      ? epDef extends UseCaseEpDef
        ? PrimaryUseCaseEp_Impl<epDef>
        : never
      : never
  }

  type PrimaryUseCaseEp_Impl<ucEpDef extends UseCaseEpDef> = (message: ucEpDef[0]) => Promise<ucEpDef[1]>
}
