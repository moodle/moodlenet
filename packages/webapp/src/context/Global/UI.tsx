import { FC } from 'react'
import { ProvideReactRouterLinkComponent } from './UI/LinkComponent'

export const UICtxProviders: FC = ({ children }) => {
  return (
    <ProvideReactRouterLinkComponent>
      {children}
    </ProvideReactRouterLinkComponent>
  )
}
