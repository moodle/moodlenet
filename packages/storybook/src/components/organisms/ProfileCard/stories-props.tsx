// import { t } from '@lingui/macro'
import { overrideDeep } from '@moodlenet/component-library/common'
import { ProfileFormValues } from '@moodlenet/web-user/common'
import { MainProfileCardProps } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import {
  profileStoriesValidationSchema,
  useProfileStoryProps,
} from 'components/pages/Profile/stories-props.js'
import { useFormik } from 'formik'
import { PartialDeep } from 'type-fest'

export const useMainProfileCardStoryProps = (
  overrides?: PartialDeep<MainProfileCardProps>,
): MainProfileCardProps => {
  const profileProps = useProfileStoryProps()
  const { access, actions, profileForm, mainProfileCardSlots } = profileProps
  const { editProfile } = actions
  const form = useFormik<ProfileFormValues>({
    initialValues: profileForm,
    validationSchema: profileStoriesValidationSchema,
    onSubmit: values => {
      return editProfile(values)
    },
  })
  return overrideDeep<MainProfileCardProps>(
    {
      access: access,
      form: form,
      isEditing: false,
      slots: mainProfileCardSlots,
      toggleIsEditing: action('toggle is editting'),
    },

    { ...overrides },
  )
}
