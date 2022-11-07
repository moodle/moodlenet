import { API_DEF_SYMBOL } from './lib.mjs'
import { ApiDef, ApiFn, ArgsValidation, CtxApiFn } from './types.mjs'
export * from './types.mjs'

export function defApi<_ApiFn extends ApiFn>(
  api: CtxApiFn<_ApiFn>,
  argsValidation: ArgsValidation,
): ApiDef<_ApiFn> {
  return {
    api,
    argsValidation,
    ...{ [API_DEF_SYMBOL]: API_DEF_SYMBOL },
  }
}
