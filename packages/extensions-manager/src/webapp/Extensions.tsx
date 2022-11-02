import { Card, HeaderProps } from '@moodlenet/component-library'
import { MainLayout } from '@moodlenet/react-app/ui'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import InstallExtension from './InstallExtension/InstallExtension.js'
import { MainContext } from './MainComponent.js'
// import { ExtMngMainLayout } from './MainLayout.tsx__'
import Modules, { ModulesProps } from './Modules/Modules.js'
import Packages from './Packages/Packages.js'
// import {
//   HeaderPageTemplate,
//   HeaderPageTemplateProps,
// } from '../../templates/HeaderPageTemplate'
// import Extensions, { ExtensionsProps } from './Extensions/Extensions'
import './styles.scss'

type SectionNameType = 'Account' | 'Extension' | 'Packages' | 'Modules' | 'InstallExtension'

export type ExtensionsProps = {
  sectionProps: ModulesProps | ExtensionsProps
  headerProps: HeaderProps
  section?: SectionNameType
  // headerPageTemplateProps: CP<HeaderPageTemplateProps>
}

type SectionType = {
  name: SectionNameType
  component: typeof Packages | typeof Modules
  displayName: 'Account' | 'Modules' | 'Extensions' | 'Add extensions'
}

const sections: SectionType[] = [
  { name: 'InstallExtension', component: InstallExtension, displayName: 'Add extensions' },
  { name: 'Packages', component: Packages, displayName: 'Extensions' },
  // { name: 'Modules', component: Modules, displayName: 'Modules' },
]

export const Extensions: FC<ExtensionsProps> = ({ headerProps, sectionProps }) => {
  //   return (
  //     <ExtMngMainLayout>
  //       <ExtensionsBody sectionProps={sectionProps} />
  //     </ExtMngMainLayout>
  //   )
  // }
  // export const ExtensionsBody: FC<ExtensionsProps> = ({
  //   sectionProps,
  //   section = 'InstallExtension' /* , headerPageTemplateProps */,
  // }) => {
  const mainCtx = useContext(MainContext)

  const [currentSection, setCurrentSection] = useState('InstallExtension')
  const [currentContent, setCurrentContent] = useState<any>(null)
  // const [menuItemPressed, setMenuItemPressed] = useState<any>(false)
  const menu = useMemo(
    () =>
      sections.map(
        (e, i) =>
          (mainCtx.devMode || e.name !== 'Modules') && (
            <div
              key={i}
              className={`section ${e.name === currentSection ? 'selected' : ''}`}
              onClick={() => {
                setCurrentSection(e.name)
                // setMenuItemPressed(true)
                // setMenuItemPressed(false)
              }}
            >
              {e.displayName}
              {/* <Trans>{e.displayName}</Trans> */}
            </div>
          ),
      ),
    [mainCtx.devMode, currentSection],
  )

  useEffect(() => {
    const sectionComponent = sections.filter(e => e.name === currentSection)
    const content = sectionComponent[0]
      ? React.createElement(sectionComponent[0].component, {
          ...(sectionProps as any),
          // menuItemPressed: menuItemPressed,
        })
      : null
    setCurrentContent(content)
  }, [currentSection, sectionProps])

  return (
    <MainLayout headerProps={headerProps}>
      <div className="extensions">
        <div className="left-menu">
          <Card>{menu}</Card>
        </div>
        <div className="content">{currentContent}</div>
      </div>
    </MainLayout>
  )
}

Extensions.displayName = 'ExtensionsPage'

export default Extensions
