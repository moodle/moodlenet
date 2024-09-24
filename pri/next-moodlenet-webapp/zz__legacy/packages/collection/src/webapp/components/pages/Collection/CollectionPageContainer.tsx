import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import Collection from './Collection'
import { useCollectionPageProps } from './CollectionPageHooks'

export const CollectionContainer: FC<{ collectionKey: string }> = ({ collectionKey }) => {
  const collectionProps = useCollectionPageProps({ collectionKey })
  if (collectionProps === null) {
    return <FallbackContainer />
  } else if (collectionProps === undefined) {
    return null
  }
  return <Collection key={collectionKey} {...collectionProps} />
}
