import { FC } from 'react'
import { HeaderElementProvider } from './UI/HeaderElement'
import { LinkComponentProvider } from './UI/LinkComponent'

export const UICtxProviders: FC = ({ children }) => {
  return (
    <HeaderElementProvider>
      <LinkComponentProvider>{children}</LinkComponentProvider>
    </HeaderElementProvider>
  )
}
