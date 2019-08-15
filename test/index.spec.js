import 'chai/register-should'
import inv, { check, simple } from '../'

describe('index.js', () => {
    it('has a default export inv', () => {
        const double = inv(x => x + x, x => x / 2)
        double(10).should.equal(20)
    })
    it('has named exports available', () => {
        const invertible = inv(() => true)
        check(invertible).should.be.true

        const nonInvertible = () => true
        check(nonInvertible).should.be.false
    })
})
