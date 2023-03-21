import { Href, ListCard, PrimaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { LibraryAdd } from '@mui/icons-material'
import { FC, useMemo } from 'react'
import { CollectionCard, CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import './ProfileCollectionList.scss'

export type ProfileCollectionListProps = {
  collectionCardPropsList: CollectionCardProps[]
  newCollectionHref: Href
  isCreator: boolean
}

export const ProfileCollectionList: FC<ProfileCollectionListProps> = ({
  collectionCardPropsList,
  newCollectionHref,
  isCreator,
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
        isCreator
          ? {
              element: (
                <Link href={newCollectionHref}>
                  <PrimaryButton className="action">
                    <LibraryAdd />
                    New collection
                  </PrimaryButton>
                </Link>
              ),
              position: 'end',
            }
          : undefined
      }
    ></ListCard>
  )

  return (isCreator || collectionCardPropsList.length > 0) && window.innerWidth ? listCard : null
}

ProfileCollectionList.defaultProps = {}

export default ProfileCollectionList
