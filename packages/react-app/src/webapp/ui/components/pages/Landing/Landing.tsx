import { FC, useContext } from 'react'
import defaultBackgroud from '../../../../static/img/default-landing-background.png'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import { MainLayout } from '../../layout'
import { SettingsCtx } from '../Settings/SettingsContext'
import './Landing.scss'

export type LandingProps = {
  // headerPageTemplateProps: CP<HeaderPageTemplateProps>
  // collectionCardPropsList: CP<CollectionCardProps>[]
  // resourceCardPropsList: CP<ResourceCardProps>[]
  // smallProfileCardPropsList: CP<SmallProfileCardProps>[]
  // trendCardProps: TrendCardProps
  // organization: Pick<Organization, 'name' | 'title' | 'subtitle'>
  // isAuthenticated: boolean
  // loginHref: Href
  // signUpHref: Href
  // newResourceHref: Href
  // newCollectionHref: Href
  // setSearchText(text: string): unknown
  // searchResourcesHref: Href
  // searchCollectionsHref: Href
  // searchAuthorsHref: Href
}

export const Landing: FC<LandingProps> = () => {
  return (
    <MainLayout style={{ height: '100%' }}>
      <LandingBody />
    </MainLayout>
  )
}
export const LandingBody: FC<LandingProps> = (
  {
    // searchResourcesHref,
    // searchAuthorsHref,
    // searchCollectionsHref,
    // headerPageTemplateProps,
    // // trendCardProps,
    // collectionCardPropsList,
    // resourceCardPropsList,
    // smallProfileCardPropsList,
    // organization,
    // isAuthenticated,
    // loginHref,
    // signUpHref,
    // newResourceHref,
    // newCollectionHref,
    // setSearchText,
  },
) => {
  const setCtx = useContext(SettingsCtx)
  // const [isSearchboxInViewport, setIsSearchboxInViewport] =
  //   useState<boolean>(true)
  // const [isCreatingContent, setIsCreatingContent] = useState<boolean>(false)

  const background = {
    backgroundImage: 'url(' + /* imageUrl ||  */ defaultBackgroud + ')',
    backgroundSize: 'cover',
  }

  return (
    <div className="landing">
      <div className="landing-header" style={background}>
        <div className="landing-title">
          <div className="title">{setCtx.organizationData.landingTitle}</div>
          {/* <div className="title">{organization.title}</div> */}
          <div className="subtitle">{setCtx.organizationData.landingSubtitle}</div>
          {/* <div className="subtitle">{organization.subtitle}</div> */}
        </div>
        {/* <Searchbox
          // setSearchText={() => {
          //   return 'sdsf'
          // }}
          size="big"
          // setSearchText={setSearchText}
          // searchText=""
          placeholder={`Search for open educational conten`}
          // setIsSearchboxInViewport={setIsSearchboxInViewport}
          marginTop={12}
        /> */}
        <PrimaryButton
          className="share-content"
          color="blue"
          onClick={() => alert('Nothing to see here, for the moment 🤫')}
          // onClick={() => setIsCreatingContent(true)}
        >
          Share content
        </PrimaryButton>
      </div>
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
  )
}

Landing.displayName = 'LandingPage'
