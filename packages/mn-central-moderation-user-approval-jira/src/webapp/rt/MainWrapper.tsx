import type { PropsWithChildren } from 'react'
import { MyLmsContextProvider } from './myLmsContext.js'

export function MainWrapper({ children }: PropsWithChildren<unknown>) {
  return <MyLmsContextProvider>{children}</MyLmsContextProvider>
}
