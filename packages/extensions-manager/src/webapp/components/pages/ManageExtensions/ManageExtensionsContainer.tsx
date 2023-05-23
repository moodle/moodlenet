import type { FC } from 'react'
import type { ManageExtensionsProps } from './ManageExtensions.js'
import Extensions from './ManageExtensions.js'

export const ManageExtensionsContainer: FC = () => {
  const manageExtensionsStoryProps: ManageExtensionsProps = {
    extensions: [],
  } //useManageExtensionsStoryProps()

  return <Extensions {...manageExtensionsStoryProps} />
}
