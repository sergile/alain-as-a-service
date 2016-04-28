'use strict'

const alain = require('alain')
const path = require('path')
const bunyan = require('bunyan')
const restify = require('restify')
const server = restify.createServer({
  name: 'alain'
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.jsonp())
server.use(restify.gzipResponse())
server.use(restify.fullResponse())

function safeParseInt (s) {
  try {
    return parseInt(s, 10)
  } catch (_) {
    return undefined
  }
}

function applyOpt (opts, query, name, aliases, isNumber) {
  if (query[name]) {
    opts[name] = isNumber ? safeParseInt(query[name]) : query[name]
    if (opts[name]) return
  }
  for (let i = 0, len = aliases.length; i < len; i++) {
    if (query[aliases[i]]) {
      opts[name] = isNumber ? safeParseInt(query[aliases[i]]) : query[aliases[i]]
      if (opts[name]) return
    }
  }
}

server.get(/^\/v1/, function (req, res, next) {
  console.log('query:', req.query)

  var opts = {}
  applyOpt(opts, req.query, 'exactly', ['e'], true)
  applyOpt(opts, req.query, 'min', ['n'], true)
  applyOpt(opts, req.query, 'max', ['x'], true)
  applyOpt(opts, req.query, 'join', ['j'])
  applyOpt(opts, req.query, 'object', ['o'])

  alain(opts, function (err, results) {
    if (err) return next(err)
    res.send(200, results)
    next()
  })
})

server.get('/', function (req, res, next) {
  // this preserves original query params
  res.redirect({
    pathname: '/v1'
  }, next)
})

server.on('after', restify.auditLogger({
  log: bunyan.createLogger({
    name: 'audit',
    streams: [{
      type: 'rotating-file',
      path: path.join(__dirname, 'log', 'audit.log'),
      period: '1d', // daily rotation
      count: 3      // keep 3 back copies
    }]
  })
}))

server.listen(8080, function () {
  console.log('alain listening: %s', server.url)
})
