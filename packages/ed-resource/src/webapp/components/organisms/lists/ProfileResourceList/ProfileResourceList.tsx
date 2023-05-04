import { NoteAdd } from '@material-ui/icons'
import { ListCard, PrimaryButton } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ResourceCardProps } from '../../ResourceCard/ResourceCard.js'
import ResourceCard from '../../ResourceCard/ResourceCard.js'
import './ProfileResourceList.scss'

export type ProfileResourceListProps = {
  resourceCardPropsList: ResourceCardProps[]
  createResource(): void
  canEdit: boolean
}

export const ProfileResourceList: FC<ProfileResourceListProps> = ({
  resourceCardPropsList,
  createResource,
  canEdit,
}) => {
  const listCard = (
    <ListCard
      className="resources"
      content={useMemo(
        () =>
          resourceCardPropsList.map(resourceCardProps => {
            return (
              <ResourceCard
                key={resourceCardProps.data.resourceId}
                {...resourceCardProps}
                orientation="horizontal"
                showDeleteButton
              />
            )
          }),
        [resourceCardPropsList],
      )}
      header={`Latest resources`}
      actions={
        canEdit
          ? {
              element: (
                <PrimaryButton className="action" onClick={createResource}>
                  <NoteAdd />
                  New resource
                </PrimaryButton>
              ),
              position: 'end',
            }
          : undefined
      }
    />
  )

  return canEdit || resourceCardPropsList.length > 0 ? listCard : null
}

ProfileResourceList.defaultProps = {}

export default ProfileResourceList
