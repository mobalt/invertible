import 'chai/register-should'
import inv from '../src/main'
import pipe from '../src/pipe'

const addTwo = inv(x => x + 2, x => x - 2)
const subtractOne = inv(x => x - 1, x => x + 1)
const double = inv(x => x + x, x => x / 2)
const triple = inv(x => 3 * x, x => x / 3)
const quadruple = inv(x => 4 * x, x => x / 4)

describe('#pipe', () => {
    describe('can be used for math', () => {
        it('can do simple (commutative) math functions', () => {
            const multiply6 = pipe(
                double,
                triple,
            )
            const multiply24 = pipe(
                double,
                triple,
                quadruple,
            )
            const weirdSums = pipe(
                addTwo,
                addTwo,
                subtractOne,
                addTwo,
                addTwo,
                subtractOne,
            )
            multiply6(6).should.equal(36)
            multiply6.inv(6).should.equal(1)

            multiply24(8).should.equal(192)
            multiply24(10).should.equal(240)
            multiply24.inv(48).should.equal(2)

            weirdSums(99).should.equal(105)
            weirdSums.inv(99).should.equal(93)
        })

        it('non-commutative math functions are inverted in order', () => {
            const x = pipe(
                double,
                addTwo,
            )
            const y = pipe(
                double,
                addTwo,
                triple,
                subtractOne,
            )

            x(99).should.equal(200)
            x.inv(200).should.equal(99)

            y(50).should.equal(305)
            y.inv(305).should.equal(50)
        })
    })

    describe('can handle objects', () => {
        const convertA = inv(
            input => ({ b: input.a + 5 }),
            input => ({ a: input.b - 5 }),
        )

        const convertB = inv(
            ({ b }) => ({ c: b * 3 }),
            ({ c }) => ({ b: c / 3 }),
        )

        it('The property conversion steps work separately', () => {
            convertA({ a: 9 }).should.deep.equal({ b: 14 })
            convertB({ b: 14 }).should.deep.equal({ c: 42 })

            convertA.inv({ b: 14 }).should.deep.equal({ a: 9 })
            convertB.inv({ c: 42 }).should.deep.equal({ b: 14 })
        })

        it('but can be done all at once via a pipe', () => {
            const piped = pipe(
                convertA,
                convertB,
            )

            piped({ a: 9 }).should.deep.equal({ c: 42 })
            piped.inv({ c: 42 }).should.deep.equal({ a: 9 })
        })
    })
})
