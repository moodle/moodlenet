import { FC, PropsWithChildren } from 'react'
import SimpleLayout, { SimpleLayoutProps } from './SimpleLayout.js'
import { useSimpleLayoutProps } from './SimpleLayoutHooks.mjs'

export const SimpleLayoutContainer: FC<
  PropsWithChildren<{ overrideProps?: SimpleLayoutProps }>
> = ({ children, overrideProps }) => {
  const props = useSimpleLayoutProps()
  return <SimpleLayout {...{ ...props, ...overrideProps }}>{children}</SimpleLayout>
}
