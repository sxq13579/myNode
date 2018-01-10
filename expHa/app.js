var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('hello world');
});

app.post('/', function(){
    res.send('Got a POST request');
});

app.put('/user', function() {
    res.send('Got a PUT request at /user');
});

app.delete('/user', function() {
    res.send('Got a DELETE request at /user');
});

var server = app.listen(3060, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});

