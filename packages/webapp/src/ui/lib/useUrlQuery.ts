import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'

const getQueryString = <QPar extends QueryParams<string>>(qPar: QPar) => {
  const params = new URLSearchParams()

  Object.entries(qPar).forEach(([pname, pvals]) => {
    params.delete(pname)
    ;(pvals as string[]).forEach(pval => params.append(pname, pval))
  })
  const qstring = params.toString()
  return qstring
}

type QueryParams<ParamNames extends string> = Record<ParamNames, string[]>
export const useUrlQuery = <ParamNames extends string>(
  paramNames: readonly ParamNames[],
  opts?: {
    baseUrl?: string
    delay?: number
  },
) => {
  type QParams = QueryParams<ParamNames>
  const paramNamesRef = useRef(paramNames)
  const firstIn = useRef(true)
  const neverSet = useRef(true)
  const location = useLocation()
  const urlSearch = location.search
  const baseUrl = opts?.baseUrl || location.pathname
  const history = useHistory()

  const queryParams = useMemo(() => {
    const urlSearchParams = new URLSearchParams(urlSearch)
    return paramNamesRef.current.reduce((obj, paramName) => {
      const paramValue = urlSearchParams.getAll(paramName)
      return {
        ...obj,
        [paramName]: paramValue,
      }
    }, {} as QParams)
  }, [urlSearch])

  const [queryString, setQueryString] = useState(getQueryString(queryParams))

  const setQueryParams = useCallback((newQueryParams: QParams) => {
    const qstring = getQueryString(newQueryParams)
    setQueryString(qstring)
  }, [])

  useEffect(() => {
    if (firstIn.current) {
      firstIn.current = false
      return
    }
    const to = setTimeout(() => {
      const action = opts?.baseUrl === location.pathname ? 'replace' : 'push'
      neverSet.current = false
      history[action](`${baseUrl}?${queryString}`)
    }, opts?.delay || 300)
    return () => clearTimeout(to)
  }, [history, baseUrl, queryString, opts?.delay, opts?.baseUrl, location.pathname])

  // useEffect(() => {
  //   if (firstIn.current) {
  //     return
  //   }
  //   firstIn.current = false
  //   setQueryParams(queryParams)
  // }, [queryParams, setQueryParams])

  return {
    queryParams,
    setQueryParams,
  }
}
