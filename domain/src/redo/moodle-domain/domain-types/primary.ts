/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { Either } from 'fp-ts/Either'

declare module 'moodle-domain' {
  type PrimaryDirectives = Primary<false>

  type Primary<with_call extends boolean = true> = {
    [personaType in keyof Personas]?: PrimaryPersonas<Personas[personaType], with_call>
  }

  type PrimaryPersonas<personaDef extends PersonaDef, with_call extends boolean = false> = {
    [scopeName in keyof personaDef['scope']]?: personaDef['scope'][scopeName] extends ScopeDef
      ? PrimaryService<personaDef['scope'][scopeName], with_call>
      : never
  }

  type PrimaryService<scopeDef extends ScopeDef, with_call extends boolean = false> = {
    [useCaseName in keyof scopeDef['useCase']]?: PrimaryUseCase<scopeDef['useCase'][useCaseName], with_call>
  }

  type PrimaryUseCase<useCase extends UseCaseDef, with_call extends boolean = false> = {
    [endpointName in keyof useCase['endpoint']]?: PrimaryUseCaseEp<useCase['endpoint'][endpointName], with_call>
  }

  // type PrimaryUseCaseEp<ucEpDef extends UseCaseEpDef> = (message: ucEpDef[0]) => Promise<ucEpDef[1]>
  type PrimaryUseCaseEp<ucEpDef extends UseCaseEpDef, with_call extends boolean = false> = with_call extends true
    ? {
        call: (message: ucEpDef[0]) => Promise<ucEpDef[1]>
        directives: ucEpDef[2]
      }
    : {
        directives: Either<void, ucEpDef[2]>
      }

  // type x = 'directives' extends never ? 'yes' : 'no'
  // type y = never extends 'directives' ? 'yes' : 'no'

  /// Directives

  // type PrimaryDirectives = {
  //   [persona_type in keyof Personas]: Personas[persona_type] extends infer personaDef
  //     ? personaDef extends PersonaDef
  //       ? {
  //           [scopeName in keyof personaDef['scope']]: personaDef['scope'][scopeName] extends ScopeDef
  //             ? DirectivesService<personaDef['scope'][scopeName]>
  //             : never
  //         }
  //       : never
  //     : never
  // }

  // type DirectivesService<scopeDef extends ScopeDef> = {
  //   [useCaseName in keyof scopeDef['useCase']]: DirectivesUseCase<scopeDef['useCase'][useCaseName]>
  // }

  // type DirectivesUseCase<useCase extends UseCaseDef> = {
  //   [endpointName in keyof useCase]: useCase[endpointName] extends infer ucEpDef
  //     ? ucEpDef extends UseCaseEpDef
  //       ? ucEpDef[2]
  //       : never
  //     : never
  // }
}
