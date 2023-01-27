// import { useMainLayoutProps } from '@moodlenet/react-app/ui'
// import { useMemo } from 'react'
// import { useResourceCardProps } from '../../organisms/ResourceCard/ResourceCardHooks.js'
// import { ResourceProps } from './Resource.js'

// export const useResourceProps = ({ resourceKey }: { resourceKey: string }): ResourceProps => {
//   const resourceCardProps = useResourceCardProps({ resourceKey })
//   const mainLayoutProps = useMainLayoutProps()
//   const ResourceProps = useMemo<ResourceProps>(() => {
//     const props: ResourceProps = {
//       resourceCardProps,
//       mainLayoutProps,
//     }
//     return props
//   }, [mainLayoutProps, resourceCardProps])

//   return ResourceProps
// }
