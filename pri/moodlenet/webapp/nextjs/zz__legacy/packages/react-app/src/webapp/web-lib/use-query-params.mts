import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type Params<PNames extends string> = {
  [k in PNames]?: string
}

type Handle<PNames extends string> = [
  params: Params<PNames>,
  setParams: (params: Params<PNames>) => void,
  query: (params: Params<PNames>) => {
    qString: string
    qMap: Record<string, string | undefined>
  },
]

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

  const currentQRef = useRef(q)
  currentQRef.current = q
  const qString = useCallback<Handle<PNames>[2]>(
    params => {
      // const current = [...currentQRef.current.keys()].reduce((acc, key) => {
      //   const val = currentQRef.current.get(key)
      //   typeof val === 'string' && (acc[key] = val)
      //   return acc
      // }, {} as Record<string, string>)

      const prefixedParams = Object.entries(params).reduce(
        (acc, [key, val]) => {
          typeof val === 'string' && (acc[`${prefix}${key}`] = val)
          return acc
        },
        {} as Record<string, string>,
      )

      const qMap = {
        // ...current,
        ...prefixedParams,
      }
      const qString = Object.entries(qMap)
        .map(([key, val]) => `${key}=${val}`)
        .join('&')

      return {
        qString,
        qMap,
      }
    },
    [prefix],
  )

  const setParams = useCallback<Handle<PNames>[1]>(
    params => {
      const current = [...currentQRef.current.keys()].reduce(
        (acc, key) => {
          acc[key] = currentQRef.current.getAll(key)
          return acc
        },
        {} as Record<string, string[]>,
      )
      const prefixedParams = Object.entries(params).reduce(
        (acc, [key, val]) => {
          typeof val === 'string' && (acc[`${prefix}${key}`] = val)
          return acc
        },
        {} as Record<string, string>,
      )

      const nextQ = {
        ...current,
        ...prefixedParams,
      }

      setQ(nextQ)
    },
    [setQ, prefix],
  )

  useEffect(() => {
    const updatedParams = makeParams()
    setStrictParams(updatedParams)
  }, [makeParams])

  const handle = useMemo<Handle<PNames>>(() => {
    const handle: Handle<PNames> = [strictParams, setParams, qString]
    return handle
  }, [strictParams, setParams, qString])

  return handle
}
