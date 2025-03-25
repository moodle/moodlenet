/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { path } from '@moodle/lib-types'
// import { identity, pipe } from 'fp-ts/function'
import { Error4xx } from '../lib'

type voidable<t> = t extends never | undefined | void ? void : t

declare global {
  namespace moo.def.gate {
    // type client = {
    //   [userTypeName in keyof UserType]: client.branch<UserType[userTypeName]>
    // }
    type client = client.branch<UserType>

    namespace client {
      // type branch<branch_> = (context: voidable<tagType<branch_, tags.context>>) => E.Either<
      // type withMaybeError4xx<branch_> = ({ $error: Error4xx } & Partial<branch_>) | ({ $error?: never } & branch_)
      // type withMaybeError4xx<branch_> = ({ $error?: Error4xx } & Partial<branch_>)

      type node<node_> = (
        context?: voidable<tagType<node_, tags.context>>,
      ) => branchWithMaybeErrror<node_ extends moo.def.userType.endpoint ? endpointAccessHandle<node_> : branch<node_>>

      type branch<branch_> = {
        [key in keyof branch_]: node<branch_[key]>
      }

      type branchWithMaybeErrror<branch_> = branch_ extends endpointAccessHandle
        ? ({ $error?: undefined } & branch_) | ({ $error: Error4xx } & { [k in keyof branch_]: undefined }) // Partial<branch_> //
        : { $error?: Error4xx } & branch_

      type request<endpoint_ extends def.userType.endpoint = def.userType.endpoint> = {
        path: path
        form: userType.endpointFormType<endpoint_>
      }

      type dispatcher<endpoint_ extends def.userType.endpoint = def.userType.endpoint> = (gateClientRequest: request<endpoint_>) => Promise<userType.endpointReturn<endpoint_>>

      type endpointAccessHandle<endpoint_ extends moo.def.userType.endpoint = moo.def.userType.endpoint> = {
        // preflight: gate.preflight<endpoint_>
        send: userType.endpointFunction<endpoint_>
        zod: userType.enpointZodType<endpoint_>
      }
    }
  }
}

// declare const cli: moo.def.gate.client
// declare const _i: moo.def.policies.user.info
// const accessControl = pipe(
//   cli.any(),
//   E.flatMap(({ accessControl }) => accessControl({ m1: '' })),
// )
// const q = E.ap(accessControl)

// const _1 = q(E.right(ac => ac.policies({ s1: '' })))
// const _2 = q(E.left('ccc'))

// const policiesInfo = pipe(
//   accessControl,
//   E.flatMap(({ policies }) => policies({ s1: '' })),
//   E.flatMap(({ readMyOwn }) => readMyOwn({ u1: '' })),
//   E.map(({ policiesInfo }) => ({
//     policiesInfo: E.getOrElse(() => null)(policiesInfo({ e1: '' })),
//   })),
//   //E.map(({})=>policiesInfo({configs:{e:''},context:{e1:''}})),
// )
// pipe(
//   policiesInfo,
//   E.map(({ policiesInfo }) => policiesInfo),
//   E.flatMapNullableK(() => new Error4xx('Unauthorized', ''))(identity),
//   E.map(policiesInfo => policiesInfo.send()),
// )
