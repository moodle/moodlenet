import type { FC, PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProvideMainSearchBoxCtx } from './MainSearchBox.js'

export const MainSearchBoxCtxProviderContainer: FC<PropsWithChildren> = ({ children }) => {
  const nav = useNavigate()
  const search = useCallback(
    (text: string) => {
      nav(`/search?q=${text}`)
    },
    [nav],
  )
  return <ProvideMainSearchBoxCtx search={search}>{children}</ProvideMainSearchBoxCtx>
}
