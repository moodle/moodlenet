import { SimpleResponse } from '@moodlenet/common/lib/graphql/types.graphql.gen'

export const getSimpleResponse = ({
  success,
  message,
}:
  | {
      success?: false
      message: string | null | undefined
    }
  | {
      success: true
      message?: null
    }): SimpleResponse => ({
  __typename: 'SimpleResponse',
  success: !!success,
  message: message || null,
})
