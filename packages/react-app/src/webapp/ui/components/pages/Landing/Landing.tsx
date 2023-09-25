import type { FC } from 'react'
import { useContext } from 'react'
// import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton.js'
// import { ArrowForward, NoteAdd } from '@mui/icons-material'
import type { AddonItem } from '@moodlenet/component-library'
// import { LibraryAdd, StreamOutlined } from '@mui/icons-material'
import { MainHeaderContext } from '../../../../exports/ui.mjs'
import defaultBackground from '../../../assets/img/default-landing-background.png'
// import { Href, Link } from '../../elements/link.js'
import { MainSearchBox } from '../../atoms/MainSearchBox/MainSearchBox.js'
import type { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
import './Landing.scss'

export type LandingProps = {
  mainLayoutProps: Pick<MainLayoutProps, 'headerProps' | 'footerProps'>
  mainColumnItems: AddonItem[]
  headerCardItems: AddonItem[]
  title: string
  subtitle: string
  search(text: string): unknown

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

const LandingSearchBox: FC = () => {
  const { setHideSearchbox } = useContext(MainHeaderContext)
  return <MainSearchBox size="big" setIsSearchboxInViewport={setHideSearchbox} marginTop={12} />
}

export const Landing: FC<LandingProps> = ({
  mainLayoutProps,
  mainColumnItems,
  headerCardItems,
  title,
  subtitle,
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
  // const defaultBackground = new URL(
  //   '../../../assets/img/default-landing-background.png',
  //   import.meta.url,
  // ).href

  const background = {
    backgroundImage: 'url("' + /* imageUrl ||  */ defaultBackground + '")',
    backgroundSize: 'cover',
  }

  const landingTitle = (
    <div className="landing-title">
      <div className="title">{title}</div>
      {/* <div className="title">{organization.title}</div> */}
      <div className="subtitle">{subtitle}</div>
      {/* <div className="subtitle">{organization.subtitle}</div> */}
    </div>
  )

  const landingSearchBox = <LandingSearchBox />

  const updatedHeaderCardItems = [
    landingTitle,
    landingSearchBox,
    ...(headerCardItems ?? []),
  ].filter((item): item is AddonItem | JSX.Element => !!item)

  const headerCard = (
    <div className="landing-header" key="landing-header" style={background}>
      {updatedHeaderCardItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )

  const updatedMainColumnItems = [headerCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  return (
    <MainLayout
      {...mainLayoutProps}
      headerProps={{ ...mainLayoutProps.headerProps }}
      defaultHideSearchbox={true}
    >
      {/* modals */}
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
