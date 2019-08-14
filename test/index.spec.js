/*
import 'chai/register-should'
import q from '../src'
import inv, { pipe } from '../src/invertible'

const addTwo = inv(x => x + 2, x => x - 2)
const subtractOne = inv(x => x - 1, x => x + 1)
const double = inv(x => x + x, x => x / 2)
const triple = inv(x => 3 * x, x => x / 3)
const quadruple = inv(x => 4 * x, x => x / 4)

describe('#inv', () => {
    it('groups a function with its inverse', () => {
        double(10).should.equal(20)
        double.inv(10).should.equal(5)
    })
})

describe('#pipe', () => {
    describe('passing numbers', () => {
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

    describe('passing objects', () => {
        const convertA = inv(
            input => ({ A: input.a }),
            input => ({ a: input.A }),
        )

        it('can do simple property name conversion', () => {
            convertA({ a: 9 }).should.deep.equal({ A: 9 })
            convertA.inv({ A: 9 }).should.deep.equal({ a: 9 })
        })

        const convertB = inv(
            ({ b }) => ({ B: b * 3 }),
            ({ B }) => ({ b: B / 3 }),
        )

        it('can perform math while converting properties', () => {
            convertB({ b: 9 }).should.deep.equal({ B: 27 })
            convertB.inv({ B: 27 }).should.deep.equal({ b: 9 })
        })

        it('can do both when properly wrapped', () => {
            const combined = q.seq(q.fn(convertA), q.fn(convertB))

            combined(
                { b: 9, a: 27 },
                { input: { b: 9, a: 27 } },
            ).should.deep.equal({ A: 27, B: 27 })
            // combined.inv({ A: 27, B: 27 }).should.deep.equal({ b: 9, a: 27 })
        })
    })
})

describe('q', () => {
    it('must do simple lookup', () => {
        const cn = q.seq(q.prop('x', 'y'), q.prop('y', 'x'), q.prop('z', 'Z'))
        cn({ x: 2, y: 3 }).should.deep.equal({ y: 2, x: 3 })
        cn.inv({ x: 2, y: 3 }).should.deep.equal({ y: 2, x: 3 })

        cn({ x: 2, y: 3, Z: 9 }).should.deep.equal({ y: 2, x: 3 })
        cn.inv({ x: 2, y: 3, Z: 9 }).should.deep.equal({ y: 2, x: 3, z: 9 })
    })
    it('must do harder lookup', () => {
        q.seq(
            q.prop('x', 'y'),
            q.prop(
                'y',
                'x',
                inv((input, { output }) => {
                    return input * 2
                }),
            ),
        )({ x: 2, y: 3 }).should.deep.equal({ y: 2, x: 6 })
    })
    it('must do hardest lookup', () => {
        q.seq(
            q.prop('x', 'y'),
            q.fn(
                inv(input => ({
                    x: input.y * 2,
                    z: input.y * 3,
                })),
            ),
        )({ x: 2, y: 3 }).should.deep.equal({ y: 2, x: 6, z: 9 })
    })
    it('must do raw', () => {
        q.seq(
            q.prop('x', 'y'),
            q.fn(({ a }) => {
                a: a || 'blah'
            }),
            inv(
                function forward(input, { output }) {
                    output.x = input.y * 9
                    output.z = 99
                },
                function inverse(input, { output }) {
                    output.y = input.x / 9
                },
            ),
        )({ x: 2, y: 3 }).should.deep.equal({ y: 2, x: 27, z: 99 })
    })
    it('q.map', () => {
        const f = q.seq(
            q.map('list', 'LIST', q.seq(q.prop('x', 'y'), q.prop('y', 'x'))),
        )

        f({ list: [{ x: 2, y: 3 }] }).should.deep.equal({
            LIST: [{ y: 2, x: 3 }],
        })
    })
})

describe('conditionals', () => {
    const mathFn = pipe(
        double,
        addTwo,
    )

    const convertA = inv(
        ({ a = 0 }) => ({ A: mathFn(a) }),
        ({ A = 0 }) => ({ a: mathFn.inv(A) }),
    )

    const convertB = inv(
        ({ b = 0 }) => ({ B: b * 3 }),
        ({ B = 0 }) => ({ b: B / 3 }),
    )

    it('can do simple conditionals', () => {
        const fn = q.seq(
            inv(
                function forward(input, args) {
                    if (input.a != 0) {
                        args.output = q.seq(q.fn(convertA), q.fn(convertB))(
                            input,
                        )
                    }
                },
                function inverse(input, { output }) {},
            ),
        )
        fn({ a: 9 }).should.deep.equal({ A: 20, B: 0 })
    })

    it('can do simple conditionals', () => {
        const fn = q.seq(
            q.if(
                inv(
                    ({ denominator }) => !!denominator,
                    ({ numerator }) => !!numerator,
                ),
                q.seq(
                    q.fn(
                        a => ({ result: a.numerator / a.denominator }),
                        a => ({ result: a.denominator / a.numerator }),
                    ),
                ),
                q.seq(
                    q.fn(() => ({
                        error:
                            "Can't divide by zero, please use different denominator.",
                    })),
                ),
            ),
        )
        fn({ a: 9 }).should.have.keys('error')
        fn({ numerator: 1, denominator: 2 }).should.deep.equal({
            result: 1 / 2,
        })
        fn.inv({ numerator: 1, denominator: 2 }).should.deep.equal({
            result: 2,
        })
    })
})

describe.skip('ifCond', () => {
    const mathFn = pipe(
        double,
        addTwo,
    )

    const convertA = inv(
        ({ a = 0 }) => ({ A: mathFn(a) }),
        ({ A = 0 }) => ({ a: mathFn.inv(A) }),
    )

    const convertB = inv(
        ({ b = 0 }) => ({ B: b * 3 }),
        ({ B = 0 }) => ({ b: B / 3 }),
    )

    it('simple cond: double', () => {
        const fn = cond(
            inv(x => x.a != 0, x => x.A != 0),
            pipeObj(convertA, convertB),
        )

        fn({ a: 9 }).should.deep.equal({ A: 20, B: 0 })
        fn.inv({ A: 9, B: 81 }).should.deep.equal({ a: 3.5, b: 27 })
    })
    it('should do inv math', () => {
        const fn = condOther(
            inv(
                x => (x.a == 0 ? {} : undefined),
                x => (x.A == 0 ? {} : undefined),
            ),
            pipeObj(convertA, convertB),
        )

        fn({ a: 9 }).should.deep.equal({ A: 20, B: 0 })
        fn.inv({ A: 9, B: 81 }).should.deep.equal({ a: 3.5, b: 27 })
    })
    it.skip('complex conditional', () => {
        const fn = complexConvert([
            ['a', 'A', cond(inv(x => x != 0, x => x != 0), mathFn)],
            ['b', 'B', mathFn],
        ])

        fn({ a: 9 }).should.deep.equal({ A: 20 })
        fn.inv({ A: 20 }).should.deep.equal({ a: 9 })

        fn({ a: 0 }).should.deep.equal({})
        fn.inv({ A: 0 }).should.deep.equal({})

        fn({ b: 9 }).should.deep.equal({ B: 20 })
        fn.inv({ B: 20 }).should.deep.equal({ b: 9 })

        fn({ b: 0 }).should.deep.equal({ B: 2 })
        fn.inv({ B: 0 }).should.deep.equal({ b: -1 })
    })
    it.skip('double nested', () => {
        const fn = cond(
            inv(x => x.a != 0, x => x.A != 0),
            pipeObj(convertA, convertB),
        )
        const f = complexConvert([
            [
                'subobj',
                'SUB',
                cond(
                    inv(
                        function cond(val, obj) {
                            console.log('doing sub check', val, obj)
                            return obj.type == 'TF'
                        },
                        (v, o) => o.type == 'TF',
                    ),
                    fn,
                ),
            ],
        ])

        const obj = {
            type: 'TF',
            subobj: {
                a: 9,
                b: 9,
            },
        }
        f(obj).should.deep.equal({ SUB: { A: 20, B: 27 } })
        f.inv({ SUB: { A: 20, B: 27 } }).should.deep.equal({})
        f.inv({ type: 'TF', SUB: { A: 20, B: 27 } }).should.deep.equal({
            subobj: { a: 9, b: 9 },
        })
    })
})

 */
