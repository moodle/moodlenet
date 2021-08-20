import { LMSPrefs } from '../../../lib/moodleLMS/LMSintegration'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'

export type LMSMoodleLandingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
} & (
  | {
      params: LMSPrefs
      badParams?: false
    }
  | {
      badParams: true
    }
)

export const LMSMoodleLanding = withCtrl<LMSMoodleLandingProps>(props => {
  if (props.badParams) {
    return (
      <div>
        <h2>Bad Params</h2>
      </div>
    )
  } else {
    const { course, site, section } = props.params
    return (
      <HeaderPageTemplate {...props.headerPageTemplateProps}>
        <div>
          <h1>Welcome from Moodle LMS !</h1>
          <h2>Site: {site}</h2>
          {course && <h3>course: {course}</h3>}
          {section && <h3>section: {section}</h3>}
        </div>
      </HeaderPageTemplate>
    )
  }
})
