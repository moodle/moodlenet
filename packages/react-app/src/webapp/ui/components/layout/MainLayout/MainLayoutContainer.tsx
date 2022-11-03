import { FC, PropsWithChildren } from 'react'
import MainLayout, { MainLayoutProps } from './MainLayout.js'
import { useMainLayoutProps } from './MainLayoutHooks.mjs'

export const MainLayoutContainer: FC<PropsWithChildren<{ overrideProps?: MainLayoutProps }>> = ({
  children,
  overrideProps,
}) => {
  const props = useMainLayoutProps()
  return <MainLayout {...{ ...props, ...overrideProps }}>{children}</MainLayout>
}
