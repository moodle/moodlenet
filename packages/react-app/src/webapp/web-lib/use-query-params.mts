import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useQueryParams<Def extends ParamsDef>(paramsOpts: AllParamOpts<Def>): Handle<Def> {
  const [stableParamsOpts, setStableParamsOpts] = useState(paramsOpts)
  !Object.keys(stableParamsOpts).every(
    key => String(stableParamsOpts[key]) === String(paramsOpts[key]),
  ) && setStableParamsOpts(paramsOpts)

  const [q, setQ] = useSearchParams()
  const [strictParams, setStrictParams] = useState<Partial<Params<Def>>>({})

  const setParams = useCallback<Handle<Def>[1]>(
    params => {
      setQ(curr => ({
        ...[...curr.keys()].reduce((acc, key) => {
          acc[key] = curr.getAll(key)
          return acc
        }, {} as Record<string, string[]>),
        ...params,
      }))
    },
    [setQ],
  )

  useEffect(() => {
    const updatedParams = Object.keys(stableParamsOpts).reduce((_acc, name) => {
      const pOpts = stableParamsOpts[name]

      const _url_has_at_least_one_param = q.has(name)

      const paramValue = _url_has_at_least_one_param
        ? (isArrayParamOpts(pOpts) ? q.getAll(name) : q.get(name)) ?? undefined
        : undefined

      return { ..._acc, [name]: paramValue }
    }, {} as Partial<Params<Def>>)
    setStrictParams(updatedParams)
  }, [q, stableParamsOpts])

  const handle = useMemo<Handle<Def>>(() => {
    const handle: Handle<Def> = [strictParams, setParams]
    return handle
  }, [strictParams, setParams])

  return handle
}

function isArrayParamOpts(
  opts: undefined | StringParamOpts | ArrayParamOpts,
): opts is ArrayParamOpts {
  return Array.isArray(opts) || opts === 'a'
}

type ArrayParamOpts = 'a' | never[]
type StringParamOpts = null | 's'

type AllParamOpts<Def extends ParamsDef> = {
  [k in keyof Def]: Def[k] extends string[] ? ArrayParamOpts : StringParamOpts
}
type ParamsDef = Record<string, string | string[]>

type Params<Def extends ParamsDef> = {
  [k in keyof Def]?: undefined | Def[k]
}

type Handle<Def extends ParamsDef> = [
  params: Partial<Def>,
  setParams: (params: Partial<Def>) => void,
]
