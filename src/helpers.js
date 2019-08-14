/**
 * Find first property that matches from a list of possible property names
 * @param {{}} obj
 * @param {string[]} possibleNames
 * @returns {undefined|*} value
 */
export function findProp(obj, possibleNames) {
    for (const p in possibleNames) {
        if (obj.hasOwnProperty(p)) return obj[p]
    }
    return undefined
}
