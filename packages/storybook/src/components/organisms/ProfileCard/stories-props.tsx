// import { t } from '@lingui/macro'
import { overrideDeep } from '@moodlenet/component-library/common'
import { ProfileFormValues } from '@moodlenet/react-app/common'
import { ProfileCardProps } from '@moodlenet/react-app/ui'
import { action } from '@storybook/addon-actions'
import {
  profileStoriesValidationSchema,
  useProfileStoryProps,
} from 'components/pages/Profile/stories-props.js'
import { useFormik } from 'formik'
import { PartialDeep } from 'type-fest'

export const useProfileCardStoryProps = (
  overrides?: PartialDeep<ProfileCardProps>,
): ProfileCardProps => {
  const profileProps = useProfileStoryProps()
  const { access, actions, profileForm, profileCardSlots } = profileProps
  const { editProfile } = actions
  const form = useFormik<ProfileFormValues>({
    initialValues: profileForm,
    validationSchema: profileStoriesValidationSchema,
    onSubmit: values => {
      return editProfile(values)
    },
  })
  return overrideDeep<ProfileCardProps>(
    {
      access: access,
      actions: actions,
      form: form,
      isEditing: false,
      slots: profileCardSlots,
      toggleIsEditing: action('toggle is editting'),
    },

    { ...overrides },
  )
}
