import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useUrlQueryString<PNames extends string>(
  pNames: readonly PNames[],
  _prefix = '',
): Handle<PNames> {
  const prefix = _prefix ? `${_prefix.replace(/\W/g, '_')}-` : ''
  const [q, setQ] = useSearchParams()
  const pNamesString = pNames.map(_ => `${prefix}${_}`).join('&')
  const makeParams = useCallback(() => {
    const updatedParams = pNamesString.split('&').reduce((_acc, name) => {
      const paramValue = q.get(name) ?? undefined
      return { ..._acc, [name.substring(prefix.length)]: paramValue }
    }, {} as Params<PNames>)
    return updatedParams
  }, [pNamesString, q, prefix])

  const [strictParams, setStrictParams] = useState<Params<PNames>>(makeParams)

  const setParams = useCallback<Handle<PNames>[1]>(
    params => {
      setQ(curr => {
        const current = [...curr.keys()].reduce((acc, key) => {
          acc[key] = curr.getAll(key)
          return acc
        }, {} as Record<string, string[]>)
        const prefixedParams = Object.entries(params).reduce((acc, [key, val]) => {
          typeof val === 'string' && (acc[`${prefix}${key}`] = val)
          return acc
        }, {} as Record<string, string>)

        return {
          ...current,
          ...prefixedParams,
        }
      })
    },
    [setQ, prefix],
  )

  useEffect(() => {
    const updatedParams = makeParams()
    setStrictParams(updatedParams)
  }, [makeParams])

  const handle = useMemo<Handle<PNames>>(() => {
    const handle: Handle<PNames> = [strictParams, setParams]
    return handle
  }, [strictParams, setParams])

  return handle
}

type Params<PNames extends string> = {
  [k in PNames]?: string
}

type Handle<PNames extends string> = [
  params: Params<PNames>,
  setParams: (params: Params<PNames>) => void,
]
