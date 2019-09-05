import 'chai/register-should'
import simple_inv from '../src/simple'

describe('simple.js', () => {
    const context = {
        from: ['x', 'y'],
        to: ['y', 'x'],
        addend: [7, -7],
        multiplicand: [2, 0.5],
    }
    function make_me_simple(inputObj) {
        const inputValue = inputObj[this.from]
        const resultValue = (inputValue + this.addend) * this.multiplicand

        const result = {}
        result[this.to] = resultValue
        return result
    }

    const simple = simple_inv({
        context,
        fn: make_me_simple,
    })

    it('can do forwards', () => {
        simple({ x: 3 }).should.deep.equal({ y: 20 })
    })
    it('can do backwards', () => {
        simple.inv({ y: 17 }).should.deep.equal({ x: 5 })
    })
})
