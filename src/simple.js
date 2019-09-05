import invertible_fn from './inv'
import isInvertibleFn from './checks'

export default function simple_inv({ context, fn }) {
    const forwardCx = {},
        backCx = {}

    for (let prop in context) {
        const v = context[prop]
        if (Array.isArray(v)) {
            forwardCx[prop] = v[0]
            backCx[prop] = v[1]
        } else if (typeof v == 'object') {
            forwardCx[prop] = findProp(v, [
                'value',
                'val',
                'v',
                'f',
                'forward',
                'forwards',
                'n',
                'norm',
                'normal',
            ])
            backCx[prop] = findProp(v, [
                'inv',
                'i',
                'inverse',
                'reverse',
                'rev',
                'r',
                'back',
                'backward',
                'backwards',
            ])
        } else if (isInvertibleFn(v)) {
            forwardCx[prop] = v
            backCx[prop] = v.inv
        }
    }

    return invertible_fn(fn.bind(forwardCx), fn.bind(backCx))
}

/**
 * Find first property that matches from a list of possible property names
 * @param {{}} obj
 * @param {string[]} possibleNames
 * @returns {undefined|*} value
 */
function findProp(obj, possibleNames) {
    for (const p in possibleNames) {
        if (obj.hasOwnProperty(p)) return obj[p]
    }
    return undefined
}
