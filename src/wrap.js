import inv from './inv'
import isInvertibleFn, { requireInvertibleFns } from './checks'
import pipe from './pipe'

// Takes care of setup/teardown
const bumper = inv(input => ({ input, output: {} }), ({ output }) => output)

export default function wrap(...invertibleFns) {
    requireInvertibleFns(...invertibleFns)
    return pipe(
        bumper,
        ...invertibleFns,
        bumper.inv,
    )
}
