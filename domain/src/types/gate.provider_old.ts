/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { map, signed_token, url_string } from '@moodle/lib-types'

type voidable<t> = t extends never | undefined | void ? void : t
declare global {
  namespace moo.def.gate {
    type endpointChecksHandle______2<useCaseEndpoint extends moo.def.userType.endpoint> = {
      zod: userType.enpointZodType<useCaseEndpoint>
    } //& gateContextChecks<useCaseEndpoint>

    // type gateContextChecks<useCaseEndpoint extends moo.def.userType.endpoint> =
    //   tagType<useCaseEndpoint, tags.context> extends never | undefined | void
    //     ? {
    //         context?: undefined
    //       }
    //     : {
    //         context: {
    //           preflight: preflight<useCaseEndpoint>
    //           check: contextCheck
    //         }
    //       }

    // type contextCheck = () => Either<Error4xx, unknown>
    // type preflight<useCaseEndpoint extends moo.def.userType.endpoint> = (form: def.userType.endpointFormType<useCaseEndpoint>) => Either<Error4xx, unknown>

    type provider______2<forUserTypes extends map<moo.def.userType> = moo<UserType>> = {
      [userType_ in keyof forUserTypes]: provider.userType<forUserTypes[userType_]>
    }
    namespace provider______2 {
      type dispatcher = (gateProviderRequest: request) => Promise<unknown>
      type requestClaims = {
        server: { authSessionToken: signed_token | null; requestId: string; href: url_string; ua: string | null; meta?: unknown }
        // client: { locale?: string; locales?: string[] }
      }
      type request<endpoint_ extends def.userType.endpoint = def.userType.endpoint> = client.request<endpoint_> & {
        info: {
          claims: requestClaims
        }
      }
      type branch<from, to> = (configs: moo.def.tagType<from, moo.def.tags.configs>, context: voidable<tagType<from, moo.def.tags.context>>) => to //Either<Error4xx, to>

      type userType<userType_ extends moo.def.userType = moo.def.userType> = branch<
        userType_,
        {
          [modelName in string & keyof userType_]: userType_[modelName] extends moo.def.userType.model ? model<userType_[modelName]> : unknown
        }
      >

      type model<model_ extends moo.def.userType.model = moo.def.userType.model> = branch<
        model_,
        {
          [scopeName in string & keyof model_]: model_[scopeName] extends moo.def.userType.scope ? scope<model_[scopeName]> : unknown
        }
      >

      type scope<scope_ extends moo.def.userType.scope = moo.def.userType.scope> = branch<
        scope_,
        {
          [useCaseName in string & keyof scope_]: scope_[useCaseName] extends moo.def.userType.usecase ? usecase<scope_[useCaseName]> : never
        }
      >

      type usecase<usecase_ extends moo.def.userType.usecase = moo.def.userType.usecase> = branch<
        usecase_,
        {
          [endpointName in string & keyof usecase_]: usecase_[endpointName] extends moo.def.userType.endpoint ? endpoint<usecase_[endpointName]> : never
        }
      >

      type endpoint<endpoint_ extends moo.def.userType.endpoint = moo.def.userType.endpoint> = branch<endpoint_, endpointChecksHandle<endpoint_>>
    }
  }
}
