import { t, Trans } from '@lingui/macro'
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import StreamOutlinedIcon from '@mui/icons-material/StreamOutlined'
import { useState } from 'react'
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
  organization: Pick<Organization, 'name' | 'title' | 'subtitle'>
  isAuthenticated: boolean
  loginHref: Href
  signUpHref: Href
  newResourceHref: Href
  newCollectionHref: Href
  setSearchText(text: string): unknown
}

export const Landing = withCtrl<LandingProps>(
  ({
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
    // const [widthCollectionCard, setWidthCollectionCard] = useState<number>(170)
    const [isSearchboxInViewport, setIsSearchboxInViewport] =
      useState<boolean>(true)
    // const [numResources, setNumResources] = useState<number>(9)
    const [isCreatingContent, setIsCreatingContent] = useState<boolean>(false)
    // const [numResources, setNumResources] = useState<number>(9)

    const background = {
      backgroundImage: 'url(' + /* imageUrl ||  */ defaultBackgroud + ')',
      backgroundSize: 'cover',
    }

    // const calcNumResources = () => {
    //   if (window.innerWidth > 820 && window.innerWidth <= 1125) {
    //     const remainder = resourceCardPropsList.length % 2
    //     setNumResources(resourceCardPropsList.length - remainder)
    //   } else if (window.innerWidth > 1125) {
    //     const remainder = resourceCardPropsList.length % 3
    //     setNumResources(resourceCardPropsList.length - remainder)
    //   }
    // }

    // window.addEventListener('resize', calcNumResources)

    // const getCollectionCardWidth = () => {
    //   const widthDoc = document.documentElement.clientWidth
    //   const margin =
    //     widthDoc < 675 ? 50 : widthDoc < 1250 ? 200 : widthDoc - 1100
    //   const containerWidth = widthDoc - margin
    //   var numElements = Math.trunc(containerWidth / (170 + 12))
    //   const overflow = 170 - (containerWidth - numElements * (170 + 12))
    //   if (overflow > -12 && overflow < 140) numElements++
    //   var partToGrow = 0
    //   var percentatgeToGrow = 0
    //   if (numElements === 1) {
    //     partToGrow = containerWidth - 50
    //     percentatgeToGrow = containerWidth / partToGrow
    //   } else {
    //     partToGrow = (numElements - 1) * (170 + 12) + 170 / 2
    //     percentatgeToGrow = containerWidth / partToGrow
    //   }
    //   return 170 * percentatgeToGrow
    // }

    // const setCollectionCardWidth = useCallback(() => {
    //   setWidthCollectionCard(getCollectionCardWidth())
    // }, [setWidthCollectionCard])

    // useLayoutEffect(() => {
    //   window.addEventListener('resize', setCollectionCardWidth)
    //   return () => {
    //     window.removeEventListener('resize', setCollectionCardWidth)
    //   }
    // }, [setCollectionCardWidth])

    // useEffect(() => {
    //   setCollectionCardWidth()
    // })

    return (
      <HeaderPageTemplate
        {...headerPageTemplateProps}
        style={{ backgroundColor: 'white' }}
        hideSearchbox={isSearchboxInViewport}
      >
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
                  <SecondaryButton className="more">
                    <Trans>See more resources</Trans>
                    <ArrowForwardRoundedIcon />
                  </SecondaryButton>
                }
              </div>
            }
            noCard={true}
            minGrid={245}
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
                  <SecondaryButton className="more">
                    <Trans>See more collections</Trans>
                    <ArrowForwardRoundedIcon />
                  </SecondaryButton>
                }
              </div>
            }
            minGrid={245}
            noCard={true}
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
                  <SecondaryButton className="more">
                    <Trans>See more authors</Trans>
                    <ArrowForwardRoundedIcon />
                  </SecondaryButton>
                }
              </div>
            }
            className={`people`}
            noCard={true}
            minGrid={170}
          />
          {/* <TrendCard {...trendCardProps} maxRows={2} /> */}
        </div>
      </HeaderPageTemplate>
    )
  }
)

Landing.displayName = 'LandingPage'
