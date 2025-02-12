/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
import { any_ } from '@moodle/lib-types'
type sessionDataType = 'user' | 'configs'
declare global {
  namespace moo {
    type session<t extends sessionDataType> = {
      [personaType_ in personaType]: (t extends 'user' ? undefined : never) | session.persona<Personas[personaType_], t>
    }
    namespace session {
      type configs = session<'configs'>
      type user = session<'user'>
      type persona<persona_ extends moo.persona<any_>, t extends sessionDataType> = context_tag<persona_, t> &
        config_tag<persona_> & {
          [contextName in string & keyof persona_]:
            | (t extends 'user' ? undefined : never)
            | (persona_[contextName] extends moo.persona.context ? session.context<persona_[contextName], t> : never)
        }

      type context<context extends moo.persona.context, t extends sessionDataType> = config_tag<context> & {
        [scopeName in string & keyof context]:
          | (t extends 'user' ? undefined : never)
          | (context[scopeName] extends moo.persona.scope ? session.scope<context[scopeName], t> : never)
      }

      type scope<scope extends moo.persona.scope, t extends sessionDataType> = config_tag<scope> & {
        [useCaseName in string & keyof scope]:
          | (t extends 'user' ? undefined : never)
          | (scope[useCaseName] extends moo.persona.usecase ? session.UseCase<scope[useCaseName], t> : never)
      }

      type UseCase<useCase extends moo.persona.usecase, t extends sessionDataType> = config_tag<useCase> & {
        [endpointName in string & keyof useCase]:
          | (t extends 'user' ? undefined : never)
          | session.Endpoint<persona.endpoint<useCase[endpointName]>>
      }

      type Endpoint<useCaseEndpoint extends moo.persona.endpoint> = useCaseEndpoint[2] extends undefined | void | never
        ? Record<string, never>
        : {
            _: useCaseEndpoint[2]
          }
    }
  }
}
type config_tag<T> = T extends moo.persona.withConfigs
  ? T[typeof moo.persona.configs] extends never
    ? { _?: never }
    : { _: T[typeof moo.persona.configs] }
  : unknown

type context_tag<T, t extends sessionDataType> = t extends 'configs'
  ? unknown
  : T extends moo.persona.withContext
    ? T[typeof moo.persona.myContext] extends never
      ? { $?: never }
      : { $: T[typeof moo.persona.myContext] }
    : unknown
