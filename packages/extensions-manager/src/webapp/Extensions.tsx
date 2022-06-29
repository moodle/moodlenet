import lib from 'moodlenet-react-app-lib'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { StateContext } from './devModeContextProvider'
import InstallExtension from './InstallExtension/InstallExtension'
import { ExtMngMainLayout } from './MainLayout'
import Modules, { ModulesProps } from './Modules/Modules'
import Packages from './Packages/Packages'
// import {
//   HeaderPageTemplate,
//   HeaderPageTemplateProps,
// } from '../../templates/HeaderPageTemplate'
// import Extensions, { ExtensionsProps } from './Extensions/Extensions'
import './styles.scss'

const Card = lib.ui.components.atoms.Card

type SectionNameType = 'Account' | 'Extension' | 'Packages' | 'Modules' | 'InstallExtension'

export type ExtensionsProps = {
  sectionProps: ModulesProps | ExtensionsProps
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
  { name: 'Modules', component: Modules, displayName: 'Modules' },
]

const sectionProps = {}
export const Extensions: FC<ExtensionsProps> = () => {
  return (
    <ExtMngMainLayout>
      <ExtensionsBody sectionProps={sectionProps} />
    </ExtMngMainLayout>
  )
}
export const ExtensionsBody: FC<ExtensionsProps> = ({
  sectionProps,
  section = 'InstallExtension' /* , headerPageTemplateProps */,
}) => {
  const stateContext = useContext(StateContext)
  const [currentSection, setCurrentSection] = useState(section)
  const [currentContent, setCurrentContent] = useState<any>(null)
  // const [menuItemPressed, setMenuItemPressed] = useState<any>(false)
  const menu = useMemo(
    () =>
      sections.map(
        (e, i) =>
          (stateContext.devMode || e.name !== 'Modules') && (
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
    [stateContext.devMode],
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
  }, [currentSection])

  return (
    // <HeaderPageTemplate {...headerPageTemplateProps}>
    <div className="extensions">
      <div className="left-menu">
        <Card>{menu}</Card>
      </div>
      <div className="content">{currentContent}</div>
    </div>
    // </HeaderPageTemplate>
  )
}

Extensions.displayName = 'ExtensionsPage'

export default Extensions
