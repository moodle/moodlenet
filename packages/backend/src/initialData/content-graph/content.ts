import { ShallowNodeByType } from '../../graphql/types.node'
import initialUsers from '../user-auth/initialUsers'

export const localDomainData: Omit<ShallowNodeByType<'Domain'>, 'id'> = {
  name: 'MoodleNet',
  summary: 'Our global network to share and curate open educational resources',
}

export const initialProfiles = ({ domain }: { domain: string }) =>
  initialUsers({ domain }).map(userData => {
    return {
      name: userData.username,
      summary: userData.username,
    }
  })
