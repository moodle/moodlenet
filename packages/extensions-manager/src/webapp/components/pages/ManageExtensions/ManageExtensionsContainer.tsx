import { FC } from 'react'
import Extensions from './ManageExtensions.js'
import { useManageExtensionsStoryProps } from './ManageExtensions.stories.js'

export const ManageExtensionsContainer: FC = () => {
  const manageExtensionsStoryProps = useManageExtensionsStoryProps()

  return <Extensions {...manageExtensionsStoryProps} />
}
