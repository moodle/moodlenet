import type { FC, PropsWithChildren } from 'react'
import type { SimpleLayoutProps } from './SimpleLayout'
import SimpleLayout from './SimpleLayout'
import { useSimpleLayoutProps } from './SimpleLayoutHooks.mjs'

export const SimpleLayoutContainer: FC<
  PropsWithChildren<{ overrideProps?: SimpleLayoutProps }>
> = ({ children, overrideProps }) => {
  const props = useSimpleLayoutProps()
  return <SimpleLayout {...{ ...props, ...overrideProps }}>{children}</SimpleLayout>
}
