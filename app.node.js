var express = require('express')
var app = express()
var path = require('path')
app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname, '/node_modules')))
app.listen(8000)
 