import { ExtDef, ExtId, SubcriptionPaths, SubcriptionReq, SubcriptionVal } from '@moodlenet/core'
import { RawSubOpts } from '@moodlenet/http-server'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { take } from 'rxjs/operators'
import { subRaw } from './fetch'

export const lazyFetchHook =
  <Def extends ExtDef>(extId: ExtId<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    type HttpSubType = RawSubOpts<Def, Path>
    const fetch = useCallback(
      (req: SubcriptionReq<Def, Path>) =>
        new Promise<[SubcriptionVal<Def, Path>, HttpSubType['obsType']['msg']]>((resolve, reject) => {
          setFetching(true)
          subRaw<Def>(extId)<Path>(path)(req)
            .pipe(take(1))
            .subscribe({
              next(resp) {
                setMsg(resp.msg)
                const itemNotif = resp.msg.data.value
                if (itemNotif.kind === 'E') {
                  setError(itemNotif.error)
                } else if (itemNotif.kind === 'N') {
                  resolve([itemNotif.value, resp.msg])
                  setValue(itemNotif.value)
                  setError(undefined)
                }
                setFetching(false)
              },
              complete() {
                setFetching(false)
                reject('no value')
              },
              error(err) {
                reject(err)
                setError(err)
                setFetching(false)
              },
            })
        }),
      [extId, path],
    )
    const [msg, setMsg] = useState<HttpSubType['obsType']['msg']>()
    const [value, setValue] = useState<SubcriptionVal<Def, Path>>()
    const [error, setError] = useState<any>()
    const [fetching, setFetching] = useState(true)

    return useMemo(() => ({ fetch, value, fetching, error, msg }), [fetch, msg, value, error, fetching])
  }
export const fetchHook =
  <Def extends ExtDef>(extId: ExtId<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path, req: SubcriptionReq<Def, Path>) => {
    const { fetch, value, fetching, error, msg } = lazyFetchHook<Def>(extId)<Path>(path)
    const reqStr = useMemo(() => JSON.stringify(req), [req])
    const refresh = useCallback(() => {
      return fetch(JSON.parse(reqStr))
    }, [fetch, reqStr])

    useEffect(() => {
      refresh()
    }, [refresh])

    return useMemo(() => ({ value, fetching, refresh, error, msg }), [msg, value, error, fetching, refresh])
  }
