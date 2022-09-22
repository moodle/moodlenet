import { ApiDef, ApiFn, ArgsValidation, CtxApiFn } from './types.mjs'

export function defApi<_ApiFn extends ApiFn>(api: CtxApiFn<_ApiFn>, argsValidation: ArgsValidation): ApiDef<_ApiFn> {
  return {
    api,
    argsValidation,
  }
}
