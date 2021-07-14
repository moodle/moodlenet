import { FC } from 'react'
import { ProvideGlobalLinkComponent } from './UI/LinkComponent'

export const UICtxProviders: FC = ({ children }) => {
  return <ProvideGlobalLinkComponent>{children}</ProvideGlobalLinkComponent>
}
