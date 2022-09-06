import { ContentGraphExtDef, NodeGlyph } from '@moodlenet/content-graph'
import lib from 'moodlenet-react-app-lib'
import { FC, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ContentGraphContext } from '../ContentGraphProvider'

export const route = 'content/:_type/:_key'
export const Component: FC = () => {
  const { _type, _key } = useParams<'_type' | '_key'>()
  if (!(_type && _key)) {
    throw new Error()
  }
  const [node, setNode] = useState<NodeGlyph>()
  useEffect(() => {
    lib.priHttp
      .fetch<ContentGraphExtDef>(
        '@moodlenet/content-graph',
        '0.1.0',
      )('read/node')({
        identifier: {
          _type,
          _key,
        },
      })
      .then(res => {
        setNode(res?.node)
      })
  }, [_type, _key])
  const { nodeHomePages } = useContext(ContentGraphContext)
  const nodeHomePageDef = nodeHomePages[_type]
  console.log({ nodeHomePageDef, _type, node, nodeHomePages })
  return node && nodeHomePageDef ? <nodeHomePageDef.Component node={node} /> : null
}
