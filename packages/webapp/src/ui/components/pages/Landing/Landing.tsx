import { t, Trans } from '@lingui/macro'
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import StreamOutlinedIcon from '@mui/icons-material/StreamOutlined'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Href, Link } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import defaultBackgroud from '../../../static/img/default-landing-background.png'
import { Organization } from '../../../types'
import Modal from '../../atoms/Modal/Modal'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../atoms/Searchbox/Searchbox'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import {
  CollectionCard,
  CollectionCardProps,
} from '../../molecules/cards/CollectionCard/CollectionCard'
import ListCard from '../../molecules/cards/ListCard/ListCard'
import ResourceCard, {
  ResourceCardProps,
} from '../../molecules/cards/ResourceCard/ResourceCard'
import {
  SmallProfileCard,
  SmallProfileCardProps,
} from '../../molecules/cards/SmallProfileCard/SmallProfileCard'
import { TrendCardProps } from '../../molecules/cards/TrendCard/TrendCard'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import './styles.scss'

export type LandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  smallProfileCardPropsList: CP<SmallProfileCardProps>[]
  trendCardProps: TrendCardProps
  organization: Pick<Organization, 'name' | 'title' | 'subtitle' | 'smallLogo'>
  isAuthenticated: boolean
  loginHref: Href
  signUpHref: Href
  newResourceHref: Href
  newCollectionHref: Href
  setSearchText(text: string): unknown
  searchResourcesHref: Href
  searchCollectionsHref: Href
  searchAuthorsHref: Href
}

