import { ExtDef, ExtId, SubcriptionPaths, SubcriptionReq, SubcriptionVal } from '@moodlenet/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetch } from './fetch'

export const lazyFetchHook =
  <Def extends ExtDef>(extId: ExtId<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    const [value, setValue] = useState<SubcriptionVal<Def, Path>>()
    const [error, setError] = useState<any>()
    const [fetching, setFetching] = useState(true)

    const lazyFetch = useCallback(
      (req: SubcriptionReq<Def, Path>) => {
        // new Promise<[SubcriptionVal<Def, Path>, HttpSubType['obsType']]>((resolve, reject) => {
        setFetching(true)
        return fetch<Def>(extId)<Path>(path)(req)
          .then(resp => {
            setValue(resp)
            return resp
          })
          .catch(err => {
            setError(err)
            throw err
          })
          .finally(() => {
            setFetching(false)
          })
      },
      [extId, path],
    )
    return useMemo(() => ({ fetch: lazyFetch, value, fetching, error }), [lazyFetch, value, error, fetching])
  }

export const fetchHook =
  <Def extends ExtDef>(extId: ExtId<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path, req: SubcriptionReq<Def, Path>) => {
    const { fetch, value, fetching, error } = lazyFetchHook<Def>(extId)<Path>(path)
    const reqStr = useMemo(() => JSON.stringify(req), [req])
    // console.log({ reqStr })
    const refresh = useCallback(() => {
      return fetch(JSON.parse(reqStr))
    }, [fetch, reqStr])

    useEffect(() => {
      refresh()
    }, [refresh])

    return useMemo(() => ({ value, fetching, refresh, error }), [value, error, fetching, refresh])
  }
