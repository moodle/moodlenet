/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { Either } from 'fp-ts/Either'

declare module 'moodle-domain' {
  type PrimaryDirectives = Primary<false>

  type Primary<with_call extends boolean = true> = {
    [persona_type in keyof Personas]?: PrimaryPersonas<Personas[persona_type], with_call>
  }

  type PrimaryPersonas<personaDef extends PersonaDef, with_call extends boolean = false> = {
    [system_name in keyof personaDef['systems']]?: personaDef['systems'][system_name] extends SystemAccessDef
      ? PrimarySystem<personaDef['systems'][system_name], with_call>
      : never
  }

  type PrimarySystem<systemAccessDef extends SystemAccessDef, with_call extends boolean = false> = {
    [useCaseName in keyof systemAccessDef['useCase']]?: PrimaryUseCase<systemAccessDef['useCase'][useCaseName], with_call>
  }

  type PrimaryUseCase<useCase extends UseCaseDef, with_call extends boolean = false> = {
    [endpointName in keyof useCase]?: PrimaryUseCaseEp<useCase[endpointName], with_call>
  }

  type EitherDirectives<ucEpDef extends UseCaseEpDef> = Either<void, ucEpDef[2]>

  // type PrimaryUseCaseEp<ucEpDef extends UseCaseEpDef> = (message: ucEpDef[0]) => Promise<ucEpDef[1]>
  type PrimaryUseCaseEp<ucEpDef extends UseCaseEpDef, with_call extends boolean = false> = with_call extends true
    ? {
        call: (message: ucEpDef[0]) => Promise<ucEpDef[1]>
        directives: ucEpDef[2]
      }
    : {
        eitherDirectives: EitherDirectives<ucEpDef>
      }

  // type x = 'directives' extends never ? 'yes' : 'no'
  // type y = never extends 'directives' ? 'yes' : 'no'

  /// Directives

  // type PrimaryDirectives = {
  //   [persona_type in keyof Personas]: Personas[persona_type] extends infer personaDef
  //     ? personaDef extends PersonaDef
  //       ? {
  //           [system_name in keyof personaDef['systems']]: personaDef['systems'][system_name] extends SystemAccessDef
  //             ? DirectivesSystem<personaDef['systems'][system_name]>
  //             : never
  //         }
  //       : never
  //     : never
  // }

  // type DirectivesSystem<systemAccessDef extends SystemAccessDef> = {
  //   [useCaseName in keyof systemAccessDef['useCase']]: DirectivesUseCase<systemAccessDef['useCase'][useCaseName]>
  // }

  // type DirectivesUseCase<useCase extends UseCaseDef> = {
  //   [endpointName in keyof useCase]: useCase[endpointName] extends infer ucEpDef
  //     ? ucEpDef extends UseCaseEpDef
  //       ? ucEpDef[2]
  //       : never
  //     : never
  // }
}
