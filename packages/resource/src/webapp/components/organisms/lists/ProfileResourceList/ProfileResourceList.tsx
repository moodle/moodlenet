import { NoteAdd } from '@material-ui/icons'
import { Href, ListCard, PrimaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { FC } from 'react'
import ResourceCard, { ResourceCardProps } from '../../ResourceCard/ResourceCard.js'
import './ProfileResourceList.scss'

export type ProfileResourceListProps = {
  resourceCardPropsList: ResourceCardProps[]
  newResourceHref: Href
  isOwner: boolean
}

export const ProfileResourceList: FC<ProfileResourceListProps> = ({
  resourceCardPropsList,
  newResourceHref,
  isOwner,
}) => {
  return isOwner || resourceCardPropsList.length > 0 ? (
    <ListCard
      className="resources"
      content={resourceCardPropsList.map(resourceCardProps => {
        return (
          <ResourceCard
            key={resourceCardProps.resourceId}
            {...resourceCardProps}
            orientation="horizontal"
          />
        )
      })}
      title={`Latest resources`}
      actions={
        isOwner
          ? {
              element: (
                <Link href={newResourceHref}>
                  <PrimaryButton className="action">
                    <NoteAdd />
                    New resource
                  </PrimaryButton>
                </Link>
              ),
              position: 'end',
            }
          : undefined
      }
    />
  ) : null
}

ProfileResourceList.defaultProps = {}

export default ProfileResourceList
