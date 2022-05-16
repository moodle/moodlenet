import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { CP, withCtrl } from '../../../lib/ctrl'
import Card from '../../atoms/Card/Card'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import Account, { AccountProps } from './Account/Account'
import Appearance, { AppearanceProps } from './Appearance/Appearance'
import './styles.scss'

type SectionNameType = 'Account' | 'Appearance'

export type AdminProps = {
  sectionProps: AccountProps | AppearanceProps
  section: SectionNameType
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
}

type SectionType = {
  name: SectionNameType
  component: typeof Account | typeof Appearance
  displayName: 'Account' | 'Appearance'
}

const sections: SectionType[] = [
  { name: 'Account', component: Account, displayName: 'Account' },
  { name: 'Appearance', component: Appearance, displayName: 'Appearance' },
]

//const progressStates = [t`Upload Resource`, t`Add to Resources`]
export const Admin = withCtrl<AdminProps>(
  ({ sectionProps, section, headerPageTemplateProps }) => {
    const [currentSection, setCurrentSection] = useState(section)
    const menu = sections.map((e, i) => (
      <div
        key={i}
        className={`section ${e.name === currentSection ? 'selected' : ''}`}
        onClick={() => setCurrentSection(e.name)}
      >
        <Trans>{e.displayName}</Trans>
      </div>
    ))

    const sectionComponent = sections.filter(
      (e) => e.displayName === currentSection
    )
    const content = sectionComponent[0]
      ? React.createElement(sectionComponent[0].component, {
          ...(sectionProps as any),
        })
      : null

    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="admin">
          <div className="left-menu">
            <Card>{menu}</Card>
          </div>
          <div className="content">{content}</div>
        </div>
      </HeaderPageTemplate>
    )
  }
)
Admin.displayName = 'AdminPage'
