import { Trans } from '@lingui/macro'
import { useState } from 'react'
import Card from '../../components/atoms/Card/Card'
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import ListCard from '../../components/cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type CategoryProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  title: string
  following: boolean
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  numFollowers: number
  numCollections: number
  numResources: number
  updateCategory: () => unknown
}

export const Category = withCtrl<CategoryProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    title,
    following,
    //categoryOverallCard,
    resourceCardPropsList,
    collectionCardPropsList,
    numFollowers,
    numCollections,
    numResources,
  }) => {
    const [isFollowig, setIsFollowing] = useState<boolean>(following)

    const handleOnFollowClick = () => {
      setIsFollowing(true)
    }
    const handleOnUnfollowClick = () => {
      setIsFollowing(false)
    }

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="category">
          <div className="content">
            <div className="category-header">
              <Card className="category-card" hideBorderWhenSmall={true}>
                <div className="info">
                  <div className="title">#{title}</div>
                  <div className="overall">
                    <div className="data">
                      <span>{numFollowers}</span>
                      <span>
                        <Trans>Followers</Trans>
                      </span>
                    </div>
                    <div className="data">
                      <span>{numCollections}</span>
                      <span>
                        <Trans>Collections</Trans>
                      </span>
                    </div>
                    <div className="data">
                      <span>{numResources}</span>
                      <span>
                        <Trans>Resources</Trans>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="actions">
                  {isFollowig ? (
                    <SecondaryButton onClick={handleOnUnfollowClick}>
                      <Trans>Unfollow</Trans>
                    </SecondaryButton>
                  ) : (
                    <PrimaryButton disabled={!isAuthenticated} onClick={handleOnFollowClick}>
                      <Trans>Follow</Trans>
                    </PrimaryButton>
                  )}
                </div>
              </Card>
            </div>
            <div className="main-content">
              {collectionCardPropsList && (
                <ListCard
                  content={collectionCardPropsList./*slice(0, 4).*/map((collectionCardProps, i) => ( //Infinite scoll?
                    <CollectionCard {...collectionCardProps} key={i}/>
                  ))}
                  className="collections"
                  noCard={true}
                  direction="horizontal"
                >
                  <div className="card-header">
                    <div className="title">
                      <Trans>Collections</Trans>
                    </div>
                    <SecondaryButton>
                      <Trans>See all</Trans>
                    </SecondaryButton>
                  </div>
                </ListCard>
              )}
              {resourceCardPropsList && (
                <ListCard
                  content={resourceCardPropsList.map((resourcesCardProps, i) => ( //Requires infinite scrolling
                    <ResourceCard {...resourcesCardProps} key={i} />
                  ))}
                  className="resources"
                  noCard={true}
                >
                  <div className="card-header">
                    <div className="title">
                      <Trans>Resources</Trans>
                    </div>
                  </div>
                </ListCard>
              )}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
