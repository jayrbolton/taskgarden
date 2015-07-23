var express = require('express')
var app = express()

app.set('views', __dirname + '/client/markup')

app.engine('html', require('ejs').renderFile)

app.get('/', function(req, res){
	res.render('index.html')
})

var server = app.listen(4200, function(){
	var host = server.address().address
	var port = server.address().port

	console.log('taskgarden listening at http://%s:%s', host, port)
})
