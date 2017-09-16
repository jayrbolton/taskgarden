// Get a possibly nested set of keys , returning the value and its parent as a pair
// eg. deep_get('x', {x: 1}) -> [x, 1]
// eg. deep_get('x.y', {x: {y: 1}}) -> [y, 1]
// eg. deep_get('x.y', {'x.y': 1}) -> [x.y, 1]
//
// You can also index arrays using dot notation
// eg. deep_get('xs.1', {xs: ['a','b','c']}) -> [xs, 'b']

module.exports = deep_get

function deep_get(keys, obj) {
	if(obj[keys] !== undefined)
		return [obj, obj[keys]]

	var current = obj, prev = obj
	var keys = keys.split('.')

	for(var i = 0; i < keys.length; ++i) {
		if(current === undefined || current === null)
			return [prev, current]

		if(is_number(keys[i]))
			keys[i] = Number(keys[i])

		if(current[keys[i]] !== undefined) {
			prev = current
			current = current[keys[i]]
		} else return []
	}

	return [prev, current]
}

window.deep_get = deep_get

function is_number(n) {return !isNaN(n)}

