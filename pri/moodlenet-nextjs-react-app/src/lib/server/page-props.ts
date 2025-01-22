import { map } from '@moodle/lib-types'
import assert from 'assert'

export type pageProps<params extends params_, searchParams extends params_ = never> = {
  params: Promise<params>
  searchParams: Promise<searchParams>
}

type pVal = undefined | string | string[]

// export type params<names extends string> = Record<names, string>
type params_ = map<pVal>
type paramsKeys<params extends Promise<params_>, t extends pVal> = keyof Awaited<params> extends infer _k
  ? _k extends string
    ? Awaited<params>[_k] extends t
      ? _k
      : never
    : never
  : never

/**
 * Gets a required parameter.
 * @param name The name of the parameter to retrieve.
 * @param params The object containing the parameters.
 * @returns A Promise that resolves to the value of the required parameter as a string.
 * @throws Assertion error if the parameter is undefined or an array.
 */
export async function paramRequired<params extends Promise<params_>, name extends paramsKeys<params, string>>(
  name: name,
  params: params,
): Promise<string> {
  const _pval = (await params)[name]
  assert(!Array.isArray(_pval) && _pval !== undefined, `required param ${name} is undefined or array: [${_pval}]`)
  return _pval
}

/**
 * Gets an array parameter.
 * @param name The name of the parameter to retrieve.
 * @param params The object containing the parameters.
 * @returns A Promise that resolves to an array of strings representing the parameter values.
 */
export async function paramArray<params extends Promise<params_>, name extends paramsKeys<params, string[] | undefined>>(
  name: name,
  params: params,
): Promise<string[]> {
  const _pval = (await params)[name]
  return _pval === undefined ? [] : [_pval].flat()
}

/**
 * Gets an optional parameter.
 * @param name The name of the parameter to retrieve.
 * @param params The object containing the parameters.
 * @returns A Promise that resolves to the value of the optional parameter as a string or undefined.
 */
export async function paramOpt<params extends Promise<params_>, name extends paramsKeys<params, string | undefined>>(
  name: name,
  params: params,
): Promise<string | undefined> {
  const _pval = (await params)[name]
  assert(!Array.isArray(_pval), `param ${name} is an array, but should be a string | undefined: [${_pval}]`)
  return _pval
}
