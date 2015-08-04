// Convert a positive integer into an ordinal (1st, 2nd, 3rd...)

module.exports = ordinalize

function ordinalize(n) {
 if(n <= 0) return n
  // Deal with the preteen punks first
  if([11,12,13].indexOf(n) !== -1) return String(n) + 'th'
  var str = String(n)
  var lst = str[str.length-1]
  if(lst === '1') return String(n) + 'st'
  else if(lst === '2') return String(n) + 'nd'
  else if(lst === '3') return String(n) + 'rd'
  else return String(n) + 'th'
}
