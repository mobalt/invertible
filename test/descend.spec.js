import 'chai/register-should'
import seq from '../src/sequence'
import sub from '../src/descend'

describe('properties.js', () => {
    const usdYen = sub('USD', 'YEN', usd => 100 * usd, yen => yen / 100)

    it('can convert fowards, using custom function', () => {
        const moneyConversion = seq(usdYen)
        moneyConversion({ USD: 100 }).should.deep.equal({ YEN: 10e3 })
    })
    it('can convert backwards, but not automatically', () => {
        const moneyConversion = seq(usdYen)

        moneyConversion({ YEN: 1e6 }).should.deep.equal({})

        // notice the required `.inv`
        moneyConversion.inv({ YEN: 1e6 }).should.deep.equal({ USD: 10e3 })
    })

    it('can work in both directions, if applied twice (forwards/inverted)', () => {
        const moneyConversion = seq(usdYen, usdYen.inv)

        moneyConversion({ USD: 100 }).should.deep.equal({ YEN: 10e3 })

        // notice the `.inv` no longer required
        moneyConversion({ YEN: 1e6 }).should.deep.equal({ USD: 10e3 })

        // yet it still works if optional `.inv` is given
        moneyConversion.inv({ YEN: 1e6 }).should.deep.equal({ USD: 10e3 })

        // can do both directions simultaneously (which can be confusing, use with care)
        moneyConversion({
            USD: 100,
            YEN: 300,
        }).should.deep.equal({ YEN: 10e3, USD: 3 })
    })
})
