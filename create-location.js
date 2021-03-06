const document = require('global/document')
const assert = require('assert')
const xtend = require('xtend')

const qs = require('./qs')

module.exports = createLocation

// takes an initial representation of the location state
// and then synchronize a mutation across all fields
//
// scenarios:
// - create a state object from document.location; we got no state yet
// - create a new state object from a string we pass in; full override mode
// - patch a state object with some value we pass in - lil patchy stuff
//
// (obj?, str?) -> obj
function createLocation (state, patch) {
  if (!state) {
    const newLocation = {
      pathname: document.location.pathname,
      search: (document.location.search) ? qs(document.location.search) : {},
      hash: document.location.hash,
      href: document.location.href
    }
    return newLocation
  } else {
    assert.equal(typeof state, 'object', 'sheet-router/create-location: state should be an object')
    if (typeof patch === 'string') {
      const newLocation = parseUrl(patch)
      return newLocation
    } else {
      assert.equal(typeof patch, 'object', 'sheet-router/create-location: patch should be an object')
      const newLocation = xtend(state, patch)
      return newLocation
    }
  }

  // parse a URL into a kv object inside the browser
  // str -> obj
  function parseUrl (url) {
    const a = document.createElement('a')
    a.href = url

    return {
      href: a.href,
      pathname: a.pathname,
      search: (a.search) ? qs(a.search) : {},
      hash: a.hash
    }
  }
}
