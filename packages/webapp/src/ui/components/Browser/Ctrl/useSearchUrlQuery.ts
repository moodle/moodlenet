import { useCallback, useMemo } from 'react'
import { mainPath } from '../../../../hooks/glob/nav'
import { useUrlQuery } from '../../../lib/useUrlQuery'

const paramNames = ['text'] as const
export const useBrowserUrlQuery = () => {
  const { queryParams, setQueryParams } = useUrlQuery(paramNames, {
    baseUrl: mainPath.search,
  })
  const setText = useCallback((text: string) => setQueryParams({ text: [text] }), [setQueryParams])
  const text = useMemo(() => queryParams.text.join(' '), [queryParams])
  return {
    setText,
    text,
  }
}
