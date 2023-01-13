import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { FC } from 'react'
import { SettingsItem } from '../Settings/Settings.js'
import { Users, UsersFormValues, UsersMenu, UsersProps } from './Users.js'

export const useUsersStoryProps = (overrides?: {
  editFormValues?: Partial<UsersFormValues>
  props?: Partial<UsersProps>
}): UsersProps => {
  return {
    form: useFormik<UsersFormValues>({
      onSubmit: action('Submit Users settings'),
      // validationSchema,
      initialValues: {
        users: [
          {
            displayName: 'Maria Anders',
            email: 'maria.anders@school.edu',
            userTypes: [],
            toggleUserType: action('toogle user type'),
          },
          {
            displayName: 'Josef Stevenson',
            email: 'josef.stevenson@university.edu',
            userTypes: ['Admin'],
            toggleUserType: action('toogle user type'),
          },
          {
            displayName: 'Veronica Velazquez',
            email: 'vero.velazquez@next-school.edu',
            userTypes: ['Admin'],
            toggleUserType: action('toogle user type'),
          },
          {
            displayName: 'Alfred Nobel Tschekov',
            email: 'alfrednt@old-university.edu',
            userTypes: [],
            toggleUserType: action('toogle user type'),
          },
        ],
        ...overrides?.editFormValues,
      },
    }),
    ...overrides?.props,
  }
}

const UsersItem: FC = () => <Users {...useUsersStoryProps()} />
export const useElements = (): SettingsItem => {
  return {
    Menu: UsersMenu,
    Content: { Item: UsersItem, key: 'content-Users' },
  }
}
