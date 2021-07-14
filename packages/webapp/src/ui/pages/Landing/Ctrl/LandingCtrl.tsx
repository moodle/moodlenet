import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { createWithProps } from '../../../lib/ctrl'
import { headerPageTemplateWithProps } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FollowTag } from '../../../types'
import { LandingProps } from '../Landing'

export const [LandingCtrl, landingWithProps] = createWithProps<LandingProps, {}>(
  ({ __key, __uiComp: LandingUI, ...rest }) => {
    const trendingQ = useGlobalSearchQuery({
      variables: {
        sortBy: 'Popularity',
        nodeTypes: ['Collection', 'SubjectField'],
        text: '',
      },
    })
    const tags = useMemo(
      () =>
        trendingQ.data?.globalSearch.edges
          .map(edge =>
            edge.node.__typename === 'SubjectField' || edge.node.__typename === 'Collection' ? edge.node : null,
          )
          .filter(isJust)
          .map<FollowTag>(node => ({
            name: node.name,
            type: 'Specific',
          })),
      [trendingQ.data?.globalSearch.edges],
    )
    const landingProps = useMemo<LandingProps>(
      () => ({
        headerPageTemplateWithProps: headerPageTemplateWithProps({ key: 'Header Page Template' }),
        organization: {
          name: 'Bern University of Applied Sciences',
          intro: 'Diverse, sound, dynamic – these are the values that define BFH. And this is our MoodleNet server. ',
        },
        image: 'https://picsum.photos/200/100',
        trendCardProps: { tags: tags || [] },
      }),
      [tags],
    )
    return <LandingUI {...landingProps} {...rest} key={__key} />
  },
)
