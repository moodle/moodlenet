/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'
import { any_, d_u } from '@moodle/lib-types'
type sessionDataType = 'user' | 'configs'
declare global {
  namespace moo {
    type session<t extends sessionDataType> = {
      [personaType_ in personaType]: (t extends 'user' ? undefined : never) | session.persona<Personas[personaType_], t>
    }
    namespace session {
      type configs = session<'configs'>
      type user = session<'user'>
      type info = {
        user: info.user
        session: user
      }
      namespace info {
        type user = d_u<
          {
            auth: {
              id: string
            }
            anon: unknown
          },
          'type'
        >
      }
      type persona<persona_ extends moo.persona<any_>, t extends sessionDataType> = context_tag<persona_, t> &
        config_tag<persona_> & {
          [contextName in string & keyof persona_]:
            | (t extends 'user' ? undefined : never)
            | (persona_[contextName] extends moo.persona.context<any_> ? context<persona_[contextName], t> : never)
        }

      type context<context extends moo.persona.context<any_>, t extends sessionDataType> = config_tag<context> & {
        [scopeName in string & keyof context]:
          | (t extends 'user' ? undefined : never)
          | (context[scopeName] extends moo.persona.scope<any_> ? scope<context[scopeName], t> : never)
      }

      type scope<scope extends moo.persona.scope<any_>, t extends sessionDataType> = config_tag<scope> & {
        [useCaseName in string & keyof scope]:
          | (t extends 'user' ? undefined : never)
          | (scope[useCaseName] extends moo.persona.usecase<any_> ? usecase<scope[useCaseName], t> : never)
      }

      type usecase<useCase extends moo.persona.usecase<any_>, t extends sessionDataType> = config_tag<useCase> & {
        [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.persona.endpoint<any_>
          ? (t extends 'user' ? undefined : never) | endpoint<persona.endpoint<useCase[endpointName]>>
          : never
      }

      type endpoint<useCaseEndpoint extends moo.persona.endpoint<any_>> = useCaseEndpoint[2] extends undefined | void | never
        ? Record<string, never>
        : {
            _: useCaseEndpoint[2]
          }
    }
  }
}
type config_tag<T> = T extends moo.withConfigs
  ? T[typeof moo.configs] extends never
    ? { _?: never }
    : { _: T[typeof moo.configs] }
  : unknown

type context_tag<T, t extends sessionDataType> = t extends 'configs'
  ? unknown
  : T extends moo.persona.withMeta
    ? T[typeof moo.persona.meta] extends never
      ? { $?: never }
      : { $: T[typeof moo.persona.meta] }
    : unknown
