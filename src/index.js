import inv from 'invertible'
import { convert_prop } from './properties'
import { sub } from './descend'
import { map } from './map'
import { merge_objects, partial } from './partial'
import { cond } from './conditional'

//complexConvert = sub
// doList = merge_result
// pipeObj = merge_result

/*
q.prop:::
x, y
x, y, fn
x, y, forwardFn, reverseFn
q.fn:::
fn
forwardFn, reverseFn
 */

export default function q(x, y, forwardFn, backwardFn) {
    let fn = typeof x === 'string' ? prop : partial
    return fn(...arguments)
}
q.seq = seq
q.prop = prop
q.sub = sub
q.fn = partial
q.raw = inv
q.map = map
q.cond = q.if = cond

export function easyProps(propDict) {
    const fns = []
    for (const x in propDict) {
        const y = String(propDict[x])
        fns.push(convert_prop(x, y))
    }
    return seq(...fns)
}
function needsWrap(fn) {
    // contains "output" is a good sign
    if (/\boutput\b/.test(fn)) {
        return false
    } else {
        // if a value is being returned, then
        // probably a sign function was written to expect a wrapper
        return 1 + /\breturn|=>\b/.test(fn)
    }
}

function areInv(args) {
    for (let fn of args) {
        if (!inv.check(fn))
            throw new Error('Functions must be invertibles' + fn.name)
    }
    return true
}

function argsNeedWrap(args) {
    for (let fn of args) {
        let wrapResult = needsWrap(fn)
        if (typeof fn !== 'function' || typeof fn.inv !== 'function')
            throw new Error('Functions must be invertibles' + fn.name)
        else if (wrapResult > 0) {
            throw new Error(
                wrapResult + fn.toString() + ' needs to be wrapped in q.fn',
            )
        } else if (needsWrap(fn.inv) > 1) {
            throw new Error(
                `The inverse function ${fn.inv.toString()} needs to be wrapped in q.fn`,
            )
        }
    }
    return true
}

export function prop(x, y, forwardFn, inverseFn) {
    return (forwardFn ? sub : convert_prop)(...arguments)
}
