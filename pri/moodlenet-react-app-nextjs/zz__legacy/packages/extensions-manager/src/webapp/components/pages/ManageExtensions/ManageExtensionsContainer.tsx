import type { FC } from 'react'
import type { ManageExtensionsProps } from './ManageExtensions'
import Extensions from './ManageExtensions'

export const ManageExtensionsContainer: FC = () => {
  const manageExtensionsStoryProps: ManageExtensionsProps = {
    extensions: [],
  } //useManageExtensionsStoryProps()

  return <Extensions {...manageExtensionsStoryProps} />
}
