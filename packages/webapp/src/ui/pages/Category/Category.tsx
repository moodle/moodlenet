import { Trans } from '@lingui/macro'
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
  isIscedSubject?: boolean
  iscedLink?: string
  toggleFollow(): unknown
}

export const Category = withCtrl<CategoryProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    title,
    following,
    toggleFollow,
    resourceCardPropsList,
    collectionCardPropsList,
    isIscedSubject,
    numFollowers,
    numCollections,
    numResources,
    iscedLink,
  }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="category">
          <div className="content">
            <div className="category-header">
              <Card className="category-card" hideBorderWhenSmall={true}>
                <div className="info">
                  <div className="title">
                    <abbr className="name" title={title}>
                      {title}
                    </abbr>
                    {isIscedSubject && iscedLink && (
                      <a href={iscedLink} target="_blank" rel="noreferrer" className="isced-pill">
                        ISCED
                      </a>
                    )}
                  </div>
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
                  {following ? (
                    <SecondaryButton onClick={toggleFollow}>
                      <Trans>Unfollow</Trans>
                    </SecondaryButton>
                  ) : (
                    <PrimaryButton disabled={!isAuthenticated} onClick={toggleFollow}>
                      <Trans>Follow</Trans>
                    </PrimaryButton>
                  )}
                </div>
              </Card>
            </div>
            <div className="main-content">
              {collectionCardPropsList && (
                <ListCard
                  content={collectionCardPropsList.map(collectionCardProps => (
                    <CollectionCard {...collectionCardProps} />
                  ))}
                  title={
                    <div className="card-header">
                      <div className="title">
                        <Trans>Collections</Trans>
                      </div>
                      <SecondaryButton>
                        <Trans>See all</Trans>
                      </SecondaryButton>
                    </div>
                  }
                  className="collections"
                  noCard={true}
                  direction="horizontal"
                />
              )}
              {resourceCardPropsList && (
                <ListCard
                  content={resourceCardPropsList.map(resourcesCardProps => (
                    <ResourceCard {...resourcesCardProps} />
                  ))}
                  title={
                    <div className="card-header">
                      <div className="title">
                        <Trans>Resources</Trans>
                      </div>
                      <SecondaryButton>
                        <Trans>See all</Trans>
                      </SecondaryButton>
                    </div>
                  }
                  className="resources"
                  noCard={true}
                />
              )}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)

Category.defaultProps = {
  isIscedSubject: true,
}
