import { SnackbarStack, sortAddonItems, type AddonItem } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useContext } from 'react'
import { MainHeaderContext } from '../../../../exports/ui.mjs'
import defaultBackground from '../../../assets/img/default-landing-background.png'
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
}) => {
  const background = {
    backgroundImage: 'url("' + defaultBackground + '")',
    backgroundSize: 'cover',
  }

  const landingTitle = (
    <div className="landing-title">
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
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

  const updatedMainColumnItems = sortAddonItems([headerCard, ...(mainColumnItems ?? [])])

  const snackbars = <SnackbarStack snackbarList={[]} />

  return (
    <MainLayout
      {...mainLayoutProps}
      headerProps={{ ...mainLayoutProps.headerProps }}
      defaultHideSearchbox={true}
    >
      {snackbars}
      <div className="landing">
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        {/* <TrendCard {...trendCardProps} maxRows={2} /> */}
      </div>
    </MainLayout>
  )
}

Landing.displayName = 'LandingPage'
