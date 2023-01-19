
packages/react-app/src/webapp/ui/components/pages/Settings/Users/UsersHooks.tsx

packages/authentication-manager/src/expose.mts

export type TuserProps = {
  userId : string,
  displayName: string
  email: string
  userTypes: string[]
}

    getUsers: {
      guard: () => void 0,
      fn: async (req: { search: string }): Promise<TuserProps[]> => {
        console.log()
        return []
      },
    },
    changeUserType: {
      guard: () => void 0,
      fn: async (req: { userId: string; userType: string }) => {
        console.log('todo', req)
        return { success: true }
      },
    },



packages/react-app/src/webapp/context/AuthContext.tsx

// da dare pasto a alle  form non importa quali
export type TuserProps = {
  displayName: string
  email: string
  userTypes: string[]
}

export type TusersProps = {
  users: TuserProps[],
  changeType: (user: TuserProps, userType: string) => void
}
