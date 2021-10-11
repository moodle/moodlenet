import { BaseOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/graphOperators'
import { ns } from '../../lib/ns/namespace'
import { value } from '../../lib/stub/Stub'

export const getGraphOperatorsAdapter = value<GraphOperators>(ns(__dirname, 'get-graph-operators'))
export const getBaseOperatorsAdapter = value<BaseOperators>(ns(__dirname, 'get-base-operators'))
