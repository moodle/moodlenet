import { any_, map } from '@moodle/lib-types'
import { isLeft, isRight } from 'fp-ts/Either'
import * as moo from 'moodle-domain'

export function makePrimary(
  priDir: moo.PrimaryDirectives,
  exec: (primaryPath: string[], message: unknown, directives: map) => Promise<unknown>,
): moo.Primary {
  priDir.anonymous?.emailSignup?.requestSignupWithMyEmail?.apply?.eitherDirectives
  priDir.ciccioPersona?.ciccioSystem?.some?.ep1?.eitherDirectives
  const primary = Object.entries(priDir ?? {}).reduce((acc, [personaType, systems]) => {
    acc[personaType] = Object.entries(systems ?? {}).reduce((acc, [systemName, useCases]) => {
      acc[systemName] = Object.entries(useCases ?? {}).reduce((acc, [useCaseName, endpoints]) => {
        acc[useCaseName] = Object.entries(endpoints ?? {}).reduce((acc, [endpointName, _ep]) => {
          const maybe_eitherDirectives = (_ep ?? ({} as any_)).eitherDirectives ?? ({} as any_)
          const primaryPath = [personaType, systemName, useCaseName, endpointName]
          if (!(isLeft(maybe_eitherDirectives) || isRight<map>(maybe_eitherDirectives))) {
            console.error(`eitherDirectives in ${primaryPath.join('.')} is not left or right`, maybe_eitherDirectives)
            return acc
          }
          if (!isRight(maybe_eitherDirectives)) {
            return acc
          }
          const directives = maybe_eitherDirectives.right
          const primaryUseCaseEp_with_call: moo.PrimaryUseCaseEp<moo.UseCaseEpDef, true> = {
            directives,
            call: (message: unknown) => exec(primaryPath, message, directives),
          }
          acc[endpointName] = primaryUseCaseEp_with_call
          return acc
        }, {} as map)
        return acc
      }, {} as map)
      return acc
    }, {} as map)
    return acc
  }, {} as map) as moo.Primary
  return primary
}
// const primary = makePrimary({} as moo.Primary<false>, async (_primaryPath, _message) => null)

// primary.anonymous?.emailSignup?.signupWithMyEmail?.apply?.directives
// const ep1 = primary.ciccioPersona?.ciccioSystem?.some?.ep1
// if (ep1) {
//   ep1.directives
//   ep1.call({ a: 1 }).then(_ => {
//     _.x.concat('a')
//   })
// }
