import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useHistory, useLocation } from 'react-router'

type ParamsRecord<ParamNames extends string> = Record<ParamNames, string[]>
export const useUrlQuery = <ParamNames extends string>(paramNames: readonly ParamNames[], push?: boolean) => {
  type PRec = ParamsRecord<ParamNames>
  const paramNamesRef = useRef(paramNames)
  const firstIn = useRef(true)
  const location = useLocation()
  const urlSearch = location.search
  const baseUrl = location.pathname
  const history = useHistory()

  const queryParams = useMemo(() => {
    const urlSearchParams = new URLSearchParams(urlSearch)
    return paramNamesRef.current.reduce((obj, paramName) => {
      const paramValue = urlSearchParams.getAll(paramName)
      return {
        ...obj,
        [paramName]: paramValue,
      }
    }, {} as PRec)
  }, [urlSearch])

  const setQueryParams = useCallback(
    (pRec: PRec) => {
      const params = new URLSearchParams()

      Object.entries(pRec).forEach(([pname, pvals]) => {
        params.delete(pname)
        ;(pvals as string[]).forEach(pval => params.append(pname, pval))
      })
      const qstring = params.toString()
      history[push ? 'push' : 'replace'](`${baseUrl}?${qstring}`)
    },
    [push, baseUrl, history],
  )

  useEffect(() => {
    if (firstIn.current) {
      return
    }
    firstIn.current = false
    setQueryParams(queryParams)
  }, [queryParams, setQueryParams])

  return {
    queryParams,
    setQueryParams,
  }
}
