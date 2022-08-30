import lib from 'moodlenet-react-app-lib'
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ContentGraphExtDef, NodeGlyph } from '../types'

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
  }, [])

  return (
    <div>
      <h2>NodeHomePage</h2>
      <h3>
        {_type}/{_key}
      </h3>
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  )
}
