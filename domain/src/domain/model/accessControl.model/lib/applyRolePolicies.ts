import { any_ } from '@moodle/lib-types'
import { defaultsDeep } from 'lodash'
import { rolePolicies } from '../types'

export function applyRolePolicies(config: moo.def.policies.config.tree, rolePolicies: rolePolicies[]): moo.def.policies.user.tree {
  return rolePolicies
    .map(
      ({ deny, allow }) =>
        [
          ['deny', deny],
          ['allow', allow],
        ] as const,
    )
    .flat()
    .filter((_): _ is policyNode_ => _[1] !== undefined)
    .reduce((curr, policy) => apply_policy_(curr, config, policy), {} as moo.def.policies.user.tree)
}

type policyT_ = 'deny' | 'allow'
type policyNode_ = [policyT_, moo.def.policies.override.tree]

const deny_sym_ = Symbol('deny')

function apply_policy_(currentPolicyUserTreeNode: any_, currentPolicyConfigTreeNode: any_, [d_a, policyOverrideTreeNode]: [policyT_, any_]): moo.def.policies.user.tree {
  if (!currentPolicyConfigTreeNode) {
    return deny_sym_ as unknown as moo.def.policies.user.tree
    // throw new TypeError('currentPolicyConfigTreeNode is required')
  }
  const policy_override_tree_entries = Object.entries(policyOverrideTreeNode)
  const isOverrideLeaf = policy_override_tree_entries.length === 0
  if (currentPolicyUserTreeNode === deny_sym_ || (d_a === 'deny' && isOverrideLeaf)) {
    return deny_sym_ as unknown as moo.def.policies.user.tree
  }
  const node = policy_override_tree_entries.reduce(
    (acc, [prop, tree_prop_entry]) => {
      const isConfigProperty = prop === '_'
      if (isConfigProperty) {
        return acc
      }
      acc[prop] = apply_policy_(currentPolicyUserTreeNode?.[prop], currentPolicyConfigTreeNode?.[prop], [d_a, tree_prop_entry])
      return acc
    },
    {
      ...(currentPolicyUserTreeNode ?? (isOverrideLeaf && d_a === 'allow' ? currentPolicyConfigTreeNode : null) ?? null),
      ...(policyOverrideTreeNode?._ || currentPolicyUserTreeNode?._ || currentPolicyConfigTreeNode?._
        ? { _: defaultsDeep({}, policyOverrideTreeNode?._ ?? {}, currentPolicyUserTreeNode?._ ?? {}, currentPolicyConfigTreeNode?._ ?? {}) }
        : null),
    },
  )
  return cleanup_(node)
}
function cleanup_(node: any_) {
  return Object.entries(node).reduce((acc, [prop, value]) => {
    const isConfigProperty = prop === '_'
    acc[prop] = isConfigProperty ? value : value === deny_sym_ || value === undefined ? undefined : cleanup_(value)
    return acc
  }, {} as any_) as moo.def.policies.user.tree
}
