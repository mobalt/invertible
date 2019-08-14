export function isInvertibleFn(fn) {
    return (
        typeof fn === 'function' &&
        typeof fn.inv === 'function' &&
        fn.inv.inv === fn
    )
}
