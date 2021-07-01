import { FC } from 'react'
import { LinkComponentProvider } from './UI/LinkComponent'

export const UICtxProviders: FC = ({ children }) => {
  return <LinkComponentProvider>{children}</LinkComponentProvider>
}
