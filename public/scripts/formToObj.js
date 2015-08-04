// Convert a form element into an object where every object property is an
// input name and every object value is an input value

module.exports = formToObj
var _ = require('lodash')

function formToObj(form) {
 var obj = {}
	_.each(form.querySelectorAll('input'), function(input) {
  obj[input.getAttribute('name')] = input.value
 })
 form.reset()
 return obj
}
