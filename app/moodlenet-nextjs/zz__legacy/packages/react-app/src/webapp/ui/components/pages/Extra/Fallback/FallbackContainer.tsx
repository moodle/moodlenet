import type { FC } from 'react'
import { useMainLayoutProps } from '../../../layout/MainLayout/MainLayoutHooks.mjs'
import { Fallback } from './Fallback.js'
import './Fallback.scss'

export const FallbackContainer: FC = () => {
  const mainLayoutProps = useMainLayoutProps()
  return <Fallback mainLayoutProps={mainLayoutProps} />
}

Fallback.defaultProps = {}
