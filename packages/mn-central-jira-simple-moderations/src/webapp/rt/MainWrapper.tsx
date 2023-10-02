import type { PropsWithChildren } from 'react'
import { MyModerationsContextProvider } from './myModerationsContext.js'

export function MainWrapper({ children }: PropsWithChildren<unknown>) {
  return <MyModerationsContextProvider>{children}</MyModerationsContextProvider>
}
