module.exports = secondsToMinutes

function secondsToMinutes(seconds) {
  var secs = seconds % 60
  if(secs === 0) secs = "00"
  var mins = Math.floor(seconds / 60)
  return String(mins) + ":" + String(secs)
}
