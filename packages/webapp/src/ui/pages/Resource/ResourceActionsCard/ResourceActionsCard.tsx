import { Trans } from '@lingui/macro'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import { withCtrl } from '../../../lib/ctrl'
import '../../../styles/tags.css'
import './styles.scss'

export type ResourceActionsCardProps = {

}

export const ResourceActionsCard = withCtrl<ResourceActionsCardProps>(() => {
  return (
    <Card className="resource-action-card">
      <PrimaryButton><Trans>Send to Moodle</Trans></PrimaryButton>
      <SecondaryButton><Trans>Add to Collection</Trans></SecondaryButton>
    </Card>
  )
})
