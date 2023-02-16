// import { useMainLayoutProps } from '@moodlenet/react-app/ui'
// import { useMemo } from 'react'
// import { useCollectionCardProps } from '../../organisms/CollectionCard/CollectionCardHooks.js'
// import { CollectionProps } from './Collection.js'

// export const useCollectionProps = ({ collectionKey }: { collectionKey: string }): CollectionProps => {
//   const collectionCardProps = useCollectionCardProps({ collectionKey })
//   const mainLayoutProps = useMainLayoutProps()
//   const CollectionProps = useMemo<CollectionProps>(() => {
//     const props: CollectionProps = {
//       collectionCardProps,
//       mainLayoutProps,
//     }
//     return props
//   }, [mainLayoutProps, collectionCardProps])

//   return CollectionProps
// }
