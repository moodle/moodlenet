import { AddonItem } from '@moodlenet/component-library'
import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui'
import { FC } from 'react'
import MainSubjectCard, {
  MainSubjectCardSlots,
} from '../../molecules/MainSubjectCard/MainSubjectCard.js'
import './Subject.scss'

export type SubjectOverallProps = {
  name: string
  value: number
  key: string | number
}

export type SubjectProps = {
  mainLayoutProps: MainLayoutProps
  mainSubjectCardSlots: MainSubjectCardSlots
  mainColumnItems: AddonItem[]
  title: string
  overallItems: SubjectOverallProps[]
  isIsced: boolean
  iscedUrl: string | null
}

export const Subject: FC<SubjectProps> = ({
  mainLayoutProps,
  mainSubjectCardSlots,
  mainColumnItems,
  title,
  overallItems,
  isIsced,
  iscedUrl,
}) => {
  const mainSubjectCard = (
    <MainSubjectCard
      key="main-subject-card"
      slots={mainSubjectCardSlots}
      title={title}
      isIsced={isIsced}
      iscedUrl={iscedUrl}
      overallItems={overallItems}
    />
  )

  const updatedMainColumnItems = [mainSubjectCard, ...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  return (
    <MainLayout {...mainLayoutProps}>
      <div className="subject">
        <div className="main-column">
          {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>
      </div>
    </MainLayout>
  )
}
Subject.displayName = 'SubjectPage'
export default Subject
