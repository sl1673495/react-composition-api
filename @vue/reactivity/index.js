if (process.env.NODE_ENV === 'production') {
  module.exports = require('./reactivity.esm.prod.js')
} else {
  module.exports = require('./reactivity.esm.js')
}
