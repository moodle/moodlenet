import { AddonItem } from '@moodlenet/component-library'
import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { FC, useReducer } from 'react'
import {
  ResourceCard,
  ResourceCardPropsControlled,
} from '../../organisms/ResourceCard/ResourceCard.js'
import './Resource.scss'

export type ResourceProps = {
  mainLayoutProps: MainLayoutProps
  resourceCardProps: ResourceCardPropsControlled
  mainColumnItems?: AddonItem[]
  sideColumnItems?: AddonItem[]
}

export const Resource: FC<ResourceProps> = ({
  mainLayoutProps,
  resourceCardProps,
  mainColumnItems,
  sideColumnItems,
}) => {
  const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)
  const updatedMainColumnItems: AddonItem[] = [...(mainColumnItems ?? [])]

  return (
    <MainLayout {...mainLayoutProps}>
      {/* {modals} {snackbars} */}
      <div className="resource">
        <div className="content">
          <div className="main-column">
            <ResourceCard
              {...resourceCardProps}
              // editForm={editForm}
              isEditing={isEditing}
              toggleIsEditing={toggleIsEditing}
              // setShowUserIdCopiedAlert={setShowUserIdCopiedAlert}
              // setShowUrlCopiedAlert={setShowUrlCopiedAlert}
              // setIsReporting={setIsReporting}
              // openSendMessage={() => setIsSendingMessage(/* !!sendEmailForm */ true)}
            />
            {updatedMainColumnItems.map(i => (
              <i.Item key={i.key} />
            ))}
          </div>
          <div className="side-column">
            {sideColumnItems?.map(i => (
              <i.Item key={i.key} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Resource.displayName = 'ResourcePage'
export default Resource
