
import { Trans } from '@lingui/macro'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import ShareIcon from '@material-ui/icons/Share'
import { useState } from 'react'
import Card from '../../components/atoms/Card/Card'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { ContributorCard, ContributorCardProps } from './ContributorCard/ContributorCard'
import { InfoCard, InfoCardProps } from './InfoCard/InfoCard'
import { ResourceActionsCard, ResourceActionsCardProps } from './ResourceActionsCard/ResourceActionsCard'
import './styles.scss'

export type ResourceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  imageUrl: string 
  title: string
  description: string
  liked: boolean
  infoCardProps: InfoCardProps
  contributorCardProps: ContributorCardProps
  resourceActionsCard: ResourceActionsCardProps
}

export const Resource = withCtrl<ResourceProps>(
  ({
    headerPageTemplateProps,
    imageUrl,
    title,
    description,
    liked,
    infoCardProps,
    contributorCardProps,
    resourceActionsCard
  }) => {
    const [likeState, setLikeState] = useState<boolean>(liked)
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="resource">
          <div className="content">
            <div className="main-column">
              <Card className="main-resource-card">
                <div className="resource-header">
                  <div className="actions">
                    <div className={`like ${likeState && 'liked'}`} onClick={() => setLikeState(!likeState)}>
                      { likeState ? (
                        <FavoriteIcon/>
                      ) : (
                        <FavoriteBorderIcon/>
                      )}
                      <Trans>Like</Trans>
                    </div>
                    <div className="share"><ShareIcon/><Trans>Share</Trans></div>
                  </div>
                </div>
                <InfoCard {...infoCardProps} />
                <img className="image" src={imageUrl} alt="Background" />
                <div className="description">{description}</div>
                {/*<div className="comments"></div>*/}
              </Card>
              <div className="resource-footer">
                <ContributorCard {...contributorCardProps} />
                <ResourceActionsCard {...resourceActionsCard} />
              </div>
            </div>
            <div className="side-column">
              <ContributorCard {...contributorCardProps} />
              <ResourceActionsCard {...resourceActionsCard} />
            </div>
          </div>
        </div>
      </HeaderPageTemplate>
    )
  },
)
Resource.displayName = 'ResourcePage'
