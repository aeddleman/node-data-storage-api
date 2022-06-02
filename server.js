const express = require('express')
const server = express()
const bodyParser = require("body-parser")

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(require('./src/api'));

module.exports = server

if (require.main === module) {
  const port = process.env.PORT || 3000
  server.listen((port), () => {
    console.log(`App listening at http://localhost:${port}`)
  })
}
