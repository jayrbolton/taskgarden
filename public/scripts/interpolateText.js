module.exports = interpolateText
// Given some text, replace all properties that look like {prop} with val where the prop/vals come from object
// eg. interpolateText("hi{hi}hi", {hi: 'sup'}) -> "hisuphi"
function interpolateText(str, obj) {
 if(!str) return ""
 var result = str
 for(var key in obj) {
  var re = new RegExp("\{" + key + "\}", 'g')
  result = result.replace(re, obj[key])
 }
 result = result.replace(/{this}/g, obj)
 return result
}
