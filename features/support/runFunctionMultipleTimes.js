function runFunctionMultipleTimes (times, fn) {
  let promises = []

  for (let i = 1; i <= times; i++) {
    promises.push(fn(i))
  }

  return Promise.all(promises)
}

module.exports = runFunctionMultipleTimes
