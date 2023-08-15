import { FieldsDataStories } from '@moodlenet/ed-meta/stories'
import type { EdMetaOptionsProps, ResourceFormProps } from '@moodlenet/ed-resource/common'
import type { SimpleEmailUserSettingsProps } from '@moodlenet/simple-email-auth/ui'
import { SimpleEmailUserSettings } from '@moodlenet/simple-email-auth/ui'
import type { GeneralProps, UserSettingsItem } from '@moodlenet/web-user/ui'
import { General, GeneralMenu } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'

export const ResourceFormValues: ResourceFormProps = {
  title: '',
  description:
    'Earth 2020: An Insider’s Guide to a Rapidly Changing Planet responds to a public increasingly concerned about the deterioration of Earth’s natural systems, offering readers a wealth of perspectives on our shared ecological past, and on the future trajectory of planet Earth. Written by world-leading thinkers on the front-lines of global change research and policy, this multi-disciplinary collection maintains a dual focus: some essays investigate specific facets of the physical Earth system, while others explore the social, legal and political dimensions shaping the human environmental footprint. In doing so, the essays collectively highlight the urgent need for collaboration across diverse domains of expertise in addressing one of the most significant challenges facing us today. Earth 2020 is essential reading for everyone seeking a deeper understanding of the past, present and future of our planet, and the role of humanity in shaping this trajectory.',
  subject: FieldsDataStories.SubjectsTextOptionProps[2]!.value,
  language: FieldsDataStories.LanguagesTextOptionProps[2]!.value,
  level: FieldsDataStories.LevelTextOptionProps[2]!.value,
  license: FieldsDataStories.LicenseIconTextOptionProps[2]!.value,
  month: FieldsDataStories.MonthTextOptionProps[8]!.value,
  year: FieldsDataStories.YearsProps[20]!.valueOf(),
  type: FieldsDataStories.TypeTextOptionProps[1]!.value,
}

const edMetaOptions: EdMetaOptionsProps = {
  subjectOptions: FieldsDataStories.SubjectsTextOptionProps,
  languageOptions: FieldsDataStories.LanguagesTextOptionProps,
  levelOptions: FieldsDataStories.LevelTextOptionProps,
  licenseOptions: FieldsDataStories.LicenseIconTextOptionProps,
  monthOptions: FieldsDataStories.MonthTextOptionProps,
  yearOptions: FieldsDataStories.YearsProps,
  typeOptions: FieldsDataStories.TypeTextOptionProps,
}

export const useUserSettingsGeneralStoryProps = (overrides?: {
  props?: Partial<GeneralProps>
}): GeneralProps => {
  const simpleEmailUserSettingsProps: SimpleEmailUserSettingsProps = {
    data: {
      password: 'mypassword',
    },
    passwordChangedSuccess: false,
    editData: action('edit data'),
  }
  return {
    mainColumnItems: [
      {
        Item: () => <SimpleEmailUserSettings {...simpleEmailUserSettingsProps} />,
        key: 'simple-email-auth',
      },
    ],
    resourceForm: ResourceFormValues,
    edMetaOptions: edMetaOptions,

    // userId: 'john-cake-21321312',
    // updateExtensions: action('Updating extensions'),
    // updateSuccess: true,
    ...overrides?.props,
  }
}

const UserSettingsGeneralItem = () => <General {...useUserSettingsGeneralStoryProps()} />
export const useUserSettingsGeneralElements = (): UserSettingsItem => {
  return {
    Menu: GeneralMenu,
    Content: UserSettingsGeneralItem,
    key: 'content-general',
  }
}
