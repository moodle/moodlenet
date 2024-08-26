import type { FC, PropsWithChildren } from 'react'
import type { MainLayoutProps } from '../../../../../../../../../app-nextjs-moodlenet/src/layouts/MainLayout.js'
import MainLayout from '../../../../../../../../../app-nextjs-moodlenet/src/layouts/MainLayout.js'
import { useMainLayoutProps } from './MainLayoutHooks.mjs'

export const MainLayoutContainer: FC<PropsWithChildren<{ overrideProps?: MainLayoutProps }>> = ({
  children,
  overrideProps,
}) => {
  const props = useMainLayoutProps()
  return <MainLayout {...{ ...props, ...overrideProps }}>{children}</MainLayout>
}
