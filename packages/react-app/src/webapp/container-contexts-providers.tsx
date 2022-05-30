import { FC, PropsWithChildren } from 'react'
import { HttpAdapterCtx, ProvideHttpAdapterCtx } from './http-adapter'
import { ProvideAppRouterContext, RouterCtx } from './routes'
import type { RactAppContainer as RactAppContainerT } from './types'

export const RactAppContainer: RactAppContainerT = {
  HttpAdapterCtx,
  RouterCtx,
}

export const ContainerContextsProviders: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <ProvideAppRouterContext>
      <ProvideHttpAdapterCtx>{children}</ProvideHttpAdapterCtx>
    </ProvideAppRouterContext>
  )
}
