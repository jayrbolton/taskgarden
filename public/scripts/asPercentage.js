module.exports = asPercentage

function asPercentage(n, max) {
  return String(n * 100 / max) + '%'
}
