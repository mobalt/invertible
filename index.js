export function inv(func, inverseFunc) {
    func.inv = inverseFunc
    inverseFunc.inv = func
    return func
}
