var iter = require('./iter')
var interpolateText = require('./interpolateText')

var app = {state: {}, name: 'app', els: [document.body]}
var components = {}
var bindings = {}
window.app = app
window.bindings = bindings
window.components = components

module.exports = app

function view(el, obj) {
}

view.prototype.set = function() {
 var self = this
 if(typeof arguments[0] === "string" && arguments[1]) {
  var obj = {}
  obj[arguments[0]] = arguments[1]
 } else if(arguments[0].constructor === Object) {
  var obj = arguments[0]
 } else {
  throw new Error("Pass in a key/value pair or a single object")
 }

 for(var key in obj) {
  self.state[key] = obj
 }
}


// Restore data from localStorage
var cached = JSON.parse(localStorage.getItem('app'))

// Define a component using an attribute name and an element transformation function
app.component = function(attrName, fn) {
 var els = document.querySelectorAll('[' + attrName + ']')
 components[attrName] = fn
 iter.each(els, function(el) {
  var boundKey = el.getAttribute('data-bind')
  if(boundKey) {
   if(bindings[boundKey]) {
    bindings[boundKey].push({
     attr: attrName,
     el: el
    })
   } else {
    bindings[boundKey] = [{attr: attrName, el: el}]
   }
   app.set(boundKey, app.state[boundKey])
  }
 })
 return app
}


app.childView = function() {
 if(typeof x === "string") {
  child.els = document.querySelector("[view='" + x + "']")
 } else {
  child.els = x.length ? x : [x]
 }

 var child = Object.create(this)
 child.components = Object.create(this.components)
 child.state = Object.create(this.state)
 child.bindings = Object.create(this.bindings)
 child.render()
 return child
}


app.render = function() {
 //TODO
 // go through this.els, find all components, create bindings
}

// Set a key to a value in the ui state
// When this happens, re-evaluate all bound components
app.set = function(key, val) {
 if(arguments.length === 1) {
  return function(val) { app.set(key, val) }
 }
 app.state[key] = val
 localStorage.setItem('app', JSON.stringify(app.state))
 iter.each(bindings[key], function(binding) {
  var attr = binding.attr
  var el = binding.el
  var fn = components[attr]
  fn(el, val)
 })
 return app
}

if(cached) {
 for(var key in cached) {
  app.set(key, cached[key])
 }
}

// Default app components
app.component('interpolate', function(el, obj) {
 if(!obj) return
 el.textContent = interpolateText(el.getAttribute('interpolate'), obj)
})


// Repeat an element for every item in the array
app.component('repeat', function(el, items) {

 // Assign the parents and placeholder marker. Cache them as properties of the elem.
 if(!el.__parent || !el.__placeholder) {
  var parent = el.parentElement
  var placeholder = document.createTextNode('')
  el.__parent = parent
  el.__placeholder = placeholder
  el.removeAttribute('data-bind')
  el.removeAttribute('repeat')
  parent.insertBefore(placeholder, el)
  parent.removeChild(el)
 } else { // We've repeated before; retrieve the cached parent/placeholder
  var parent = el.__parent
  var placeholder = el.__placeholder
 }

 // Remove all previously repeated elements
 while(placeholder.previousElementSibling && placeholder.previousElementSibling.hasAttribute('data-repeated')) {
  placeholder.previousSibling.parentElement.removeChild(placeholder.previousSibling)
 }

 // Append all new repeated elements to a document fragment
 var fragment = document.createDocumentFragment()
 iter.each(items, function(item) {
  var cloned = el.cloneNode(true)
  cloned.setAttribute('data-repeated', '')
  fragment.appendChild(cloned)
  app.state.each = item
  render(cloned)
 })
 delete app.state.each
 parent.insertBefore(fragment, placeholder)
})

app.component('show-if-any', function(el, arr) {
 el.style.display = arr && arr.length ? '' : 'none'
})

app.component('show-if', function(el, val) {
 el.style.display = val ? '' : 'none'
})

app.component('hide-if', function(el, val) {
 el.style.display = val ? 'none' : ''
})

