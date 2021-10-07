import { BaseOperators, GetBV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { AddEdgeOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/AddEdge'
import { GraphOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/graphOperators'
import { ns } from '../../lib/ns/namespace'
import { stub, value } from '../../lib/stub/Stub'

export const getGraphBV = stub<GetBV>(ns('get-graph-bv'))
export const getGraphOperators = value<GraphOperators>(ns('get-graph-operators'))
export const getBaseOperators = value<BaseOperators>(ns('get-graph-operators'))
export const getAddEdgeOperators = value<AddEdgeOperators>(ns('get-add-edge-operators'))
