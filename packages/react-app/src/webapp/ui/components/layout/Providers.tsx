import { FC, PropsWithChildren } from 'react'
import { StateProvider } from './ContextProvider'

const Providers: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <StateProvider>{children}</StateProvider>
}

export default Providers
