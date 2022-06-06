import type { ExtId } from '@moodlenet/kernel'
import type { FC, PropsWithChildren } from 'react'
import { ExtInstancesCtx, ProvideExtInstancesContext } from './ext-instances'
import { ProvideAppRouterContext, RouterCtx } from './routes'
import { ReactAppContainer } from './types'

export const ContainerContextsProviders: FC<PropsWithChildren<{ extensionInstances: Record<ExtId, any> }>> = ({
  children,
  extensionInstances,
}) => {
  return (
    <ProvideExtInstancesContext extensionInstances={extensionInstances}>
      <ProvideAppRouterContext>{children}</ProvideAppRouterContext>
    </ProvideExtInstancesContext>
  )
}

export const reactAppContainer: ReactAppContainer = {
  RouterCtx,
  ExtInstancesCtx,
}
