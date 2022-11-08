import { Header, HeaderProps, HeaderTitleProps, UserProps } from '@moodlenet/component-library'
import { FC } from 'react'

import { Landing, LandingProps } from './Landing.js'
import { useLandingPageProps } from './LandingHook.mjs'

export const LandingContainer: FC = () => {
  const myProps = useLandingPageProps()
  return <Landing {...myProps} />
}
