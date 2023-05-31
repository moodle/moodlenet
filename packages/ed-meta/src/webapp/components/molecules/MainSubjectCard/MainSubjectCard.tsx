import { AddonItem, Card, PrimaryButton } from '@moodlenet/component-library'
import { FC } from 'react'
import { SubjectOverallProps } from '../../pages/Subject/Subject.js'

export type MainSubjectCardSlots = {
  mainColumnItems: (AddonItem | null)[]
  headerItems: (AddonItem | null)[]
  footerRowItems: (AddonItem | null)[]
}

export type MainSubjectCardProps = {
  slots: MainSubjectCardSlots
  title: string
  overallItems: SubjectOverallProps[]
  isIsced: boolean
  iscedUrl: string | null
}

export const MainSubjectCard: FC<MainSubjectCardProps> = ({
  slots,
  title,
  overallItems,
  isIsced,
  iscedUrl,
}) => {
  const { mainColumnItems, headerItems, footerRowItems } = slots
  console.log('iscedUrl', iscedUrl)

  const isced = isIsced ? (
    <a
      href={iscedUrl ?? ''}
      target="_blank"
      rel="noreferrer"
      className={`isced-pill ${iscedUrl ? '' : 'disabled'}`}
    >
      <PrimaryButton color="blue">ISCED</PrimaryButton>
    </a>
  ) : null

  const titleDiv = (
    <div className="title" key="title">
      <div className="name">{title}</div>
      {isced}
    </div>
  )

  const overall = (
    <div className="overall">
      {overallItems.map(({ key, name, value }) => {
        return (
          <div className="data" key={key}>
            <span>{value}</span>
            <span>{name}</span>
          </div>
        )
      })}
    </div>
  )

  const updatedHeaderItems = [titleDiv, ...(headerItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const subjectHeader = (
    <div className="subject-header" key="subject-header">
      {updatedHeaderItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )

  const updatedFooterRowItems = [...(footerRowItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const subjectFooter =
    updatedFooterRowItems.length > 0 ? (
      <div className="subject-footer" key="subject-footer">
        {updatedFooterRowItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </div>
    ) : null

  const updatedMainColumnItems = [
    subjectHeader,
    overall,
    subjectFooter,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  return (
    <>
      <Card className="main-subject-card" hideBorderWhenSmall={true}>
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    </>
  )
}
MainSubjectCard.displayName = 'MainSubjectCard'
export default MainSubjectCard
