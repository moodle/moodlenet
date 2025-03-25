/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { map, path } from '@moodle/lib-types'
import { Error4xx } from '../lib/access-error'

declare global {
  namespace moo.def.gate_old {
    type client<forUserTypes extends map<moo.def.userType> = moo<UserType>> = {
      [userType_ in keyof forUserTypes]: client.userType<forUserTypes[userType_]>
    }
    namespace client {
      type request<endpoint_ extends def.userType.endpoint = def.userType.endpoint> = {
        path: path
        form: userType.endpointFormType<endpoint_>
      }
      type dispatcher = (gateClientRequest: request) => Promise<unknown>

      type userType<userType_ extends moo.def.userType> = {
        [contextName in string & keyof userType_]: userType_[contextName] extends moo.def.userType.model ? model<userType_[contextName]> : unknown
      } & withAccErr<'u'>

      type model<model_ extends moo.def.userType.model> = {
        [scopeName in string & keyof model_]: model_[scopeName] extends moo.def.userType.scope ? scope<model_[scopeName]> : unknown
      } & withAccErr<'u'>

      type scope<scope_ extends moo.def.userType.scope> = {
        [useCaseName in string & keyof scope_]: scope_[useCaseName] extends moo.def.userType.usecase ? usecase<scope_[useCaseName]> : never
      } & withAccErr<'u'>

      type usecaseAccess<usecase_ extends moo.def.userType.usecase = moo.def.userType.usecase> = withAccErr &
        ((
          context: tagType<usecase_, tags.context> extends never | undefined | null | void ? void : tagType<usecase_, tags.context>,
        ) => (withAccErr<'e'> & Partial<usecase<usecase_>>) | (withAccErr<'u'> & usecase<usecase_>))

      type usecase<usecase_ extends moo.def.userType.usecase> = {
        [endpointName in string & keyof usecase_]: usecase_[endpointName] extends moo.def.userType.endpoint ? endpointAccess<usecase_[endpointName]> : never
      }

      type endpointAccessHandle<endpoint_ extends moo.def.userType.endpoint = moo.def.userType.endpoint> = gate.endpointChecksHandle<endpoint_> &
        withAccErr<'u'> & {
          allowed: true
          send: endpointCall<endpoint_>
        }

      type endpointAccess<endpoint_ extends moo.def.userType.endpoint = moo.def.userType.endpoint> = withAccErr &
        ((
          context: endpoint_[3] extends never | undefined | null | void ? void : endpoint_[3],
        ) => (withAccErr<'e'> & { allowed: false; zod?: undefined; send?: endpointCall<endpoint_>; context?: undefined }) | endpointAccessHandle<endpoint_>)

      type withAccErr<t extends 'e' | 'u' = 'e' | 'u'> = {
        _: t extends 'e' ? { error: Error4xx } : never | t extends 'u' ? undefined : never
      }

      type endpointCall<endpoint_ extends moo.def.userType.endpoint = moo.def.userType.endpoint> = (form: userType.endpointFormType<endpoint_>) => Promise<endpoint_[1]>
    }
  }
}
