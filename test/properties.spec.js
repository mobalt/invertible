import 'chai/register-should'
import convert_prop from '../src/properties'
import seq from '../src/sequence'

describe('properties.js', () => {
    it('can do simple object property mapping', () => {
        const propCon = seq(
            convert_prop('old', 'new'),
            convert_prop('black', 'white'),
            convert_prop('ying', 'yang'),
        )

        // forwards
        propCon({
            old: 9,
            black: true,
            ying: 'Hi ying!',
        }).should.deep.equal({
            new: 9,
            white: true,
            yang: 'Hi ying!',
        })

        // reverse
        propCon
            .inv({
                new: 'baby',
                white: 'elephant',
                yang: 'Hello yang!',
            })
            .should.deep.equal({
                old: 'baby',
                black: 'elephant',
                ying: 'Hello yang!',
            })
    })
})
