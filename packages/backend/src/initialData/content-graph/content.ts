import { ShallowNodeByType } from '../../graphql/types.node'
import initialUsers from '../user-auth/initialUsers'

export const localOrganizationData = ({
  domain,
}: {
  domain: string
}): Omit<ShallowNodeByType<'Organization'>, 'id'> => ({
  name: 'MoodleNet',
  summary: 'Our global network to share and curate open educational resources',
  color: '#f98109',
  domain,
})

export const initialProfiles = ({ domain }: { domain: string }) =>
  initialUsers({ domain }).map(userData => {
    return {
      name: userData.username,
      summary: userData.username,
    }
  })
