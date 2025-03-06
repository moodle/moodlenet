import { any_ } from '@moodle/lib-types'
import { defaultsDeep } from 'lodash'
import { rolePerm } from '../types'

export function applyRolePerms(config: moo.permissions.config.tree, rolePerms: rolePerm[]): moo.permissions.user.tree {
  return rolePerms
    .map(
      ({ deny, allow }) =>
        [
          ['deny', deny],
          ['allow', allow],
        ] as const,
    )
    .flat()
    .filter((_): _ is permNode_ => _[1] !== undefined)
    .reduce((curr, perm) => apply_perm_(curr, config, perm), {} as moo.permissions.user.tree)
}

type permT_ = 'deny' | 'allow'
type permNode_ = [permT_, moo.permissions.override.tree]

const deny_sym_ = Symbol('deny')

function apply_perm_(currentPermUserTreeNode: any_, currentPermConfigTreeNode: any_, [d_a, permOverrideTreeNode]: [permT_, any_]): moo.permissions.user.tree {
  if (!currentPermConfigTreeNode) {
    throw new TypeError('currentPermConfigTreeNode is required')
  }
  const perm_override_tree_entries = Object.entries(permOverrideTreeNode)
  const isOverrideLeaf = perm_override_tree_entries.length === 0
  if (currentPermUserTreeNode === deny_sym_ || (d_a === 'deny' && isOverrideLeaf)) {
    return deny_sym_ as unknown as moo.permissions.user.tree
  }
  const node = perm_override_tree_entries.reduce(
    (acc, [prop, tree_prop_entry]) => {
      const isConfigProperty = prop === '_'
      if (isConfigProperty) {
        return acc
      }
      acc[prop] = apply_perm_(currentPermUserTreeNode?.[prop], currentPermConfigTreeNode?.[prop], [d_a, tree_prop_entry])
      return acc
    },
    {
      ...(currentPermUserTreeNode ?? (isOverrideLeaf && d_a === 'allow' ? currentPermConfigTreeNode : null) ?? null),
      ...(permOverrideTreeNode?._ || currentPermUserTreeNode?._ || currentPermConfigTreeNode?._
        ? { _: defaultsDeep({}, permOverrideTreeNode?._ ?? {}, currentPermUserTreeNode?._ ?? {}, currentPermConfigTreeNode?._ ?? {}) }
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
  }, {} as any_) as moo.permissions.user.tree
}
