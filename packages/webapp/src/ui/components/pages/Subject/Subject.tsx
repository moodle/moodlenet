import { Trans } from '@lingui/macro'
import { Helmet } from 'react-helmet'
import { CP, withCtrl } from '../../../lib/ctrl'
import { Organization } from '../../../types'
import Card from '../../atoms/Card/Card'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import {
  CollectionCard,
  CollectionCardProps,
} from '../../molecules/cards/CollectionCard/CollectionCard'
import ListCard from '../../molecules/cards/ListCard/ListCard'
import {
  ResourceCard,
  ResourceCardProps,
} from '../../molecules/cards/ResourceCard/ResourceCard'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import './styles.scss'

export type SubjectProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  title: string
  isFollowing: boolean
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  numFollowers: number
  numCollections: number
  numResources: number
  isIscedSubject: boolean
  organization: Pick<Organization, 'name' | 'smallLogo'>
  iscedLink?: string
  toggleFollow(): unknown
}

export const Subject = withCtrl<SubjectProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    title,
    isFollowing,
    toggleFollow,
    resourceCardPropsList,
    collectionCardPropsList,
    isIscedSubject,
    numFollowers,
    numCollections,
    numResources,
    organization,
    iscedLink,
  }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Helmet>
          <meta property="og:title" content={title.slice(0, 90)} />
          <meta
            property="og:description"
            content={organization.name?.slice(0, 300)}
          />
          <meta property="og:image" content={organization.smallLogo} />
          <meta name="twitter:card" content="summary-large-image" />
          <meta property="twitter:image" content={organization.smallLogo} />
        </Helmet>
        <div className="subject">
          <div className="content">
            <div className="category-header">
              <Card className="category-card" hideBorderWhenSmall={true}>
                <div className="info">
                  <div className="title">
                    <abbr className="name" title={title}>
                      {title}
                    </abbr>
                    {isIscedSubject && iscedLink && (
                      <a
                        href={iscedLink}
                        target="_blank"
                        rel="noreferrer"
                        className="isced-pill"
                      >
                        <PrimaryButton color="blue">ISCED</PrimaryButton>
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
                  {!isFollowing ? (
                    <PrimaryButton
                      disabled={!isAuthenticated}
                      onClick={toggleFollow}
                      className="following-button"
                    >
                      {/* <AddIcon /> */}
                      <Trans>Follow</Trans>
                    </PrimaryButton>
                  ) : (
                    <SecondaryButton
                      disabled={!isAuthenticated}
                      onClick={toggleFollow}
                      className="following-button"
                      color="orange"
                    >
                      {/* <CheckIcon /> */}
                      <Trans>Following</Trans>
                    </SecondaryButton>
                  )}
                </div>
              </Card>
            </div>
            <div className="main-content">
              {collectionCardPropsList && collectionCardPropsList.length > 0 && (
                <ListCard
                  className="collections"
                  content={collectionCardPropsList
                    .slice(0, 20)
                    .map((collectionCardProps) => (
                      <CollectionCard {...collectionCardProps} />
                    ))}
                  title={
                    <div className="card-header">
                      <div className="title">
                        <Trans>Collections</Trans>
                      </div>
                    </div>
                  }
                  minGrid={245}
                  noCard={true}
                />
              )}
              {resourceCardPropsList && resourceCardPropsList.length > 0 && (
                <ListCard
                  className="resources"
                  noCard={true}
                  content={resourceCardPropsList.map((resourcesCardProps) => {
                    return (
                      <ResourceCard
                        {...resourcesCardProps}
                        orientation="horizontal"
                      />
                    )
                  })}
                  title={
                    <div className="card-header">
                      <div className="title">
                        <Trans>Resources</Trans>
                      </div>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  }
)

Subject.defaultProps = {}
