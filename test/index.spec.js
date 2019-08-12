import 'chai/register-should'
import { inv } from '../index'

describe('inv', () => {
    it('Keeps track of forward/inverse functions', () => {
        const fn = inv(
            function double(x) {
                return 2 * x
            },
            function half(x) {
                return x / 2
            },
        )

        fn(10).should.equal(20)
        fn.inv(10).should.equal(5)
    })
})
