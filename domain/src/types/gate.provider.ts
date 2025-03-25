/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { map, signed_token, url_string } from '@moodle/lib-types'
import { Error4xx } from '../lib'

type voidable<t> = t extends never | undefined | void ? void : t
declare global {
  namespace moo.def.gate {
    type endpointChecksHandle<useCaseEndpoint extends moo.def.userType.endpoint = moo.def.userType.endpoint> = {
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

    type provider<forUserTypes extends map<moo.def.userType> = moo<UserType>> = provider.branch<forUserTypes>
    namespace provider {
      type dispatcher = (gateProviderRequest: request) => Promise<unknown>

      type request<endpoint_ extends def.userType.endpoint = def.userType.endpoint> = client.request<endpoint_> & { info: request.info }
      namespace request {
        type claims = {
          server: { authSessionToken: signed_token | null; requestId: string; href: url_string; ua: string | null; meta?: unknown }
          // client: { locale?: string; locales?: string[] }
        }
        type info = {
          claims: claims
        }
      }

      type branch<node_> = node_ extends moo.def.userType.endpoint
        ? endpointChecksHandle<node_>
        : {
            [key in string & keyof node_]: node<node_[key]>
          }

      type node<node_> = (configs: moo.def.tagType<node_, moo.def.tags.configs>, context?: voidable<tagType<node_, moo.def.tags.context>>) => Error4xx | branch<node_>
    }
  }
}

