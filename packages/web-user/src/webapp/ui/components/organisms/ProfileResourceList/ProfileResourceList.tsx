import { NoteAdd } from '@material-ui/icons'
import { ListCard, PrimaryButton } from '@moodlenet/component-library'
import { ResourceCard } from '@moodlenet/ed-resource/ui'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import './ProfileResourceList.scss'

export type ProfileResourceListProps = {
  resourceCardPropsList: { key: string; resourceCardProps: ProxyProps<ResourceCardProps> }[]
  createResource(): void
  canEdit: boolean
}
1504062
1504094
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
                key={resourceCardProps.key}
                {...resourceCardProps.resourceCardProps}
                orientation="horizontal"
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
