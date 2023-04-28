import { ListCard, PrimaryButton } from '@moodlenet/component-library'
import { LibraryAdd } from '@mui/icons-material'
import { FC, useMemo } from 'react'
import { CollectionCard, CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import './ProfileCollectionList.scss'

export type ProfileCollectionListProps = {
  collectionCardPropsList: CollectionCardProps[]
  createCollection(): void
  canEdit: boolean
}

export const ProfileCollectionList: FC<ProfileCollectionListProps> = ({
  collectionCardPropsList,
  createCollection,
  canEdit,
}) => {
  // const [windowWidth, /* _isShowingSmallCard */ setIsShowingSmallCard] = useState<boolean>(false)

  // const setIsShowingSmallCardHelper = () => {
  //   setIsShowingSmallCard(window.innerWidth < 550 ? true : false)
  // }

  // useLayoutEffect(() => {
  //   window.addEventListener('resize', setIsShowingSmallCardHelper)
  //   return () => {
  //     window.removeEventListener('resize', setIsShowingSmallCardHelper)
  //   }
  // }, [])

  const listCard = (
    <ListCard
      className="profile-collection-list"
      header={`Curated collections`}
      content={useMemo(
        () =>
          collectionCardPropsList.map(collectionCardProps => (
            <CollectionCard key={collectionCardProps.data.collectionId} {...collectionCardProps} />
          )),
        [collectionCardPropsList],
      )}
      actions={
        canEdit
          ? {
              element: (
                <PrimaryButton className="action" onClick={createCollection}>
                  <LibraryAdd />
                  New collection
                </PrimaryButton>
              ),
              position: 'end',
            }
          : undefined
      }
    ></ListCard>
  )

  return (canEdit || collectionCardPropsList.length > 0) && window.innerWidth ? listCard : null
}

ProfileCollectionList.defaultProps = {}

export default ProfileCollectionList
