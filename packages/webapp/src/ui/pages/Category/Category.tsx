import { Trans } from '@lingui/macro';
import { useState } from 'react';
import Card from '../../components/atoms/Card/Card';
import PrimaryButton from '../../components/atoms/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton';
import ListCard from '../../components/cards/ListCard/ListCard';
import { OverallCardProps } from '../../components/cards/OverallCard/OverallCard';
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard';
import { CP, withCtrl } from '../../lib/ctrl';
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate';
import { ContributorCardProps } from './ContributorCard/ContributorCard';
import './styles.scss';

export type CategoryProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  isAuthenticated: boolean
  isOwner: boolean
  following: boolean
  contributorCardProps: ContributorCardProps
  overallCardProps: OverallCardProps
  resourceCardPropsList: CP<ResourceCardProps>[]
  updateCategory: () => unknown
}

export const Category = withCtrl<CategoryProps>(
  ({
    headerPageTemplateProps,
    isAuthenticated,
    following,
    resourceCardPropsList,
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
              <Card className="main-Category-card" hideBorderWhenSmall={true}>
                <div className="info">
                  <div className="label"><Trans>Category</Trans></div>
                </div>
                <div className="actions">
                  {isFollowig ? (
                    <SecondaryButton onClick={handleOnUnfollowClick}><Trans>Unfollow</Trans></SecondaryButton>
                  ) : (
                    <PrimaryButton disabled={!isAuthenticated} onClick={handleOnFollowClick}><Trans>Follow</Trans></PrimaryButton>
                  )}
                </div>
              </Card>
              <div className="main-content">
                <div className="main-column">
                  <ListCard
                    content={resourceCardPropsList.map(resourcesCardProps => {
                      return <ResourceCard {...resourcesCardProps}/>
                    })}
                    className="resources no-card"
                  />
              </div>
            </div>
          </div>
        </div>
      </ HeaderPageTemplate>
    )
  }
)

