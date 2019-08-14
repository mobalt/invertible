import isInvertibleFn from './checks'

function setProperties(fn, invFn) {
    return Object.defineProperties(fn, {
        inv: {
            value: invFn,
        },
        isInvertible: {
            value: true,
        },
    })
}

export function invertible_fns(forward, inverse) {
    setProperties(inverse, forward)
    return setProperties(forward, inverse)
}

export function identity_fn(fn) {
    return setProperties(fn, fn)
}

export function oneway_fn(fn) {
    const passthrough_fn = x => x
    return invertible_fns(fn, passthrough_fn)
}

export default function inv(forward, reverse) {
    if (isInvertibleFn(forward)) return forward
    else if (reverse === undefined) return identity_fn(forward)
    else if (reverse === false) return oneway_fn(forward)
    else return invertible_fns(forward, reverse)
}
