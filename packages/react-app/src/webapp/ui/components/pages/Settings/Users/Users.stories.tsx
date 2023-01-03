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
            isAdmin: false,
            toggleIsAdmin: action('toogle isAdmin'),
          },
          {
            displayName: 'Josef Stevenson',
            email: 'josef.stevenson@university.edu',
            isAdmin: true,
            toggleIsAdmin: action('toogle isAdmin'),
          },
          {
            displayName: 'Veronica Velazquez',
            email: 'vero.velazquez@next-school.edu',
            isAdmin: true,
            toggleIsAdmin: action('toogle isAdmin'),
          },
          {
            displayName: 'Alfred Nobel Tschekov',
            email: 'alfrednt@old-university.edu',
            isAdmin: false,
            toggleIsAdmin: action('toogle isAdmin'),
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
