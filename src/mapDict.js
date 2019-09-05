import descend from './descend'
import simpleton from './simpleton'

export default function mapDict(x, y, levels) {
    return descend(
        x,
        y,
        simpleton(
            arr => array_to_hiearchy(arr, levels),
            dict => hiearchy_to_array(dict, levels),
        ),
    )
}

function array_to_hiearchy(arr, levels) {
    if (!levels.length) return arr
    levels = levels.slice()
    const last = levels.pop()
    const result = {}

    function extracted(clone, lvl, obj, newItem = {}) {
        const name = clone[lvl]
        delete clone[lvl]
        if (obj[name] === undefined) obj[name] = newItem
        return obj[name]
    }

    for (const element of arr) {
        let clone = { ...element }
        let obj = result

        for (const lvl of levels) {
            obj = extracted(clone, lvl, obj)
        }
        obj = extracted(clone, last, obj, [])
        obj.push(clone)
    }
    return result
}

function hiearchy_to_array(dict, levels, accumulator = {}) {
    levels = levels.slice()
    const current = levels.shift()
    let result = []
    if (current === undefined) {
        if (Array.isArray(dict)) {
            result = dict.map(x => ({ ...accumulator, ...x }))
        }
    } else {
        for (let k in dict) {
            let v = dict[k]
            accumulator[current] = k
            let r = hiearchy_to_array(v, levels, { ...accumulator })
            result = result.concat(r)
        }
    }
    return result
}
