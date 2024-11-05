import { ListCard, PrimaryButton } from '@moodlenet/component-library'
import type { ResourceCardProps } from '@moodlenet/ed-resource/ui'
import { ResourceCard } from '@moodlenet/ed-resource/ui'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import { NoteAdd } from '@mui/icons-material'
import type { FC } from 'react'
import { useMemo } from 'react'
import './ProfileResourceList.scss'

export type ProfileResourceListProps = {
  resourceCardPropsList: { key: string; props: ProxyProps<ResourceCardProps> }[]
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
      className="profile-resource-list"
      content={useMemo(
        () =>
          resourceCardPropsList.map(({ key, props }) => {
            return { key, el: <ResourceCard key={key} {...props} orientation="horizontal" /> }
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
