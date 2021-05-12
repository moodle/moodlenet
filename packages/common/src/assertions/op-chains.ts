import { ConnAssertion, CtxAssertion, NodeAssertion } from '../content-graph'
import { BoolOp, op_chain } from '../utils/op-chain'

export const _ctx = op_chain<BoolOp, CtxAssertion>()
export const _node = op_chain<BoolOp, NodeAssertion>()
export const _conn = op_chain<BoolOp, ConnAssertion>()
