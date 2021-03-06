import {isObject} from '../utils'

export default function (target, value) {
  function set ({state, props, resolve}) {
    if (!resolve.isTag(target, 'state', 'props')) {
      throw new Error('Cerebral operator.set: You have to use the STATE or PROPS TAG as first argument')
    }

    let resolvedValue = resolve.value(value)

    if (
      !resolve.isTag(value) &&
      !resolve.isCompute(value) &&
      isObject(value)
    ) {
      resolvedValue = Object.assign({}, resolvedValue)
    } else if (
      !resolve.isTag(value) &&
      !resolve.isCompute(value) &&
      Array.isArray(value)
    ) {
      resolvedValue = resolvedValue.slice()
    }

    if (target.type === 'state') {
      state.set(resolve.path(target), resolvedValue)
    } else {
      const result = Object.assign({}, props)
      const parts = resolve.path(target).split('.')
      const key = parts.pop()
      const targetObj = parts.reduce((target, key) => {
        return (target[key] = Object.assign({}, target[key] || {}))
      }, result)
      targetObj[key] = resolvedValue

      return result
    }
  }

  set.displayName = `operator.set(${String(target)}, ${String(value)})`

  return set
}
