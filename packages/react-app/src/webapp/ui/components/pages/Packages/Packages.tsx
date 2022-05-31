import React, { FC, useEffect, useState } from 'react'
import Card from '../../atoms/Card/Card'
import Extensions, { ExtensionsProps } from './Extensions/Extensions'
import Install, { InstallProps } from './Install/Install'
// import {
//   HeaderPageTemplate,
//   HeaderPageTemplateProps,
// } from '../../templates/HeaderPageTemplate'
// import Extensions, { ExtensionsProps } from './Extensions/Extensions'
import './styles.scss'

type SectionNameType = 'Install' | 'Account' | 'Extensions'

export type PackagesProps = {
  sectionProps: InstallProps | ExtensionsProps
  section: SectionNameType
  // headerPageTemplateProps: CP<HeaderPageTemplateProps>
}

type SectionType = {
  name: SectionNameType
  component: typeof Install | typeof Extensions
  displayName: 'Packages' | 'Account' | 'Extensions'
}

const sections: SectionType[] = [
  { name: 'Install', component: Install, displayName: 'Packages' },
  { name: 'Extensions', component: Extensions, displayName: 'Extensions' },
]

export const Packages: FC<PackagesProps> = ({ sectionProps, section = 'Install' /* , headerPageTemplateProps */ }) => {
  const [currentSection, setCurrentSection] = useState(section)
  const [currentContent, setCurrentContent] = useState<any>(null)
  const menu = sections.map((e, i) => (
    <div
      key={i}
      className={`section ${e.name === currentSection ? 'selected' : ''}`}
      onClick={() => setCurrentSection(e.name)}
    >
      {e.displayName}
      {/* <Trans>{e.displayName}</Trans> */}
    </div>
  ))

  useEffect(() => {
    const sectionComponent = sections.filter(e => e.name === currentSection)
    const content = sectionComponent[0]
      ? React.createElement(sectionComponent[0].component, {
          ...(sectionProps as any),
        })
      : null
    setCurrentContent(content)
    console.log(content)
  }, [currentSection])

  return (
    // <HeaderPageTemplate {...headerPageTemplateProps}>
    <div className="packages">
      <div className="left-menu">
        <Card>{menu}</Card>
      </div>
      <div className="content">{currentContent}</div>
    </div>
    // </HeaderPageTemplate>
  )
}

export default Packages

Packages.displayName = 'PackagesPage'
