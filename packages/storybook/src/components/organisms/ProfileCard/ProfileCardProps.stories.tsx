// import { t } from '@lingui/macro'
import { overrideDeep } from '@moodlenet/component-library/common'
import type { ProfileFormValues } from '@moodlenet/web-user/common'
import { profileFormValidationSchema } from '@moodlenet/web-user/common'
import type { MainProfileCardProps } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { useProfileStoryProps } from 'components/pages/Profile/ProfileProps.stories.js'
import { useFormik } from 'formik'
import type { PartialDeep } from 'type-fest'

export const useMainProfileCardStoryProps = (
  overrides?: PartialDeep<MainProfileCardProps>,
): MainProfileCardProps => {
  const profileProps = useProfileStoryProps()
  const { access, actions, data, state, profileForm, mainProfileCardSlots } = profileProps
  const { editProfile } = actions
  const form = useFormik<ProfileFormValues>({
    initialValues: profileForm,
    validationSchema: profileFormValidationSchema(340000),
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
      actions,
      data,
      profileUrl: 'moodle.net/profile',
      state,
      toggleIsEditing: action('toggle is editting'),
    },

    { ...overrides },
  )
}
