import { requireInvertibleFns } from './checks'
import invertible_fns from './inv'

export default function pipe(...functions) {
    requireInvertibleFns(...functions)
    return invertible_fns(forward, reverse)

    function forward(input) {
        let val = input
        const len = functions.length
        for (let i = 0; i < len; i++) {
            val = functions[i](val)
        }
        return val
    }

    function reverse(input) {
        let val = input
        for (let i = functions.length - 1; i >= 0; i--) {
            val = functions[i].inv(val)
        }
        return val
    }
}
