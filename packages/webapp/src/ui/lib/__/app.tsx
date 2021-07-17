import { FC } from 'react'
import { withProps, WithProps } from './ctrl'
import './styles.css'

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  )
}

export type LeafProps = { d1: string; u1: string }
export const Leaf: FC<LeafProps> = props => {
  return (
    <div style={{ marginLeft: '10px' }}>
      <pre>Leaf :{JSON.stringify(props, null, 4)}</pre>
      <hr />
      <br />
    </div>
  )
}

export type MidProps = { l1: WithProps<LeafProps, 'u1'>; l2: WithProps<LeafProps, 'u1'>[]; d1: string; u1: string }
export const Mid: FC<MidProps> = props => {
  const [LeafCtrl, leafP] = withProps(Leaf, props.l1)
  return (
    <div style={{ marginLeft: '10px' }}>
      <pre>Mid :{JSON.stringify(props, null, 4)}</pre>
      <LeafCtrl u1="u1" {...leafP} />
      <LeafCtrl u1="u1" {...leafP} />
      {props.l2.map((l2n, ind) => {
        const [LeafCtrl, leafP] = withProps(Leaf, l2n)
        return <LeafCtrl u1={`u1[${ind}]`} {...leafP} />
      })}

      <hr />
      <br />
    </div>
  )
}
