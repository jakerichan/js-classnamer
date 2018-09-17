import * as R from 'ramda'
import classnames from 'classnames'

/**
 * build results in a space separated string that composes classNames in a standard way
 * @param {Array} prefixes Array of strings, each will be the root of a composed className
 * @param {String} tail Element specific name dash-cased, appends to each of the given prefixes
 * @param {Object} [stateNames={}] Object describing additional state specific classes
 *
 * build(['ComponentName', 'CustomClassName'], 'actions', { active: true })
 * > 'ComponentName--actions CustomClassName--actions ComponentName--actions-active CustomClassName--actions-active'
 */
const build = (prefixes, tail, stateNames = {}) => {
  const renameKeysBy = (renameKeyFn, target) => R.reduce(
    (acc, key) => R.assoc(renameKeyFn(key), R.prop(key, target), acc),
    {},
    R.keys(target)
  )

  const cleanedPrefixes = R.pipe(
    R.reject(R.anyPass([R.isEmpty, R.isNil])),
    R.reduce((acc, prefix) => R.concat(acc, R.split(' ', prefix)), []),
    R.uniq
  )(prefixes)

  const stateClasses = R.reduce((acc, prefix) => {
    const elementName = R.join('-', R.reject(R.isEmpty, [prefix, tail]))
    const joinNameWithState = stateName =>
      R.join('-', [elementName, stateName])
    const base = R.assoc(elementName, true, acc)
    return R.merge(base, renameKeysBy(joinNameWithState, stateNames))
  }, {})(cleanedPrefixes)

  return classnames(stateClasses)
}

export default R.curry(build)
