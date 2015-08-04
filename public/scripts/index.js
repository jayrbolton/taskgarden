var d3 = require('d3')
var Bacon = require('baconjs').Bacon
var _ = require('lodash')

var formToObj = require('./formToObj')
var ordinalize = require('./ordinalize')
var interpolateText = require('./interpolateText')

// Using a convention with some prefixes based on types
// eX is an element named 'X'
// sX is a bacon stream named 'X'
// cX is a function that renders elements with d3 (c for component)


// Components

function cNewButton(count) {
  d3.select('.js-NewButton').text('Add ' + ordinalize(count+1) + ' item')
}

function cEmptyMessage(el) {
  return function(count) {
    if(count > 0) el.style.display = 'none'
    else el.style.display = ''
  }
}

function cTotalCount(count) {
  d3.select('.js-TotalCount').text(' - ' + count + ' total')
}

function cItemList(items) {
  var lis = d3.select('.js-ItemList').selectAll('li').data(items).text(get('name'))
  lis.enter().append('li').text(get('name'))
  lis.exit().remove()
}

function cFinishedList(items) {
  var lis = d3.select('.js-FinishedList').selectAll('li').data(items).text(get('name'))
  lis.enter().append('li').text(get('name'))
  lis.exit().remove()
}

// Streams

var sTodos = Bacon.fromEvent(q('.js-NewItemForm'), 'submit')
 .doAction('.preventDefault')
 .map('.currentTarget')

// Convert event streams into a total count of items
var sCount = sTodos.map(1).scan(0, add)
sCount.onValue(cNewButton)
sCount.onValue(cTotalCount)
sCount.onValue(cEmptyMessage(q('.js-EmptyQueue')))

// Convert event streams into an array of item objects, set to app.items
sTodos
  .map(formToObj)
  .scan([], shiftEach)
  .onValue(cItemList)

var sFinished = Bacon.fromArray([])
sFinished.onValue(cFinishedList)
sFinishedCount = sFinished.map(1).scan(0, add)
sFinishedCount.onValue(cEmptyMessage(q('.js-NoneFinished')))

// Shift each new todo item to the beginning of the list
function shiftEach(arr, val) { return [val].concat(arr) }

function add(x,y) {return x + y}

// Return a function that will retrieve the given property from an object
// useful for method chaining, like .text(get('name')) where you're getting 'item.name'
function get(prop) {
  return function(obj) {
    return obj[prop]
  }
}

// Some very lazy shortcuts...
function q(str) {return document.querySelector(str)}
function qa(str) {return document.querySelectorAll(str)}
