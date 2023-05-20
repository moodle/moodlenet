import type { Href } from '@moodlenet/component-library'
import { ListCard, PrimaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { LibraryAdd } from '@mui/icons-material'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { CollectionCardProps } from '../../CollectionCard/CollectionCard.js'
import { CollectionCard } from '../../CollectionCard/CollectionCard.js'
import './CollectionList.scss'

export type CollectionListProps = {
  collectionCardPropsList: { props: CollectionCardProps; key: string }[]
  newCollectionHref: Href
  isCreator: boolean
}

export const CollectionList: FC<CollectionListProps> = ({
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
      className="collection-list"
      header={`Curated collections`}
      content={useMemo(
        () =>
          collectionCardPropsList.map(collectionCardProps => (
            <CollectionCard key={collectionCardProps.key} {...collectionCardProps.props} />
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

CollectionList.defaultProps = {}

export default CollectionList
