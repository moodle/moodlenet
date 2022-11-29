import { withCtrl } from '../../../lib/ctrl'

export type LMSMoodleLandingProps = {} & (
  | {
      badParams?: false
    }
  | {
      badParams: true
    }
)

export const LMSMoodleLanding = withCtrl<LMSMoodleLandingProps>((props) => {
  if (props.badParams) {
    return (
      <div>
        <h2>Bad Params</h2>
      </div>
    )
  }
  return null
})
