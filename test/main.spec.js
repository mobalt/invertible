import 'chai/register-should'
import inv, { invertible_fns, identity_fn, oneway_fn } from '../src/main'

describe('src/main', () => {
    describe('can keep track of inverse functions', () => {
        const double = x => x * 2
        const half = x => x / 2

        const invertible = invertible_fns(double, half)

        it('can do forward (double)', () => {
            invertible(9).should.equal(18)
            invertible(-30).should.equal(-60)
        })

        it('can do inverse (half)', () => {
            invertible.inv(200).should.equal(100)
        })
    })

    describe("can mark a function's inverse as itself", () => {
        const multiplicative_identity = identity_fn(x => x * 1)

        it('runs the same function in both forwards and reverse directions', () => {
            multiplicative_identity(99).should.equal(99)
            multiplicative_identity(-199).should.equal(-199)

            multiplicative_identity.inv(5).should.equal(5)
            multiplicative_identity.inv(-5).should.equal(-5)
        })
    })

    describe('can allow a function to work in only one direction', () => {
        const sq = oneway_fn(x => x * x)

        it('computes foward', () => {
            sq(-7).should.equal(49)
        })
        it('input passes through in reverse', () => {
            sq.inv(-49).should.equal(-49)
        })
    })
    describe('does the right thing via the default export function', () => {
        const double = x => x * 2
        const half = x => x / 2

        const invertible = inv(double, half)
        const multiplicative_identity = inv(x => x * 1 /* inverse=undefined */)
        const sq = inv(x => x * x, false)

        invertible(9).should.equal(18)
        invertible(-30).should.equal(-60)
        invertible.inv(200).should.equal(100)

        multiplicative_identity(99).should.equal(99)
        multiplicative_identity(-199).should.equal(-199)
        multiplicative_identity.inv(5).should.equal(5)
        multiplicative_identity.inv(-5).should.equal(-5)

        sq(-7).should.equal(49)
        sq.inv(-49).should.equal(-49)
    })
})
