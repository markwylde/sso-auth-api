const axios = require('axios')

const instance = axios.create({
  timeout: 1000,
  headers: {
    'X-Requested-With': 'axios'
  }
})

module.exports = instance
