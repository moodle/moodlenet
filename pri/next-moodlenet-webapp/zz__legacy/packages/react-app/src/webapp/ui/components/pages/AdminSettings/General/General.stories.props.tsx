import type { OrganizationData } from '@moodlenet/organization/common'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { FC } from 'react'
import type { SchemaOf } from 'yup'
import { object, string } from 'yup'
import type { AdminSettingsItem } from '../AdminSettings'
import type { GeneralProps } from './General'
import { General, GeneralMenu } from './General'

export const validationSchema: SchemaOf<OrganizationData> = object({
  instanceName: string().max(160).min(3).required(/* t */ `Please provide an instance name`),
  landingTitle: string().max(160).min(3).required(/* t */ `Please provide a landing title`),
  landingSubtitle: string().max(4096).min(3).required(/* t */ `Please provide a landing subtitle`),
  locationAddress: string().max(160).min(3).required(/* t */ `Please provide a location address`),
  locationUrl: string()
    .max(50)
    .min(3)
    .url(/* t */ `Please provide a valid URL`)
    .required(/* t */ `Please provide a location URL`),
  copyright: string().max(160).required(/* t */ `Please provide a location address`),
})

export const useGeneralStoryProps = (overrides?: {
  editFormValues?: Partial<OrganizationData>
  props?: Partial<GeneralProps>
}): GeneralProps => {
  return {
    form: useFormik<OrganizationData>({
      onSubmit: action('submit edit'),
      validationSchema,
      initialValues: {
        instanceName: 'MoodleNet',
        landingTitle: 'Find, share and curate open educational resources',
        landingSubtitle: 'Search for resources, subjects, collections or people',
        locationAddress: 'PO Box 303, West Perth WA 6872, Australia',
        locationUrl:
          'https://www.google.com/maps/place/Moodle/@-31.9489919,115.8403923,15z/data=!4m5!3m4!1s0x0:0x2bff7bedf43b4fc7!8m2!3d-31.9489919!4d115.8403923',
        copyright: `Copyright © ${new Date().getFullYear()} Moodle Pty Ltd, All rights reserved.`,
        ...overrides?.editFormValues,
      },
    }),
    // updateExtensions: action('Updating extensions'),
    // updateSuccess: true,
    ...overrides?.props,
  }
}

const GeneralItem: FC = () => <General {...useGeneralStoryProps()} />
export const useElements = (): AdminSettingsItem => {
  return {
    Menu: GeneralMenu,
    Content: GeneralItem,
    key: 'content-general',
  }
}
