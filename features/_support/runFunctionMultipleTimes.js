function runFunctionMultipleTimes (times, fn) {
  const promises = []

  for (let i = 1; i <= times; i++) {
    promises.push(fn(i))
  }

  return Promise.all(promises)
}

module.exports = runFunctionMultipleTimes
