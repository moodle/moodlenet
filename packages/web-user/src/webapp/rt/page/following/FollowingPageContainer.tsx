import type { FC } from 'react'
import { Following } from '../../../ui/exports/ui.mjs'
import { useFollowsPageProps } from './FollowingPageHook.mjs'

export const FollowingPageContainer: FC = () => {
  const followsPageProps = useFollowsPageProps()
  return <Following {...followsPageProps} />
}
