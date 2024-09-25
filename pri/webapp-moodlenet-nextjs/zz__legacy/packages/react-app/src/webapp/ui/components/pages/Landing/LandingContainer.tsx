import type { FC } from 'react'

import { Landing } from './Landing'
import { useLandingPageProps } from './LandingHook.mjs'

export const LandingContainer: FC = () => {
  const myProps = useLandingPageProps()
  return <Landing {...myProps} />
}
