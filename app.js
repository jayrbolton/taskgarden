var express = require('express')
var app = express()

app.set('views', __dirname + '/views')

app.engine('html', require('ejs').renderFile)

// Serve static assets from /public
app.use(express.static('public'))

app.get('/', function(req, res){
	res.render('index.html')
})

var server = app.listen(4200, function(){
	var port = server.address().port

	console.log('taskgarden listening at http://localhost:%s', port)
})
