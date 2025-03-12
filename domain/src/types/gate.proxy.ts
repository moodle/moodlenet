/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, map } from '@moodle/lib-types'

declare global {
  namespace moo {
    namespace gate {
      // type clientClaims = { locale?: string; locales?: string[] }

      type proxy<forPersonas extends map<moo.persona<any_>>> = {
        [personaType_ in keyof forPersonas]: proxy.persona<forPersonas[personaType_]>
      }
      namespace proxy {
        type dispatcher = (gateProviderRequest: provider.request) => Promise<unknown>

        type persona<persona_ extends moo.persona<any_>> = {
          [contextName in string & keyof persona_]: persona_[contextName] extends moo.persona.context<any_> ? context<persona_[contextName]> : unknown
        }

        type context<context extends moo.persona.context<any_>> = {
          [scopeName in string & keyof context]: context[scopeName] extends moo.persona.scope<any_> ? scope<context[scopeName]> : unknown
        }

        type scope<scope extends moo.persona.scope<any_>> = {
          [useCaseName in string & keyof scope]: scope[useCaseName] extends moo.persona.usecase<any_> ? usecase<scope[useCaseName]> : never
        }

        type usecase<useCase extends moo.persona.usecase<any_>> = {
          [endpointName in string & keyof useCase]: useCase[endpointName] extends moo.persona.endpoint<any_> ? endpoint<useCase[endpointName]> : never
        }

        type endpoint<useCaseEndpoint extends moo.persona.endpoint<any_> = moo.persona.endpoint<any_>> = (
          form: persona.endpointFormType<useCaseEndpoint>,
        ) => Promise<useCaseEndpoint[1]>
      }
    }
  }
}