export const Landing = withCtrl<LandingProps>(
  ({
    searchResourcesHref,
    searchAuthorsHref,
    searchCollectionsHref,
    headerPageTemplateProps,
    // trendCardProps,
    collectionCardPropsList,
    resourceCardPropsList,
    smallProfileCardPropsList,
    organization,
    isAuthenticated,
    loginHref,
    signUpHref,
    newResourceHref,
    newCollectionHref,
    setSearchText,
  }) => {
    const [isSearchboxInViewport, setIsSearchboxInViewport] =
      useState<boolean>(true)
    const [isCreatingContent, setIsCreatingContent] = useState<boolean>(false)

    const background = {
      backgroundImage: 'url(' + /* imageUrl ||  */ defaultBackgroud + ')',
      backgroundSize: 'cover',
    }

    return (
      <HeaderPageTemplate
        {...headerPageTemplateProps}
        style={{ backgroundColor: 'white' }}
        hideSearchbox={isSearchboxInViewport}
      >
        <Helmet>
          <meta property="og:title" content={organization.name?.slice(0, 90)} />
          <meta
            property="og:description"
            content={organization.title?.slice(0, 300)}
          />
          <meta property="og:image" content={organization.smallLogo} />
          <meta name="twitter:card" content="summary-large-image" />
          <meta property="twitter:image" content={organization.smallLogo} />
        </Helmet>
        {!isAuthenticated && isCreatingContent && (
          <Modal
            className="create-content-modal"
            title={t`Log in or create an account to start sharing content`}
            closeButton={false}
            onClose={() => {
              setIsCreatingContent(false)
            }}
            style={{ maxWidth: '500px', width: '100%', gap: '22px' }}
          >
            <Link href={loginHref}>
              <PrimaryButton className="" color="card">
                <ArrowForwardIcon />
                <div className="content">
                  <div className="title">
                    <Trans>Log in</Trans>
                  </div>
                  <div className="subtitle">
                    <Trans>Enter to your account</Trans>
                  </div>
                </div>
              </PrimaryButton>
            </Link>
            <Link href={signUpHref}>
              <PrimaryButton className="" color="card">
                <StreamOutlinedIcon />
                <div className="content">
                  <div className="title">
                    <Trans>Join now</Trans>
                  </div>
                  <div className="subtitle">
                    <Trans>Create a new account</Trans>
                  </div>
                </div>
              </PrimaryButton>
            </Link>
          </Modal>
        )}
        {isAuthenticated && isCreatingContent && (
          <Modal
            className="create-content-modal"
            title={t`What would you like to create?`}
            closeButton={false}
            onClose={() => {
              setIsCreatingContent(false)
            }}
            style={{ maxWidth: '500px', width: '100%', gap: '22px' }}
          >
            <Link href={newCollectionHref}>
              <PrimaryButton className="" color="card">
                <LibraryAddIcon />
                <div className="content">
                  <div className="title">
                    <Trans>Create a new collection</Trans>
                  </div>
                  <div className="subtitle">
                    <Trans>Collections are groups of resources</Trans>
                  </div>
                </div>
              </PrimaryButton>
            </Link>
            <Link href={newResourceHref}>
              <PrimaryButton className="" color="card">
                <NoteAddIcon />
                <div className="content">
                  <div className="title">
                    <Trans>Create a new resource</Trans>
                  </div>
                  <div className="subtitle">
                    <Trans>A resource is a single item of content</Trans>
                  </div>
                </div>
              </PrimaryButton>
            </Link>
          </Modal>
        )}
        <div className="landing">
          <div className="landing-header" style={background}>
            <div className="landing-title">
              <div className="title">{organization.title}</div>
              <div className="subtitle">{organization.subtitle}</div>
            </div>
            <Searchbox
              size="big"
              setSearchText={setSearchText}
              searchText=""
              placeholder={t`Search for open educational content`}
              setIsSearchboxInViewport={setIsSearchboxInViewport}
              marginTop={12}
            />
            <PrimaryButton
              className="share-content"
              color="blue"
              onClick={() => setIsCreatingContent(true)}
            >
              <Trans>Share content</Trans>
            </PrimaryButton>
          </div>
          <ListCard
            className="resources"
            content={resourceCardPropsList
              .slice(0, 10)
              .map((resourceCardProps) => (
                <ResourceCard {...resourceCardProps} orientation="vertical" />
              ))}
            title={
              <div className="card-header">
                <div className="info">
                  <div className="title">
                    <Trans>Featured resources</Trans>
                  </div>
                  <div className="subtitle">
                    <Trans>Highlights on top quality content</Trans>
                  </div>
                </div>
                {
                  <SecondaryButton className="more" color="dark-blue">
                    <Link href={searchResourcesHref}>
                      <Trans>See more resources</Trans>
                    </Link>
                    <ArrowForwardRoundedIcon />
                  </SecondaryButton>
                }
              </div>
            }
            noCard={true}
            minGrid={245}
            maxHeight={736}
            // maxRows={2}
          />
          <ListCard
            className="collections"
            content={collectionCardPropsList
              .slice(0, 20)
              .map((collectionCardProps) => (
                <CollectionCard {...collectionCardProps} />
              ))}
            title={
              <div className="card-header">
                <div className="info">
                  <div className="title">
                    <Trans>Featured collections</Trans>
                  </div>
                  <div className="subtitle">
                    <Trans>Great collections of curated resources</Trans>
                  </div>
                </div>
                {
                  <SecondaryButton className="more" color="dark-blue">
                    <Link href={searchCollectionsHref}>
                      <Trans>See more collections</Trans>
                    </Link>
                    <ArrowForwardRoundedIcon />
                  </SecondaryButton>
                }
              </div>
            }
            minGrid={245}
            noCard={true}
            maxHeight={397}
            // maxRows={2}
          />
          <ListCard
            content={smallProfileCardPropsList
              .slice(0, 11)
              .map((smallProfileCardProps) => (
                <SmallProfileCard {...smallProfileCardProps} />
              ))}
            title={
              <div className="card-header">
                <div className="info">
                  <div className="title">
                    <Trans>Featured authors</Trans>
                  </div>
                  <div className="subtitle">
                    <Trans>Authors with outstanding contributions</Trans>
                  </div>
                </div>
                {
                  <SecondaryButton className="more" color="dark-blue">
                    <Link href={searchAuthorsHref}>
                      <Trans>See more authors</Trans>
                    </Link>
                    <ArrowForwardRoundedIcon />
                  </SecondaryButton>
                }
              </div>
            }
            className={`people`}
            noCard={true}
            minGrid={170}
            maxHeight={267}
            // maxRows={1}
          />
          {/* <TrendCard {...trendCardProps} maxRows={2} /> */}
        </div>
      </HeaderPageTemplate>
    )
  }
)

Landing.displayName = 'LandingPage'
