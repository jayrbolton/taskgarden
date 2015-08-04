var iter = require('./iter')
var ordinalize = require('./ordinalize')

var dom = { }

var state = {}
var bindings = {}
var components = {}

module.exports = components
window.dom = dom

dom.setState = function(key, val) {
 state[key] = val
 iter.each(bindings[key], function(binding) {
  var el = binding.el
  var fn = components[binding.name]
 })
}


components['item-list'] = function(items) {
 var els = document.querySelectorAll('[item-list]')
 iter.each(els, function(el) {
  var children = el.children
  var tmpl = document.querySelector("[component-repeat-template='item-list']")

  if(!tmpl) {
   el.setAttribute('component-repeat-template', 'item-list')
   el.style.display = 'none'
   document.body.appendChild(el)
   var tmpl = el
  }
  var interp = tmpl.getAttribute('interpolate')

  while(el.firstChild) el.removeChild(el.firstChild)
  iter.each(items, function(item) {
   var repeated = tmpl.cloneNode(true)
   el.appendChild(repeated)
  })
 })
}

components['item-count-button'] = function(count) {
 var nth = ordinalize(count+1)
 var els = document.querySelectorAll('[item-count-button]')
 iter.each(els, function(el) {
  var tmpl = el.getAttribute('interpolate')
  el.textContent = interpolateText(tmpl, {nth: nth})
 })
}

// Given some text, replace all properties that look like {prop} with val where the prop/vals come from object
// eg. interpolateText("hi{hi}hi", {hi: 'sup'}) -> "hisuphi"
function interpolateText(str, obj) {
 if(!str) return ""
 var result = str
 for(var key in obj) {
  var re = new RegExp("\{" + key + "\}", 'g')
  result = result.replace(re, obj[key])
 }
 return result
}

