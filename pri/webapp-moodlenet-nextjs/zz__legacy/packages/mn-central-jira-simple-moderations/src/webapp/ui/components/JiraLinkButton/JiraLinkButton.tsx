import { InsertPageBreak } from '@mui/icons-material'
import type { FC } from 'react'
import './JiraLinkButton.scss'

export type JiraLinkButtonProps = {
  url: string
}

export const JiraLinkButton: FC<JiraLinkButtonProps> = ({ url }) => {
  return (
    <a className={`jira-link-button-container`} href={url} target="_blank" rel="noreferrer">
      <abbr className={`jira-link-button`} title="Review in Jira">
        <InsertPageBreak />
      </abbr>
    </a>
  )
}

export const JiraButtonHead = {
  Item: () => <abbr title="Review in Jira">Review</abbr>,
  key: 'jira-head-review',
}

export const JiraButtonBody = (url: string) => {
  return {
    Item: () => <JiraLinkButton url={url} />,
    key: 'jira-body-review',
  }
}
