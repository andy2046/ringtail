const M = 2
const N = 11 * M
const zeros = Array(N - M).fill(0).join('')
const rand = () => Math.random().toString(36).slice(M)

module.exports = len => {
  return Array(len + 1).fill('').map(() =>
    (Array(M).fill('').map(rand).join('') + zeros).slice(0, N)
  ).join('').slice(0, len)
}
