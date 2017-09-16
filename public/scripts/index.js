var el = require('virtual-dom/h')
var view = require('./vvvview/index')

// functional utilities
var formToObj = require('./formToObj')
var ordinalize = require('./ordinalize')
var asPercentage = require('./asPercentage')
var secondsToMinutes = require('./secondsToMinutes')

// Using a convention with some prefixes based on types
// eX is an element named 'X'
// sX is a bacon stream named 'X'
// cX is a function that renders elements with d3 (c for component)

//// components

function app(state) {
  if(state.pomodoro) {
    return pomProgress(state.pomodoro)
  }
  return el('.wrapper', [
    newTodoForm(state.items.length),
    itemsQueue(state.items)
  ])
}

// Display a giant progress bar of how far into your pomodoro you are
function pomProgress(pomodoro) {
  return el('.pomProgress', [
    el('p', ["focus on ", el('strong', pomodoro.name), " for ", secondsToMinutes(1500 - pomodoro.progress), " more minutes"]),
    el('button', {onclick: stopPomodoro}, "squash tomato"),
    el('.pomProgress-bar', {style: {width: asPercentage(pomodoro.progress, 1500)}})
  ])
}


// Create a new todo item from a simple form
function newTodoForm(count) {
  return el('form', {onsubmit: addItem}, [
    el('input', {name: 'name', type: 'text', placeholder: 'What needs to be done?', required: true}),
    el('button', {component: 'newTodo_btn'}, 'Add ' + ordinalize(count+1) + ' item')
  ])
}


// Display all your todo items
function itemsQueue(items) {
  if(items.length === 0) {
    var content = el('p', 'your slate is clean!')
  } else {
    var content = el('table', {class: 'queueTable'}, el('tbody', items.map(itemRow)))
  }

  return el('div', [
    el('h2', [items.filter(isFinished).length, ' / ', items.length + ' completed']),
    content
  ])
}

// Display a single todo item
function itemRow(item) {
  var status = item.finished ? 'is-finished' : 'is-pending'
  return el('tr', { className: status}, [
    el('td', el('input', { onchange: toggleStatus(item), type: 'checkbox', checked: item.finished})),
    el('td', item.name),
    el('td', item.finished ?
      el('button', {onclick: removeItem(item)}, 'delete') :
      el('button', {onclick: startPomodoro(item)}, 'start pomodoro')),
    el('td', pomIcons(item))
  ])
}

function pomIcons(item) {
  if(!item.pomCount) return
  var icons = []
  for(var i = 0; i < item.pomCount; ++i) {
    icons.push(el('.i-tomato'))
  }
  return icons
}

// Initialize appView
var appView = view(document.body, app, {
	defaultState: {items: [{name: 'Do the dishes!'}]},
	cacheState: 'appView'
})


function isFinished(item) { return item.finished}

//// events

function removeItem(item) { return function(ev) {
  var ind = appView.state.items.indexOf(item)
  appView.state.items.splice(ind, 1)
  appView.render()
}}

function startPomodoro(item) { return function(ev) {
  var pom = appView.state.pomodoro = {progress: 0, name: item.name}
  pom.intervalID = setInterval(function() {
    if(pom.progress >= 1500) {
      item.pomCount = item.pomCount || 0
      ++item.pomCount
      stopPomodoro()
    }
    ++pom.progress
    appView.render()
  }, 1000)
  appView.render()
}}

function stopPomodoro() {
  clearInterval(appView.state.pomodoro.intervalID)
  appView.state.pomodoro = null
  appView.render()
}

function toggleStatus(item) { return function(event) {
  item.finished = !item.finished
  appView.render()
}}

function addItem(ev) {
  ev.preventDefault()
  var item = formToObj(ev.currentTarget)
  appView.state.items.push(item)
  appView.render()
}

