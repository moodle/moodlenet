import { useCallback, useMemo } from 'react'
import { useUrlQuery } from '../../../lib/useUrlQuery'

const paramNames = ['text'] as const
export const useSearchUrlQuery = () => {
  const { queryParams, setQueryParams } = useUrlQuery(paramNames)
  const setText = useCallback((text: string) => setQueryParams({ text: [text] }), [setQueryParams])
  const text = useMemo(() => queryParams.text.join(' '), [queryParams])
  return {
    setText,
    text,
  }
}
