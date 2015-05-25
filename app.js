var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 4020))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
	res.send('Hello World!')
})

app.listen(app.get('port'), function(){
	console.log('Node app is running on port', app.get('port'))	
})
