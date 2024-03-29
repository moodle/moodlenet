import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router'

const getQueryString = <QPar extends QueryParamsArray<string>>(qPar: QPar) => {
  const params = new URLSearchParams()

  Object.entries(qPar).forEach(([pname, pvals]) => {
    params.delete(pname)
    ;(pvals as string[]).forEach((pval) => params.append(pname, pval))
  })
  const qstring = params.toString()
  return qstring
}

type QueryParamsArray<ParamNames extends string> = Record<ParamNames, string[]>
type QueryParams<ParamNames extends string> = Record<ParamNames, string>
export const useUrlQuery = <ParamNames extends string>(
  paramNames: readonly ParamNames[],
  opts?: {
    baseUrl?: string
    delay?: number
    sep?: string
  }
) => {
  type QParamsArray = QueryParamsArray<ParamNames>
  type QParams = QueryParams<ParamNames>
  const paramNamesRef = useRef(paramNames)
  const firstIn = useRef(true)
  const neverSet = useRef(true)
  const history = useHistory()

  const [urlSearch, setUrlSearch] = useState(history.location.search)
  useEffect(
    () => history.listen(({ search }) => setUrlSearch(search)),
    [history]
  )

  const baseUrl = opts?.baseUrl || history.location.pathname

  const [queryParamsArray, queryParams] = useMemo(() => {
    const urlSearchParams = new URLSearchParams(urlSearch)
    return paramNamesRef.current.reduce(
      ([_qParamsArray, _qParams], paramName) => {
        const paramValue = urlSearchParams.getAll(paramName)
        return [
          {
            ..._qParamsArray,
            [paramName]: paramValue,
          },
          {
            ..._qParams,
            [paramName]: paramValue.join(opts?.sep ?? ' '),
          },
        ]
      },
      [{}, {}] as [QParamsArray, QParams]
    )
  }, [opts?.sep, urlSearch])

  const [queryString, setQueryString] = useState(
    getQueryString(queryParamsArray)
  )

  const setQueryParams = useCallback(
    (newQueryParams: Partial<QParamsArray>) => {
      // console.log({ queryParamsArray, newQueryParams })
      const qstring = getQueryString({ ...queryParamsArray, ...newQueryParams })
      setQueryString(qstring)
    },
    [queryParamsArray]
  )

  useEffect(() => {
    if (firstIn.current) {
      firstIn.current = false
      return
    }
    const to = setTimeout(() => {
      const action =
        opts?.baseUrl === history.location.pathname ? 'replace' : 'push'
      neverSet.current = false
      history[action]({
        pathname: opts?.baseUrl,
        search: `?${queryString}`,
      })
    }, opts?.delay || 300)
    return () => clearTimeout(to)
  }, [history, baseUrl, queryString, opts?.delay, opts?.baseUrl])

  // useEffect(() => {
  //   if (firstIn.current) {
  //     return
  //   }
  //   firstIn.current = false
  //   setQueryParams(queryParams)
  // }, [queryParams, setQueryParams])

  return {
    queryParams,
    queryParamsArray,
    setQueryParams,
  }
}
