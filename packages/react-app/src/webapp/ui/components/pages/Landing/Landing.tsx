import { FC, useContext, useState } from 'react'
// import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton.js'
import { ArrowForward, NoteAdd } from '@material-ui/icons'
import {
  AddonItem,
  Modal,
  PrimaryButton,
  Searchbox,
  SearchboxProps,
} from '@moodlenet/component-library'
import { LibraryAdd, StreamOutlined } from '@mui/icons-material'
import { MainHeaderContext } from '../../../../ui.mjs'
import defaultBackground from '../../../assets/img/default-landing-background.png'
import { Href, Link } from '../../elements/link.js'
import MainLayout, { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import './Landing.scss'
export type LandingProps = {
  mainLayoutProps: MainLayoutProps
  mainColumnItems: AddonItem[]
  shareContentModalItems: AddonItem[]

  title: string
  subtitle: string

  loginHref: Href
  signUpHref: Href
  newResourceHref: Href
  newCollectionHref: Href

  setSearchText(text: string): unknown

  // headerPageTemplateProps: CP<HeaderPageTemplateProps>
  // collectionCardPropsList: CP<CollectionCardProps>[]
  // resourceCardPropsList: CP<ResourceCardProps>[]
  // smallProfileCardPropsList: CP<SmallProfileCardProps>[]
  // trendCardProps: TrendCardProps
  // organization: Pick<Organization, 'name' | 'title' | 'subtitle'>
  // searchResourcesHref: Href
  // searchCollectionsHref: Href
  // searchAuthorsHref: Href
}
const LandingSearchBox: FC<Pick<SearchboxProps, 'setSearchText'>> = ({ setSearchText }) => {
  const { setHideSearchbox } = useContext(MainHeaderContext)

  return (
    <Searchbox
      size="big"
      setSearchText={setSearchText}
      searchText=""
      placeholder={`Search for open educational content`}
      setIsSearchboxInViewport={setHideSearchbox}
      marginTop={12}
    />
  )
}
export const Landing: FC<LandingProps> = ({
  mainLayoutProps,
  mainColumnItems,
  shareContentModalItems,

  title,
  subtitle,

  loginHref,
  signUpHref,
  newResourceHref,
  newCollectionHref,

  setSearchText,

  // {
  //   // searchResourcesHref,
  //   // searchAuthorsHref,
  //   // searchCollectionsHref,
  //   // headerPageTemplateProps,
  //   // // trendCardProps,
  //   // collectionCardPropsList,
  //   // resourceCardPropsList,
  //   // smallProfileCardPropsList,
  //   // organization,
  //   // isAuthenticated,
  //   // setSearchText,
}) => {
  const isAuthenticated = mainLayoutProps.headerProps.isAuthenticated

  // const defaultBackground = new URL(
  //   '../../../assets/img/default-landing-background.png',
  //   import.meta.url,
  // ).href
  const [isShowingContentModal, setIsShowingContentModal] = useState<boolean>(false)

  const background = {
    backgroundImage: 'url("' + /* imageUrl ||  */ defaultBackground + '")',
    backgroundSize: 'cover',
  }
  const headerCard = (
    <div className="landing-header" style={background}>
      <div className="landing-title">
        <div className="title">{title}</div>
        {/* <div className="title">{organization.title}</div> */}
        <div className="subtitle">{subtitle}</div>
        {/* <div className="subtitle">{organization.subtitle}</div> */}
      </div>
      <LandingSearchBox setSearchText={setSearchText} />
      <PrimaryButton
        className="share-content"
        color="blue"
        onClick={() => setIsShowingContentModal(true)}
        // onClick={() => setIsCreatingContent(true)}
      >
        Share content
      </PrimaryButton>
    </div>
  )

  const updatedMainColumnItems = [headerCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const newResource = (
    <Link href={newCollectionHref}>
      <PrimaryButton className="" color="card">
        <LibraryAdd />
        <div className="content">
          <div className="title">Create a new collection</div>
          <div className="subtitle">Collections are groups of resources</div>
        </div>
      </PrimaryButton>
    </Link>
  )

  const newCollection = (
    <Link href={newResourceHref}>
      <PrimaryButton className="" color="card">
        <NoteAdd />
        <div className="content">
          <div className="title">Create a new resource</div>
          <div className="subtitle">A resource is a single item of content</div>
        </div>
      </PrimaryButton>
    </Link>
  )

  const updatedShareContentModalItems = [
    newResource,
    newCollection,
    ...(shareContentModalItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const modals = [
    !isAuthenticated && isShowingContentModal && (
      <Modal
        className="create-content-modal"
        title={`Log in or create an account to start sharing content`}
        closeButton={false}
        onClose={() => {
          setIsShowingContentModal(false)
        }}
        style={{ maxWidth: '500px', width: '100%', gap: '22px' }}
      >
        <Link href={loginHref}>
          <PrimaryButton className="" color="card">
            <ArrowForward />
            <div className="content">
              <div className="title">Log in</div>
              <div className="subtitle">Enter to your account</div>
            </div>
          </PrimaryButton>
        </Link>
        <Link href={signUpHref}>
          <PrimaryButton className="" color="card">
            <StreamOutlined />
            <div className="content">
              <div className="title">Join now</div>
              <div className="subtitle">Create a new account</div>
            </div>
          </PrimaryButton>
        </Link>
      </Modal>
    ),
    isAuthenticated && isShowingContentModal && (
      <Modal
        className="create-content-modal"
        title={`What would you like to create?`}
        closeButton={false}
        onClose={() => {
          setIsShowingContentModal(false)
        }}
        style={{ maxWidth: '500px', width: '100%', gap: '22px' }}
      >
        {updatedShareContentModalItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Modal>
    ),
  ]

  return (
    <MainLayout {...mainLayoutProps} headerProps={{ ...mainLayoutProps.headerProps }}>
      {modals}
      <div className="landing">
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}

        {/* <ListCard
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
                    Featured resources
                  </div>
                  <div className="subtitle">
                    Highlights on top quality content
                  </div>
                </div>
                {
                  <SecondaryButton className="more" color="dark-blue">
                    <Link href={searchResourcesHref}>
                      See more resources
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
                    Featured collections
                    </div>
                  <div className="subtitle">
                    Great collections of curated resources
                  </div>
                </div>
                {
                  <SecondaryButton className="more" color="dark-blue">
                    <Link href={searchCollectionsHref}>
                      See more collections
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
                    Featured authors
                  </div>
                  <div className="subtitle">
                    Authors with outstanding contributions
                  </div>
                </div>
                {
                  <SecondaryButton className="more" color="dark-blue">
                    <Link href={searchAuthorsHref}>
                      See more authors
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
          /> */}
        {/* <TrendCard {...trendCardProps} maxRows={2} /> */}
      </div>
    </MainLayout>
  )
}

Landing.displayName = 'LandingPage'
