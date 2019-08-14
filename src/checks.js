export default function isInvertibleFn(fn) {
    return (
        typeof fn === 'function' &&
        typeof fn.inv === 'function' &&
        fn.inv.inv === fn
    )
}

export function requireInvertibleFns(...args) {
    for (let fn of args) {
        if (!isInvertibleFn(fn))
            throw new TypeError(`The function "${fn.name}" is not invertible.`)
    }
    return true
}
